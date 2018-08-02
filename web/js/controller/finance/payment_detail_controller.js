/**
 * 主菜单：财务管理 -> 支付管理(支付详情) 控制器
 */
app.controller("payment_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state", function ($scope, $stateParams, _basic, _host, _config, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 支付编号
    var paymentId = $stateParams.id;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 支付状态
    $scope.paymentStatusList = _config.paymentStatus;
    // 支付方式
    $scope.paymentTypeList = _config.paymentType;
    // 海运费用类别
    $scope.shipTransFeeTypes = _config.shipTransFeeTypes;

    // 关联仓储订单 合计应付
    $scope.totalMoney = 0;
    // 关联海运订单 合计应付
    $scope.totalShipTransMoney = 0;

    // TAB[关联还款] 剩余金额(美元)
    $scope.leftMoney = 0;
    // TAB[关联还款] 支付还款订单总额(美元)
    $scope.totalPaymentMoney = 0;

    // 还款信息：追加关联画面用
    $scope.loanRepaymentInfo = {
        // 还款编号
        repaymentId: "",
        // 还款日期
        repaymentDate: "",
        // 关联贷出订单
        loanId: "",
        // 归还本金
        repaymentMoney: "",
        // 利息
        interestMoney: "",
        // 手续费
        fee: "",
        // 实际应还
        realRepaymentMoney: "",
        // 本次支付金额
        thisPaymentMoney: ""
    };

    /**
     *返回上层
     * */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * Tab跳转 支付信息详情
     */
    $scope.lookPaymentMsg = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookPaymentMsg').addClass("active");
        $("#lookPaymentMsg").addClass("active");
        $("#lookPaymentMsg").show();
    };

    /**
     * Tab跳转 关联仓储订单
     */
    $scope.lookRelatedOrder = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookRelatedOrder').addClass("active");
        $("#lookRelatedOrder").addClass("active");
        $("#lookRelatedOrder").show();
        // 左侧 未完结 列表
        _basic.get(_host.api_url + "/storageOrder?entrustId=" + $scope.storagePaymentArray.entrust_id + '&orderStatus=' + $scope.paymentStatusList[0].id).then(function (data) {
            if (data.success) {
                $scope.storageOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        var url = _host.api_url + "/paymentStorageOrderRel?paymentId=" + paymentId;
        //右侧关联列表
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.storageOrderPaymentRelList = data.result;
                $scope.totalMoney = 0;
                for (var i = 0; i < $scope.storageOrderPaymentRelList.length; i++) {
                    if ($scope.storageOrderPaymentRelList[i].actual_fee == null) {
                        $scope.storageOrderPaymentRelList[i].actual_fee = 0;
                    }
                    $scope.totalMoney = $scope.storageOrderPaymentRelList[i].actual_fee + $scope.totalMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * *
     * 添加仓储关联
     * */
    $scope.addOderRel = function (id) {
        // 追加画面数据
        var obj = {
            storageOrderId: id,
            paymentId: paymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/paymentStorageOrderRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookRelatedOrder();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * *
     * 删除仓储关联
     * */
    $scope.deleteOderRel = function (id) {
        swal({
                title: "确定要移除当前订单与该次支付的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/storageOrder/" + id + '/payment/' + paymentId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookRelatedOrder();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * Tab跳转 关联海运订单
     */
    $scope.lookShipTransOrder = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookShipTransOrder').addClass("active");
        $("#lookShipTransOrder").addClass("active");
        $("#lookShipTransOrder").show();
        // 左侧一览 未完结
        _basic.get(_host.api_url + "/shipTransOrder?entrustId=" + $scope.storagePaymentArray.entrust_id + '&orderStatus=' + $scope.paymentStatusList[0].id).then(function (data) {
            if (data.success == true) {
                $scope.shipTransOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 右侧，已关联
        var url = _host.api_url + "/paymentShipOrderRel?paymentId=" + paymentId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.shipTransOrderRelList = data.result;
                $scope.totalShipTransMoney = 0;
                for (var i = 0; i < $scope.shipTransOrderRelList.length; i++) {
                    if ($scope.shipTransOrderRelList[i].total_fee == null) {
                        $scope.shipTransOrderRelList[i].total_fee = 0;
                    }
                    $scope.totalShipTransMoney = $scope.shipTransOrderRelList[i].total_fee + $scope.totalShipTransMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * *
     * 添加海运关联
     * */
    $scope.addShipTransOderRel = function (shipTransOrderId) {
        // 追加画面数据
        var obj = {
            shipTransOrderId: shipTransOrderId,
            paymentId: paymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/paymentShipOrderRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookShipTransOrder();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * *
     * 删除海运关联
     * */
    $scope.deleteShipTransOderRel = function (shipTransOrderId) {
        swal({
                title: "确定要移除当前订单与该次支付的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrder/" + shipTransOrderId + '/payment/' + paymentId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookShipTransOrder();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 保存修改信息
     * */
    $scope.updatePaymentInfo = function () {
        if ($scope.storagePaymentArray.entrust_id !== ""
            && $scope.storagePaymentArray.payment_type !== ""
            && $scope.storagePaymentArray.number !== ""
            && $scope.storagePaymentArray.payment_money !== "") {
            var obj = {
                entrustId: $scope.storagePaymentArray.entrust_id,
                paymentType: $scope.storagePaymentArray.payment_type,
                number: $scope.storagePaymentArray.number,
                paymentMoney: $scope.storagePaymentArray.payment_money,
                remark: $scope.storagePaymentArray.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + "/payment/" + paymentId, obj).then(function (data) {
                if (data.success) {
                    swal("修改成功", "", "success");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 点击完结
     * */
    $scope.updatePaymentStatus = function () {
        swal({
                title: "确定支付完结吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                // 修改状态为已完结【2：已完结】
                var url = _host.api_url + "/user/" + userId + "/payment/" + paymentId + "/paymentStatus/" + $scope.paymentStatusList[1].id;
                _basic.put(url, {}).then(function (data) {
                    if (data.success) {
                        initData();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * Tab跳转 3:其他方式还款
     */
    $scope.lookPayment = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .paymentDiv').addClass("active");
        $("#paymentDiv").addClass("active");
        $("#paymentDiv").show();

        // 获取还款编号列表
        getLoanRepaymentList();

        // 隐藏追加画面
        $scope.newPaymentDiv = false;

        // 获取支付编号对应的 关联还款列表
        getPaymentLoanRepRel();
    };

    /**
     * 获取还款编号列表
     */
    function getLoanRepaymentList() {
        var url = _host.api_url + "/loanRepayment?entrustId=" + $scope.storagePaymentArray.entrust_id + '&repaymentStatus=' + $scope.paymentStatusList[0].id;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.loanRepaymentList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取还款编号信息
     */
    $scope.getLoanRepaymentInfo = function (id) {

        var url = _host.api_url + "/loanRepayment?repaymentId=" + id;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                if (data.result.length > 0) {
                    // 显示追加画面
                    $scope.newPaymentDiv = true;

                    // 还款编号
                    $scope.loanRepaymentInfo.repaymentId= data.result[0].id;
                    // 还款日期
                    $scope.loanRepaymentInfo.repaymentDate= data.result[0].created_on;
                    // 关联贷出订单
                    $scope.loanRepaymentInfo.loanId= data.result[0].loan_id;
                    // 归还本金
                    $scope.loanRepaymentInfo.repaymentMoney= data.result[0].repayment_money;
                    // 利息
                    $scope.loanRepaymentInfo.interestMoney= data.result[0].interest_money;
                    // 手续费
                    $scope.loanRepaymentInfo.fee= data.result[0].fee;
                    // 实际应还
                    $scope.loanRepaymentInfo.realRepaymentMoney= data.result[0].repayment_money + data.result[0].interest_money + data.result[0].fee;
                    // 本次支付金额
                    $scope.loanRepaymentInfo.thisPaymentMoney = "";

                    // 清空 还款编号
                    $scope.loanRepaymentId = "";
                } else {
                    // 隐藏追加画面
                    $scope.newPaymentDiv = false;
                    // 清空数据
                    $scope.loanRepaymentInfo = {};
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 新增还款支付订单，修改本次支付金额。
     */
    $scope.addLoanRepPaymentRel = function () {
        if ($scope.loanRepaymentInfo.thisPaymentMoney !== "") {
            swal({
                    title: "确定要追加当前支付订单与该次还款的关联吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function () {
                    // 追加画面数据
                    var obj = {
                        repaymentId: $scope.loanRepaymentInfo.repaymentId,
                        paymentId: $scope.storagePaymentArray.id
                    };

                    _basic.post(_host.api_url + "/user/" + userId + "/paymentLoanRepRel", obj).then(function (data) {
                        if (data.success) {
                            // 成功后，修改本次支付金额
                            obj = {thisPaymentMoney : $scope.loanRepaymentInfo.thisPaymentMoney === "" ? 0 : $scope.loanRepaymentInfo.thisPaymentMoney};
                            var url = _host.api_url + "/user/" + userId + "/repayment/" + $scope.loanRepaymentInfo.repaymentId + "/payment/" + $scope.storagePaymentArray.id + "/paymentRepMoney" ;
                            _basic.put(url, obj).then(function (data) {
                                if (data.success) {
                                    swal("追加成功", "", "success");
                                    // 关闭追加关联还款画面
                                    $scope.closePaymentDiv();
                                    // 获取支付编号对应的 关联还款列表
                                    getPaymentLoanRepRel();
                                } else {
                                    swal(data.msg, "", "error");
                                }
                            })
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                });
        } else {
            swal("请填写本次支付金额！", "", "warning");
        }
    };

    /**
     * 从关联还款信息中删除指定还款。
     * @param $event
     * @param repaymentId 还款编号
     */
    $scope.deleteOtherPayment = function ($event, repaymentId) {
        $event.stopPropagation();
        swal({
                title: "确定要移除当前支付订单与该次还款的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + repaymentId + '/payment/' + $scope.storagePaymentArray.id, {}).then(
                    function (data) {
                        if (data.success) {
                            // 获取支付编号对应的 关联还款列表
                            getPaymentLoanRepRel();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 关闭追加关联还款画面。
     */
    $scope.closePaymentDiv = function () {
        // 隐藏追加画面
        $scope.newPaymentDiv = false;
        // 清空数据
        $scope.loanRepaymentInfo = {};
    };

    /**
     * 获取支付编号对应的 关联还款列表
     */
    function getPaymentLoanRepRel() {
        // TAB[关联还款] 支付还款订单总额(美元)
        $scope.totalPaymentMoney = 0;

        var url = _host.api_url + "/paymentLoanRepRel?paymentId=" + $scope.storagePaymentArray.id;
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 关联还款列表
                $scope.paymentLoanRepRelList = data.result;
                // 遍历结果集
                $scope.paymentLoanRepRelList.forEach(function (value, index, array) {
                    // TAB[关联还款] 支付还款订单总额(美元)
                    $scope.totalPaymentMoney = $scope.totalPaymentMoney + value.this_payment_money;
                });

                // TAB[关联还款] 剩余金额(美元)
                $scope.leftMoney = $scope.storagePaymentArray.payment_money - $scope.totalMoney - $scope.totalShipTransMoney - $scope.totalPaymentMoney;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取委托方信息
     * @param type 委托方类型
     */
    $scope.getEntrustInfo = function (type) {

        if (type == null && type == undefined) {
            return;
        }

        var url = _host.api_url + "/entrust?entrustType=" + type;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    /**
     * 打开追加【费用明细】模态画面。
     * @param shipTransOrderId 海运订单编号
     * @param vin vin
     */
    $scope.showShipFeeDetailDiv = function (shipTransOrderId, vin) {
        $('.modal').modal();
        $('#shipFeeDetailDiv').modal('open');

        $scope.shipTransFee = {};
        // 海运订单编号
        $scope.shipTransFee.shipTransOrderId = shipTransOrderId;
        $scope.shipTransFee.vin = vin;

        // 取得海运费用一览
        getShipTransOrderFeeRel(shipTransOrderId);
    };

    /**
     * 取得海运费用一览
     * @param shipTransOrderId 海运订单编号
     */
    function getShipTransOrderFeeRel(shipTransOrderId) {
        // 检索用url
        var url = _host.api_url + "/shipTransOrderFeeRel?shipTransOrderId=" + shipTransOrderId;

        // 合计费用(美元)
        $scope.shipTransFee.totalFee = 0;
        var thisFee = 0;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.shipTransOrderFeeRelList = data.result;
                // 计算 合计费用(美元)
                for (var i = 0; i < $scope.shipTransOrderFeeRelList.length; i++) {
                    thisFee = $scope.shipTransOrderFeeRelList[i].pay_money;
                    $scope.shipTransFee.totalFee = $scope.shipTransFee.totalFee + thisFee;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取基本信息
     * */
    function initData() {
        _basic.get(_host.api_url + "/payment?paymentId=" + paymentId).then(function (data) {
            if (data.success) {
                // 当前支付编号 对应的数据
                $scope.storagePaymentArray = data.result[0];
                // 当前画面的支付状态
                $scope.paymentStatus = data.result[0].payment_status;
                $scope.getEntrustInfo(data.result[0].entrust_type);
                $scope.storagePaymentArray.entrust_id = data.result[0].entrust_id;
                $scope.lookRelatedOrder();
                $scope.lookPaymentMsg();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    initData();
}]);
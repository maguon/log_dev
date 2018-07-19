/**
 * 主菜单：财务管理 -> 发票管理(详细画面) 控制器
 */
app.controller("invoice_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state", function ($scope, $stateParams, _basic, _host, _config, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 支付编号
    var invoiceId = $stateParams.id;

    // 发票 状态
    $scope.invoiceStatus = _config.invoiceStatus;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 支付状态
    $scope.paymentStatusList = _config.paymentStatus;

    // 关联仓储订单 应开发票总额
    $scope.totalStorageMoney = 0;
    // 关联海运订单 应开发票总额
    $scope.totalShipTransMoney = 0;
    // 关联还款 应开发票总额(美元)
    $scope.totalPaymentMoney = 0;

    // 发票信息
    $scope.invoiceInfo = {
        // id
        invoiceId: "",
        // 发票状态
        invoiceStatus: "",
        // 发票编号
        invoiceNum: "",
        // 发票金额
        invoiceMoney: "",
        // 委托方性质
        entrustType: "",
        // 委托方
        entrustId: "",
        entrustNm: "",
        // 备注
        remark: "",
        // 开票人
        invoiceUserName: "",
        // 开票时间
        createdOn: ""
    };

    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"invoice_detail"}, {reload: true})
    };

    /**
     * Tab跳转 发票信息详情
     */
    $scope.lookInvoiceInfo = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .invoiceDiv').addClass("active");
        $("#invoiceDiv").addClass("active");
        $("#invoiceDiv").show();

        // textarea 高度调整
        $('#remarkText').val($scope.invoiceInfo.remark);
        $('#remarkText').trigger('autoresize');
    };

    /**
     * 保存修改信息
     * */
    $scope.updateInvoiceInfo = function () {
        if ($scope.invoiceInfo.invoiceNum !== ""
            && $scope.invoiceInfo.invoiceMoney !== ""
            && $scope.invoiceInfo.entrustType !== ""
            && $scope.invoiceInfo.entrustId !== "") {
            var obj = {
                invoiceNum: $scope.invoiceInfo.invoiceNum,
                invoiceMoney: $scope.invoiceInfo.invoiceMoney,
                entrustId: $scope.invoiceInfo.entrustId,
                remark: $scope.invoiceInfo.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + "/invoice/" + invoiceId, obj).then(function (data) {
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
    $scope.updateInvoiceStatus = function () {
        swal({
                title: "确定发放该发票？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                // 修改状态为已完结【2：已发】
                var url = _host.api_url + "/user/" + userId + "/invoice/" + invoiceId + "/invoiceStatus/" + $scope.invoiceStatus[1].id;
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
        var url = _host.api_url + "/storageOrder?entrustId=" + $scope.invoiceInfo.entrustId + '&orderStatus=' + $scope.paymentStatusList[1].id + '&invoiceStatus=' + $scope.invoiceStatus[0].id;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.storageOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 右侧关联列表
        queryInvoiceStorageOrderRel();
    };

    /**
     * 查询已关联仓储订单（右侧）。
     */
    function queryInvoiceStorageOrderRel() {
        var url = _host.api_url + "/invoiceStorageOrderRel?invoiceId=" + invoiceId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.invoiceStorageOrderRelList = data.result;
                $scope.totalStorageMoney = 0;
                for (var i = 0; i < $scope.invoiceStorageOrderRelList.length; i++) {
                    if ($scope.invoiceStorageOrderRelList[i].actual_fee == null) {
                        $scope.invoiceStorageOrderRelList[i].actual_fee = 0;
                    }
                    $scope.totalStorageMoney = $scope.invoiceStorageOrderRelList[i].actual_fee + $scope.totalStorageMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * *
     * 添加仓储关联
     * */
    $scope.addInvoiceStorageOrderRel = function (id) {
        // 追加画面数据
        var obj = {
            storageOrderId: id,
            invoiceId: invoiceId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/invoiceStorageOrderRel", obj).then(function (data) {
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
    $scope.deleteInvoiceStorageOrderRel = function (id) {
        swal({
                title: "确定要移除当前订单与该发票的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/storageOrder/" + id + '/invoice/' + invoiceId, {}).then(
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
        $('.tabWrap .invoiceShipOrderDiv').addClass("active");
        $("#invoiceShipOrderDiv").addClass("active");
        $("#invoiceShipOrderDiv").show();
        // 左侧一览 未完结
        var url = _host.api_url + "/shipTransOrder?entrustId=" + $scope.invoiceInfo.entrustId + '&orderStatus=' + $scope.paymentStatusList[1].id + '&invoiceStatus=' + $scope.invoiceStatus[0].id;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.shipTransOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 右侧，已关联
        queryInvoiceShipOrderRel();
    };

    /**
     * 查询已关联海运订单（右侧）。
     */
    function queryInvoiceShipOrderRel() {
        var url = _host.api_url + "/invoiceShipOrderRel?invoiceId=" + invoiceId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.invoiceShipOrderRelList = data.result;
                $scope.totalShipTransMoney = 0;
                for (var i = 0; i < $scope.invoiceShipOrderRelList.length; i++) {
                    if ($scope.invoiceShipOrderRelList[i].ship_trans_fee == null) {
                        $scope.invoiceShipOrderRelList[i].ship_trans_fee = 0;
                    }
                    $scope.totalShipTransMoney = $scope.invoiceShipOrderRelList[i].ship_trans_fee + $scope.totalShipTransMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * *
     * 添加海运关联
     * */
    $scope.addShipTransOderRel = function (shipTransOrderId) {
        // 追加画面数据
        var obj = {
            shipTransOrderId: shipTransOrderId,
            invoiceId: invoiceId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/invoiceShipOrderRel", obj).then(function (data) {
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
                title: "确定要移除当前订单与该发票的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrder/" + shipTransOrderId + '/invoice/' + invoiceId, {}).then(
                    function (data) {
                        if (data.success) {
                            $scope.lookShipTransOrder();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
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

        // 左侧一览 未完结
        var url = _host.api_url + "/loanRepayment?entrustId=" + $scope.invoiceInfo.entrustId + '&repaymentStatus=' + $scope.paymentStatusList[1].id + '&invoiceStatus=' + $scope.invoiceStatus[0].id;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.loanRepaymentList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 右侧，已关联
        queryInvoiceLoanRepRel();
    };

    /**
     * 查询已关联还款订单（右侧）。
     */
    function queryInvoiceLoanRepRel() {
        var url = _host.api_url + "/invoiceLoanRepRel?invoiceId=" + invoiceId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.invoiceLoanRepRelList = data.result;
                $scope.totalPaymentMoney = 0;
                var thisRepayMoney = 0;
                var thisInterestMoney = 0;
                var thisFee = 0;
                for (var i = 0; i < $scope.invoiceLoanRepRelList.length; i++) {
                    thisRepayMoney = $scope.invoiceLoanRepRelList[i].repayment_money;
                    thisInterestMoney = $scope.invoiceLoanRepRelList[i].interest_money;
                    thisFee = $scope.invoiceLoanRepRelList[i].fee;
                    $scope.totalPaymentMoney = $scope.totalPaymentMoney + (thisRepayMoney==null ? 0 : thisRepayMoney) + (thisInterestMoney==null ? 0 : thisInterestMoney) + (thisFee==null ? 0 : thisFee);
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * *
     * 添加还款关联
     * */
    $scope.addInvoiceLoanRepRel = function (repaymentId) {
        // 追加画面数据
        var obj = {
            repaymentId: repaymentId,
            invoiceId: invoiceId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/invoiceLoanRepRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookPayment();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * *
     * 删除还款关联
     * */
    $scope.deleteInvoiceLoanRepRel = function (repaymentId) {
        swal({
                title: "确定要移除当前订单与该发票的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + repaymentId + '/invoice/' + invoiceId, {}).then(
                    function (data) {
                        if (data.success) {
                            $scope.lookPayment();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 清空委托方选中
     */
    $scope.clearSelectEntrust = function () {
        $scope.invoiceInfo.entrustId = "";
        $scope.invoiceInfo.entrustNm = "委托方";
        $("#select2-entrustSelect-container").text("委托方").trigger("change");
    };

    /**
     * 获取委托方信息
     * @param selectText 默认选中项文字
     */
    $scope.getEntrustInfo = function (selectText) {
        // 取得委托方url
        var url = _host.api_url + "/entrust";

        // 检索画面 委托方select2初期化
        $('#entrustSelect').select2({
            // 因为有返回时默认值，所以动态赋值
            placeholder: selectText,
            containerCssClass: 'select2_dropdown',
            ajax : {
                type:'GET',
                url : url,
                dataType : 'json',
                delay : 400,
                data : function(params) {
                    return {
                        // 检索条件 检索画面委托方性质
                        entrustType : $scope.invoiceInfo.entrustType,
                        // 委托方简称
                        shortNameCode : params.term
                    };
                },
                processResults : function(data, params) {
                    var options = [];
                    $(data.result).each(function(i, o) {
                        // 获取 select2 必要的字段，id与text
                        options.push({
                            id : o.id,
                            text : o.short_name
                        });
                    });
                    // 返回组装后 select2 列表
                    return {
                        results : options
                    };
                },
                // 开启缓存
                cache : true
            },
            allowClear: false

        // 选中某个委托方后，触发事件
        }).on('change', function () {
            // 委托方 下拉选中 内容
            if ($("#entrustSelect").val() != null && $("#entrustSelect").val() !== "") {
                $scope.invoiceInfo.entrustId = $("#entrustSelect").select2("data")[0].id;
                $scope.invoiceInfo.entrustNm = $("#entrustSelect").select2("data")[0].text;
            }
        });
    };

    /**
     * 获取基本信息
     * */
    function initData() {
        _basic.get(_host.api_url + "/invoice?invoiceId=" + invoiceId).then(function (data) {
            if (data.success) {
                // 当前发票信息
                // id
                $scope.invoiceInfo.invoiceId = data.result[0].id;
                // 发票状态
                $scope.invoiceInfo.invoiceStatus = data.result[0].invoice_status;
                // 发票编号
                $scope.invoiceInfo.invoiceNum = data.result[0].invoice_num;
                // 发票金额
                $scope.invoiceInfo.invoiceMoney = data.result[0].invoice_money;
                // 委托方性质
                $scope.invoiceInfo.entrustType = data.result[0].entrust_type;
                // 委托方
                $scope.invoiceInfo.entrustId = data.result[0].entrust_id;
                $scope.invoiceInfo.entrustNm = data.result[0].short_name;
                // 加载 委托方 信息
                $scope.getEntrustInfo($scope.invoiceInfo.entrustNm);
                // 备注
                $scope.invoiceInfo.remark = data.result[0].remark;
                // 开票人
                $scope.invoiceInfo.invoiceUserName = data.result[0].invoice_user_name;
                // 开票时间
                $scope.invoiceInfo.createdOn = data.result[0].created_on;

                // 显示 发票信息 TAB
                $scope.lookInvoiceInfo();

                // 仓储
                queryInvoiceStorageOrderRel();
                // 海运
                queryInvoiceShipOrderRel();
                // 还款
                queryInvoiceLoanRepRel();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    initData();
}]);
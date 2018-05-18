/**
 * 主菜单：财务管理 -> 金融贷出(详细) 控制器
 */
app.controller("finance_loan_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state", function ($scope, $stateParams, _basic, _host, _config, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 支付编号
    var orderPaymentId = $stateParams.id;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 支付状态
    $scope.paymentStatusList = _config.paymentStatus;
    // 支付方式
    $scope.paymentTypeList = _config.paymentType;

    // // 金融贷出 状态
    // $scope.loanStatus = _config.loanStatus;
    // // 颜色列表
    // $scope.configColor = _config.config_color;
    // // 是否金融车 列表
    // $scope.purchaseTypes = _config.purchaseTypes;
    // // 委托方性质
    // $scope.entrustTypeList = _config.entrustType;
    // // 是否MSO车辆
    // $scope.msoFlags = _config.msoFlags;



    // 合计应付
    $scope.totalMoney = 0;

    /**
     *返回上层
     * */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_loan_detail"}, {reload: true})
    };

    /**
     * Tab跳转 支付信息详情
     */
    $scope.lookLoanInfo = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookLoanFinfoDiv').addClass("active");
        $("#lookLoanFinfoDiv").addClass("active");
        $("#lookLoanFinfoDiv").show();
    };

    /**
     * Tab跳转 关联仓储订单
     */
    $scope.lookMortgageCar = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookMortgageCar').addClass("active");
        $("#lookMortgageCar").addClass("active");
        $("#lookMortgageCar").show();
        // 左侧 未完结 列表
        _basic.get(_host.api_url + "/storageOrder?entrustId=" + $scope.storagePaymentArray.entrust_id + '&orderStatus=' + $scope.paymentStatusList[0].id).then(function (data) {
            if (data.success == true) {
                $scope.storageOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        var url = _host.api_url + "/orderPaymentRel?orderPaymentId=" + orderPaymentId;
        //右侧关联列表
        _basic.get(url).then(function (data) {
            if (data.success == true) {
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
     * Tab跳转 购买车辆
     */
    $scope.lookBuyingCars = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookBuyingCars').addClass("active");
        $("#lookBuyingCars").addClass("active");
        $("#lookBuyingCars").show();
    };


    /**
     * *
     * 添加仓储关联
     * */
    $scope.addOderRel = function (id) {
        // 追加画面数据
        var obj = {
            storageOrderId: id,
            orderPaymentId: orderPaymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/orderPaymentRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookMortgageCar();
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
                _basic.delete(_host.api_url + "/user/" + userId + "/storageOrder/" + id + '/orderPayment/' + orderPaymentId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookMortgageCar();
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
    $scope.lookPaymentHistory = function () {
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookPaymentHistory').addClass("active");
        $("#lookPaymentHistory").addClass("active");
        $("#lookPaymentHistory").show();
        // 左侧一览 未完结
        _basic.get(_host.api_url + "/shipTransOrder?entrustId=" + $scope.storagePaymentArray.entrust_id + '&orderStatus=' + $scope.paymentStatusList[0].id).then(function (data) {
            if (data.success == true) {
                $scope.shipTransOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 右侧，已关联
        var url = _host.api_url + "/shipTransOrderPaymentRel?orderPaymentId=" + orderPaymentId;
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.shipTransOrderRelList = data.result;
                $scope.totalShipTransMoney = 0;
                for (var i = 0; i < $scope.shipTransOrderRelList.length; i++) {
                    if ($scope.shipTransOrderRelList[i].ship_trans_fee == null) {
                        $scope.shipTransOrderRelList[i].ship_trans_fee = 0;
                    }
                    $scope.totalShipTransMoney = $scope.shipTransOrderRelList[i].ship_trans_fee + $scope.totalShipTransMoney;
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
            orderPaymentId: orderPaymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/shipTransOrderPaymentRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookPaymentHistory();
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
                _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrder/" + shipTransOrderId + '/orderPayment/' + orderPaymentId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookPaymentHistory();
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
            _basic.put(_host.api_url + "/user/" + userId + "/orderPayment/" + orderPaymentId, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    getBaseInfo();
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
                var url = _host.api_url + "/user/" + userId + "/orderPayment/" + orderPaymentId + "/paymentStatus/" + $scope.paymentStatusList[1].id;
                _basic.put(url, {}).then(function (data) {
                    if (data.success == true) {
                        getBaseInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

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
            if (data.success == true) {
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
     * 取得订单详情
     */
    function getOrderDetails() {
        // 检索用url
        var url = _host.api_url + "/storageOrder?storageOrderId=" + $scope.storageOrderId;

        _basic.get(url).then(function (data) {
            if (data.success == true) {

                if (data.result.length == 0) {
                    return;
                }

                // 订单是已支付时，取得支付详情
                if (data.result[0].order_status == 2) {
                    getPaymentDetails();
                }
                // 支付状态
                $scope.orderInfo.orderStatus = data.result[0].order_status == null ? '0' : data.result[0].order_status;
                // 委托方
                $scope.orderInfo.entrustId = data.result[0].entrust_id == null ? 0 : data.result[0].entrust_id;
                $scope.orderInfo.entrustName = data.result[0].short_name == null ? '未知' : data.result[0].short_name;
                // vin
                $scope.orderInfo.vin = data.result[0].vin == null ? '未知' : data.result[0].vin;
                // 制造商
                $scope.orderInfo.makeName = data.result[0].make_name == null ? '未知' : data.result[0].make_name;
                // 型号
                $scope.orderInfo.modelName = data.result[0].model_name == null ? '未知' : data.result[0].model_name;
                // 颜色
                $scope.orderInfo.color = '未知';
                for (var i = 0; i < $scope.configColor.length; i++) {
                    if ($scope.configColor[i].colorId == data.result[0].colour) {
                        $scope.orderInfo.color = $scope.configColor[i].colorName;
                    }
                }
                // 入库
                $scope.orderInfo.enterTime = data.result[0].enter_time == null ? '未知' : data.result[0].enter_time;
                // 出库
                $scope.orderInfo.realOutTime = data.result[0].real_out_time == null ? '未知' : data.result[0].real_out_time;
                // 合计天数
                $scope.orderInfo.dayCount = data.result[0].day_count == null ? 0 : data.result[0].day_count;
                // 预计支付(美元)：
                $scope.orderInfo.planFee = data.result[0].plan_fee == null ? 0 : data.result[0].plan_fee;
                // 实际应付(美元)：
                $scope.orderInfo.actualFee = data.result[0].plan_fee == null ? 0 : data.result[0].actual_fee;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得订单详情
        // getOrderDetails();
        $scope.lookLoanInfo();
    };
    $scope.initData();
}]);
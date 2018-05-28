/**
 * 主菜单：财务管理 -> 支付详情(详细画面) 控制器
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
    // 合计应付
    $scope.totalMoney = 0;

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
                var url = _host.api_url + "/user/" + userId + "/payment/" + paymentId + "/paymentStatus/" + $scope.paymentStatusList[1].id;
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
     * 获取基本信息
     * */
    function getBaseInfo() {
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

    getBaseInfo();
}]);
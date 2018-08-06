/**
 * 主菜单：海运管理 -- 海运订单详情   by star 2018/4/24
 */
app.controller("sea_transport_order_detail_controller", ["$scope","$stateParams", "_basic", "_host","_config","$state",  function ($scope,$stateParams, _basic, _host,_config,$state) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 海运订单 ID
    var shipTransOrderId = $stateParams.id;

    // 支付状态
    $scope.payStatus = _config.payStatus;
    // 发票 状态
    $scope.invoiceStatus = _config.invoiceStatus;

    // 海运费用类别
    $scope.shipTransFeeTypes = _config.shipTransFeeTypes;

    // 新增 海运费用 画面默认数据
    var defaultShipTransFee = {
        // 前画面订单ID
        shipTransOrderId: "",
        // 画面区分
        pageType: "",
        // 选择付费项目
        type: "",
        // 数量
        qty: "",
        // 金额(美元)
        fee: "",
        // 备注
        remark: "",
        // 合计费用(美元)
        totalFee: 0
    };

    // 新增 海运费用 画面用
    $scope.newShipTransFee = {};

    /**
     * 返回到前画面（订单管理）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * 根据id获得详情。
     */
    function queryOrderData() {
        _basic.get( _host.api_url + "/shipTransOrder?shipTransOrderId=" + shipTransOrderId).then(function (data) {
            if (data.success) {
                if(data.result.length===0){
                    return;
                }
                $scope.paymentInfo = data.result[0];
                getPaymentInfo( $scope.paymentInfo.id);
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /*
    * 获取支付信息
    * */
    function getPaymentInfo(id) {
        _basic.get(_host.api_url + "/payment?shipTransOrderId=" + id).then(function (data) {
            if (data.success) {
                if (data.result.length === 0) {
                    return;
                }
                $scope.paymentList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 打开追加【海运费用】模态画面。
     * @param pageType 画面区分(新建/编辑)
     */
    $scope.showEditShipFeeDiv = function (pageType) {
        $('.modal').modal();
        $('#editShipFeeDiv').modal('open');

        // 初期化数据
        angular.copy(defaultShipTransFee, $scope.newShipTransFee);
        $scope.newShipTransFee.shipTransOrderId = shipTransOrderId;
        $scope.newShipTransFee.pageType = pageType;

        // 取得海运费用一览
        getShipTransOrderFeeRel();
    };

    /**
     * 取得海运费用一览
     */
    function getShipTransOrderFeeRel() {
        // 检索用url
        var url = _host.api_url + "/shipTransOrderFeeRel?shipTransOrderId=" + shipTransOrderId;

        // 合计费用(美元)
        $scope.newShipTransFee.totalFee = 0;
        var thisFee = 0;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.shipTransOrderFeeRelList = data.result;
                // 计算 合计费用(美元)
                for (var i = 0; i < $scope.shipTransOrderFeeRelList.length; i++) {
                    thisFee = $scope.shipTransOrderFeeRelList[i].pay_money;
                    $scope.newShipTransFee.totalFee = $scope.newShipTransFee.totalFee + thisFee;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 追加海运费用 （画面加号按钮）
     */
    $scope.addShipTransOrderFeeRel = function () {
        if ($scope.newShipTransFee.type !== "" && $scope.newShipTransFee.fee !== "") {
            var obj = {
                payType: $scope.newShipTransFee.type,
                qty: $scope.newShipTransFee.qty,
                payMoney: $scope.newShipTransFee.fee,
                remark: $scope.newShipTransFee.remark
            };

            _basic.post(_host.api_url + "/user/" + userId + "/shipTransOrder/" + $scope.newShipTransFee.shipTransOrderId + "/shipTransOrderFeeRel", obj).then(function (data) {
                if (data.success) {
                    swal("追加成功", "", "success");

                    // 初期化数据
                    $scope.newShipTransFee.type = "";
                    $scope.newShipTransFee.qty = "";
                    $scope.newShipTransFee.fee = "";
                    $scope.newShipTransFee.remark = "";

                    // 取得海运费用一览
                    getShipTransOrderFeeRel();
                    // 取得运载车辆详情 （画面下部分）
                    queryOrderData();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整海运费用信息！", "", "warning");
        }
    };

    /**
     * 从列表中，修改指定海运费用
     *
     * @param shipTransFeeInfo 海运费用信息
     */
    $scope.updShipTransOrderFeeRel = function (shipTransFeeInfo) {
        if (shipTransFeeInfo.pay_money !== "") {
            swal({
                    title: "",
                    text: "确认修改？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var obj = {
                            payType: shipTransFeeInfo.pay_type,
                            qty: shipTransFeeInfo.qty,
                            payMoney: shipTransFeeInfo.pay_money,
                            remark: shipTransFeeInfo.remark
                        };
                        // 修改费用
                        var url = _host.api_url + "/user/" + userId + "/shipTransOrderFeeRel/" + shipTransFeeInfo.id;
                        _basic.put(url, obj).then(function (data) {
                            if (data.success) {
                                swal("修改费用成功", "", "success");
                                // 取得海运费用一览
                                getShipTransOrderFeeRel();
                                // 取得运载车辆详情 （画面下部分）
                                queryOrderData();
                            } else {
                                swal(data.msg, "", "error");
                            }
                        })
                    } else {
                        swal.close();
                    }
                });
        } else {
            swal("请填写费用金额！", "", "warning");
        }
    };

    /**
     * 从列表中，删除指定海运费用
     *
     * @param shipTransOrderFeeRelId 删除费用ID
     */
    $scope.delShipTransOrderFeeRel = function (shipTransOrderFeeRelId) {
        swal({
                title: "",
                text: "确认删除？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrderFeeRel/" + shipTransOrderFeeRelId, {}).then(
                        function (data) {
                            if (data.success) {
                                swal("删除费用成功", "", "success");
                                // 取得海运费用一览
                                getShipTransOrderFeeRel();
                                // 取得运载车辆详情 （画面下部分）
                                queryOrderData();
                            } else {
                                swal(data.msg, "", "error");
                            }
                        });
                } else {
                    swal.close();
                }
            });
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData () {
        // 取得订单详情
        queryOrderData();
    }
    initData();
}]);
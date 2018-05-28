/**
 * 主菜单：主控面板 -> 财务面板 控制器
 */
app.controller("finance_index_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", function ($scope, $rootScope, _host, _basic, _config) {

    // 委托方性质 列表
    $scope.entrustTypeList = _config.entrustType;
    // 支付状态 列表
    $scope.payStatus = _config.payStatus;

    // 委托方总数(企业)
    $scope.entrustCoCount = 0;
    // 委托方总数(个人)
    $scope.entrustPerCount = 0;

    // 委托方支付(未完结笔数)
    $scope.paymentCount = 0;
    // 委托方支付(未完结总额)
    $scope.paymentMoney = 0;

    // 仓储订单(未支付笔数)
    $scope.orderCount = 0;
    // 仓储订单(未支付总额)
    $scope.actualFee = 0;

    // 海运订单(未支付笔数)
    $scope.shipTransOrderCount = 0;
    // 海运订单(未支付总额)
    $scope.shipTransFee = 0;

    /**
     * 委托方总数 查询
     */
    function getEntrustCount() {
        var url = _host.api_url + "/entrustCount";
        _basic.get(url).then(function (data) {
            if (data.success) {
                for (var i = 0; i < data.result.length; i++) {
                    // 委托方性质(1-个人,2-企业)
                    if (data.result[i].entrust_type == $scope.entrustTypeList[0].entrust_type) {
                        // 1-个人
                        $scope.entrustPerCount = data.result[i].entrust_count;
                    } else if (data.result[i].entrust_type == $scope.entrustTypeList[1].entrust_type) {
                        // 2-企业
                        $scope.entrustCoCount = data.result[i].entrust_count;
                    } else {
                        // 委托方总数(企业)
                        $scope.entrustCoCount = 0;
                        // 委托方总数(个人)
                        $scope.entrustPerCount = 0;
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 委托方支付(未完结) 查询
     */
    function getPaymentCount() {
        // 1：未完结
        var url = _host.api_url + "/paymentCount?paymentStatus=1";
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 委托方支付(未完结笔数)
                    $scope.paymentCount = data.result[0].payment_count;
                    // 委托方支付(未完结总额)
                    $scope.paymentMoney = data.result[0].payment_money;
                } else {
                    // 委托方支付(未完结笔数)
                    $scope.paymentCount = 0;
                    // 委托方支付(未完结总额)
                    $scope.paymentMoney = 0;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 仓储订单(未支付) 查询
     */
    function getStorageOrderCount() {
        // 1：未支付
        var url = _host.api_url + "/storageOrderCount?orderStatus=" + $scope.payStatus[0].id;
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 仓储订单(未支付笔数)
                    $scope.orderCount = data.result[0].order_count;
                    // 仓储订单(未支付总额)
                    $scope.actualFee = data.result[0].actual_fee;
                } else {
                    // 仓储订单(未支付笔数)
                    $scope.orderCount = 0;
                    // 仓储订单(未支付总额)
                    $scope.actualFee = 0;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 海运订单(未支付) 查询
     */
    function getShipTransOrderCount() {
        // 1：未支付
        var url = _host.api_url + "/shipTransOrderCount?orderStatus=" + $scope.payStatus[0].id;
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 海运订单(未支付笔数)
                    $scope.shipTransOrderCount = data.result[0].order_count;
                    // 海运订单(未支付总额)
                    $scope.shipTransFee = data.result[0].ship_trans_fee;
                } else {
                    // 海运订单(未支付笔数)
                    $scope.shipTransOrderCount = 0;
                    // 海运订单(未支付总额)
                    $scope.shipTransFee = 0;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 委托方总数 查询
        getEntrustCount();
        // 委托方支付(未完结) 查询
        getPaymentCount();
        // 仓储订单(未支付) 查询
        getStorageOrderCount();
        // 海运订单(未支付) 查询
        getShipTransOrderCount();
    };
    $scope.initData();
}]);
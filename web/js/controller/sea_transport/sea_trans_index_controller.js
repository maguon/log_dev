/**
 * 主菜单：主控面板 -> 财务面板 控制器
 */
app.controller("sea_trans_index_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", function ($scope, $rootScope, _host, _basic, _config) {

    // 待发运舱数
    $scope.waitShipTransCount = 0;
    // 已发在途舱数
    $scope.sendShipTransCount = 0;

    // 待发运车辆
    $scope.waitShipTransOrderCount = 0;
    // 已发在途车辆
    $scope.sendShipTransOrderCount = 0;

    /**
     * 海运订舱/订单 信息查询
     */
    function getShipTransCount() {
        var url = _host.api_url + "/shipTransCount";
        _basic.get(url).then(function (data) {
            if (data.success) {
                for (var i = 0; i < data.result.length; i++) {
                    // 发送状态(1待发运 2已发出)
                    if (data.result[i].ship_trans_status === 1) {
                        // 1-待发运
                        // 待发运舱数
                        $scope.waitShipTransCount = data.result[i].ship_trans_count;
                        // 待发运车辆
                        $scope.waitShipTransOrderCount = data.result[i].ship_trans_order_count;
                    } else if (data.result[i].ship_trans_status === 2) {
                        // 2-已发出
                        // 已发在途舱数
                        $scope.sendShipTransCount = data.result[i].ship_trans_count;
                        // 已发在途车辆
                        $scope.sendShipTransOrderCount = data.result[i].ship_trans_order_count;
                    }
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
        // 海运订舱/订单 信息查询
        getShipTransCount();
    };
    $scope.initData();
}]);
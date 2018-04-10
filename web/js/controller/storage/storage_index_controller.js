/**
 * 主菜单：主控面板 控制器
 */
app.controller("storage_index_controller", ['$rootScope', '$scope', "_host", '$location', '$q', "_basic",
    function ($rootScope, $scope, _host, $location, $q, _basic) {

        // 当天日期
        var date = new Date();
        var nowDate = moment(date).format('YYYYMMDD');

        // 库存总车辆,今日入库,今日出库 数据取得
        _basic.get(_host.api_url + "/storageCount?dateStart=" + nowDate + "&dateEnd=" + nowDate).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.storageIndexCount = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 仓储总车位
        $scope.storageAllStorage = 0;

        // 明细，仓储总车位 取得
        _basic.get(_host.api_url + "/storageDate?dateStart=" + nowDate + "&dateEnd=" + nowDate).then(function (data) {
            if (data.success == true) {
                $scope.storageIndexList = data.result;
                for (var i in $scope.storageIndexList) {
                    $scope.storageAllStorage = $scope.storageAllStorage + $scope.storageIndexList[i].total_seats;
                }
                return $scope.storageAllStorage;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }]);
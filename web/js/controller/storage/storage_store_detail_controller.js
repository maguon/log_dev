/**
 * 主菜单：仓储管理 -> 仓储存放（仓库详情) 控制器
 */
app.controller("storage_store_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "_baseService", function ($scope, $state, $stateParams, _basic, _config, _host, _baseService) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 仓储信息 ID (前画面)
    var storageId = $stateParams.id;

    // 仓库详情（头部）
    $scope.storageNm = "";

    // 仓库详情（头部）区域列表
    $scope.zoneList = [];

    // 仓库详情（头部）区域列表 默认选中项
    $scope.selectedZone = "";

    // 仓库详情（头部）行
    $scope.row = 0;

    // 仓库详情（头部）列
    $scope.col = 0;

    // 仓库详情（头部）单元存车位
    $scope.lot = 0;

    // 仓库详情（头部）剩余位置
    $scope.leftPosition = 0;

    // 一行一列内，多个停车位区分用 (A-Z)
    $scope.characters = _config.characters;

    // 画面是否有区域详细信息
    $scope.hasPosition = false;

    // 画面显示停车情况数据
    $scope.storageParkingArray = [];

    /**
     * 获取仓储（分区）剩余位置信息。
     */
    $scope.getLeftPosition = function (selectZoneId) {

        // 检索仓储剩余位置信息URL
        var url = _host.api_url + "/storageParkingBalanceCount?storageId=" + storageId + "&areaId=" + selectZoneId;

        // 调用API取得
        _basic.get(url).then(function (data) {
            if (data.success && data.result.length > 0) {
                // 剩余位置
                $scope.leftPosition = data.result[0].parking_balance_count;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 获取仓储分区停车信息列表
     */
    $scope.getStorageParkingInfo = function (selectedZone) {

        var url = _host.api_url + "/storageParking?storageId=" + storageId + '&areaId=' + selectedZone;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                if (data.result.length > 0) {
                    $scope.storageParking = data.result;
                    $scope.storageParkingArray = _baseService.storageParking($scope.storageParking);

                    if ($scope.storageParkingArray.length > 0) {
                        $scope.storageParkingCol = $scope.storageParkingArray[0].col;
                    }

                    $scope.hasPosition = true;
                } else {
                    $scope.hasPosition = false;
                    swal("未取到该分区的详细信息！", "", "warning");
                }
            } else {
                $scope.hasPosition = false;
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 返回到前画面（仓储设置）。
     */
    $scope.return = function () {
        $state.go('storage_store', {}, {reload: true})
    };


    /**
     * 获取仓储（分区）详细信息。
     */
    $scope.getStorageAreaInfo = function (selectedZone) {

        if (selectedZone == null || selectedZone == '') {
            return;
        }

        // 检索仓储详细信息URL
        var url = _host.api_url + "/storageArea?areaStatus=1&storageId=" + storageId + "&areaId=" + selectedZone;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 行
                    $scope.row = data.result[0].row;
                    // 列
                    $scope.col = data.result[0].col;
                    // 单元存车位
                    $scope.lot = data.result[0].lot;
                    // 取得剩余位置
                    $scope.getLeftPosition(selectedZone);
                    // 获取仓储分区停车信息
                    $scope.getStorageParkingInfo(selectedZone);
                } else {
                    // 该仓库没有对应的区域信息
                    $scope.hasPosition = false;
                    swal("该仓库没有对应的区域信息！", "", "warning");
                }
            } else {
                $scope.hasPosition = false;
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 获取仓储详细信息。
     */
    $scope.getStorageInfo = function () {

        // 检索仓储详细信息URL
        var url = _host.api_url + "/storageArea?areaStatus=1&storageId=" + storageId;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {

                // 仓库区域列表
                $scope.zoneList = data.result;

                // 有仓库区域的时候
                if (data.result.length > 0) {
                    // 画面仓储 名称
                    $scope.storageNm = data.result[0].storage_name;
                    // 默认选中 区域
                    $scope.selectedZone = data.result[0].id;
                    // 获取仓储（分区）详细信息
                    $scope.getStorageAreaInfo($scope.selectedZone);
                } else {
                    swal("该仓库没有对应的区域信息！", "", "warning");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 画面初期检索
     */
    $scope.getStorageInfo();
}]);

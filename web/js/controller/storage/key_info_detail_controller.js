/**
 * 主菜单：管理员设置 -> 钥匙柜设置(详细画面) 控制器
 */
app.controller("key_info_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "_baseService", function ($scope, $state, $stateParams, _basic, _config, _host, _baseService) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 钥匙柜信息 ID
    var keyCabinetId = $stateParams.id;

    // 总位置
    $scope.totalPosition = $stateParams.position;
    // 剩余位置
    $scope.leftPosition = 0;

    // 钥匙柜信息 名称
    $scope.keyCabinetNm = "";

    // 钥匙柜扇区信息
    $scope.zoneList = [];

    // 钥匙信息
    $scope.keyInfo = {
        // 钥匙柜ID
        id: $stateParams.id,
        keyCabinetId: "",
        keyCabinetNm: "",
        zoneNm: "",
        row: "",
        col: "",
        // vin
        carVin: "",
        // 制造商
        carMaker: "",
        // 型号
        carModel: "",
        // 生产日期
        carProDate: "",
        // 颜色
        carColor: "",
        // 发动机号
        carEngineNum: "",
        // 位置
        carPosition: "",
        // 入库
        carEnterTime: "",
        // 计划出库
        carPlanOutTime: "",
        // 委托方
        carEntrust: "",
        // 估价
        carValuation: "",
        // MOS
        carMosStatus: ""
    };

    // 画面扇区列表默认选中项
    $scope.selectedZone = "";

    /**
     * 获取钥匙柜分区信息列表
     */
    $scope.getCarInfo = function (id, row, col) {

        // 扇区名称
        var url = _host.api_url + "/carKeyCabinetArea?carKeyCabinetId=" + keyCabinetId + "&areaId=" + $scope.selectedZone;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.keyInfo.zoneNm = data.result[0].area_name;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 行列
        $scope.keyInfo.row = row;
        $scope.keyInfo.col = col;

        // 车辆信息 TODO test data
        id = 100016;
        var url = _host.api_url + "/user/" + userId + "/car?active=1&carId=" + id;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                if (data.result.length > 0) {
                    // 初期化数据

                    // vin
                    $scope.keyInfo.carVin = data.result[0].vin;
                    // 制造商
                    $scope.keyInfo.carMaker = data.result[0].make_name;
                    // 型号
                    $scope.keyInfo.carModel = data.result[0].model_name;
                    // 生产日期
                    $scope.keyInfo.carProDate = data.result[0].pro_date;
                    // 颜色
                    $scope.keyInfo.carColor = data.result[0].colour;
                    // 发动机号
                    $scope.keyInfo.carEngineNum = data.result[0].engine_num;
                    // 位置 TODO
                    $scope.keyInfo.carPosition = data.result[0].car_key_position_id;
                    // 入库
                    $scope.keyInfo.carEnterTime = data.result[0].enter_time;
                    // 计划出库
                    $scope.keyInfo.carPlanOutTime = data.result[0].plan_out_time;
                    // 委托方
                    $scope.keyInfo.carEntrust = data.result[0].entrust_name;
                    // 估价
                    $scope.keyInfo.carValuation = data.result[0].valuation;
                    // MOS
                    $scope.keyInfo.carMosStatus = data.result[0].mos_status;

                    $('.modal').modal();
                    $('#carKeyInfo').modal('open');
                } else {
                    swal("该钥匙没有对应的车辆信息！", "", "warning");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 获取钥匙柜分区信息列表
     */
    $scope.getKeyCabinetZoneList = function () {

        var url = _host.api_url + "/carKeyPosition?carKeyCabinetId=" + keyCabinetId + '&areaId=' + $scope.selectedZone;

        console.log(url);

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                if (data.result == null) {
                    return;
                } else {
                    $scope.carKeyCabinetParking = data.result;
                    $scope.carKeyCabinetParkingArray = _baseService.carKeyParking($scope.carKeyCabinetParking);

                    if ($scope.carKeyCabinetParkingArray.length > 0) {
                        $scope.carKeyCabinetParkingCol = $scope.carKeyCabinetParkingArray[0].col;
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    /**
     * 返回到前画面（钥匙柜设置）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * 获取钥匙柜（分区）详细信息。
     */
    $scope.getLeftPosition = function () {

        // GET /carKeyCabinet/{carKeyCabinetId}/carKeyPositionCount

        // 检索钥匙柜详细信息URL
        var url = _host.api_url + "/carKeyCabinet/" + keyCabinetId + "/carKeyPositionCount";

        console.log('url: ' + url);

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.leftPosition = data.result[0].position_count;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 获取钥匙柜（分区）详细信息。
     */
    $scope.getKeyCabinetAreaInfo = function () {

        // 检索钥匙柜详细信息URL
        var url = _host.api_url + "/carKeyCabinetArea?carKeyCabinetId=" + keyCabinetId;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.zoneList = data.result;

                $scope.selectedZone = $scope.zoneList[0].id;
                // 画面钥匙柜 名称
                if (data.result.length > 0) {
                    $scope.keyCabinetNm = data.result[0].key_cabinet_name;
                }
                $scope.getKeyCabinetZoneList();
                $scope.getLeftPosition();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 画面初期检索
     */
    $scope.getKeyCabinetAreaInfo();
}]);

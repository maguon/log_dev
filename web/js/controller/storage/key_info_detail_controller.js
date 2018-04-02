/**
 * 主菜单：管理员设置 -> 钥匙柜设置(详细画面) 控制器
 */
app.controller("key_info_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "_baseService", function ($scope, $state, $stateParams, _basic, _config, _host, _baseService) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 钥匙柜信息
    $scope.carKeyCabinetInfo = {
        // 钥匙柜ID
        id: $stateParams.id,
        name: "",
        remark: "",
        zoneSize: "",
        status: ""
    };
    // 钥匙柜扇区信息
    $scope.zoneList = [];

    // 追加画面（增加扇区）初期数据
    var initZoneInfo = {
        addZoneName: "",
        addZoneRow: "",
        addZoneCol: ""
    };

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

    // $scope.selectedZone = "1";

    /**
     * 获取钥匙柜分区信息列表
     */
    $scope.getCarInfo = function (id, row, col) {
        // 检索URL组装

        // http://stg.myxxjs.com:8001/api/carKeyCabinetArea?areaId=1&carKeyCabinetId=1
        var url = _host.api_url + "/carKeyCabinetArea?carKeyCabinetId=" + $scope.carKeyCabinetInfo.id + "&areaId=" + $scope.selectedZone;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.keyInfo.zoneNm = data.result[0].area_name;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // TODO test data
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

        // $scope.keyInfo.zoneNm = zoneNm;
        $scope.keyInfo.row = row;
        $scope.keyInfo.col = col;

    };


    /**
     * 获取钥匙柜分区信息列表
     */
    $scope.getKeyCabinetZoneList = function () {
        // 检索URL组装
        // api/carKeyCabinetArea?areaId=2&carKeyCabinetId=1
        var url = _host.api_url + "/carKeyPosition?carKeyCabinetId=" + $scope.carKeyCabinetInfo.id + '&areaId=' + $scope.selectedZone;
        // var url = _host.api_url + "/carKeyPosition?carKeyCabinetId=" + carKeyCabinetInfoId + '&areaId=' + zoneId;

        console.log(url);
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                if (data.result == null) {
                    return;
                } else {
                    console.log('else ....');
                    $scope.carKeyCabinetParking = data.result;
                    $scope.carKeyCabinetParkingArray = _baseService.carKeyParking($scope.carKeyCabinetParking);
                    console.log($scope.carKeyCabinetParkingArray);

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
    $scope.getKeyCabinetAreaInfo = function () {

        // 检索URL组装
        var url = _host.api_url + "/carKeyCabinetArea?carKeyCabinetId=" + $scope.carKeyCabinetInfo.id;

        console.log(url);
        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.zoneList = data.result;
                // 画面扇区数变更
                $scope.carKeyCabinetInfo.zoneSize = data.result.length;

                // console.log('-----------------------------------');
                // console.log($scope.zoneList);
                $scope.selectedZone = $scope.zoneList[0].id;
                // 画面钥匙柜 名称
                if (data.result.length > 0) {
                    $scope.carKeyCabinetInfo.name = data.result[0].key_cabinet_name;
                }

                $scope.getKeyCabinetZoneList();
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

/**
 * 主菜单：仓储管理 -> 订单管理(详细画面) 控制器
 */
app.controller("storage_order_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "_baseService", function ($scope, $state, $stateParams, _basic, _config, _host, _baseService) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);


    // 支付方式 列表
    $scope.paymentMethodList = _config.payMethods;

    $scope.otherOrderList = false;

    // 订单信息
    $scope.orderInfo = {
        id: "",
        entrustName: "",
        vin: "",
        makeName: "",
        modelName: "",
        color:"",
        enterTime: "",
        realOutTime: "",
        dayCount: "",
        planFee: "",
        actualFee: ""
    };

    /**
     * 获取钥匙柜分区信息列表
     */
    $scope.getOrderDetails = function () {

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

        // 车辆信息
        var url = _host.api_url + "/user/" + userId + "/car?active=1&carId=" + id;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                if (data.result.length > 0) {
                    // 初期化数据

                    // vin
                    $scope.keyInfo.carVin = data.result[0].vin == null ? '未知' : data.result[0].vin;
                    // 制造商
                    $scope.keyInfo.carMaker = data.result[0].make_name == null ? '未知' : data.result[0].make_name;
                    // 型号
                    $scope.keyInfo.carModel = data.result[0].model_name == null ? '未知' : data.result[0].model_name;
                    // 生产日期
                    $scope.keyInfo.carProDate = data.result[0].pro_date == null ? '未知' : data.result[0].pro_date;
                    // 颜色
                    $scope.keyInfo.carColor = '未知';
                    for (var i = 0; i < $scope.configColor.length; i++) {
                        if ($scope.configColor[i].colorId == data.result[0].colour) {
                            $scope.keyInfo.carColor = $scope.configColor[i].colorName;
                        }
                    }
                    // 发动机号
                    $scope.keyInfo.carEngineNum = data.result[0].engine_num == null ? '未知' : data.result[0].engine_num;
                    // 位置
                    var storageName = data.result[0].storage_name == null ? '未知' : data.result[0].storage_name;
                    var row = data.result[0].row == null ? '未知' : data.result[0].row;
                    var col = data.result[0].col == null ? '未知' : data.result[0].col;
                    $scope.keyInfo.carPosition = storageName + ' ' +  row + '排' + col + '列';
                    // 入库
                    $scope.keyInfo.carEnterTime = data.result[0].enter_time == null ? '未知' : data.result[0].enter_time;
                    // 计划出库
                    $scope.keyInfo.carPlanOutTime = data.result[0].plan_out_time == null ? '未知' : data.result[0].plan_out_time;
                    // 委托方
                    $scope.keyInfo.carEntrust = data.result[0].entrust_name == null ? '未知' : data.result[0].entrust_name;
                    // 估价
                    $scope.keyInfo.carValuation = data.result[0].valuation == null ? 0 : data.result[0].valuation;
                    // MSO
                    $scope.keyInfo.carMsoStatus = data.result[0].mso_status == null ? '未知' : $scope.msoFlags[data.result[0].mso_status-1].name;

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
     * 返回到前画面（订单管理）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * 打开模态画面（查看关联的仓储订单）。
     */
    $scope.openAssociatedOrder = function () {
        $('.modal').modal();
        $('#associatedOrderInfoDiv').modal('open');
        queryOrderData();
    };


    $scope.openOtherOrderList = function () {
        $scope.otherOrderList = true;
    };

    /**
     * 打开修改价格模态窗口。
     */
    $scope.openChangePriceDiv = function (el) {
        $('.modal').modal();
        $('#changePriceDiv').modal('open');

        $scope.orderInfo.id = el.id;
        // 委托方
        $scope.orderInfo.entrustName = el.entrust_name;
        // VIN
        $scope.orderInfo.vin = el.vin;
        // 车型
        $scope.orderInfo.makeName = el.make_name;
        $scope.orderInfo.modelName = el.model_name;
        // 入库时间
        $scope.orderInfo.enterTime = el.enter_time;
        // 出库时间
        $scope.orderInfo.realOutTime = el.real_out_time;
        // 预计支付
        $scope.orderInfo.planFee = el.plan_fee;
    };

    /**
     * 打开[支付信息]模态窗口。
     */
    $scope.openPaymentInfoDiv = function (el) {
        $('.modal').modal();
        $('#paymentInfoDiv').modal('open');
        $scope.otherOrderList = false;
    };


    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryOrderData() {
        // 检索用url
        var reqUrl = _host.api_url + "/storageOrder?start=" + 0 + "&size=" + 11;

        console.log(reqUrl);

        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.orderResult = data.result;
                $scope.orderList = $scope.orderResult.slice(0, 10);
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    // /**
    //  * 获取钥匙柜（分区）详细信息。
    //  */
    // $scope.getLeftPosition = function (selectZoneId) {
    //
    //     // GET /carKeyCabinet/{carKeyCabinetId}/carKeyPositionCount
    //
    //     // 检索钥匙柜详细信息URL
    //     var url = _host.api_url + "/carKeyCabinet/" + keyCabinetId + "/carKeyPositionCount?areaId=" + selectZoneId;
    //
    //     // 调用API取得，画面数据
    //     _basic.get(url).then(function (data) {
    //         if (data.success) {
    //             // 检索取得数据集
    //             $scope.leftPosition = data.result[0].position_count;
    //         } else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };
    //
    // /**
    //  * 获取钥匙柜（分区）详细信息。
    //  */
    // $scope.getKeyCabinetAreaInfo = function () {
    //
    //     // 检索钥匙柜详细信息URL
    //     var url = _host.api_url + "/carKeyCabinetArea?areaStatus=1&carKeyCabinetId=" + keyCabinetId;
    //
    //     // 调用API取得，画面数据
    //     _basic.get(url).then(function (data) {
    //         if (data.success) {
    //             // 检索取得数据集
    //             $scope.zoneList = data.result;
    //
    //             // 画面钥匙柜 名称
    //             if (data.result.length > 0) {
    //                 $scope.selectedZone = $scope.zoneList[0].id;
    //                 $scope.keyCabinetNm = data.result[0].key_cabinet_name;
    //                 $scope.getKeyCabinetZoneList($scope.selectedZone);
    //             } else {
    //                 $scope.keyCabinetNm = keyCabinetNm;
    //             }
    //         } else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };

    /**
     * 画面初期检索
     */
    // $scope.getOrderDetails();
}]);

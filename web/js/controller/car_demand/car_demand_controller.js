/**
 * 主菜单：车辆查询 控制器
 */
app.controller("car_demand_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", function ($scope, $rootScope, _host, _basic, _config) {
    // 当前汽车品牌ID
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 车库状态 列表
    $scope.carStatusList = _config.carRelStatus;
    // 状态船运 列表
    $scope.shipTransStatus = _config.shipTransStatus;
    // 是否MSO车辆 列表
    $scope.msoFlags = _config.msoFlags;
    // 是否金融车
    $scope.purchaseTypes = _config.purchaseTypes;

    /**
     * 当车辆品牌变更时，车辆型号要进行联动刷新。
     * @param val 车辆品牌ID
     */
    $scope.changeMakerId = function (val) {
        if (val) {
            if ($scope.curruntId == val) {
            } else {
                $scope.curruntId = val;
                _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.carModelList = data.result;
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        }
    };

    /**
     * 【船公司】列表查询，用来填充查询条件：船公司
     */
    function getShippingCoList() {
        // 调用API取得，画面数据
        _basic.get(_host.api_url + "/shipCompany").then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.shippingCoList = data.result;
            }
        });
    }


    /**
     * 车辆品牌列表查询，用来填充查询条件：车辆品牌
     */
    function getCarMakerList() {
        _basic.get(_host.api_url + "/carMake").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.carMakerList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 仓库列表查询，用来填充查询条件：所在仓库
     */
    function getStorageList() {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                if(data.result.length == 0){
                    return;
                }
                $scope.storageList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 委托方列表查询，用来填充查询条件：委托方
     */
    function getEntrustList() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustId').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                if(data.result.length==0){
                    return;
                }
                queryCarDemandData();
            }
        });
    }

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryCarDemandData() {
        // 基本检索URL
        var reqUrl = _host.api_url + "/user/" + userId + "/car?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        reqUrl = conditions.length > 0 ? reqUrl + "&" + conditions : reqUrl;
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storageCarList = data.result;
                $scope.storageCar = $scope.storageCarList.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /*
     * 数据导出*
     * */
    $scope.export = function () {
        // 基本检索URL
        var url =_host.api_url + "/carStorageShipTrans.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    };


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        // 委托方
        $scope.entrust = {};
        if ($("#entrustId").val() === "") {
            $scope.entrust = {id: "", text: ""};
        } else {
            $scope.entrust = $("#entrustId").select2("data")[0];
        }

        var obj = {
            vin: $scope.conditionVin,
            makeId:$scope.conditionMakeId,
            modelId:$scope.conditionModelId,
            entrustId:$scope.entrust.id,
            // 是否金融车
            purchaseType:$scope.conditionPurchaseType,
            enterStart:$scope.conditionEnterTimeStart,
            enterEnd:$scope.conditionEnterTimeEnd,
            realStart:$scope.conditionOutTimeStart,
            realEnd:$scope.conditionOutTimeEnd,
            relStatus:$scope.conditionCarStatus,
            storageId:$scope.conditionStorage,
            shipTransStatus:$scope.conditionShipTransStatus,
            shipCompanyId:$scope.conditionShipCompanyId,
            container:$scope.conditionContainer,
            actualStartDateStart:$scope.conditionStartShipDateStart,
            actualStartDateEnd:$scope.conditionStartShipDateEnd,
            actualEndDateStart:$scope.conditionEndShipDateStart,
            actualEndDateEnd:$scope.conditionEndShipDateEnd
        };
        return obj;
    }




    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryCarList = function () {
        // 默认第一页
        $scope.start = 0;
        queryCarDemandData();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        queryCarDemandData();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryCarDemandData();
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得查询条件列表
        getStorageList();
        getShippingCoList();
        getCarMakerList();
        getEntrustList();
    };
    $scope.initData();
}]);


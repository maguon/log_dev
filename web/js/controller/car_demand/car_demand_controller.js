/**
 * 主菜单：车辆查询 控制器
 */
app.controller("car_demand_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "_baseService", function ($scope, $rootScope, _host, _basic, _config, _baseService) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 车库状态 列表
    $scope.carStatusList = _config.carRelStatus;
    // 车库状态 当前选中项
    $scope.conditionCarStatus = 1;
    // 状态船运 列表
    $scope.shipTransStatus = _config.shipTransStatus;
    // 是否MSO车辆 列表
    $scope.msoFlags = _config.msoFlags;

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryCarDemandData() {

        // 委托方 下拉选中 内容
        $scope.entrust = $("#entrustId").select2("data")[0] ;
        var reqUrl = _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size;

        //单选
        // 车辆状态
        if ($scope.conditionCarStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.conditionCarStatus;
        }
        // 所在仓库
        if ($scope.conditionStorage != null) {
            reqUrl = reqUrl + "&storageId=" + $scope.conditionStorage;
        }
        // vin码
        if ($scope.conditionVin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.conditionVin;
        }
        // 品牌
        if ($scope.conditionMakeId != null) {
            reqUrl = reqUrl + "&makeId=" + $scope.conditionMakeId;
        }
        // 型号
        if ($scope.conditionModelId != null) {
            reqUrl = reqUrl + "&modelId=" + $scope.conditionModelId;
        }
        // 委托方
        if ($scope.entrust.id != null && $scope.entrust.id != 0) {
            reqUrl = reqUrl + "&entrustId=" + $scope.entrust.id;
        }
        // 入库时间 开始
        if ($scope.conditionEnterTimeStart != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.conditionEnterTimeStart
        }
        // 入库时间 终了
        if ($scope.conditionEnterTimeEnd != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.conditionEnterTimeEnd
        }
        // 出库库时间 开始
        if ($scope.conditionOutTimeStart != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.conditionOutTimeStart
        }
        // 出库时间 终了
        if ($scope.conditionOutTimeEnd != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.conditionOutTimeEnd
        }
        // 是否MSO
        if ($scope.conditionMsoId != null) {
            reqUrl = reqUrl + "&msoStatus=" + $scope.conditionMsoId
        }

        // 船公司
        if ($scope.conditionShipCompanyId != null) {
            reqUrl = reqUrl + "&shipCompanyId=" + $scope.conditionShipCompanyId
        }
        // 状态
        if ($scope.conditionShipTransStatus != null) {
            reqUrl = reqUrl + "&shipTransStatus=" + $scope.conditionShipTransStatus
        }
        // 货柜
        if ($scope.conditionContainer != null) {
            reqUrl = reqUrl + "&container=" + $scope.conditionContainer
        }
        // 开船日期
        if ($scope.conditionStartShipDateStart!= null) {
            reqUrl = reqUrl + "&startShipDateStart=" + $scope.conditionStartShipDateStart
        }
        // 开船日期
        if ($scope.conditionStartShipDateEnd!= null) {
            reqUrl = reqUrl + "&startShipDateEnd=" + $scope.conditionStartShipDateEnd
        }
        // 到港日期
        if ($scope.conditionEndShipDateStart!= null) {
            reqUrl = reqUrl + "&endShipDateStart=" + $scope.conditionEndShipDateStart
        }
        // 到港日期
        if ($scope.conditionEndShipDateEnd!= null) {
            reqUrl = reqUrl + "&endShipDateEnd=" + $scope.conditionEndShipDateEnd
        }

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
        var obj = {
            vin: $scope.conditionVin,
            makeId:$scope.conditionMakeId,
            modelId:$scope.conditionModelId,
            entrustId:$scope.entrust.id,
            msoStatus:$scope.conditionMsoId,
            enterStart:$scope.conditionEnterTimeStart,
            enterEnd:$scope.conditionEnterTimeEnd,
            realStart:$scope.conditionOutTimeStart,
            realEnd:$scope.conditionOutTimeEnd,
            relStatus:$scope.conditionCarStatus,
            active:1,
            storageId:$scope.conditionStorage,
            shipTransStatus:$scope.conditionShipTransStatus,
            shipCompanyId:$scope.conditionShipCompanyId,
            container:$scope.conditionContainer,
            startShipDateStart:$scope.conditionStartShipDateStart,
            startShipDateEnd:$scope.conditionStartShipDateEnd,
            endShipDateStart:$scope.conditionEndShipDateStart,
            endShipDateEnd:$scope.conditionEndShipDateEnd
        };
        window.open(_host.api_url + "/carStorageShipTrans.csv?" + _basic.objToUrl(obj));
    };


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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得查询条件列表
        getStorageList();
        getShippingCoList();
        getCarMakerList();
        getEntrustList();
        /*// 查询数据
        queryCarDemandData();*/
    };
    $scope.initData();
}]);


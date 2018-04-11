/**
 * 主菜单：仓储管理 -> 订单管理 控制器
 */
app.controller("storage_order_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "_baseService", function ($scope, $rootScope, _host, _basic, _config, _baseService) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 车库状态 列表
    $scope.carStatusList = _config.carRelStatus;
    // 车库状态 当前选中项
    $scope.conditionCarStatus = 1;

    // 支付状态 列表
    $scope.payStatusList = _config.payStatus;

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryCarDemandData() {
        var reqUrl = _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size;
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
        if ($scope.conditionEntrustId != null && $scope.conditionEntrustId != 0) {
            reqUrl = reqUrl + "&entrustId=" + $scope.conditionEntrustId;
        }
        // 入库时间 开始
        if ($scope.conditionEnterTimeStart != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.conditionEnterTimeStart
        }
        // 入库时间 终了
        if ($scope.conditionEnterTimeEnd != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.conditionEnterTimeEnd
        }
        // 是否MSO
        if ($scope.conditionMsoId != null) {
            reqUrl = reqUrl + "&msoStatus=" + $scope.conditionMsoId
        }
        // 计划出库时间
        if ($scope.conditionPlanTimeStart != null) {
            reqUrl = reqUrl + "&planStart=" + $scope.conditionPlanTimeStart
        }
        if ($scope.conditionPlanTimeEnd != null) {
            reqUrl = reqUrl + "&planEnd=" + $scope.conditionPlanTimeEnd
        }
        // 实际出库时间
        if ($scope.conditionOutTimeStart != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.conditionOutTimeStart
        }
        if ($scope.conditionOutTimeEnd != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.conditionOutTimeEnd
        }

        console.log(reqUrl);

        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storageCarList = data.result;
                // TODO 可能需要删除的代码
                $scope.orderList = $scope.storageCarList.slice(0, 10);
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
     * 委托方下拉变更
     */
    $scope.changeEntrust = function () {
        // 当选中【清除选择】时，委托方改为空
        if ($scope.conditionEntrustId == 0) {
            $scope.conditionEntrustId = null;
        }
    };

    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryCarList = function () {
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
            if (data.success == true && data.result.length > 0) {
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
                $('#entrustIdSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown'
                });
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得查询条件列表
        getStorageList();
        getCarMakerList();
        getEntrustList();
        // 查询数据
        queryCarDemandData();
    };
    $scope.initData();
}]);


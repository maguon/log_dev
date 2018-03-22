/**
 * Created by jiangsen on 2017/5/17.
 * 主菜单：车辆查询
 */
app.controller("car_demand_controller", ["$scope", "$rootScope", "$host", "_basic", "_config","_baseService", function ($scope, $rootScope, $host, _basic,  _config, _baseService) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    // 车库状态
    $scope.relStatus = _config.carRelStatus;
    $scope.searchRelStatus = 1;

    /**
     * 车辆品牌列表查询，用来填充查询条件：车辆品牌
     */
    function getCarMakerList(){
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.makecarName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 仓库列表查询，用来填充查询条件：所在仓库
     */
    function getStorageList(){
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 存放位置联动查询--行
     */
/*    $scope.changeStorageId = function (val) {
        if (val) {
            _basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true&&data.result.length>0) {
                    $scope.storageParking = data.result;
                    $scope.parkingArray = _baseService.storageParking($scope.storageParking);
                } else {
                    swal(data.msg, "", "error");
                }
            });
        }
    },
    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {
        if (val) {
            $scope.colArr = array[val - 1].col;
        }
    };*/

    /**
     * 当车辆品牌变更时，车辆型号要进行联动刷新。
     * @param val 车辆品牌ID
     */
    $scope.changeMakerId = function (val) {
        if (val) {
            if ($scope.curruntId == val) {
            } else {
                $scope.curruntId = val;
                _basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success == true&&data.result.length>0) {
                        $scope.carModelName = data.result;
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        }
    };

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryCarDemandData() {
        var reqUrl = $host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size
        if ($scope.searchRelStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.searchRelStatus
        }
        if ($scope.search_storage != null) {
            reqUrl = reqUrl + "&storageId=" + $scope.search_storage
        }
        if ($scope.search_makeId != null) {
            reqUrl = reqUrl + "&makeId=" + $scope.search_makeId
        }
        if ($scope.search_modelId != null) {
            reqUrl = reqUrl + "&modelId=" + $scope.search_modelId
        }
        if ($scope.search_vin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.search_vin
        }
        if ($scope.search_enterTime_start != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.search_enterTime_start
        }
        if ($scope.search_enterTime_end != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.search_enterTime_end
        }
        if ($scope.search_planTime_start != null) {
            reqUrl = reqUrl + "&planStart=" + $scope.search_planTime_start
        }
        if ($scope.search_planTime_end != null) {
            reqUrl = reqUrl + "&planEnd=" + $scope.search_planTime_end
        }
        if ($scope.search_outTime_start != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.search_outTime_start
        }
        if ($scope.search_outTime_end != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.search_outTime_end
        }
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storageCarList = data.result;
                $scope.storageCar = $scope.storageCarList.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").removeClass("disabled");
                } else {
                    $("#pre").addClass("disabled");
                }
                if ($scope.storageCarList.length < $scope.size) {
                    $("#next").addClass("disabled");
                } else {
                    $("#next").removeClass("disabled");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        queryCarDemandData();
        getCarMakerList();
        getStorageList();
    };
    $scope.initData();
}]);


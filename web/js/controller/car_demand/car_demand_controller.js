/**
 * Created by jiangsen on 2017/5/17.
 */
var car_demand_controller = angular.module("car_demand_controller", []);
car_demand_controller.controller("car_demand_controller", ["$scope", "$rootScope", "$host", "$basic", "$config_variable", "service_storage_parking", function ($scope, $rootScope, $host, $basic,  $config_variable, service_storage_parking) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;
    $scope.change_model_id = "";
    var userId = $basic.getSession($basic.USER_ID);
    var searchAll = function () {
        var reqUrl = $host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size
        if ($scope.search_relStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.search_relStatus
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
        $basic.get(reqUrl).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storage_car_box = data.result;
                $scope.storage_car = $scope.storage_car_box.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").removeClass("disabled");
                } else {
                    $("#pre").addClass("disabled");
                }
                if ($scope.storage_car_box.length < $scope.size) {
                    $("#next").addClass("disabled");
                } else {
                    $("#next").removeClass("disabled");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 条件查询
    $scope.searchStorage_car = function () {
        searchAll();
    };
    // 分页
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        searchAll();
    };
    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        searchAll();
    };
    // 车库状态
    $scope.rel_status = $config_variable.car_rel_status;
    $scope.search_relStatus = 1;
    // 车辆品牌查询
    $basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车库查询
    $basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.storageName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        if (val) {
            $basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true&&data.result.length>0) {
                    $scope.storageParking = data.result;
                    $scope.parkingArray = service_storage_parking.storage_parking($scope.storageParking);
                    // console.log($scope.parkingArray)

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
    };
    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        if (val) {
            if ($scope.curruntId == val) {
            } else {
                $scope.curruntId = val;
                $basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success == true&&data.result.length>0) {
                        $scope.carModelName = data.result;
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        }
    };
    // modelId全局变量
    searchAll();
}]);


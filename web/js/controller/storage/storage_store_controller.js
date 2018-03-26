/**
 * Created by ASUS on 2017/5/4.
 */
app.controller("storage_store_controller", ["$scope", "_host", "$stateParams", "_basic", "$state", "$rootScope", "_config", "_baseService", function ($scope, _host, $stateParams, _basic, $state, $rootScope, _config,_baseService ) {
    var userId = _basic.getSession(_basic.USER_ID);
    var data = new Date();
    var nowDate = moment(data).format('YYYYMMDD');
    $scope.imgArr = [];
    // 颜色
    $scope.color = _config.config_color;
    var getStorageStoreList = function () {
        var obj = {
            dateStart: nowDate,
            dateEnd: nowDate
        };
        _basic.get(_host.api_url + "/storageDate?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storeStorage = data.result;
            }
        })
       /* _basic.get(_host.api_url + "/storageDate").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.storeStorage = data.result;
            }
        })*/
    };
    getStorageStoreList();
    // 车辆品牌查询
    _basic.get(_host.api_url + "/carMake").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        if ($scope.curruntId == val) {
        } else {
            $scope.curruntId = val;
            _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true&&data.result.length>0) {
                    $scope.carModelName = data.result;

                } else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };
    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        _basic.get(_host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageParking = data.result;
                $scope.parkingArray = _baseService.storageParking($scope.storageParking);

            } else {
                swal(data.msg, "", "error");
            }
        });
    },
    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {
        $scope.colArr = array[val - 1].col;
    };
}]);
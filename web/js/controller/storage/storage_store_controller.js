/**
 * 主菜单：仓储管理 -> 仓储存放 控制器
 */
app.controller("storage_store_controller", ["$scope", "_host", "_basic", "_config", "_baseService", function ($scope, _host, _basic, _config,_baseService ) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    /**
     * 检索钥仓库存放数据列表。
     */
    $scope.getStorageStoreList = function () {
        // 取得当天日期
        var data = new Date();
        var nowDate = moment(data).format('YYYYMMDD');

        // 检索URL组装
        var url = _host.api_url + "/storageDate?dateStart=" + nowDate + "&dateEnd=" + nowDate;

        console.log(url);

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.storageList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 画面初期检索。
     */
    $scope.getStorageStoreList();


    $scope.imgArr = [];
    // 颜色
    $scope.color = _config.config_color;

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
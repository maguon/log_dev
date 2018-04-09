/**
 * Created by star on 2018/4/3.
 * 委托方
 */
app.controller("client_info_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "_baseService", function ($scope, $rootScope, _host, _basic, _config, _baseService) {
    $scope.start = 0;
    $scope.size = 10;
    //委托方性质
    $scope.entrustType = _config.entrustType;
    $scope.carLot=_config.carParking;
    //获取委托方信息
    $scope.entrust =function(type) {
        _basic.get(_host.api_url + "/entrust?entrustType="+type).then(function (data) {
            if (data.success == true) {
                $scope.getEntrust = data.result;
                $('#getEntrustId').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown'
                });
            }
        });
    };
   //获取列表
    $scope.getClient = function (){
        var obj = {
            entrustType:$scope.getEntrustType,
            entrustId:$scope.getEntrustId,
            contactsName:$scope.contactsName,
            tel:$scope.contactsTel,
            start:$scope.start.toString(),
            size:$scope.size
        };
        _basic.get(_host.api_url + "/entrustBase?" +_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
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
                $scope.getClientList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 上一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getClient();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getClient();
    };
    //获取数据
    $scope.queryData = function () {
        $scope.getClient();
    };
    $scope.queryData();
}])

/**
 * Created by star on 2018/4/3.
 * 委托方详情
 */
app.controller("client_info_detail_controller", ["$scope", "$rootScope", "$stateParams","_host", "_basic", "_config", "_baseService", function ($scope, $rootScope,$stateParams, _host, _basic, _config, _baseService) {
    //获取传过来的id
    var entrustId = $stateParams.id;
    //获取头部基本信息
    function getentrust (){
        _basic.get(_host.api_url + "/entrust?entrustId=" + entrustId).then(function (data) {
            if (data.success == true) {
                $scope.clientList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    getentrust ();
}])
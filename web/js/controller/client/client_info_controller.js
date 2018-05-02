/**
 * Created by star on 2018/4/3.
 * 委托方
 */
app.controller("client_info_controller", ["$scope", "$rootScope", "_host", "_basic", "_config",  function ($scope, $rootScope, _host, _basic, _config) {
    $scope.start = 0;
    $scope.size = 11;
    var url="";
    //委托方性质
    $scope.entrustTypeList = _config.entrustType;
    //获取委托方信息
    $scope.getEntrustInfo =function(type) {
        if(type==undefined){
            url=_host.api_url + "/entrust";
        }else{
            url=_host.api_url + "/entrust?entrustType="+type;
        }
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                if(data.result.length==0){
                    return;
                }
                $("#entrustSelect").val(null).trigger("change");
                getClient();
            }
        });
    };

   //获取列表
     function getClient  (){
         //委托方
        var entrust = $("#entrustSelect").select2("data")[0] ;
        var obj = {
            entrustType:$scope.entrustType,
            entrustId:entrust.id,
            contactsName:$scope.contactsName,
            tel:$scope.contactsTel,
            start:$scope.start.toString(),
            size:$scope.size
        };
        _basic.get(_host.api_url + "/entrustBase?" +_basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.clientBoxArray = data.result;
                $scope.clientArray = $scope.clientBoxArray.slice(0,10);
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //点击搜索
    $scope.searchClient = function (){
        $scope.start =0;
        getClient();
    }
    // 上一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        getClient();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        getClient();
    };
    //获取数据
    $scope.queryData = function () {
        $scope.getEntrustInfo();
    };
    $scope.queryData();
}])

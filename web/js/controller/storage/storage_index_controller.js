var storage_index_controller=angular.module("storage_index_controller",[]);
storage_index_controller.controller("storage_index_controller", ['$rootScope','$scope',"$host",'$location','$q',"$basic",
    function($rootScope,$scope,$host,$location,$q,$basic) {
        var date = new Date();
        var now_date = moment(date).format('YYYYMMDD');
        $scope.storage_allStorage=0;
        $basic.get($host.api_url+"/storageCount?dateStart="+now_date+"&dateEnd="+now_date).then(function (data) {
            if(data.success==true){
                $scope.storage_index_count=data.result[0];
            }else {

            }
        });
        $basic.get($host.api_url+"/storageDate?dateStart="+now_date+"&dateEnd="+now_date).then(function (data) {
            if(data.success==true){
                $scope.storage_index_list=data.result;
                for(var i in $scope.storage_index_list){
                    $scope.storage_allStorage=$scope.storage_allStorage+$scope.storage_index_list[i].col*$scope.storage_index_list[i].row
                }
                return $scope.storage_allStorage;
            }else {

            }
        })


    }]);
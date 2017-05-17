/**
 * Created by ASUS on 2017/5/17.
 */
var setting_amend_vin_controller=angular.module("setting_amend_vin_controller",[]);
setting_amend_vin_controller.controller("setting_amend_vin_controller",["$scope","$basic","$host",function ($scope,$basic,$host){
    var admin=$basic.getSession($basic.$basic.USER_ID);
    $scope.demand_car=function ($iValid) {
        $scope.submitted=true;
        if($iValid){
            $basic.get($host.api_url+"/admin/"+admin+"/car?vin="+1).then(function (data) {
                if(data.success=true){

                }
            })
        }
    }
}])

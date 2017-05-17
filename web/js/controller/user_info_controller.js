/**
 * Created by ASUS on 2017/5/16.
 */
var user_info_controller=angular.module("user_info_controller",[]);
user_info_controller.controller("user_info_controller",["$scope","$basic","$config_variable","$host",function ($scope,$basic,$config_variable,$host) {
    var user_info_obj=$config_variable.userTypes;
    var user_info_fun=function () {
        $scope.user_info_section=[];
        for(var i in user_info_obj){
            $scope.user_info_section.push(user_info_obj[i])
        }
        return $scope.user_info_section
    };
    user_info_fun();

    $scope.get_userInfo=function ($event,type) {

        if( $($event.target).attr("flag")=="true"){
            $(".user_info_list").attr("flag","true");
            $($event.target).attr("flag","false");
            $basic.get($host.api_url+"/user").then(function (data) {
                if(data.success==true){
                    $scope.user_info_list=data.result;
                    $scope.user_info_list_array=[];
                    for(var i in $scope.user_info_list){
                        if($scope.user_info_list[i].type==type){
                            $scope.user_info_list_array.push($scope.user_info_list[i])
                        }
                    }
                    // console.log($scope.user_info_array)
                }else {
                    swal(data.msg,"","error")
                }
            });
            // $($event.target).addClass("cyan light-1");

        }else {
            $($event.target).attr("flag","true");
        }

    }
}]);
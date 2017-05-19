/**
 * Created by ASUS on 2017/5/16.
 */
var user_info_controller=angular.module("user_info_controller",[]);
user_info_controller.controller("user_info_controller",["$scope","$basic","$config_variable","$host",function ($scope,$basic,$config_variable,$host) {

    var user_info_obj=$config_variable.userTypes;
    $scope.user_info_section=[];
    var user_info_fun=function () {
        $basic.get($host.api_url+"/user").then(function (data) {
            if(data.success==true){
                $scope.user_info_list=data.result;
                for(var i in user_info_obj){
                    $scope.user_info_section.push({
                        user_type:user_info_obj[i].type,
                        type_name:user_info_obj[i].name,
                        user_info_list_array:[]
                    });
                }
                for(var k in $scope.user_info_section){
                    for(var j in $scope.user_info_list){
                    if($scope.user_info_list[j].type==$scope.user_info_section[k].user_type){
                        $scope.user_info_section[k].user_info_list_array.push({
                            status:$scope.user_info_list[j].status,
                            real_name:$scope.user_info_list[j].real_name,
                            mobile:$scope.user_info_list[j].mobile,
                            gender:$scope.user_info_list[j].gender,
                        })
                    }
                }
            }


                console.log($scope.user_info_section);
                // console.log($scope.user_info_array)
            }else {
                swal(data.msg,"","error")
            }
        });

        // return $scope.user_info_section
    };
    user_info_fun();

}]);
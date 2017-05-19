/**
 * Created by jiangsen on 2017/4/11.
 */
var common_login_controller=angular.module("common_login_controller",[]);
common_login_controller.controller("common_login_controller", ['$rootScope','$scope','$location','$q',"$basic","$host","$config_variable",

    function($rootScope,$scope,$location,$q,$basic,$host,$config_variable){
            $scope.username='';
            $scope.password='';
            $scope.login = function(){

            if($scope.username==''||$scope.username==''){

                swal("账号或密码不能为空", "", "error");
            } else {
                $(".shadeDowWrap").show();
                $basic.post($host.api_url+"/userLogin", {
                    "mobile": $scope.username,
                    "password": $scope.password
                }).then(function(data){
                    $(".shadeDowWrap").hide();
                    if(data.success==true){
                        $basic.setSession($basic.USER_AUTH_NAME,data.result.accessToken);
                        $basic.setSession($basic.USER_ID,data.result.userId);
                        $basic.setSession($basic.USER_STATUS,data.result.userStatus);
                        $basic.setSession($basic.USER_TYPE,data.result.type);
                        $basic.setHeader($basic.USER_TYPE, data.result.type);
                        $basic.setHeader($basic.COMMON_AUTH_NAME, data.result.accessToken);
                        // 判断user_type控制页面调到某个模块
                        if(data.result.type==$config_variable.userTypes.storageUser.type){
                            window.location.href="storage.html";
                        }
                        if(data.result.type==$config_variable.userTypes.dispatch.type){
                            window.location.href="dispatch.html";
                        }
                        if(data.result.type==$config_variable.userTypes.international_trade.type){
                            window.location.href="international_trade.html";
                        }

                    }else {
                        swal(data.msg,"","error");
                    }
                }).catch(function(error){
                    swal("登录异常", "", "error");
                    console.log(error)
                });
            }

        };
        console.log('Login Controller Init !');
    }]);

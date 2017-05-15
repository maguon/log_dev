var storage_loginController=angular.module("storage_loginController",[]);
storage_loginController.controller("loginController", ['$rootScope','$scope','$location','$q',"$basic","$host",

    function($rootScope,$scope,$location,$q,$basic,$host){
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
                        console.log(data);

                        $basic.setSession($basic.USER_AUTH_NAME,data.result.accessToken);
                        $basic.setSession($basic.USER_ID,data.result.userId);
                        $basic.setSession($basic.USER_STATUS,data.result.userStatus);
                        $basic.setSession($basic.USER_TYPE,data.result.type);
                        $basic.setHeader($basic.USER_TYPE, data.result.type);
                        $basic.setHeader($basic.COMMON_AUTH_NAME, data.result.accessToken);
                        window.location.href="storage.html";
                    }else {
                        swal(data.msg,"","error");
                    }


                    // $basic.setCookie("auth-token",data.data.result.accessToken);
                    // $basic.setCookie("userId",data.data.result.userId);

                    // sweetAlert({
                    //     title: "Are you sure?",
                    //     text: "You will not be able to recover this imaginary file!",
                    //     type: "warning",
                    //     showCancelButton: true,
                    //     confirmButtonColor: "#DD6B55",
                    //     confirmButtonText: "Yes, delete it!",
                    //     closeOnConfirm: false
                    // }, function(){
                    //     swal("Deleted!",
                    //         "Your imaginary file has been deleted.",
                    //         "success");
                    // });

                }).catch(function(error){
                    swal("登录异常", "", "error");
                    console.log(error)
                });
            }


            //swal('登录成功','欢迎您进入系统'+$scope.username,'success')

        };
        console.log('Login Controller Init !');
    }]);/**
 * Created by ASUS on 2017/4/11.
 */

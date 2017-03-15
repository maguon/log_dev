var loginController=angular.module("loginController",[]);
loginController.controller("loginController", ['$rootScope','$scope','$location','$q',"$basic",

    function($rootScope,$scope,$location,$q,$basic ) {
        $scope.username='';
        $scope.password='';
        $scope.login = function(){
            console.log($scope.username,$scope.password);
            $basic.post(DataUrl+"/admin/do/login", {
                "userName": $scope.username,
                "password": $scope.password
            }).then(function(data){
                    console.log(data)
                }).catch(function(error){            });

            //swal('登录成功','欢迎您进入系统'+$scope.username,'success')

        };
        console.log('Login Controller Init !');
    }]);
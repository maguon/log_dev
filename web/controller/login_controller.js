app.controller("loginController", ['$rootScope','$scope','$location','$q',

    function($rootScope,$scope,$location,$q ) {
        $scope.username='Player';
        $scope.password='adfadfa';
        $scope.login = function(){
            //swal('登录成功','欢迎您进入系统'+$scope.username,'success')
            window.location.href = 'index.html';
        }
        console.log('Login Controller Init !')
    }])
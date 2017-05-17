var loginController = angular.module("loginController", []);
loginController.controller("loginController", ['$rootScope', '$scope', '$location','$q', "$basic", "$host",

    function ($rootScope, $scope, $location, $q, $basic, $host) {
        $scope.username = '';
        $scope.password = '';
        $scope.login = function () {

            if ($scope.username == '' || $scope.username == '') {
                swal("账号或密码不能为空", "", "error");
            } else {
                $basic.post($host.api_url + "/admin/do/login", {
                    "userName": $scope.username,
                    "password": $scope.password
                }).then(function (data) {

                    if (data.success == true) {
                        $basic.setSession($basic.COMMON_AUTH_NAME, data.result.accessToken);
                        $basic.setSession($basic.USER_ID, data.result.userId);
                        $basic.setSession($basic.USER_TYPE, "99");
                        $basic.setHeader($basic.USER_TYPE, "99");
                        $basic.setHeader($basic.COMMON_AUTH_NAME, data.result.accessToken);
                        window.location.href = "index.html";
                    } else {
                        swal(data.msg, "", "error");
                    }

                }).catch(function (error) {
                    swal("登录异常", "", "error");
                    console.log(error)
                });
            }

        };
        console.log('Login Controller Init !');
    }]);
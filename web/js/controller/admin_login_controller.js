var admin_login_controller = angular.module("admin_login_controller", []);
admin_login_controller.controller("admin_login_controller", ['$rootScope', '$scope', '$location','$q', "_basic", "_host",
    function ($rootScope, $scope, $location, $q, _basic, _host) {
        $scope.username = '';
        $scope.password = '';
        $scope.login = function () {
            if ($scope.username == '' || $scope.username == '') {
                swal("账号或密码不能为空", "", "error");
            } else {
                _basic.post(_host.api_url + "/admin/do/login", {
                    "userName": $scope.username,
                    "password": $scope.password
                }).then(function (data) {
                    if (data.success == true) {
                        _basic.setSession(_basic.COMMON_AUTH_NAME, data.result.accessToken);
                        _basic.setSession(_basic.USER_ID, data.result.userId);
                        _basic.setSession(_basic.USER_TYPE, "99");
                        _basic.setHeader(_basic.USER_TYPE, "99");
                        _basic.setHeader(_basic.COMMON_AUTH_NAME, data.result.accessToken);
                        window.location.href = "index.html";
                    } else {
                        swal(data.msg, "", "error");
                    }
                }).catch(function (error) {
                    swal("登录异常", "", "error");
                });
            }
        };
    }]);
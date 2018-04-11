/**
 * 普通用户 Login 画面 控制器
 */
Login_model.controller("common_login_view_controller", ['$rootScope', '$scope', '$location', '$q', "_basic", "_host", "_config",
    function ($rootScope, $scope, $location, $q, _basic, _host, _config) {
        $scope.username = '';
        $scope.password = '';

        // 登录按钮 动作
        $scope.login = function () {
            if ($scope.username == '' || $scope.username == '') {
                swal("账号或密码不能为空", "", "error");
            } else {
                $(".shadeDowWrap").show();
                _basic.post(_host.api_url + "/userLogin", {
                    "mobile": $scope.username,
                    "password": $scope.password
                }).then(function (data) {
                    $(".shadeDowWrap").hide();
                    if (data.success == true) {
                        _basic.setSession(_basic.USER_AUTH_NAME, data.result.accessToken);
                        _basic.setSession(_basic.USER_ID, data.result.userId);
                        _basic.setSession(_basic.USER_STATUS, data.result.userStatus);
                        _basic.setSession(_basic.USER_TYPE, data.result.type);
                        _basic.setHeader(_basic.USER_TYPE, data.result.type);
                        _basic.setHeader(_basic.COMMON_AUTH_NAME, data.result.accessToken);
                        // 判断user_type控制页面调到某个模块
                        for (var i = 0; i < _config.userTypes.length; i++) {
                            if (_config.userTypes[i].type == data.result.type) {
                                window.location.href = _config.userTypes[i].index;
                            }
                        }
                    } else {
                        swal(data.msg, "", "error");
                    }
                }).catch(function (error) {
                    swal("登录异常", "", "error");
                });
            }
        };
    }]);

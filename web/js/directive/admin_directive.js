var adminDirective = angular.module("adminDirective", []);
adminDirective.directive('header', function () {
    return {
        templateUrl: '/view/header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $element, $rootScope, _basic, _host) {

            // 管理者权限
            if (_basic.checkUser("99")) {

                // 取得当前登录用户ID
                var userId = _basic.getSession(_basic.USER_ID);

                /**
                 * 左侧导航栏
                 */
                $("#menu_link").sideNav({
                    menuWidth: 280, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                });
                $('.collapsible').collapsible();

                /**
                 * 注销账号
                 */
                $scope.logOut = function () {
                    swal({
                        title: "注销账号",
                        text: "是否确认退出登录",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    }, function () {
                        _basic.removeSession(_basic.COMMON_AUTH_NAME);
                        _basic.removeSession(_basic.USER_ID);
                        _basic.removeSession(_basic.USER_TYPE);
                        _basic.removeSession(_basic.USER_NAME);
                        window.location.href = '/admin_login.html';
                    });
                };

                _basic.setHeader(_basic.USER_TYPE, _basic.getSession(_basic.USER_TYPE));
                _basic.setHeader(_basic.COMMON_AUTH_NAME, _basic.getSession(_basic.COMMON_AUTH_NAME));
                _basic.get(_host.api_url + "/admin/" + _basic.getSession(_basic.USER_ID)).then(function (data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true && data.result.length > 0) {
                        $scope.userName = data.result[0].user_name;
                        _basic.setSession(_basic.USER_NAME, $scope.userName);
                        _basic.setHeader(_basic.USER_NAME, $scope.userName);
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            } else {
                window.location = "./admin_login.html"
            }

            /**
             * 显示【修改个人密码】画面。
             */
            $scope.openModifyPw = function () {
                $(".modal").modal();
                $("#user_modal").modal("open");
            };

            /**
             * 更新密码。
             * @param valid 是否有效
             */
            $scope.updatePassword = function (valid) {
                $scope.submitted = true;
                if (valid && $scope.newPassword == $scope.confirmPassword) {
                    var obj = {
                        "originPassword": $scope.oldPassword,
                        "newPassword": $scope.newPassword
                    };
                    // TODO 管理员修改的话，API 是 PUT /admin/{adminId}/password ？？
                    console.log(userId);
                    console.log($scope.oldPassword);
                    console.log($scope.newPassword);
                    _basic.put(_host.api_url + "/user/" + userId + "/password", obj).then(function (data) {
                        if (data.success == true) {
                            swal("密码重置成功", "", "success");
                            $("#user_modal").modal("close");
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                }
            };
        }
    };
});
adminDirective.directive("date", function () {
    return {
        restrict: "A",
        link: function () {
            $('.datepicker').pickadate({
                format: 'yyyy-mm-dd',
                onSet: function (arg) {
                    if ('select' in arg) {
                        this.close();
                    }
                },
                selectMonths: false, // Creates a dropdown to control month
                selectYears: 0 // Creates a dropdown of 15 years to control year
            });
        }
    }
});
adminDirective.directive("dateFilter", ["$filter", function ($filter) {
    var dateFilter = $filter("date");
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elm, attrs, ctrl) {
            function formatter(value) {
                return dateFilter(value, "yyyy-MM-dd");
            }

            function parser() {
                return ctrl.$modelValue;
            }

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);
        }
    }
}]);
adminDirective.directive("sexChange", function () {
    return {
        restrict: "A",
        link: function () {
            $(".sexBox i").on("click", function () {
                $(".sexBox i").removeClass("sex");
                $(this).addClass("sex")
            })
        }
    }
});
adminDirective.directive("addBrand", function () {
    return {
        restrict: "A",
        controller: function ($scope, _host, _basic) {
            var adminId = _basic.getSession(_basic.USER_ID);
            $scope.add_brand = function (iValid) {
                $scope.submitted1 = true;
                if (iValid) {
                    _basic.post(_host.api_url + "/admin/" + adminId + "/carMake/", {
                        makeName: $scope.b_txt
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("新增成功", "", "success");
                            $scope.b_txt = "";
                            /* $scope.searchAll();*/
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                }
            }
        }
    }
});
// 时间格式过滤指令
adminDirective.directive("formDate", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attr, ngModelCtr) {
            ngModelCtr.$formatters.push(function (modelValue) {
                var date = new Date(modelValue);
                var new_date;
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() < 10 ? '0' + (date.getDate()) + ' ' : date.getDate() + ' ');
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                new_date = Y + M + D;
                if (typeof modelValue != "undefined") {
                    //返回字符串给view,不改变模型值
                    return new_date;
                }
            })
        }
    }
});
adminDirective.directive('footer', function () {
    return {
        templateUrl: '/view/footer.html',
        replace: true,
        transclude: false,
        restrict: 'E'
    };
});
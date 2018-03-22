var adminDirective = angular.module("adminDirective", []);
adminDirective.directive('header', function () {
    return {
        templateUrl: '/view/header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $element, $rootScope, _basic,$host) {
            if (_basic.checkUser("99")) {
                $("#menu_link").sideNav({
                    menuWidth: 280, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                });
                $('.collapsible').collapsible();
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
                }
                _basic.setHeader(_basic.USER_TYPE, _basic.getSession(_basic.USER_TYPE));
                _basic.setHeader(_basic.COMMON_AUTH_NAME,  _basic.getSession(_basic.COMMON_AUTH_NAME) );
                _basic.get($host.api_url + "/admin/" + _basic.getSession(_basic.USER_ID)).then(function (data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true&&data.result.length>0) {
                        $scope.userName = data.result[0].user_name;
                        _basic.setSession(_basic.USER_NAME, $scope.userName);
                        _basic.setHeader(_basic.USER_NAME, $scope.userName);
                    } else {
                        swal(data.msg, "", "error");
                    }
                });

            } else {
                window.location="./admin_login.html"
            }

        }
    };
});
adminDirective.directive("carMsg", function () {
    return {
        restrict: 'A',
        link: function (ele, attr) {
            $('ul.tabs').tabs();
        }
    }
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
        controller: function ($scope, $host, _basic) {
            var adminId = _basic.getSession(_basic.USER_ID);
            $scope.add_brand = function (iValid) {
                $scope.submitted1 = true;
                if (iValid) {
                    // $(".add_Brand_Icon button").attr("disabled",true);
                    _basic.post($host.api_url + "/admin/" + adminId + "/carMake/", {
                        makeName: $scope.b_txt
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("新增成功", "", "success");
                            $scope.b_txt = "";
                            $scope.searchAll();
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

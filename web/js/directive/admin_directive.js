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
adminDirective.directive("collapsible", function () {
    return {
        restrict: "A",
        link: function () {
            $('.collapsible').collapsible();
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

adminDirective.directive('percent', function () {
    return {
        link: function (scope, element, attr) {
            var val = Number.parseInt(attr.value);
            var total = Number.parseInt(attr.total);
            var percentage = Number.parseInt((val*100/total));
            if (total != 0) {
                percentage = Number.parseInt((val * 100 / total));
            }else {
                percentage = 0;
            }
            $(element[0].children[0]).highcharts({
                // 表头
                title: {
                    text:percentage+"%",
                    align: 'center',
                    verticalAlign: 'middle',
                    y:8,
                    style:{
                        color:"#bdbdbd"
                    }
                },
                colors:[
                    "#6192d1",
                    "#cfd8dc"
                ],
                // 版权信息
                credits: {
                    enabled:"false",
                    text: '',
                    href: ''
                },
                tooltip: {
                    enabled : false
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: 0,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '',
                    innerSize: '80%',
                    data: [
                        ['',   percentage],
                        ['',   (100-percentage)]
                    ]
                }]
            });
            var chart = null;
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

// 验证金钱(小数点后2位)的指令
adminDirective.directive('validMoney', ['$parse', function ($parse) {
    return {
        restrict:"A",
        require: 'ngModel',
        link:function(scope,element,attrs,ngModelCtrl){
            // make sure we're connected to a model
            if (!ngModelCtrl) {
                return;
            }

            // 和画面的ngModel进行数据绑定
            ngModelCtrl.$parsers.push(function (val) {
                if (val === undefined || val === null) {
                    val = '';
                }

                var n = (val.split('.')).length-1;
                var reg = /^\d+(\.\d{1,2})?$/;

                var clean = "";
                if (reg.test(val)) {
                    clean = val;
                } else {
                    if (n==1 && val.substr(val.length-1) == '.') {

                        if (val === '.') {
                            clean = '';
                        } else {
                            clean = val;
                        }
                    } else {
                        clean = val.toString().substr(0,val.length-1);
                    }
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            // 键盘按下时触发，只能输入0-9
            // element.bind('keypress', function (e) {
            //     var code = e.keyCode || e.which;
            //     // if (!(code > 47 && code < 58) || e.shiftKey) {
            //     //     e.preventDefault();
            //     // }
            //     if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 46 ||
            //         value.match(/^\d{3}$/) || /\.\d{3}$/.test(value)) {
            //         e.preventDefault();
            //     }
            // });
        }
    };
}]);

// 验证利率(小数点后6位)的指令
adminDirective.directive('validRate', ['$parse', function ($parse) {
    return {
        restrict:"A",
        require: 'ngModel',
        link:function(scope,element,attrs,ngModelCtrl){
            // make sure we're connected to a model
            if (!ngModelCtrl) {
                return;
            }

            // 和画面的ngModel进行数据绑定
            ngModelCtrl.$parsers.push(function (val) {
                if (val === undefined || val === null) {
                    val = '';
                }

                var n = (val.split('.')).length-1;
                var reg = /^\d+(\.\d{1,6})?$/;

                var clean = "";

                if (reg.test(val)) {
                    clean = val;
                } else {
                    if (n==1 && val.substr(val.length-1) == '.') {
                        clean = val;
                    } else {
                        clean = val.toString().substr(0,val.length-1);
                    }
                }

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
        }
    };
}]);

// 验证数字(正数)的指令，只能输入[0-9]
adminDirective.directive('validNum', ['$parse', function ($parse) {
    return {
        restrict:"A",
        require: 'ngModel',
        link:function(scope,element,attrs,ngModelCtrl){
            // make sure we're connected to a model
            if (!ngModelCtrl) {
                return;
            }

            // 和画面的ngModel进行数据绑定
            ngModelCtrl.$parsers.push(function (val) {
                if (val === undefined || val === null) {
                    val = '';
                }

                var clean = val.toString().replace(/[^0-9]+/g, '');

                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            // 键盘按下时触发，只能输入0-9
            element.bind('keypress', function (e) {
                var code = e.keyCode || e.which;
                if (!(code > 47 && code < 58) || e.shiftKey) {
                    e.preventDefault();
                }
            });
        }
    };
}]);
//tab键之间转换
adminDirective.directive("ulTabs", function () {
    return {
        restrict: "A",
        link: function () {
            $('ul.tabs').tabs();
        }
    }
});


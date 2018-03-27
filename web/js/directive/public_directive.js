/**
 * Created by ASUS on 2017/5/15.
 */
var publicDirective = angular.module("publicDirective", []);
publicDirective.directive('header', function () {
    return {
        templateUrl: '/view/header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $element, $rootScope, _basic, _config, _host) {


           /* $scope.pwdReg = _config.pwdRegx;
            var str_type = $element.attr("type");
            $("#brand-logo").attr("src", $element.attr("url"));

            $scope.download_app = function () {
                $(".modal").modal();
                $("#download").modal("open");
            };
            $scope.closeModel = function () {
                $("#user_modal").modal("close");
                $scope.submitted = false;
                $scope.user_old_password = "";
                $scope.user_new_password = "";
            };*/
            //退出登录
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
                    window.location.href = '/common_login.html';
                });

            };
                //触发侧边栏导航
                $("#menu_link").sideNav({
                    menuWidth: 280, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    draggable: true // Choose whether you can drag to open on touch screens
                });
                $('.collapsible').collapsible();


                //存储信息到sessionStorage
                var userId = _basic.getSession(_basic.USER_ID);
                var userType = _basic.getSession(_basic.USER_TYPE);
                var user_info_obj = _config.userTypes;
                $scope.qrList = [];
                for (var i = 0; i < user_info_obj.length; i++) {
                    if(userType == user_info_obj[i].type){
                        $scope.qrList = user_info_obj[i].qr;
                        break;
                    }
                }
                _basic.setHeader(_basic.USER_TYPE, userType);
                _basic.setHeader(_basic.COMMON_AUTH_NAME, _basic.getSession(_basic.COMMON_AUTH_NAME));
                _basic.get(_host.api_url + "/user/" + userId).then(function (data) {
                    if (data.success == true) {
                        $scope.userName = data.result[0].user_name;
                        _basic.setSession(_basic.USER_NAME, $scope.userName);
                        _basic.setHeader(_basic.USER_NAME, $scope.userName);
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
        }
    };
});
publicDirective.directive("sideNav", function () {
    return {
        restrict: "A",
        link: function () {
            $("#menu_link").sideNav({
                menuWidth: 280, // Default is 300
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                // draggable: true // Choose whether you can drag to open on touch screens
            });
            // $(".button-collapse").sideNav();
            $('.collapsible').collapsible();
        }
    }
});
publicDirective.directive('percent', function () {
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
                    "#4dd0e1",
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
publicDirective.directive('footer', function () {
    return {
        templateUrl: '/view/footer.html',
        replace: true,
        transclude: false,
        restrict: 'E'
    };
});
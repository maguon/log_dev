/**
 * Created by ASUS on 2017/5/19.
 */

var international_trade_directive = angular.module("international_trade_directive", []);
international_trade_directive.directive('header', function () {
    return {
        templateUrl: '/view/storage/storage_header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $element, $rootScope, _basic,$host) {
            var userid=_basic.getSession(_basic.USER_ID);
            $scope.amend_user=function () {
                $(".modal").modal();
                $("#user_modal").modal("open");
            };
            $scope.amend_user_submit=function (valid) {
                $scope.submitted=true;
                if(valid&&$scope.user_new_password==$scope.user_confirm_password){
                    var obj={
                        "originPassword":$scope.user_old_password,
                        "newPassword": $scope.user_new_password
                    };
                    _basic.put($host.api_url + "/user/" + userid + "/password", obj).then(function (data) {
                        if (data.success == true) {
                            swal("密码重置成功", "", "success");
                            $("#user_modal").modal("close");
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                }
            };
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

            }
        }
    };
});

international_trade_directive.directive('dispatchNavigator', function () {
    return {
        templateUrl: '/view/dispatch/dispatch_navigator.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, _basic,_config, $host, $element, $rootScope) {
            if (_basic.checkUser(_config.userTypes.international_trade.type)) {

                _basic.setHeader(_basic.USER_TYPE, _basic.getSession(_basic.USER_TYPE));
                _basic.setHeader(_basic.COMMON_AUTH_NAME,  _basic.getSession(_basic.COMMON_AUTH_NAME) );
                _basic.get($host.api_url + "/user/" + _basic.getSession(_basic.USER_ID)).then(function (data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true&&data.result.length>0) {
                        $scope.userName = data.result[0].mobile;
                        _basic.setSession(_basic.USER_NAME, $scope.userName);
                        _basic.setHeader(_basic.USER_NAME, $scope.userName);
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
                $("#menu_link").sideNav({
                    menuWidth: 280, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    // draggable: true // Choose whether you can drag to open on touch screens
                });
                // $(".button-collapse").sideNav();
                $('.collapsible').collapsible();
            }else {
                window.location="./common_login.html"
            }


        }
    };
});
international_trade_directive.directive("carMsg", function () {
    return {
        restrict: 'A',
        link: function (ele, attr) {
            $('ul.tabs').tabs();
        }
    }
});
international_trade_directive.directive("truckUpload", function () {
    return {
        restrict: 'A',
        controller: function (_basic, $upload) {
            var userId = _basic.getSession(_basic.USER_ID);
            var arr = [];
            $("#img").on("change", function (e) {
                // 获取文件列表对象
                var files = e.target.files || e.dataTransfer.files;
                for (var i = 0, file; file = files[i]; i++) {
                    if (file.type.indexOf("image") == 0) {
                        if (file.size >= 512000) {
                            alert('您这张"' + file.name + '"图片大小过大，应小于500k');
                        } else {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                // var imgB=document.getElementById("imgBox");
                                var div = $("<div>").addClass("storage_car_picture col s3 vc-center  p0 grey white-text");
                                var imgEle = $("<img>");
                                imgEle.addClass("responsive-img");
                                imgEle.attr("src", e.target.result);
                                // imgEle.setAttribute("src",e.target.result);
                                imgEle.appendTo(div);
                                // div.appendChild(imgEle);
                                div.appendTo($(".storage_car_picture_wrap"));
                                // .appendChild(div)
                            };
                            reader.readAsDataURL(file);
                            var fd = new FormData();
                            fd.append("truck_picture", file);
                            _basic.post($upload.api_url_upload + "/user/" + userId + "/image?imageType=" + 2, {
                                image: fd
                            }).then(function (data) {

                            });
                            arr.push(file);
                            console.log(arr);
                        }
                    } else {
                        alert('文件"' + file.name + '"不是图片。');
                    }
                }
            })
        }
    }
});
international_trade_directive.directive("carSelect", function () {
    return {
        restrict: "A",
        link: function () {

        }
    }
});
international_trade_directive.directive('myRepeatDirective', function () {
    return function (scope, element, attrs) {
        angular.element(element).css('color', 'blue');
        if (scope.$last) {
            window.alert("im the last!");
        }
    };
})
international_trade_directive.directive("date", function () {
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
international_trade_directive.directive("dateFilter", ["$filter", function ($filter) {
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



international_trade_directive.directive('testDirective',[function () {
    return{
        restrict:"ECMA",
        priority:"",
        templateUrl:"",
        replace:true//false,
    }
}]);



international_trade_directive.directive("addNav", function () {
    return {
        templateUrl: '/view/car/new_truck/new_truck.html',
        restrict: "EA",
        replace: true,
    }
});
international_trade_directive.directive("truckNav", function () {
    return {
        restrict: "EA",
        link: function () {
            $(this).on("click", function () {

                $(".PublicTabs").children().removeClass("active");
                $(this).addClass("active");
                $(".add_Truck_view").load($(this).attr("data-url"))
            })
        }
    }
});

international_trade_directive.directive("basicTruck", function () {
    return {
        templateUrl: '/view/car/new_truck/basic.html',
        restrict: "EA",
        replace: true
    }
});
international_trade_directive.directive("carInspection", function () {
    return {
        templateUrl: '/view/car/new_truck/car_inspection.html',
        restrict: "EA",
        replace: true
    }
});

international_trade_directive.directive("usersTabs", function () {
    return {
        restrict: "A",
        link: function () {
            $(".users_chip").on("click", function () {
                $(".users_chip").removeClass("active");
                $(this).addClass("active")
            })
        }
    }
});
international_trade_directive.directive("sexChange", function () {
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

international_trade_directive.directive("ulTabs", function () {
    return {
        restrict: "A",
        link: function () {
            $('ul.tabs').tabs();
        }
    }
});
international_trade_directive.directive("collapsible", function () {
    return {
        restrict: "A",
        link: function () {
            $('.collapsible').collapsible();
        }
    }
});


international_trade_directive.directive("tooltipped", function () {
    return {
        restrict: "A",
        link: function () {
            $('.tooltipped').tooltip({delay: 50});
        }
    }
});

international_trade_directive.directive("addBrand", function () {
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
                            // $("<li>").html(str).appendTo($(".Brand_box"));
                            // $(".add_Brand_Icon button").removeAttr("disabled");
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
international_trade_directive.directive("addBrandModel", function () {
    return {
        restrict: "A",
        controller: function ($scope, $host, _basic) {
            var adminId = _basic.getSession(_basic.USER_ID);
            // 关闭新增型号
            $scope.close_brand_model = function (id) {
                $(".add_brand_box" + id).fadeIn(500);
                $(".add_brand_model_wrap" + id).fadeOut(500);
            };
            // 新增型号
            $scope.verify_brand_model = function (iValid, id) {
                $scope.submitted3 = true;
                if (iValid) {
                    console.log($scope.brandModelText);
                    // console.log($scope.brand_model_text)
                    _basic.post($host.api_url + "/admin/" + adminId + "/carMake/" + id + "/carModel", {
                        modelName: $scope.brandModelText
                    }).then(function (data) {
                        if (data.success == true) {
                            // $(".add_brand_box").fadeIn(500);
                            // $(".add_brand_model_wrap"+id).fadeOut(500);
                            $scope.search_carModel(id);
                            $scope.brandModelText = "";
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                }


            };

        }
    }
});

// 时间格式过滤指令
international_trade_directive.directive("formDate", function () {
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

international_trade_directive.directive("view", function () {
    return {
        restrict: "EA",
        link: function () {
            $('#jq22').viewer();
        }
    }
});

// ng-repeat渲染后的回调
international_trade_directive.directive('repeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                console.log('ng-repeat执行完毕');
                scope.$eval(attr.repeatFinish)
            }
        }
    }
});
international_trade_directive.directive('addRepeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                console.log('ng-repeat执行完毕');
                scope.$eval(attr.add_repeatFinish)
            }
        }
    }
});


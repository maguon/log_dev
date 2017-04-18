var commonDirective=angular.module("commonDirective",[]);
commonDirective.directive('header', function() {
    return {
        templateUrl: '/view/header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function($scope, $element,$rootScope){
            $scope.logOut = function(){
                swal({
                    title: "注销账号",
                    text: "是否确认退出登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText:"取消",
                    closeOnConfirm: false
                }, function(){
                   sessionStorage.removeItem("auth-token");
                    sessionStorage.removeItem("userId");
                    window.location.href='/login.html';
                });

            }
        }
    };
});

commonDirective.directive('navigator', function() {
    return {
        templateUrl: '/view/navigator.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function($scope,$basic,$host, $element,$rootScope){
            if(sessionStorage.getItem("auth-token")){
                $basic.get($host.api_url+"/admin/"+sessionStorage.getItem("userId")).then(function(data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true) {
                        $scope.userName=data.result[0].user_name;
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            $("#menu_link").sideNav({
                menuWidth: 280, // Default is 300
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                // draggable: true // Choose whether you can drag to open on touch screens
            });
            // $(".button-collapse").sideNav();
            $('.collapsible').collapsible();

        }
    };
});
commonDirective.directive('storageNavigator', function() {
    return {
        templateUrl: '/view/storage_navigator.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function($scope,$basic,$host, $element,$rootScope){
            if(sessionStorage.getItem("auth-token")){
                $basic.get($host.api_url+"/admin/"+sessionStorage.getItem("userId")).then(function(data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true) {
                        $scope.userName=data.result[0].user_name;
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            $("#menu_link").sideNav({
                menuWidth: 280, // Default is 300
                edge: 'left', // Choose the horizontal origin
                // closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                // draggable: true // Choose whether you can drag to open on touch screens
            });
            // $(".button-collapse").sideNav();
            $('.collapsible').collapsible();

        }
    };
});
commonDirective.directive("carMsg",function () {
    return{
        restrict: 'A',
        link:function (ele,attr) {
            $('ul.tabs').tabs();
        }
    }
});
commonDirective.directive("carSelect",function () {
   return{
       restrict:"A",
       link:function () {

       }
   }
});
commonDirective.directive('myRepeatDirective', function() {
        return function(scope, element, attrs) {
            angular.element(element).css('color','blue');
            if (scope.$last){
                window.alert("im the last!");
            }
        };
    })
commonDirective.directive("date",function () {
    return{
        restrict:"A",
        link:function () {
            $('.datepicker').pickadate({
                format:'yyyy-mm-dd',
                onSet: function (val) {
                    $('.picker__close').click();
                },
                selectMonths: false, // Creates a dropdown to control month
                selectYears: 0 // Creates a dropdown of 15 years to control year
            });
        }
    }
});
commonDirective.directive("dateFilter",["$filter",function ($filter) {
    var dateFilter=$filter("date");
    return{
        restrict:"A",
        require:"ngModel",
        link:function (scope, elm, attrs, ctrl) {
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
commonDirective.directive("addNav",function () {
    return{
        templateUrl: '/view/car/new_truck/new_truck.html',
        restrict:"EA",
        replace:true,
        // link:function () {
        //     $(".add_Truck_view").load("/view/car/new_truck/basic.html");
        //     $(".PublicTabs").children().on("click",function () {
        //         $(".PublicTabs").children().removeClass("active");
        //         $(this).addClass("active");
        //         $(".add_Truck_view").load($(this).attr("data-url"))
        //     })
        // }
    }
});
commonDirective.directive("truckNav",function () {
    return{
        restrict:"EA",
        link:function () {
            $(this).on("click",function () {

                        $(".PublicTabs").children().removeClass("active");
                        $(this).addClass("active");
                        $(".add_Truck_view").load($(this).attr("data-url"))
                    })
        }
    }
});

commonDirective.directive("basicTruck",function () {
    return{
        templateUrl: '/view/car/new_truck/basic.html',
        restrict:"EA",
        replace:true
    }
});
commonDirective.directive("carInspection",function () {
    return{
        templateUrl: '/view/car/new_truck/car_inspection.html',
        restrict:"EA",
        replace:true
    }
});

commonDirective.directive("usersTabs",function () {
    return{
        restrict:"A",
        link:function () {
            $(".users_chip").on("click",function () {
                $(".users_chip").removeClass("active");
                $(this).addClass("active")
            })
        }
    }
});
commonDirective.directive("sexChange",function () {
    return{
        restrict:"A",
        link:function () {
            $(".sexBox i").on("click",function () {
                $(".sexBox i").removeClass("sex");
                $(this).addClass("sex")
            })
        }
    }
});
commonDirective.directive("collapsible",function () {
    return{
        restrict:"A",
        link:function () {
            $('.collapsible').collapsible();
        }
    }
});
// commonDirective.directive("collapsibleModel",function () {
//     return{
//         restrict:"A",
//         link:function () {
//             $('.collapsible').collapsible({
//                 onOpen: function(el) { alert('Open'); }, // 回调当开启开启时
//                 onClose: function(el) { alert('Closed'); } // 回调当关闭时
//             });
//         }
//     }
// });
commonDirective.directive("tooltipped",function () {
    return{
        restrict:"A",
        link:function () {
            $('.tooltipped').tooltip({delay: 50});
        }
    }
});

commonDirective.directive("addBrand",function () {
    return{
        restrict:"A",
        controller:function ($scope,$host,$basic) {
            var adminId=sessionStorage.getItem("userId");
            $scope.add_brand=function (iValid) {
                $scope.submitted1=true;
                if(iValid){
                    // $(".add_Brand_Icon button").attr("disabled",true);
                    $basic.post($host.api_url+"/admin/"+adminId+"/carMake/",{
                        makeName: $scope.b_txt
                    }).then(function (data) {
                        if(data.success==true){
                            swal("新增成功","","success");
                            // $("<li>").html(str).appendTo($(".Brand_box"));
                            // $(".add_Brand_Icon button").removeAttr("disabled");
                            $scope.b_txt="";
                            $scope.searchAll();
                        }else {
                            swal(data.msg,"","error");
                        }
                    })
                }
                // var val=$scope.b_txt;
                // var str="<div class='collapsible-header blue-text'><i class='mdi mdi-car blue-text'></i>"+val+"</div> <div class='collapsible-body'><p>人的一生，其实就是一场自己对自己的战争。</p></div>";

            }
        }
    }
});
commonDirective.directive("addBrandModel",function () {
    return{
        restrict:"A",
        controller:function ($scope,$host,$basic) {
            var adminId=sessionStorage.getItem("userId");
            // 关闭新增型号
            $scope.close_brand_model=function (id) {
                $(".add_brand_box"+id).fadeIn(500);
                $(".add_brand_model_wrap"+id).fadeOut(500);
            };
            // 新增型号
            $scope.verify_brand_model=function (iValid,id) {
                $scope.submitted3=true;
                if(iValid){
                    console.log($scope.brandModelText);
                    // console.log($scope.brand_model_text)
                    $basic.post($host.api_url+"/admin/"+adminId+"/carMake/"+id+"/carModel",{
                        modelName:$scope.brandModelText
                    }).then(function (data) {
                        if(data.success==true){
                            // $(".add_brand_box").fadeIn(500);
                            // $(".add_brand_model_wrap"+id).fadeOut(500);
                            $scope.search_carModel(id);
                            $scope.brandModelText="";
                        }else {
                            swal(data.msg,"","error");
                        }
                    })
                }


            };
            // $scope.add_brand=function () {
            //     // var val=$scope.b_txt;
            //     // var str="<div class='collapsible-header blue-text'><i class='mdi mdi-car blue-text'></i>"+val+"</div> <div class='collapsible-body'><p>人的一生，其实就是一场自己对自己的战争。</p></div>";
            //     $(".add_Brand_Icon button").attr("disabled",true);
            //     $basic.post($host.api_url+"/admin/"+adminId+"/carMake/",{
            //         makeName: $scope.b_txt
            //     }).then(function (data) {
            //         if(data.success==true){
            //             swal("新增成功","","success");
            //             // $("<li>").html(str).appendTo($(".Brand_box"));
            //             $(".add_Brand_Icon button").removeAttr("disabled");
            //             $scope.b_txt="";
            //             $scope.searchAll();
            //         }else {
            //             swal(data.msg,"","error");
            //         }
            //     })
            // }
        }
    }
});
commonDirective.directive("calendar",function () {
    return{
        restrict:"EA",
        link:function () {
            // var options={
            //     // monthNames :"[‘一月’, ‘二月’, ……]" ,
            //     dayNames:"[‘周日’,‘周一’,‘周二’,‘周三’,‘周四’,‘周五’,‘周六’]"
            // };
            // $.fullCalendar.formatDate(date, formatString[options])
                //页面加载完初始化日历
                $('#calendar').fullCalendar({
                    height:750,
                        // monthNames:['一月','二月', '三月', '四月', '五月', '六月', '七月',
                        //     '八月', '九月', '十月', '十一月', '十二月'],
                        // dayNames:['星期日', '星期一', '星期二', '星期三',
                        //     '星期四', '星期五', '星期六'],
                        // buttonText:{
                        //     prev:     '上个月',
                        //     next:     '下个月',
                        //     prevYear: '去年',
                        //     nextYear: '明年',
                        //     today:    '当月',
                        //     month:    '月',
                        //     week:     '周',
                        //     day:      '日'
                        // }
                    }
                    //设置选项和回调

                )

        }
    }
});
// commonDirective.directive("shadeDow",function () {
//     return{
//         restrict:"A",
//         link:function (ele) {
//             ele.css({
//                 "display":"block"
//             })
//         }
//     }
// });
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
           $('select').material_select();
       }
   }
});
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
        templateUrl: '/view/car/new_truck/addTnav.html',
        restrict:"EA",
        replace:true,
        link:function () {
            $(".add_Truck_view").load("/view/car/new_truck/basic.html");
            $(".PublicTabs").children().on("click",function () {
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
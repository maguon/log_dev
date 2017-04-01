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
        controller: function($scope, $element,$rootScope){
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
                onSet: function () {
                    $('.picker__close').click();
                },
                selectMonths: false, // Creates a dropdown to control month
                selectYears: 0 // Creates a dropdown of 15 years to control year
            });
        }
    }
});
commonDirective.directive("addNav",function () {
    return{
        templateUrl: '/view/car/addTruck/addTnav.html',
        restrict:"EA",
        replace:true,
        link:function () {
            $(".add_Truck_view").load("/view/car/addTruck/basic.html");
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
        templateUrl: '/view/car/addTruck/basic.html',
        restrict:"EA",
        replace:true
    }
});
commonDirective.directive("carInspection",function () {
    return{
        templateUrl: '/view/car/addTruck/car_inspection.html',
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
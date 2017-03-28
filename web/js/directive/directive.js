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
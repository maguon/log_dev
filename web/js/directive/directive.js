var commonDirective=angular.module("commonDirective",[]);
commonDirective.directive('header', function() {
    return {
        templateUrl: '/view/header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function($scope, $element,$rootScope){
            $scope.logOut = function(){
                window.location.href='/login.html';
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
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                draggable: true // Choose whether you can drag to open on touch screens
            });

        }
    };
});
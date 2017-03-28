/**
 * Created by ASUS on 2017/3/23.
 */
var carMsgController=angular.module("carMsgController",['ui.router']);
carMsgController.controller("carMsgController",["$state","$scope",function ($state,$scope) {
    // $state.go('CarMsg.truck');//默认显示第一个tab
    // $scope.change = function(x){
    //     console.log(x);
    // };
    $scope.search=function () {
        console.log($scope.carType,$scope.beToType,$scope.carNum,$scope.driver,$scope.carState,$scope.insurance)
    }
}]);
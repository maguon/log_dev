/**
 * Created by ASUS on 2017/3/31.
 */
/**
 * Created by ASUS on 2017/3/31.
 */
var truckController=angular.module("truckController",[]);
truckController.controller("truckController",["$scope",function ($scope) {
    $('.modal').modal();
    $scope.Look=function () {
        $('#modal2').modal('open');

    };
    $scope.submit=function () {
        console.log(11)
    }
}]);
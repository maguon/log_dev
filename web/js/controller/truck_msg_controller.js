/**
 * Created by ASUS on 2017/3/23.
 */
var truckMsgController=angular.module("truckMsgController",['ui.router']);
truckMsgController.controller("truckMsgController",["$state","$scope",function ($state,$scope) {
    // $state.go('CarMsg.truck');//默认显示第一个tab
    // $scope.change = function(x){
    //     console.log(x);
    // };
    $scope.search=function () {
        console.log($scope.carType,$scope.beToType,$scope.carNum,$scope.driver,$scope.carState,$scope.insurance)
    };
    $scope.addTruck=function () {
        $('#modal1').modal('open');
        $(".PublicTabs").children("div").removeClass("active");
        $(".basic").addClass("active");
        $(".add_Truck_view").load("/view/car/new_truck/basic.html");
    }

}]);
/**
 * Created by ASUS on 2017/3/31.
 */
/**
 * Created by ASUS on 2017/3/31.
 */
var truckController = angular.module("truckController", []);
truckController.controller("truckController", ["$scope", function ($scope) {
    // $('.modal').modal();
    // $scope.Look=function () {
    //     $('#modal2').modal('open');
    // };
    // $scope.submit=function () {
    //     console.log(11)
    // }
    var count = 1;
    $scope.search = function () {
        console.log($scope.carType, $scope.beToType, $scope.carNum, $scope.driver, $scope.carState, $scope.insurance)
    };
    $scope.addTruck = function () {
        count = 1;
        $('#modal1').modal('open');
        $(".PublicTabs").children("div").removeClass("active");
        $(".basic1").addClass("active");
        $(".add_Truck_view").load("/view/car/new_truck/basic.html");
    };

    $scope.next = function () {
        count++;
        if (count < 5) {
            console.log(count);
            $(".PublicTabs").children().removeClass("active");
            $(".basic" + count).addClass("active");
            $(".add_Truck_view").load($(".basic" + count).attr("data-url"))
        }

    }
}]);
truckController.controller("truck_head_controller", ["$scope", "$host", "$basic", function ($scope, $host, $basic) {
    var userid = $basic.getSession($basic.USER_ID);

    $basic.get($host.api_url + "/user/" + userid + "truck", {
        truckType: 1
    }).then(function (data) {
        if (data.success == true) {
            console.log(data)
        } else {

        }
    })

}]);
truckController.controller("truck_hand_controller", ["$scope", "$host", "$basic", function ($scope, $host, $basic) {
    var userid = $basic.getSession($basic.USER_ID);

    $basic.get($host.api_url + "/user/" + userid + "truck", {
        truckType: 2
    }).then(function (data) {
        if (data.success == true) {
            console.log(data)
        } else {

        }
    })
}]);
truckController.controller("new_truck_controller", ["$scope", "$host", "$basic", function ($scope, $host, $basic) {

}]);
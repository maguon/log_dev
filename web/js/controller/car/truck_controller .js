/**
 * Created by ASUS on 2017/3/31.
 */
app.controller("truck_controller", ["$scope", function ($scope) {
    var count = 1;
    $scope.search = function () {
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
            $(".PublicTabs").children().removeClass("active");
            $(".basic" + count).addClass("active");
            $(".add_Truck_view").load($(".basic" + count).attr("data-url"))
        }
    }
}]);
app.controller("truck_head_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    _basic.get(_host.api_url + "/user/" + userId + "truck", {
        truckType: 1
    }).then(function (data) {
        if (data.success == true) {
        } else {
        }
    })
}]);
app.controller("truck_hand_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    _basic.get(_host.api_url + "/user/" + userId + "truck", {
        truckType: 2
    }).then(function (data) {
        if (data.success == true) {
        } else {
        }
    })
}]);
app.controller("new_truck_controller", ["$scope", "_basic", function ($scope, _basic) {
}]);
app.controller("setting_client_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {
    $scope.addClient = function () {
        $(".modal").modal();
        $("#newOperator").modal("open");
    };
}])

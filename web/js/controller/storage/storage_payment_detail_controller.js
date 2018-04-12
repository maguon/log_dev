app.controller("storage_payment_detail_controller", ["$scope","$stateParams", "_basic", "_host","_config","$state",  function ($scope,$stateParams, _basic, _host,_config,$state) {
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };
}])

app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/view/login.html',
        controller:'loginController'
    }).otherwise({
            templateUrl: '/view/login.html',
            controller:'loginController'
        });
}]);

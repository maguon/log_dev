
app.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/view/index.html',
        controller:'indexController'
    }).when('/data', {
        templateUrl: '/view/data.html',
        controller:'dataController'
    }).when('/setting', {
        templateUrl: '/view/setting.html',
        controller:'settingController'
    }).otherwise({
        templateUrl: '/view/index.html',
        controller:'indexController'
    });
}]);

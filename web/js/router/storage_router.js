var storage_router=angular.module("storage_router",[]);
storage_router.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    // $routeProvider.when('/', {
    //     templateUrl: '/view/index.html',
    //     controller:'indexController'
    // }).when('/data', {
    //     templateUrl: '/view/data.html',
    //     controller:'dataController'
    // }).when('/setting', {
    //     templateUrl: '/view/setting.html',
    //     controller:'settingController'
    // }).otherwise({
    //     templateUrl: '/view/index.html',
    //     controller:'indexController'
    // });

    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("storage_index", {  //路由状态
            url: "/storage_index",  //路由路径
            templateUrl: "/view/storage_index.html",  //路由填充的模板
            controller:'indexController'
        })
}]);
/**
 * Created by ASUS on 2017/4/10.
 */

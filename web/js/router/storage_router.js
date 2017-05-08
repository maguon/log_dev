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
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/working_calendar.html",
            // controller:'calendar_Controller'
        })
        .state("storageCar", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
        })
        .state("storageStore", {
            url:"/storage_store",
            templateUrl: "/view/storage/storage_store.html",
        })
        .state("storageCar_details", {
            url:"/storageCar_details/{id}/vin/{vin}?from",
            templateUrl: "/view/storage/storage_details.html",
        })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "/view/storage/storage_car_map.html",
        });
}]);
/**
 * Created by ASUS on 2017/4/10.
 */

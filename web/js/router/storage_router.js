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
        templateUrl: "/view/storage/storage_index.html",  //路由填充的模板
        controller:'storage_index_controller'
    })
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/working_calendar.html",
            controller:'storage_working_calendarController'
        })
        .state("storageCar", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'Storage_carController'
        })
        .state("storageStore", {
            url:"/storage_store",
            templateUrl: "/view/storage/storage_store.html",
            controller:"storage_storeController"
        })
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "/view/storage/storage_statistics.html",
            controller:"storage_statistics_controller"
        })
        .state("storageCar_details", {
            url:"/storageCar_details/{id}/vin/{vin}?from",
            templateUrl: "/view/storage/storage_details.html",
            controller:"storageCar_detailsController"
        })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "/view/storage/storage_car_map.html",
            controller:"storage_car_mapController"
        })
        .state("storage_setting_car",{
            url:"/storage_setting_car",
            templateUrl: "/view/storage/storage_setting_car.html",
            controller:'storage_setting_car_controller'
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/userinfo.html",
            controller:'user_info_controller'
        });
}]);
/**
 * Created by ASUS on 2017/4/10.
 */

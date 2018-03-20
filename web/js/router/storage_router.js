var storage_router=angular.module("storage_router",[]);
storage_router.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("storage_index", {  //路由状态
        url: "/storage_index",  //路由路径
        templateUrl: "/view/storage/storage_index.html",  //路由填充的模板
        controller:'storage_index_controller'
    })
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/storage_calendar.html",
            controller:'storage_calendar_controller'
        })
        .state("storageCar", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'storage_car_controller'
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
            url:"/storageCar_details/{id}/vin/{vin}/_form/{_form}?from",
            templateUrl: "/view/storage/storage_details.html",
            controller:"storage_car_details_controller"
        })
        .state("storageCar_details_", {
            url:"/storageCar_details/{id}/vin/{vin}?from",
            templateUrl: "/view/storage/storage_details.html",
            controller:"storage_car_details_controller"
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/user/user_info.html",
            controller:'user_info_controller'
        });
}]);
/**
 * Created by ASUS on 2017/4/10.
 */

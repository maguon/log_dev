
var app = angular.module("log_dev", ['ui.materialize','ui.router',"CommonFilter","ngCookies","ngMessages","data_controller","index_controller","loginController","storage_index_controller","settingController","truckController","Company_controller","Storage_carController","storage_storeController","storage_car_mapController","storageCar_detailsController","storage_statistics_controller","storage_working_calendarController","hostService","baseService","commonDirective","publicDirective","CommonService","index_router"]);

app.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);
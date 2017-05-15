
// var app = angular.module("storage_dev", ['ui.router',"ngCookies","ngMessages","index_controller","hostService","baseService","commonDirective","CommonService","storage_router"]);
var app = angular.module("storage_dev", ['ui.materialize','ui.router',"ngCookies","ngMessages","storage_index_controller","settingController","storage_router","Storage_carController","storage_storeController","storage_car_mapController","storageCar_detailsController","storage_working_calendarController","hostService","baseService","storageDirective","publicDirective","CommonService","CommonFilter"]);

app.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);

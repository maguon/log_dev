
var app = angular.module("log_dev", ['ui.materialize','ui.router',"CommonFilter","ngCookies","ngMessages","data_controller","index_controller","loginController","settingController","truckController","CompanyController","userController","Storage_car_Controller","storage_store_Controller","storage_car_map_controller","storageCar_details_ctrl","storage_working_calendar","hostService","baseService","commonDirective","CommonService","index_router"]);

app.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);
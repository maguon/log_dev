
var app = angular.module("log_dev", ['ui.materialize','ui.router',"CommonFilter","ngCookies","ngMessages","data_controller","index_controller","loginController","storage_index_controller","truckController","Company_controller","Storage_carController","settingController","storage_storeController","storage_car_mapController","storageCar_detailsController","storage_statistics_controller","storage_working_calendarController","user_info_controller","car_demand_controller","demand_Car_details_controller",'setting_amend_vin_controller',"hostService","baseService","adminDirective","publicDirective","CommonService","index_router"]);

app.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);
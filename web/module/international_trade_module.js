/**
 * Created by ASUS on 2017/5/19.
 */

var app = angular.module("international_trade_dev", ['ui.materialize','ui.router',"ngCookies","ngMessages","user_info_controller","demand_Car_details_controller","hostService","baseService","international_trade_directive","publicDirective","CommonService","CommonFilter","international_trade_router"]);

app.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);
/**
 * Created by 姜森 on 2017/3/14.
 */

var Login_model = angular.module("log_dev", ['ui.router',"ngCookies","loginController","login_router","CommonService","hostService"]);

Login_model.config(['$httpProvider',"$cookiesProvider",function($httpProvider,$cookiesProvider) {
    $cookiesProvider.defaults = {
        path: "/",
        domain: "",//cookie 作用域， cookies只在这个域和其子域有效
        expires:new Date(new Date().getTime()+5000),//有效时间
        secure: true//该cookie只在安全连接中被提供
    };
}]);/**
 * Created by ASUS on 2017/4/11.
 */
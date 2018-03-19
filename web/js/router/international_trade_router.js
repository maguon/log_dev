/**
 * Created by ASUS on 2017/5/19.
 */
var international_trade_router=angular.module("international_trade_router",[]);
international_trade_router.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {


    $urlRouterProvider.when("","/user_info");
    $stateProvider
        .state("car_demand",{
            url:"/car_demand",
            templateUrl: "/view/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
        .state("demand_Car_details",{
            url:"/demand_Car_details/{id}/vin/{vin}?from",
            templateUrl: "/view/car_demand/demand_Car_details.html",
            controller:'demand_Car_details_controller'
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/userinfo.html",
            controller:'user_info_controller'
        });
}]);
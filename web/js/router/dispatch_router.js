/**
 * Created by ASUS on 2017/5/19.
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/user_info");
    $stateProvider
        .state("car_demand",{
            url:"/car_demand",
            templateUrl: "/view/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
        .state("car_demand_details",{
            url:"/car_demand_details/{id}/vin/{vin}?from",
            templateUrl: "/view/car_demand/car_demand_details.html",
            controller:'car_demand_details_controller'
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/user/user_info.html",
            controller:'user_info_controller'
        });
}]);
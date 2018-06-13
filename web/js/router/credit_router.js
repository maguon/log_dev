/**
 * 信用证管理员-使用画面 路由配置.
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/finance_index");
    $stateProvider
        // 主菜单：主控面板(财务管理员)
        .state("finance_index", {
            url: "/finance_index",
            templateUrl: "/view/finance/finance_index.html",
            controller:'finance_index_controller'
        })

        // 主菜单：车辆查询 画面
        .state("car_demand",{
            url:"/car_demand",
            templateUrl: "/view/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
        // 主菜单：车辆查询 (车辆信息) 画面
        .state("car_demand_details",{
            url:"/car_demand_details/{id}/vin/{vin}?from",
            templateUrl: "/view/car_demand/car_demand_details.html",
            controller:'car_demand_details_controller'
        })

        // 财务管理->信用证
        .state("credit_card", {
            url:"/credit_card",
            params: {"from": null},
            templateUrl: "/view/finance/credit_card.html",
            controller:"credit_card_controller"
        })
        .state("credit_card_detail", {
            url:"/credit_card_detail/{id}?from",
            params: {"from": null},
            templateUrl: "/view/finance/credit_card_detail.html",
            controller:"credit_card_detail_controller"
        })
    ;
}]);

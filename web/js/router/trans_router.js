/**
 * 海运管理员-使用画面 路由配置.
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/user_info");
    $stateProvider
        // 主菜单：主控面板
        // .state("trade_index", {
        //     url: "/trade_index",
        //     templateUrl: "/view/finance/finance_index.html",
        //     controller:'finance_index_controller'
        // })

        // 主菜单：用户信息
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/user/user_info.html",
            controller:'user_info_controller'
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

        //委托方
        .state("client_info",{
            url:"/client_info",
            templateUrl: "/view/client/client_info.html",
            controller:'client_info_controller'
        })
        //委托方详情
        .state("client_info_detail",{
            url:"/client_info_detail/id/{id}/from/{from}",
            templateUrl: "/view/client/client_info_detail.html",
            controller:'client_info_detail_controller'
        })

        // 海运管理->海运信息
        .state("ship_trans_info", {
            url:"/ship_trans_info",
            params: {"from": null},
            templateUrl: "/view/sea_transport/ship_trans_info.html",
            controller:"ship_trans_info_controller"
        })
        // 海运管理->海运信息（订单详情）
        .state("ship_trans_info_detail", {
            url:"/ship_trans_info_detail/{id}?from",
            templateUrl: "/view/sea_transport/ship_trans_info_detail.html",
            controller:"ship_trans_info_detail_controller"
        })
        // 海运管理->海运日历
        .state("ship_trans_calendar", {
            url:"/ship_trans_calendar",
            templateUrl: "/view/sea_transport/ship_trans_calendar.html",
            controller:"ship_trans_calendar_controller"
        })

        // 管理员设置 -> 用户管理
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "/view/system_settings/user_manager.html",
            controller:'setting_user_controller'
        })
        // 管理员设置 -> 委托方设置
        .state("setting_client",{
            url:"/setting_client",
            templateUrl: "/view/system_settings/setting_client.html",
            controller:'setting_client_controller'
        })
        // 管理员设置 -> 船务公司设置
        .state("setting_shipping_co", {
            url:"/setting_shipping_co",
            templateUrl: "/view/system_settings/setting_shipping_co.html",
            controller:'setting_shipping_co_controller'
        })
        //港口设置
        .state("setting_port",{
            url:"/setting_port",
            templateUrl: "/view/system_settings/setting_port.html",
            controller:'setting_port_controller'
        })
    ;
}]);

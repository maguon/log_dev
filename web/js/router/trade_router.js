/**
 * 国贸管理员-使用画面 路由配置.
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/trade_index");
    $stateProvider
        // 主菜单：主控面板 TODO
        .state("trade_index", {
            url: "/trade_index",
            templateUrl: "/view/storage/storage_index.html",
            controller:'storage_index_controller'
        })

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

        // 财务管理->订单管理
        .state("order", {
            url:"/order",
            templateUrl: "/view/finance/order.html",
            controller:"order_controller"
        })
        // 财务管理->订单管理（订单详情）
        .state("order_detail", {
            url:"/order_detail/{id}?from",
            templateUrl: "/view/finance/order_detail.html",
            controller:"order_detail_controller"
        })
        // 财务管理->支付管理
        .state("payment", {
            url:"/payment",
            templateUrl: "/view/finance/payment.html",
            controller:"payment_controller"
        })
        // 财务管理->支付管理->详细
        .state("payment_detail", {
            url:"/payment_detail/{id}?from",
            templateUrl: "/view/finance/payment_detail.html",
            controller:"payment_detail_controller"
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
    ;
}]);

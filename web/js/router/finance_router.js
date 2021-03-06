/**
 * 财务管理员-使用画面 路由配置.
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/finance_index");
    $stateProvider
        // 主菜单：主控面板
        .state("finance_index", {
            url: "/finance_index",
            templateUrl: "/view/finance/finance_index.html",
            controller:'finance_index_controller'
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

        // 数据统计->车值统计
        .state("car_valuation_statistics",{
            url:"/car_valuation_statistics",
            templateUrl: "/view/statistics/car_valuation_statistics.html",
            controller:'car_valuation_statistics_controller'
        })

        // 财务管理-> 仓储订单
        .state("order", {
            url:"/order",
            templateUrl: "/view/finance/order.html",
            controller:"order_controller"
        })
        // 财务管理-> 仓储订单（订单详情）
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
        // 财务管理->发票管理
        .state("invoice", {
            url:"/invoice",
            params: {"from": null},
            templateUrl: "/view/finance/invoice.html",
            controller:"invoice_controller"
        })
        // 财务管理->发票管理->详细
        .state("invoice_detail", {
            url:"/invoice_detail/{id}?from",
            templateUrl: "/view/finance/invoice_detail.html",
            controller:"invoice_detail_controller"
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
        // 财务管理->金融车辆
        .state("finance_car", {
            url:"/finance_car",
            params: {"from": null},
            templateUrl: "/view/finance/finance_car.html",
            controller:"finance_car_controller"
        })
        // 财务管理->金融贷入
        .state("finance_loan_in", {
            url:"/finance_loan_in",
            params: {"from": null},
            templateUrl: "/view/finance/finance_loan_in.html",
            controller:"finance_loan_in_controller"
        })
        // 财务管理->金融贷入->详细
        .state("finance_loan_in_detail", {
            url:"/finance_loan_in_detail/{id}?from",
            templateUrl: "/view/finance/finance_loan_in_detail.html",
            controller:"finance_loan_in_detail_controller"
        })
        // 财务管理->贷入还款
        .state("finance_loan_in_repay", {
            url:"/finance_loan_in_repay",
            params: {"from": null},
            templateUrl: "/view/finance/finance_loan_in_repay.html",
            controller:"finance_loan_in_repay_controller"
        })
        // 财务管理->贷入还款->详细
        .state("finance_loan_in_repay_detail", {
            url:"/finance_loan_in_repay_detail/{id}?from",
            templateUrl: "/view/finance/finance_loan_in_repay_detail.html",
            controller:"finance_loan_in_repay_detail_controller"
        })
        // 财务管理->金融贷出
        .state("finance_loan_out", {
            url:"/finance_loan_out",
            params: {"from": null},
            templateUrl: "/view/finance/finance_loan_out.html",
            controller:"finance_loan_out_controller"
        })
        // 财务管理->金融贷出->详细
        .state("finance_loan_out_detail", {
            url:"/finance_loan_out_detail/{id}?from",
            templateUrl: "/view/finance/finance_loan_out_detail.html",
            controller:"finance_loan_out_detail_controller"
        })
        // 财务管理->贷出还款
        .state("finance_loan_out_repay", {
            url:"/finance_loan_out_repay",
            params: {"from": null},
            templateUrl: "/view/finance/finance_loan_out_repay.html",
            controller:"finance_loan_out_repay_controller"
        })
        // 财务管理->贷出还款->详细
        .state("finance_loan_out_repay_detail", {
            url:"/finance_loan_out_repay_detail/{id}?from",
            templateUrl: "/view/finance/finance_loan_out_repay_detail.html",
            controller:"finance_loan_out_repay_detail_controller"
        })
        // 财务管理->贷入日历
        .state("finance_loan_in_calendar", {
            url:"/finance_loan_in_calendar",
            templateUrl: "/view/finance/finance_loan_in_calendar.html",
            controller:"finance_loan_in_calendar_controller"
        })
        // 财务管理->贷出日历
        .state("finance_loan_out_calendar", {
            url:"/finance_loan_out_calendar",
            templateUrl: "/view/finance/finance_loan_out_calendar.html",
            controller:"finance_loan_out_calendar_controller"
        })

        // 海运管理-> 海运订单
        .state("sea_transport_order", {
            url:"/sea_transport_order",
            templateUrl: "/view/sea_transport/sea_transport_order.html",
            controller:"sea_transport_order_controller"
        })
        // 海运管理-> 海运订单详情
        .state("sea_transport_order_detail", {
            url:"/sea_transport_order_detail/{id}?from",
            templateUrl: "/view/sea_transport/sea_transport_order_detail.html",
            controller:"sea_transport_order_detail_controller"
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

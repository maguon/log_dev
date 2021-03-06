/**
 * 全部画面 路由配置(开发人员专用？).
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        // 仓储主控
        .state("storage_index", {
            url: "/storage_index",
            templateUrl: "/view/storage/storage_index.html",
            controller:'storage_index_controller'
        })
        // 财务主控
        .state("finance_index", {
            url: "/finance_index",
            templateUrl: "/view/finance/finance_index.html",
            controller:'finance_index_controller'
        })
        // 海运主控
        .state("sea_trans_index", {
            url: "/sea_trans_index",
            templateUrl: "/view/sea_transport/sea_trans_index.html",
            controller:'sea_trans_index_controller'
        })

        // 用户信息
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/user/user_info.html",
            controller:'user_info_controller'
        })

        // 车辆查询 画面
        .state("car_demand",{
            url:"/car_demand",
            templateUrl: "/view/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
        // 车辆查询 (车辆信息) 画面
        .state("car_demand_details",{
            url:"/car_demand_details/{id}/vin/{vin}?from",
            templateUrl: "/view/car_demand/car_demand_details.html",
            controller:'car_demand_details_controller'
        })

        // 委托方
        .state("client_info",{
            url:"/client_info",
            templateUrl: "/view/client/client_info.html",
            controller:'client_info_controller'
        })
        // 委托方详情
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

        // 财务管理->仓储订单
        .state("order", {
            url:"/order",
            templateUrl: "/view/finance/order.html",
            controller:"order_controller"
        })
        // 财务管理->仓储订单（订单详情）
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
        // 海运管理->海运统计
        .state("ship_trans_statistics", {
            url:"/ship_trans_statistics",
            templateUrl: "/view/sea_transport/ship_trans_statistics.html",
            controller:"ship_trans_statistics_controller"
        })

        // 仓储管理->工作日历
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/storage_calendar.html",
            controller:'storage_calendar_controller'
        })
        // 仓储统计
        .state("statistics", {
            url:"/statistics",
            templateUrl: "/view/storage/storage_statistics.html",
            controller:"storage_statistics_controller"
        })
        // 仓储管理->仓储存放
        .state("storage_store", {
            url:"/storage_store",
            templateUrl: "/view/storage/storage_store.html",
            controller:"storage_store_controller"
        })
        // 仓储管理->仓储存放->详细
        .state("storage_store_detail", {
            url:"/storage_store_detail/{id}?from",
            templateUrl: "/view/storage/storage_store_detail.html",
            controller:'storage_store_detail_controller'
        })
        // 仓储车辆信息(明细，共通用)
        .state("storage_car_detail", {
            url:"/storage_car_detail/{id}/{vin}?from",
            templateUrl: "/view/storage/storage_car_details.html",
            controller:"storage_car_details_controller"
        })
        // 仓储管理->仓储车辆
        .state("storage_car", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'storage_car_controller'
        })
        // 仓储管理->钥匙管理
        .state("key_info", {
            url:"/key_info",
            templateUrl: "/view/storage/key_info.html",
            controller:'key_info_controller'
        })
        // 仓储管理->钥匙管理->钥匙信息
        .state("key_info_detail", {
            url:"/key_info_detail/{id}?from",
            templateUrl: "/view/storage/key_info_detail.html",
            controller:'key_info_detail_controller'
        })

        // 管理员设置 -> 仓库设置
        .state("setting_storage", {
            url:"/setting_storage",
            templateUrl: "/view/system_settings/setting_storage.html",
            controller:'setting_storage_controller'
        })
        // 管理员设置 -> 仓库设置 -> 详情
        .state("setting_storage_detail",{
            url:"/setting_storage_detail/{id}?from",
            templateUrl: "/view/system_settings/setting_storage_detail.html",
            controller:'setting_storage_detail_controller'
        })
        // 管理员设置 -> 车辆设置
        .state("setting_car_brand", {
            url:"/setting_car_brand",
            templateUrl: "/view/system_settings/setting_car_brand.html",
            controller:'setting_car_brand_controller'
        })
        // 管理员设置 -> 管理员设置
        .state("setting_password", {
            url:"/setting_password",
            templateUrl: "/view/system_settings/setting_password.html",
            controller:'setting_password_controller'
        })
        // 管理员设置 -> 用户管理
        .state("setting_users", {
            url: "/setting_users",  //路由路径
            templateUrl: "/view/system_settings/user_manager.html", //路由填充的模板
            controller:'setting_user_controller'
        })
        // 管理员设置 -> 修改VIN
        .state("setting_amend_vin",{
            url:"/setting_amend_vin",
            templateUrl: "/view/system_settings/setting_amend_vin.html",
            controller:'setting_amend_vin_controller'
        })
        // 管理员设置 -> 委托方设置
        .state("setting_client",{
            url:"/setting_client",
            templateUrl: "/view/system_settings/setting_client.html",
            controller:'setting_client_controller'
        })
        // 钥匙柜设置
        .state("setting_key_cabinet",{
            url:"/setting_key_cabinet",
            templateUrl: "/view/system_settings/setting_key_cabinet.html",
            controller:'setting_key_cabinet_controller'
        })
        // 钥匙柜设置 -> 详情
        .state("setting_key_cabinet_detail",{
            url:"/setting_key_cabinet_detail/{id}?from",
            // params: {"id": null, "name": null, "remark": null, "zoneSize": null, "status": null},
            templateUrl: "/view/system_settings/setting_key_cabinet_detail.html",
            controller:'setting_key_cabinet_detail_controller'
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
        // 管理员设置 -> 贷入公司设置
        .state("setting_loan_in", {
            url:"/setting_loan_in",
            templateUrl: "/view/system_settings/setting_loan_in.html",
            controller:'setting_loan_in_controller'
        })

        // 下载app
        .state("admin_download_app",{
            url:"/admin_download_app",
            templateUrl: "/view/download/admin_download_app.html",
            controller:'admin_download_app_controller'
        })

        //app系统
        .state("app_version",{
            url:"/app_version",
            templateUrl: "/view/app/app_version.html",
            controller:'app_version_controller'
        })
    ;
}]);

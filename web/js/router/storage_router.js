/**
 * 仓储管理员-使用画面 路由配置.
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        // 主菜单：主控面板
        .state("storage_index", {
            url: "/storage_index",
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

        // 海运管理->海运信息
        .state("ship_trans_order", {
            url:"/ship_trans_order",
            templateUrl: "/view/sea_transport/ship_trans_order.html",
            controller:"ship_trans_order_controller"
        })
        // 海运管理->海运信息（订单详情）
        .state("ship_trans_order_detail", {
            url:"/ship_trans_order_detail/{id}?from",
            templateUrl: "/view/sea_transport/ship_trans_order_detail.html",
            controller:"ship_trans_order_detail_controller"
        })
        // 海运管理->海运日历
        .state("ship_trans_calendar", {
            url:"/ship_trans_calendar",
            templateUrl: "/view/sea_transport/ship_trans_calendar.html",
            controller:"ship_trans_calendar_controller"
        })
        // 海运管理->订单管理
        .state("sea_transport_order", {
            url:"/sea_transport_order",
            templateUrl: "/view/sea_transport/sea_transport_order.html",
            controller:"sea_transport_order_controller"
        })
        // 海运管理->订单管理详情
        .state("sea_transport_order_detail", {
            url:"/sea_transport_order_detail/{id}?from",
            templateUrl: "/view/sea_transport/sea_transport_order_detail.html",
            controller:"sea_transport_order_detail_controller"
        })

        // 仓储管理 -> 工作日历
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/storage_calendar.html",
            controller:'storage_calendar_controller'
        })
        // 仓储管理 -> 仓储统计
        .state("statistics", {
            url:"/storage_statistics",
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
        // 仓储管理->仓储车辆
        .state("storage_car", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'storage_car_controller'
        })
        // 仓储车辆信息
        .state("storage_car_detail", {
            url:"/storage_car_detail/{id}/{vin}?from",
            templateUrl: "/view/storage/storage_car_details.html",
            controller:"storage_car_details_controller"
        })
        // 仓储管理->钥匙管理
        .state("key_info", {
            url:"/key_info",
            templateUrl: "/view/storage/key_info.html",
            controller:'key_info_controller'
        })
        // 仓储管理->钥匙管理->钥匙信息
        .state("key_info_detail", {
            url:"/key_info_detail/{id}/{name}/{position}?from",
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
            url:"/setting_storage_detail/{id}/{status}?from",
            templateUrl: "/view/system_settings/setting_storage_detail.html",
            controller:'setting_storage_detail_controller'
        })
        // 管理员设置 -> 车辆设置
        .state("setting_car_brand", {
            url:"/setting_car_brand",
            templateUrl: "/view/system_settings/setting_car_brand.html",
            controller:'setting_car_brand_controller'
        })
        // 管理员设置 -> 用户管理
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "/view/system_settings/user_manager.html",
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
        // 管理员设置 -> 钥匙柜设置
        .state("setting_key_cabinet",{
            url:"/setting_key_cabinet",
            templateUrl: "/view/system_settings/setting_key_cabinet.html",
            controller:'setting_key_cabinet_controller'
        })
        // 管理员设置 -> 钥匙柜设置 -> 详情
        .state("setting_key_cabinet_detail",{
            url:"/setting_key_cabinet_detail/{id}/{status}?from",
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
    ;
}]);

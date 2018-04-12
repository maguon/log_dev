/**
 * 全部画面 路由配置(开发人员专用？).
 */
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("index", {  //路由状态
            url: "/index",  //路由路径
            templateUrl: "/view/index.html",  //路由填充的模板
            controller:'index_controller'
        })
        .state("refuel.oilMass", {
            url: "/refuel",  //路由路径
            templateUrl: "/view/car/refuel.html" //路由填充的模板
        })
        .state("data", {
            url: "/data",
            // 无菜单：文件上传 画面
            templateUrl: "/view/data/data.html",
            controller:'data_controller'
        })

        .state("setting_users", {
            url: "/setting_users",  //路由路径
            templateUrl: "/view/system_settings/user_manager.html", //路由填充的模板
            controller:'setting_user_controller'
        })
        .state("setting_password", {
            url:"/setting_password",
            templateUrl: "/view/system_settings/setting_password.html",
            controller:'setting_password_controller'
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
        // 管理员设置 -> 船务公司设置
        .state("setting_shipping_co", {
            url:"/setting_shipping_co",
            templateUrl: "/view/system_settings/setting_shipping_co.html",
            controller:'setting_shipping_co_controller'
        })

        .state("setting_car_brand", {
            url:"/setting_car_brand",
            templateUrl: "/view/system_settings/setting_car_brand.html",
            controller:'setting_car_brand_controller'
        })
        .state("setting_amend_vin",{
            url:"/setting_amend_vin",
            templateUrl: "/view/system_settings/setting_amend_vin.html",
            controller:'setting_amend_vin_controller'
        })
        .state("setting_client",{
            url:"/setting_client",
            templateUrl: "/view/system_settings/setting_client.html",
            controller:'setting_client_controller'
        })
        //港口设置
        .state("setting_port",{
            url:"/setting_port",
            templateUrl: "/view/system_settings/setting_port.html",
            controller:'setting_port_controller'
        })

        // 钥匙柜设置
        .state("setting_key_cabinet",{
            url:"/setting_key_cabinet",
            templateUrl: "/view/system_settings/setting_key_cabinet.html",
            controller:'setting_key_cabinet_controller'
        })
        // 钥匙柜设置 -> 详情
        .state("setting_key_cabinet_detail",{
            url:"/setting_key_cabinet_detail/{id}/{status}?from",
            // params: {"id": null, "name": null, "remark": null, "zoneSize": null, "status": null},
            templateUrl: "/view/system_settings/setting_key_cabinet_detail.html",
            controller:'setting_key_cabinet_detail_controller'
        })
        .state("storage_index", {  //路由状态
            url: "/storage_index",  //路由路径
            templateUrl: "/view/storage/storage_index.html",  //路由填充的模板
            controller:'storage_index_controller'
        })
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/storage_calendar.html",
            controller:'storage_calendar_controller'
        })
        .state("storage_car", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'storage_car_controller'
        })
        // 钥匙管理
        .state("key_info", {
            url:"/key_info",
            templateUrl: "/view/storage/key_info.html",
            controller:'key_info_controller'
        })
        // 钥匙管理->钥匙信息
        .state("key_info_detail", {
            url:"/key_info_detail/{id}/{name}/{position}?from",
            templateUrl: "/view/storage/key_info_detail.html",
            controller:'key_info_detail_controller'
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
        // 仓储管理->订单管理
        .state("storage_order", {
            url:"/storage_order",
            templateUrl: "/view/storage/storage_order.html",
            controller:"storage_order_controller"
        })
        // 仓储管理->订单管理（订单详情）
        .state("storage_order_detail", {
            url:"/storage_order_detail/{id}?from",
            templateUrl: "/view/storage/storage_order_detail.html",
            controller:"storage_order_detail_controller"
        })
        // 仓储管理->支付管理
        .state("storage_payment", {
            url:"/storage_payment",
            templateUrl: "/view/storage/storage_payment.html",
            controller:"storage_payment_controller"
        })
        .state("storage_car_detail", {
            url:"/storage_car_detail/{id}/vin/{vin}/?from",
            templateUrl: "/view/storage/storage_car_details.html",
            controller:"storage_car_details_controller"
        })
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
        .state("company", {
            url: "/company",  //路由路径
            templateUrl: "/view/car/company.html", //路由填充的模板
            controller:"company_controller"
        })
        // 下载app
        .state("admin_download_app",{
            url:"/admin_download_app",
            templateUrl: "/view/download/admin_download_app.html",
            controller:'admin_download_app_controller'
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
        //app系统
        .state("app_version",{
            url:"/app_version",
            templateUrl: "/view/app/app_version.html",
            controller:'app_version_controller'
        })
    /*       .state("Com", {
               url: "/Com",  //路由路径
               templateUrl: "/view/car/truck_statistics.html",  //路由填充的模板
           })
           .state("CarMsg", {
               url: "/CarMsg",  //路由路径
               templateUrl: "/view/car/truck_manager.html", //路由填充的模板
               controller:function ($state) {
                   $('.modal').modal();
                   $state.go("CarMsg.truck");
               }
           })
           .state("CarMsg.truck", {
               url: "/truck",  //路由路径
               templateUrl: "/view/car/truck/truck_head.html",  //路由填充的模板
               controller:'truck_head_controller'
           })
           .state("CarMsg.hand", {
               url: "/hand",  //路由路径
               templateUrl: "/view/car/truck/truck_hand.html",  //路由填充的模板
               controller:'truck_hand_controller'
           })
           .state("malfunction", {
               url: "/malfunction",  //路由路径
               templateUrl: "/view/car/malfunction.html", //路由填充的模板
               // abstract:true,
               controller:"truck_malfunction_controller"
           })
           .state("refuel", {
               url: "/refuel",  //路由路径
               templateUrl: "/view/car/refuel.html", //路由填充的模板
           })
           .state("refuel.carRefuel", {
               url: "/refuel",  //路由路径
               templateUrl: "/view/car/refuel.html", //路由填充的模板
               // abstract:true,
               // controller:
           })*/
    ;
}]);

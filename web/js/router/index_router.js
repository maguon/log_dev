
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
        .state("system_warehouse", {
            url:"/system_warehouse",
            templateUrl: "/view/system_settings/system_warehouse.html",
            controller:'system_warehouse_controller'
        })
        .state("setting_truck", {
            url:"/setting_truck",
            templateUrl: "/view/system_settings/setting_truck.html",
            controller:'setting_truck_controller'
        })
        .state("setting_amend_vin",{
            url:"/setting_amend_vin",
            templateUrl: "/view/system_settings/setting_amend_vin.html",
            controller:'setting_amend_vin_controller'
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
        .state("storageCar", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'storage_car_controller'
        })
        .state("storage_store", {
            url:"/storage_store",
            templateUrl: "/view/storage/storage_store.html",
            controller:"storage_store_controller"
        })
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "/view/storage/storage_statistics.html",
            controller:"storage_statistics_controller"
        })
        .state("storageCar_details_", {
            url:"/storageCar_details/{id}/vin/{vin}?from",
            templateUrl: "/view/storage/storage_car_details.html",
            controller:"storage_car_details_controller"
        })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "/view/storage/storage_car_map.html",
            controller:"storage_car_map_controller"
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/view/user/user_info.html",
            controller:'user_info_controller'
        })
        .state("car_demand",{
            url:"/car_demand",
            // 主菜单：车辆查询 画面
            templateUrl: "/view/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
        .state("car_demand_details",{
            url:"/car_demand_details/{id}/vin/{vin}?from",
            // 主菜单：车辆查询 -> 仓储车辆信息 画面
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

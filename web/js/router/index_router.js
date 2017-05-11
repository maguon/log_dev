var index_router=angular.module("index_router",[]);
index_router.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    // $routeProvider.when('/', {
    //     templateUrl: '/view/index.html',
    //     controller:'indexController'
    // }).when('/data', {
    //     templateUrl: '/view/data.html',
    //     controller:'dataController'
    // }).when('/setting', {
    //     templateUrl: '/view/setting.html',
    //     controller:'settingController'
    // }).otherwise({
    //     templateUrl: '/view/index.html',
    //     controller:'indexController'
    // });

    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("index", {  //路由状态
            url: "/index",  //路由路径
            templateUrl: "/view/index.html",  //路由填充的模板
            controller:'index_controller'
        })
        .state("Com", {
            url: "/Com",  //路由路径
            templateUrl: "/view/car/truck_statistics.html",  //路由填充的模板
            // controller:'dataController'
        })
        .state("CarMsg", {
            url: "/CarMsg",  //路由路径
            templateUrl: "/view/car/truck_manager.html", //路由填充的模板
            // abstract:true,
            controller:function ($state) {
                $('.modal').modal();
                $state.go("CarMsg.truck");
                // console.log($state);
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
        // .state("Driver", {
        //     url: "/Driver",  //路由路径
        //     templateUrl: "/view/car/Driver.html", //路由填充的模板
        //     // abstract:true,
        //     // controller:
        // })
        .state("Company", {
            url: "/Company",  //路由路径
            templateUrl: "/view/car/company.html", //路由填充的模板
            // abstract:true,
            controller:"Company_controller"
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
            // abstract:true,
            // controller:
        })
        .state("refuel.carRefuel", {
            url: "/refuel",  //路由路径
            templateUrl: "/view/car/refuel.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("refuel.oilMass", {
            url: "/refuel",  //路由路径
            templateUrl: "/view/car/refuel.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("data", {
            url: "/data",  //路由路径
            templateUrl: "/view/data.html",  //路由填充的模板
            controller:'dataController'
        })

        .state("setting_users", {
            url: "/setting_users",  //路由路径
            templateUrl: "/view/system_settings/user_manager.html", //路由填充的模板
            controller:'setting_user_controller'
        })
        .state("setting_pw", {
            url:"/setting_pw",
            templateUrl: "/view/system_settings/setting_password.html",
            controller:'settingPW_controller'
        })
        .state("setting_wh", {
            url:"/setting_wh",
            templateUrl: "/view/system_settings/system_warehouse.html",
            controller:'settingWH_controller'
        })
        .state("setting_truck", {
            url:"/setting_truck",
            templateUrl: "/view/system_settings/setting_truck.html",
            controller:'settingT_controller'
        })
        .state("storage_index", {  //路由状态
            url: "/storage_index",  //路由路径
            templateUrl: "/view/storage/storage_index.html",  //路由填充的模板
            controller:'storage_index_controller'
        })
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/view/storage/working_calendar.html",
            controller:'storage_working_calendarController'
        })
        .state("storageCar", {
            url:"/storage_car",
            templateUrl: "/view/storage/storage_car.html",
            controller:'Storage_carController'
        })
        .state("storageStore", {
            url:"/storage_store",
            templateUrl: "/view/storage/storage_store.html",
            controller:"storage_storeController"
        })
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "/view/storage/storage_statistics.html",
            controller:"storage_statistics_controller"
        })
        .state("storageCar_details", {
            url:"/storageCar_details/{id}/vin/{vin}?from",
            templateUrl: "/view/storage/storage_details.html",
            controller:"storageCar_detailsController"
        })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "/view/storage/storage_car_map.html",
            controller:"storage_car_mapController"
        });
        // .state("calendar", {
        //     url:"/calendar",
        //     templateUrl: "/view/storage/working_calendar.html",
        //     // controller:'calendar_Controller'
        // })
        // .state("storage_index", {  //路由状态
        //     url: "/storage_index",  //路由路径
        //     templateUrl: "/view/storage/storage_index.html",  //路由填充的模板
        //     controller:'storage_index_controller'
        // })
        // .state("storageCar", {
        //     url:"/storage_car",
        //     templateUrl: "/view/storage/storage_car.html",
        // })
        // .state("storageStore", {
        //     url:"/storage_store",
        //     templateUrl: "/view/storage/storage_store.html",
        // })
        // .state("storageCar_details", {
        //     url:"/storageCar_details/{id}/vin/{vin}?from",
        //     templateUrl: "/view/storage/storage_details.html",
        // })
        // .state("storage_car_map", {
        //     url:"/storage_car_map/{id}?form",
        //     templateUrl: "/view/storage/storage_car_map.html",
        // });

    // $urlRouterProvider.otherwise("/pageTab");

    // $urlRouterProvider.when("","/report")
    // $stateProvider
    //     .state("report",{
    //         url:"/report",
    //         views:{
    //             "PageTab":{
    //                 // url: "/pageTab",  //路由路径
    //                 templateUrl: "PageTab.html"  //路由填充的模板
    //             },
    //             "content":{
    //                 // url: "/content",  //路由路径
    //                 templateUrl: "content.html"  //路由填充的模板
    //             }
    //         }
    //     });
}]);

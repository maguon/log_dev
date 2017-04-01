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

    $urlRouterProvider.when("","/index");
    $stateProvider
        .state("index", {  //路由状态
            url: "/index",  //路由路径
            templateUrl: "/view/index.html",  //路由填充的模板
            controller:'indexController'
        })
        .state("Com", {
            url: "/Com",  //路由路径
            templateUrl: "/view/car/Com.html",  //路由填充的模板
            // controller:'dataController'
        })
        .state("CarMsg", {
            url: "/CarMsg",  //路由路径
            templateUrl: "/view/car/CarMsg.html", //路由填充的模板
            // abstract:true,
            controller:function ($state) {
                $('.modal').modal();
                $state.go("CarMsg.truck");
                console.log($state);
            }
        })
        .state("CarMsg.truck", {
            url: "/truck",  //路由路径
            templateUrl: "/view/car/truck/truck.html",  //路由填充的模板
            // controller:'dataController'
        })
        .state("CarMsg.hand", {
            url: "/hand",  //路由路径
            templateUrl: "/view/car/truck/hand.html",  //路由填充的模板
            // controller:'dataController'
        })
        .state("Driver", {
            url: "/Driver",  //路由路径
            templateUrl: "/view/car/Driver.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("Company", {
            url: "/Company",  //路由路径
            templateUrl: "/view/car/company.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("malfunction", {
            url: "/malfunction",  //路由路径
            templateUrl: "/view/car/malfunction.html", //路由填充的模板
            // abstract:true,
            // controller:
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
        .state("setting", {
            url:"/setting",
            templateUrl: "/view/setting.html",
            controller:'settingController'
        });


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

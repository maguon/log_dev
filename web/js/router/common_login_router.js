/**
 * 登录画面 路由配置.
 */
Login_model.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/common_login");
    $stateProvider

        // 普通登录URL入口
        .state("common_login", {
            url: "/common_login",
            templateUrl: "./common_login_view.html",
            controller: 'common_login_view_controller'
        })
        // 找回密码
        .state("retrieve_password", {
            url: "/retrieve_password",
            templateUrl: "./retrieve_password.html",
            controller: 'retrieve_password_controller'
        })
        .state('retrieve_password.phone', {
            url: '/phone',
            template: '<h2>Your priority inbox</h2>'
        });
}]);

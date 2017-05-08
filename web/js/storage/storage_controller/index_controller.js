var index_controller=angular.module("index_controller",[]);
index_controller.controller("indexController", ['$rootScope','$scope','$location','$q',"$basic",
    function($rootScope,$scope,$location,$q,$basic) {
        //
        if($basic.checkUser('2')){
            window.location.href = 'storage_Login.html';
        }


    }])

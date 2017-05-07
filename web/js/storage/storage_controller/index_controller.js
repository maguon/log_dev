var index_controller=angular.module("index_controller",[]);
index_controller.controller("indexController", ['$rootScope','$scope','$location','$q',"$basic",
    function($rootScope,$scope,$location,$q,$basic) {
        //
        if($basic.getSession($basic.USER_AUTH_NAME)&&$basic.getSession($basic.USER_TYPE)=="1"){

        }else {
            window.location.href = 'storage_Login.html';

        }


    }])/**
 * Created by ASUS on 2017/4/10.
 */

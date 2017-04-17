var storage_controller=angular.module("storage_controller",[]);/**
 * Created by ASUS on 2017/4/14.
 */
storage_controller.controller("Storage_car_Controller",["$scope","$host","$basic",function ($scope,$host,$basic) {
    var userId=sessionStorage.getItem("userId");
        $basic.get($host.api_url+"/user/"+userId+"/car").then(function (data) {
            if(data.success=true){
                $scope.storage_car=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });
    $scope.newStorage_car=function () {
        $(".modal").modal();
        $("#newStorage_car").modal("open");
        // $basic.get($host.api_url+"/admin/"+userId+"/carMark").then(function (data) {
        //     if(data.success=true){
        //         console.log(data)
        //     }else {
        //         swal(data.msg,"","error");
        //     }
        // })
    };
    $scope.submitForm=function () {
        var obj={
                "vin":$scope.win,
                "makeId": 0,
                "makeName": "string",
                "modelId": 0,
                "modelName": "string",
                "proDate": "string",
                "colour": "string",
                "engineNum": "string",
                "remark": "string"
        };
       $basic.post($host.api_url+"/user/"+userId+"/car",obj).then(function (data) {
           if(data.success=true){

           }else {

           }
       })
    }
}]);
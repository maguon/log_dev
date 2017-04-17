var storage_controller=angular.module("storage_controller",[]);/**
 * Created by ASUS on 2017/4/14.
 */
storage_controller.controller("Storage_car_Controller",["$scope","$host","$basic",function ($scope,$host,$basic) {
    var userId=sessionStorage.getItem("userId");
    var searchAll=function () {
        $basic.get($host.api_url+"/user/"+userId+"/car").then(function (data) {
            if(data.success=true){
                $scope.storage_car=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });
    };
    searchAll();
        
    $scope.newStorage_car=function () {
        $(".modal").modal();
        $("#newStorage_car").modal("open");
        // 车辆品牌查询
        $basic.get($host.api_url+"/carMake").then(function (data) {
            if(data.success=true){
                $scope.makecarName=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });
        // 车库查询
        $basic.get($host.api_url+"/storage").then(function (data) {
            if(data.success=true){
                $scope.storageName=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });


    };
    // 存放位置联动查询--行
    $scope.changeStorageId=function (val) {
        $basic.get($host.api_url+"/storage/"+val+"/storageParking").then(function (data) {
            if(data.success=true){
                $scope.storageParking=data.result;
                var rowArr=[];
                var obj={};
                for(var i in $scope.storageParking){
                    if(!obj[$scope.storageParking[i].row]){
                        rowArr.push($scope.storageParking[i].row);
                        obj[$scope.storageParking[i].row]=1;
                    }
                }
                $scope.rowArr=rowArr;


            }else {
                swal(data.msg,"","error");
            }
        });
    },
        // 存放位置联动查询--列
        $scope.changeStorageRow=function (val) {
            var colArr=[];
            for(var i in $scope.storageParking){
                if($scope.storageParking[i].row==val){
                    colArr.push($scope.storageParking[i].col)
                }
            }
            $scope.colArr=colArr;
        };

    // 车辆型号联动查询
    $scope.changeMakeId=function (val) {
        console.log(val)
        $basic.get($host.api_url+"/carMake/"+val+"/carModel").then(function (data) {
            if(data.success=true){
                $scope.carModelName=data.result;
            }else {
                swal(data.msg,"","error")
            }
        })
    };
    $scope.color=config_color;

    $scope.submitForm=function () {
        var obj_car={
                "vin":$scope.win,
                "makeId":$scope.make_name.id,
                "makeName":$scope.make_name.make_name,
                "modelId":$scope.model_name.id,
                "modelName":$scope.model_name.model_name,
                "proDate":$scope.create_time,
                "colour": $scope.car_color,
                "engineNum":$scope.engineNum,
                "remark":$scope.remark
        };

        var obj_time={
            "storageId": $scope.storage_name.id,
            "storageName": $scope.storage_name.storage_name,
            "enterTime":$scope.enter_time,
            "planOutTime": $scope.plan_out_time
        };
        console.log(obj_car,obj_time);
       // $basic.post($host.api_url+"/user/"+userId+"/car",obj_car).then(function (data) {
       //     if(data.success=true){
       //         swal("新增成功","","success");
       //         $("#newStorage_car").modal("close");
       //         searchAll();
       //     }else {
       //          swal(data.msg,"","error")
       //     }
       // });
       //  $basic.post($host.api_url+"/user/"+userId+"/carStorageRel",obj_time).then(function (data) {
       //      if(data.success=true){
       //          swal("新增成功","","success");
       //          $("#newStorage_car").modal("close");
       //          searchAll();
       //      }else {
       //          swal(data.msg,"","error")
       //      }
       //  })
    };
    // 仓库车辆详情
    $scope.lookStorageCar=function () {
        $(".modal").modal();
        $("#look_StorageCar").modal("open");
    }
}]);
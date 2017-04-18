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

                setTimeout($('select').material_select(),2000)
            }else {
                swal(data.msg,"","error");
            }
        });


    };
    // 存放位置联动查询--行
    $scope.changeStorageId=function (val){
        $basic.get($host.api_url+"/storage/"+val+"/storageParking").then(function (data) {
            if(data.success=true){
                $scope.storageParking=data.result;
                var rowArr=[];
                var obj={};

                var obj1={
                    row:"",
                    col:[
                    ],

                };
                var parkingArray =[];
                for(i=0;i<$scope.storageParking.length;i++){
                    for(j=0;j<parkingArray.length;){
                        if(parkingArray[j].row == $scope.storageParking[i].row){
                            break;
                        }else{
                            j++;
                        }
                    }
                    if(j==parkingArray.length){
                        parkingArray.push({row:$scope.storageParking[i].row,col:[{col:$scope.storageParking[i].col,carId:$scope.storageParking[i].car_id,id:$scope.storageParking[i].id}]})
                    }else{
                        parkingArray[j].col.push({col:$scope.storageParking[i].col,carId:$scope.storageParking[i].car_id,id:$scope.storageParking[i].id});
                    }
                }
                console.log(parkingArray);
                $scope.parkingArray=parkingArray;
                // for(var i in $scope.storageParking){
                //     if(!obj[$scope.storageParking[i].row]){
                //         obj[$scope.storageParking[i].row]=$scope.storageParking[i].row;
                //         // rowArr.push(obj);
                //         obj1.col.splice(0,obj1.col.length);
                //         obj1.row=$scope.storageParking[i].row;
                //         rowArr.push(obj1);
                //         console.log($scope.storageParking[i].row);
                //         for(var j in $scope.storageParking){
                //             if($scope.storageParking[j].row==$scope.storageParking[i].row){
                //                 var o={
                //                     col:$scope.storageParking[j].col,
                //                     car_id:$scope.storageParking[j].car_id
                //                 };
                //                 // console.log(o);
                //                 obj1.col.push(o);
                //             }
                //         }
                //
                //         console.log(obj1);
                //
                //     }
                //
                //
                // }
                // console.log(rowArr);
                // $scope.rowArr=rowArr;


            }else {
                swal(data.msg,"","error");
            }
        });
    },
        // 存放位置联动查询--列
        $scope.changeStorageRow=function (val) {
            // var colArr=[];
            // for(var i in $scope.storageParking){
            //     if($scope.storageParking[i].row==val){
            //         colArr.push($scope.storageParking[i].col)
            //     }
            // }
            console.log(val);
            $scope.colArr= $scope.parkingArray[val-1].col;

        };

    // 车辆型号联动查询
    $scope.changeMakeId=function (val) {
        console.log(val, $scope.make_name);

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
                "remark":$scope.remark,
                "storageId": $scope.storage_name.id,
                "storageName": $scope.storage_name.storage_name,
                // "enterTime":$scope.enter_time,
                "parkingId":$scope.col_id,
                "planOutTime": $scope.plan_out_time
        };
        console.log(obj_car);
       $basic.post($host.api_url+"/user/"+userId+"/carStorageRel",obj_car).then(function (data) {
           if(data.success=true){
               swal("新增成功","","success");
               $("#newStorage_car").modal("close");
               searchAll();
           }else {
                swal(data.msg,"","error")
           }
       });
    };
    // 仓库车辆详情
    $scope.lookStorageCar=function () {
        $(".modal").modal();
        $("#look_StorageCar").modal("open");
    };
    $scope.move_box=function () {
        if($(".move_box").attr("flag")=='true'){
            $(".move_box").show();
            $(".move_box").attr("flag",false);
        }else {
            $(".move_box").hide();
            $(".move_box").attr("flag",true);

        }
    };
    $scope.close_move_box=function () {
        $(".move_box").hide();
        $(".move_box").attr("flag",true);
    };
    $scope.out_storage=function () {
        // swal("该车辆确定要出库吗","","warning")
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: false
            },
            function(){
                swal("ok!", "Your ", "success");
            }
            );
    }
}]);
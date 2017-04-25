var storage_controller=angular.module("storage_controller",[]);/**
 * Created by ASUS on 2017/4/14.
 */
storage_controller.controller("Storage_car_Controller",["$scope","$host","$basic","$baseService","service_storage_parking",function ($scope,$host,$basic,$baseService,service_storage_parking) {
    var userId=sessionStorage.getItem("userId");
    var searchAll=function () {
        $basic.get($host.api_url+"/user/"+userId+"/car").then(function (data) {
            if(data.success==true){
                $scope.storage_car=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });
    };
    searchAll();
    // 车辆品牌查询
    $basic.get($host.api_url+"/carMake").then(function (data) {
        if(data.success==true){
            $scope.makecarName=data.result;
        }else {
            swal(data.msg,"","error");
        }
    });
    // 车库查询
    $basic.get($host.api_url+"/storage").then(function (data) {
        if(data.success==true){
            $scope.storageName=data.result;

            setTimeout($('select').material_select(),2000)
        }else {
            swal(data.msg,"","error");
        }
    });
    $scope.newStorage_car=function () {
        $scope.submitted=false;
        $('ul.tabs li a').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.test1 a').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
        $scope.win="";
        $scope.make_name="";
        $scope.model_name="";
        $scope.create_time="";
        $scope.car_color="";
        $scope.engineNum="";
        $scope.remark="";
        $scope.storage_name="";
            // "enterTime":$scope.enter_time,
        $scope.col_id="";
        $scope.plan_out_time="";
        $(".modal").modal({
            height:500
        });
        $("#newStorage_car").modal("open");

    };
    // 图片上传
        $scope.imgArr=[];
        $scope.uploadBrandImage=function (dom) {
            var filename = $(dom).val();
            // console.log($(dom)[0].files[0].size);
            if((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                //check size
                //$file_input[0].files[0].size
                var max_size_str = $(dom).attr('max_size');
                var max_size = 4*1024*1024; //default: 4M
                var re = /\d+m/i;
                if(re.test(max_size_str))  {
                    max_size = parseInt(max_size_str.substring(0,max_size_str.length-1))*1024*1024;
                }

                if($(dom)[0].files[0].size > max_size) {
                    swal('图片文件最大: '+max_size_str,"","error");
                    return false;
                }

            }
            else if(filename && filename.length>0){
                $(dom).val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)',"","error");
            }
            // $currentDom = $(dom).prev();
            $basic.formPost($(dom).parent().parent(),$host.file_url+'/user/'+userId+'/image?imageType=4',function(data){

                if(data.success){
                    console.log(data,$scope.Picture_carId);
                    var imageId=data.imageId;
                    // $($currentDom.children()[0]).attr("src",'/api/image/'+data.imageId);
                    // $scope.img = data.imageId;
                    // var imgB=document.getElementById("imgBox");

                    $basic.post($host.record_url+"/car/"+$scope.Picture_carId+"/vin/"+$scope.win+"/storageImage",{
                        "username": sessionStorage.getItem("userName"),
                        "userId": userId,
                        "userType": sessionStorage.getItem("userType"),
                        "url": imageId
                    }).then(function (data) {
                        if(data.success==true){
                            $scope.imgArr.push($host.file_url+'/api/image/'+imageId);
                            console.log($scope.imgArr);
                            // var div=$("<div>").addClass("storage_car_picture col s3 vc-center  p0 grey white-text");
                            // var imgEle=$("<img>");
                            // imgEle.addClass("responsive-img");
                            // imgEle.attr("src",$host.file_url+"/user/"+userId+'/image/'+imageId);
                            // // imgEle.setAttribute("src",$host.file_url+'/api/image/'+data.imageId);
                            // imgEle.appendTo(div);
                            // // div.appendChild(imgEle);
                            // div.appendTo($(".storage_car_picture_wrap"));
                        }
                    })
                    // .appendChild(div)
                }else{
                    swal('上传图片失败',"","error");
                }
            },function(error){
                swal('服务器内部错误',"","error");
            })

        };

    // 存放位置联动查询--行
    $scope.changeStorageId=function (val){
        $basic.get($host.api_url+"/storageParking?storageId="+val).then(function (data) {
            if(data.success==true){
                $scope.storageParking=data.result;
                // var rowArr=[];
                // var obj={};
                //
                // var obj1={
                //     row:"",
                //     col:[
                //     ],
                //
                // };
                // var storageParking=function (pk) {
                //     var parkingArray =[];
                //     for(i=0;i<pk.length;i++){
                //         for(j=0;j<parkingArray.length;){
                //             if(parkingArray[j].row == pk[i].row){
                //                 break;
                //             }else{
                //                 j++;
                //             }
                //         }
                //         if(j==parkingArray.length){
                //             parkingArray.push({row:pk[i].row,col:[{col:pk[i].col,carId:pk[i].car_id,id:pk[i].id}]})
                //         }else{
                //             parkingArray[j].col.push({col:pk[i].col,carId:pk[i].car_id,id:pk[i].id});
                //         }
                //     }
                //     // console.log(parkingArray);
                //     return parkingArray;
                //
                // };

                $scope.parkingArray=service_storage_parking.storage_parking($scope.storageParking);

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
        $scope.changeStorageRow=function (val,array) {
            // var colArr=[];
            // for(var i in $scope.storageParking){
            //     if($scope.storageParking[i].row==val){
            //         colArr.push($scope.storageParking[i].col)
            //     }
            // }
            console.log(val);
            $scope.colArr= array[val-1].col;

        };

    // 车辆型号联动查询
    $scope.changeMakeId=function (val) {
        console.log(val);

        $basic.get($host.api_url+"/carMake/"+val+"/carModel").then(function (data) {
            if(data.success==true){
                $scope.carModelName=data.result;
            }else {
                swal(data.msg,"","error")
            }
        })
    };
    $scope.color=config_color;
    // 新增信息
    $scope.submitForm=function (isValid) {
        $scope.submitted=true;
        if(isValid){
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
                "parkingId":$scope.parking_id,
                "planOutTime": $scope.plan_out_time
            };
            console.log(obj_car);
            $basic.post($host.api_url+"/user/"+userId+"/carStorageRel",obj_car).then(function (data) {
                if(data.success==true){
                    // swal("新增成功","","success");
                    // $("#newStorage_car").modal("close");
                    // $('ul.tabs').tabs('select_tab', 'test2');
                    $('ul.tabs li a').removeClass("active");
                    $(".tab_box").removeClass("active");
                    $(".tab_box").hide();
                    $('ul.tabs li.test2 a').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    searchAll();
                    $scope.Picture_carId=data.id;
                    // $scope.carPicture_vin=data.win;
                    console.log($scope.win);
                }else {
                    swal(data.msg,"","error")
                }
            });
        }

    };
    // 立刻出库
    $scope.outStorageCar=function (rel_id,relSta,p_id,s_id,car_id) {
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText:"取消",
                closeOnConfirm: false
            },
            function(){
                $basic.put($host.api_url+"/user/"+userId+"/carStorageRel/"+rel_id+"/relStatus/"+relSta,{
                    parkingId:p_id,
                    storageId:s_id,
                    carId:car_id
                }).then(function (data) {
                    if(data.success=true){
                        swal("出库成功!", "", "success");
                        searchAll();
                    }
                });
            }
        );
    };
    // 车位转移
    $scope.changeStorageCar=function (val) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $basic.get($host.api_url+"/storageParking?storageId="+val).then(function (data) {
            if (data.success == true) {
                $scope.move_storageParking = data.result;
                $scope.move_parkingArray=service_storage_parking.storage_parking($scope.move_storageParking );

            }
        })

    };
    // 仓库车辆详情
    $scope.lookStorageCar=function (val) {
        // console.log(val);
        $(".modal").modal({
        });
        $("#look_StorageCar").modal("open");
        $('ul.tabs li a').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.look_msg a').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
        $basic.get($host.api_url+"/user/"+userId+"/car?carId="+val).then(function (data) {
            if(data.success==true){
                console.log(data);
                $scope.self_car=data.result[0];
                $scope.changeMakeId($scope.self_car.make_id);
                $scope.look_create_time=$baseService.formDate($scope.self_car.created_on);
                $scope.look_car_color=$scope.self_car.colour;
                $scope.look_engineNum=$scope.self_car.engine_num;
                $scope.look_storageName=$scope.self_car.storage_name;
                $scope.look_row=$scope.self_car.row;
                $scope.look_col=$scope.self_car.col;
                $scope.look_plan_out_time=$baseService.formDate($scope.self_car.plan_out_time);
                // 车辆id
                $scope.look_car_id=$scope.self_car.id
                
                $scope.remark=$scope.self_car.remark;
            }else {
                swal(data.msg,"","error")
            }
        })
    };
    // 修改仓库详情
    $scope.changeOperatorForm=function (isValid,id) {
        if(isValid){
            
        }
        var obj={
            "vin":$scope.self_car.vin,
            "makeId": $scope.self_car.make_id,
            "makeName":$scope.self_car.make_name,
            "modelId": 0,
            "modelName": "string",
            "proDate":$scope.look_create_time,
            "colour": $scope.look_car_color,
            "engineNum": $scope.look_engineNum,
            "remark": $scope.remark
        };
        console.log(obj,id);
        // $basic.put($host.api_url+"/user/"+userId+"/car/"+id,obj).then(function (data) {
        //
        // })
    };
    // 仓库移位
    $scope.move_box=function (val) {
        if($(".move_box").attr("flag")=='true'){
            $(".move_box").show();
            $(".move_box").attr("flag",false);
            $basic.get($host.api_url+"/storageParking?storageId="+val).then(function (data) {
                if (data.success == true) {
                    $scope.move_storageParking = data.result;
                    $scope.move_parkingArray=service_storage_parking.storage_parking($scope.move_storageParking );

                }
            })
        }else {
            $(".move_box").hide();
            $(".move_box").attr("flag",true);

        }

    };
    $scope.close_move_box=function () {
        $(".move_box").hide();
        $(".move_box").attr("flag",true);
    };
    // 移动位置
    $scope.move_parking=function (parkingId,carId) {
        if(parkingId!=null){
            $basic.put($host.api_url+"/user/"+userId+"/storageParking/"+parkingId,{
                carId:carId
            }).then(function (data) {
                if (data.success == true) {
                    swal("移位成功","","success");
                    searchAll();
                    $("#look_StorageCar").modal("close");
                }else {
                    swal(data.msg,"","error")
                }
            })
        }

    };
    // 车辆出库
    $scope.out_storage=function (rel_id,relSta,p_id,s_id,car_id) {
        // swal("该车辆确定要出库吗","","warning")
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText:"取消",
                closeOnConfirm: false
            },
            function(){
            $basic.put($host.api_url+"/user/"+userId+"/carStorageRel/"+rel_id+"/relStatus/"+relSta,{
                parkingId:p_id,
                storageId:s_id,
                carId:car_id
            }).then(function (data) {
               if(data.success=true){
                   swal("出库成功!", "", "success");
                   searchAll();
                   $("#look_StorageCar").modal("close");
               }
            });
            }
            );
    }
}]);
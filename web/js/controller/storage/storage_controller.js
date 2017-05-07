/**
 * Created by ASUS on 2017/5/4.
 */
var storage_store_Controller = angular.module("storage_store_Controller", []);
storage_store_Controller.controller("storage_store_Controller", ["$scope", "$host", "$basic", "$state", "$rootScope", "$config_variable", "$baseService", "service_storage_parking", function ($scope, $host, $basic, $state, $rootScope, $config_variable, $baseService, service_storage_parking) {
    var userId = $basic.getSession($basic.USER_ID);
    var data = new Date();
    var now_date = moment(data).format('YYYYMMDD');
    var searchAll = function () {
        $basic.get($host.api_url + "/storageDate" + "?dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true) {
                $scope.store_storage = data.result;
            }

        })
    };

    searchAll();
    // // 返回仓库页
    // $scope.return=function () {
    //     $(".storage_store_subject").show();
    //     $(".LookGarage").hide();
    //     searchAll();
    // };
    // // 到仓储车辆图
    // $scope.LookGarage=function (val,name,col,row,balance,im,ex) {
    //     $(".storage_store_subject").hide();
    //     $(".LookGarage").show();
    //
    //     // $(".modal").modal();
    //     // $("#LookGarage").modal("open");
    //     $scope.newTime=new Date().getTime();
    //     $scope.self_store_storage_name=name;
    //     $scope.self_store_storage_row=row;
    //     $scope.self_store_storage_col=col;
    //     $scope.self_store_storage_pCount=row*col-balance;
    //     $scope.self_store_storage_imports=im;
    //     $scope.self_store_storage_exports=ex;
    //
    //
    //     $basic.get($host.api_url+"/storageParking?storageId="+val).then(function (data) {
    //         if(data.success==true){
    //             $scope.self_storageParking=data.result;
    //             $scope.garageParkingArray=service_storage_parking.storage_parking($scope.self_storageParking);
    //             // console.log($scope.garageParkingArray);
    //             $scope.ageParkingCol=$scope.garageParkingArray[0].col
    //
    //         }
    //
    //     })
    // };

    // 车辆品牌查询
    $basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        // console.log(val);


        if ($scope.curruntId == val) {

        } else {
            $scope.curruntId = val;
            $basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true) {
                    $scope.carModelName = data.result;

                } else {
                    swal(data.msg, "", "error")
                }
            })
        }


    };
    // 颜色
    $scope.color = $config_variable.config_color;

    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        $basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.storageParking = data.result;

                $scope.parkingArray = service_storage_parking.storage_parking($scope.storageParking);

            } else {
                swal(data.msg, "", "error");
            }
        });
    },
        // 存放位置联动查询--列
        $scope.changeStorageRow = function (val, array) {

            // console.log(val);
            $scope.colArr = array[val - 1].col;

        };
    $scope.new_garage_parking = function (storage_name, storage_id, row, col, p_id) {
        // 车辆品牌查询
        $basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.makecarName = data.result;
                // console.log($scope.makecarName)
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 车库查询

        $scope.private_storageName = storage_name;
        $scope.private_storageId = storage_id;
        // 车位置
        $scope.private_row = row;
        $scope.private_col = col;
        $scope.parking_id = p_id;
        $scope.submitted = false;
        $('ul.tabs li a').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.test1 a').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
        $scope.win = "";
        $scope.make_name = "";
        $scope.model_name = "";
        $scope.create_time = "";
        $scope.car_color = "";
        $scope.engineNum = "";
        $scope.remark = "";
        $scope.storage_name = "";
        // 照片清空
        $scope.imgArr = [];
        // "enterTime":$scope.enter_time,
        $scope.col_id = "";
        $scope.plan_out_time = "";
        $(".modal").modal({});
        $("#newStorage_car").modal("open");

    }
    // 新增信息
    $scope.submitForm = function (isValid) {
        $scope.submitted = true;


        if (isValid) {
            var obj_car = {
                "vin": $scope.win,
                "makeId": $scope.make_name.id,
                "makeName": $scope.make_name.make_name,
                "modelId": $scope.model_name.id,
                "modelName": $scope.model_name.model_name,
                "proDate": $scope.create_time,
                "colour": $scope.car_color,
                "engineNum": $scope.engineNum,
                "remark": $scope.remark,
                "storageId": $scope.private_storageId,
                "storageName": $scope.private_storageName,
                // "enterTime":$scope.enter_time,
                "parkingId": $scope.parking_id,
                "planOutTime": $scope.plan_out_time
            };
            console.log(obj_car);
            $basic.post($host.api_url + "/user/" + userId + "/carStorageRel", obj_car).then(function (data) {
                if (data.success == true) {
                    // swal("新增成功","","success");
                    // $("#newStorage_car").modal("close");
                    // $('ul.tabs').tabs('select_tab', 'test2');
                    $('ul.tabs li a').removeClass("active");
                    $(".tab_box").removeClass("active");
                    $(".tab_box").hide();
                    $('ul.tabs li.test2 a').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    // searchAll();
                    $scope.LookGarage($scope.private_storageId);
                    $scope.Picture_carId = data.id;
                    // $scope.carPicture_vin=data.win;
                    // console.log($scope.win);
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };
    // 图片上传
    $scope.imgArr = [];
    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        console.log($(dom).val());
        if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
            //check size
            //$file_input[0].files[0].size
            var max_size_str = $(dom).attr('max_size');
            var max_size = 4 * 1024 * 1024; //default: 4M
            var re = /\d+m/i;
            if (re.test(max_size_str)) {
                max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
            }

            if ($(dom)[0].files[0].size > max_size) {
                swal('图片文件最大: ' + max_size_str, "", "error");
                return false;
            }

        }
        else if (filename && filename.length > 0) {
            $(dom).val('');
            swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
        }
        $basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {

            if (data.success) {
                console.log(data, $scope.Picture_carId);
                var imageId = data.imageId;
                $basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.win + "/storageImage", {
                    "username": $basic.getSession($basic.USER_NAME),
                    "userId": userId,
                    "userType": $basic.getSession($basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope.imgArr.push({src: $host.file_url + '/image/' + imageId});
                        console.log($scope.imgArr);
                    }
                });
                // .appendChild(div)
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };


    // 当汽车详情页
    $scope.lookStorageCar = function (val) {
        console.log(val);
        $state.go("storageCar_details", {}, {reload: true})
    };
    // $scope.lookStorageCar=function (val) {
    //
    //     $scope.submitted=false;
    //     // 照片清空
    //     $scope.imgArr=[];
    //     // 预览详情照片
    //     $scope.storage_imageBox=[];
    //
    //     // console.log(val);
    //     $(".storage_store_subject").hide();
    //     $(".LookGarage").hide();
    //     $("#look_StorageCar").show();
    //     // $(".modal").modal({
    //     //     // dismissible: false
    //     // });
    //     // $("#look_StorageCar").modal("open");
    //
    //     $('ul.tabs li').removeClass("active");
    //     $(".tab_box").removeClass("active");
    //     $(".tab_box").hide();
    //     $('ul.tabs li.look_msg').addClass("active");
    //     $("#look_msg").addClass("active");
    //     $("#look_msg").show();
    //
    //     $scope.Picture_carId=val;
    //     $basic.get($host.api_url+"/user/"+userId+"/car?carId="+val).then(function (data) {
    //         if(data.success==true){
    //             $scope.modelId = data.result[0].model_id;
    //             $scope.self_car=data.result[0];
    //             // console.log(data.result[0]);
    //             // modelID赋值
    //             $scope.look_make_id=$scope.self_car.make_id,
    //                 $scope.changeMakeId($scope.look_make_id);
    //             $scope.look_model_id=$scope.self_car.model_id,
    //                 // console.log($scope.look_model_id);
    //                 $scope.look_create_time=$baseService.formDate($scope.self_car.pro_date);
    //             $scope.look_storageName=$scope.self_car.storage_name+$scope.self_car.row+"排"+$scope.self_car.col+"排";
    //             $scope.look_row=$scope.self_car.row;
    //             $scope.look_col=$scope.self_car.col;
    //             // 车辆id
    //             $scope.look_car_id=$scope.self_car.id;
    //
    //             // 该汽车的图片
    //             $basic.get($host.record_url+"/user/"+userId+"/car/"+val+"/record").then(function (data) {
    //                 if(data.success==true){
    //                     // console.log(data);
    //                     $scope.operating_record=data.result[0];
    //                     $scope.comment=$scope.operating_record.comment;
    //                     $scope.storage_image=$scope.operating_record.storage_image;
    //                     for(var  i in $scope.storage_image ){
    //                         $scope.storage_imageBox.push({src:$host.file_url+'/image/'+$scope.storage_image[i].url});
    //                     }
    //
    //                     // $scope.imgArr.push({src:$host.file_url+'/image/'+imageId});
    //                 }else {
    //                     swal(data.msg,"","error")
    //                 }
    //             });
    //         }else {
    //             swal(data.msg,"","error")
    //         }
    //     })
    //
    // };
    // // 修改仓库详情
    // $scope.changesubmitForm=function (isValid,id,r_id) {
    //     $scope.submitted=true;
    //     var obj={
    //         "vin":$scope.self_car.vin,
    //         "makeId": $scope.self_car.make_id,
    //         "makeName":$("#look_makecarName").find("option:selected").text(),
    //         "modelId": $scope.self_car.model_id,
    //         "modelName":$("#look_model_name").find("option:selected").text() ,
    //         "proDate":$scope.self_car.pro_date,
    //         "colour":$scope.self_car.colour,
    //         "engineNum": $scope.self_car.engine_num,
    //         "remark": $scope.self_car.remark
    //     };
    //     console.log(obj,id);
    //     if(isValid){
    //         // 修改计划出库时间
    //         $basic.put($host.api_url+"/user/"+userId+"/carStorageRel/"+r_id+"/planOutTime",{
    //             "planOutTime": $scope.self_car.plan_out_time
    //         }).then(function (data) {
    //             console.log(data)
    //         });
    //         // 修改仓库信息
    //         $basic.put($host.api_url+"/user/"+userId+"/car/"+id,obj).then(function (data) {
    //             if(data.success==true){
    //                 swal("修改成功","","success");
    //                 $("#look_StorageCar").modal("close");
    //                 searchAll();
    //             }else {
    //                 swal(data.msg,"","error")
    //             }
    //         });
    //
    //     }
    //
    //     // $basic.put($host.api_url+"/user/"+userId+"/car/"+id,obj).then(function (data) {
    //     //
    //     // })
    // };


}]);
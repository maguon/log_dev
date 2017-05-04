/**
 * Created by ASUS on 2017/5/4.
 */
var Storage_car_Controller=angular.module("Storage_car_Controller",[]);
Storage_car_Controller.controller("Storage_car_Controller",["$scope","$host","$basic","$baseService","service_storage_parking",function ($scope,$host,$basic,$baseService,service_storage_parking) {
    $scope.curruntId=0;
    $scope.start=0;
    $scope.size=11;
    var userId=sessionStorage.getItem("userId");
    var searchAll=function () {
        $basic.get($host.api_url+"/user/"+userId+"/car?start="+$scope.start+"&size="+$scope.size).then(function (data) {
            if(data.success==true){
                $scope.storage_car_box=data.result;
                $scope.storage_car=$scope.storage_car_box.slice(0,10);

            }else {
                swal(data.msg,"","error");
            }
        });
    };
    // 分页
    // 上一页
    $scope.pre_btn=function () {
        if($scope.start>0){
            $scope.start=$scope.start-($scope.size-1);
            searchAll();
        }

    };
    // 下一页
    $scope.next_btn=function () {
        if($scope.storage_car_box.length<$scope.size){
        }else {
            $scope.start=$scope.start+($scope.size-1);
            searchAll();
        }
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
        $('ul.tabs li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.test1').addClass("active");
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
        // 照片清空
        $scope.imgArr=[];
        // 车辆型号清空
        $scope.carModelName="";
        // 存放位置清空
        $scope.parkingArray="";
        $scope.colArr="";
        // "enterTime":$scope.enter_time,
        $scope.parking_id="";
        $scope.plan_out_time="";
        $(".modal").modal({
            height:500
        });
        $("#newStorage_car").modal("open");

    };
    // 图片上传
    $scope.imgArr=[];
    // 预览详情照片
    $scope.storage_imageBox=[];

    $scope.uploadBrandImage=function (dom) {
        var filename = $(dom).val();
        console.log($(dom).val());
        if((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)){
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
                        $scope.imgArr.push({src:$host.file_url+'/image/'+imageId});
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
                });
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

                $scope.parkingArray=service_storage_parking.storage_parking($scope.storageParking);


            }else {
                swal(data.msg,"","error");
            }
        });
    },
        // 存放位置联动查询--列
        $scope.changeStorageRow=function (val,array) {

            // console.log(val);
            $scope.colArr= array[val-1].col;

        };

    // 车辆型号联动查询
    $scope.changeMakeId=function (val) {
        // console.log(val);


        if($scope.curruntId==val){

        }else {
            $scope.curruntId=val;
            $basic.get($host.api_url+"/carMake/"+val+"/carModel").then(function (data) {
                if(data.success==true){
                    $scope.carModelName=data.result;
                    // $scope.self_car.model_id = $scope.modelId;
                    // setTimeout($scope.look_model_id=id,2000);

                    // console.log(id);
                    // $scope.look_model_id=id;

                }else {
                    swal(data.msg,"","error")
                }
            })
        }


    };
    // 颜色
    $scope.color=config_color;
    // modelId全局变量

    $scope.change_model_id="";
    // 新增信息
    $scope.newsubmitForm=function (isValid) {
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

            // console.log(obj_car);
            $basic.post($host.api_url+"/user/"+userId+"/carStorageRel",obj_car).then(function (data) {
                if(data.success==true){
                    // swal("新增成功","","success");
                    // $("#newStorage_car").modal("close");
                    // $('ul.tabs').tabs('select_tab', 'test2');
                    $('ul.tabs li').removeClass("active");
                    $(".tab_box").removeClass("active");
                    $(".tab_box").hide();
                    $('ul.tabs li.test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    searchAll();
                    $scope.Picture_carId=data.id;
                    // $scope.carPicture_vin=data.win;
                    // console.log($scope.win);
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
    $scope.changeStorageCar=function (val,id,row,col){
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $scope.now_row=row;
        $scope.now_col=col;
        $scope.move_carId=id;
        $basic.get($host.api_url+"/storageParking?storageId="+val).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking=data.result;
                $scope.garageParkingArray=service_storage_parking.storage_parking($scope.self_storageParking);
                $scope.ageParkingCol=$scope.garageParkingArray[0].col
                // console.log($scope.ageParkingCol,$scope.garageParkingArray)

            }
        })
    };


    // 车辆照片跳转
    $scope.look_car_img=function () {
        $('ul.tabs li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.look_car_img ').addClass("active");
        $("#look_car_img").addClass("active");
        $("#look_car_img").show();
    };
    $scope.look_msg=function () {
        $('ul.tabs li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.look_msg ').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
    };


    // 仓库车辆详情


    // 关闭模态按钮
    // $scope.close_storageCar=function () {
    //     searchAll();
    // };

    //controller里对应的处理函数
    var viewer;
    var add_viewer;
    $scope.renderFinish = function(){
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };
    $scope.add_repeatFinish= function(){
        add_viewer = new Viewer(document.getElementById('add_img'), {
            url: 'data-original'
        });
    };
    // $scope.add_repeatFinishOne= function(){
    //     console.log(1);
    //     add_viewerOne = new Viewer(document.getElementById('add_img_one'), {
    //         url: 'data-original'
    //     });
    // };

    // 返回
    $scope.return=function () {
        $(".main_storage_car").show();
        $("#look_StorageCar").hide();
        viewer.destroy();
    };
    // 查看详情
    $scope.lookStorageCar=function (val,vin) {
        $scope.submitted=false;
        // 照片清空
        $scope.imgArr=[];
        // 预览详情照片
        $scope.storage_imageBox=[];

        // console.log(val);
        // $(".modal").modal({
        //     // dismissible: false
        // });
        $(".main_storage_car").hide();
        $("#look_StorageCar").show();


        $('ul.tabs li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.look_msg').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();

        $scope.Picture_carId=val;
        $scope.win=vin;
        $basic.get($host.record_url+"/user/"+userId+"/car/"+val+"/record").then(function (data) {
            if(data.success==true){
                // console.log(data);
                $scope.operating_record=data.result[0];
                $scope.comment=$scope.operating_record.comment;
                $scope.storage_image=$scope.operating_record.storage_image;
                for(var  i in $scope.storage_image ){
                    $scope.storage_imageBox.push({src:$host.file_url+'/image/'+$scope.storage_image[i].url});
                }

                // $scope.imgArr.push({src:$host.file_url+'/image/'+imageId});
            }else {
                swal(data.msg,"","error")
            }
        });
        $basic.get($host.api_url+"/user/"+userId+"/car?carId="+val).then(function (data) {
            if(data.success==true){
                $scope.modelId = data.result[0].model_id;
                $scope.self_car=data.result[0];
                // modelID赋值
                $scope.look_make_id=$scope.self_car.make_id,
                    console.log($scope.look_make_id);
                $scope.changeMakeId($scope.look_make_id);
                $scope.look_model_id=$scope.self_car.model_id,
                    $scope.look_create_time=$baseService.formDate($scope.self_car.pro_date);
                $scope.look_storageName=$scope.self_car.storage_name+$scope.self_car.row+"排"+$scope.self_car.col+"列";
                // 车辆id
                $scope.look_car_id=$scope.self_car.id;
            }else {
                swal(data.msg,"","error")
            }
        })

    };
    // 修改仓库详情
    $scope.submitForm=function (isValid,id,r_id) {
        $scope.submitted=true;
        var obj={
            "vin":$scope.self_car.vin,
            "makeId": $scope.self_car.make_id,
            "makeName":$("#look_makecarName").find("option:selected").text(),
            "modelId": $scope.self_car.model_id,
            "modelName":$("#look_model_name").find("option:selected").text() ,
            "proDate":$scope.self_car.pro_date,
            "colour":$scope.self_car.colour,
            "engineNum": $scope.self_car.engine_num,
            "remark": $scope.self_car.remark
        };
        console.log(obj,id);
        if(isValid){
            // 修改计划出库时间
            $basic.put($host.api_url+"/user/"+userId+"/carStorageRel/"+r_id+"/planOutTime",{
                "planOutTime": $scope.self_car.plan_out_time
            }).then(function (data) {
                console.log(data)
            });
            // 修改仓库信息
            $basic.put($host.api_url+"/user/"+userId+"/car/"+id,obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success");
                    $("#look_StorageCar").modal("close");
                    searchAll();
                }else {
                    swal(data.msg,"","error")
                }
            });

        }

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
                if (data.success == true){
                    $scope.move_storageParking = data.result;
                    $scope.move_parkingArray=service_storage_parking.storage_parking($scope.move_storageParking);
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
    $scope.move_parking=function (parkingId,row,col) {
        // console.log(parkingId,$scope.move_carId);

        swal({
                title: "该车辆确定移位到"+row+"排"+col+"列？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText:"取消",
                closeOnConfirm: false
            },
            function(){
                if(parkingId!=null){
                    $basic.put($host.api_url+"/user/"+userId+"/storageParking/"+parkingId,{
                        carId:$scope.move_carId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("移位成功","","success");
                            searchAll();
                            $("#change_storageCar").modal("close");
                        }else {
                            swal(data.msg,"","error")
                        }
                    })
                }
            }
        )


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
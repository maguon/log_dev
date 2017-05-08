/**
 * Created by ASUS on 2017/5/4.
 */
var Storage_carController = angular.module("Storage_carController", []);
Storage_carController.controller("Storage_carController", ["$scope", "$rootScope","$pass_parameter", "$host", "$basic", "$baseService", "$config_variable", "service_storage_parking", function ($scope, $rootScope,$pass_parameter,$host, $basic, $baseService, $config_variable, service_storage_parking) {
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 11;
    var userId = $basic.getSession($basic.USER_ID);
    $pass_parameter.setter("jiangsen");
    var searchAll = function () {
        $basic.get($host.api_url + "/user/" + userId + "/car?start=" + $scope.start + "&size=" + $scope.size + "&relStatus=" + $config_variable.rel_status).then(function (data) {
            if (data.success == true) {
                $scope.storage_car_box = data.result;
                $scope.storage_car = $scope.storage_car_box.slice(0, 10);
                // $rootScope.previousState_name="storage_car";
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 分页
    // 上一页
    $scope.pre_btn = function (){
        if ($scope.start > 0) {
            $scope.start = $scope.start - ($scope.size - 1);
            searchAll();
        }

    };
    // 下一页
    $scope.next_btn = function () {
        if ($scope.storage_car_box.length < $scope.size) {
        } else {
            $scope.start = $scope.start + ($scope.size - 1);
            searchAll();
        }
    };
    searchAll();
    // 车辆品牌查询
    $basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车库查询
    $basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;

            setTimeout($('select').material_select(), 2000)
        } else {
            swal(data.msg, "", "error");
        }
    });
    $scope.newStorage_car = function () {
        $scope.submitted = false;
        $('ul.tabs li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabs li.test1').addClass("active");
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
        // 车辆型号清空
        $scope.carModelName = "";
        // 存放位置清空
        $scope.parkingArray = "";
        $scope.colArr = "";
        // "enterTime":$scope.enter_time,
        $scope.parking_id = "";
        $scope.plan_out_time = "";
        $(".modal").modal({
            height: 500
        });
        $("#newStorage_car").modal("open");

    };
    // // 图片上传
    // $scope.imgArr=[];
    // 图片
    $scope.storage_imageBox = [];


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
        // $currentDom = $(dom).prev();
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
                        $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId});
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })

    };

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


    // modelId全局变量
    $scope.change_model_id = "";
    // 新增信息
    $scope.newsubmitForm = function (isValid) {
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
                "storageId": $scope.storage_name.id,
                "storageName": $scope.storage_name.storage_name,
                // "enterTime":$scope.enter_time,
                "parkingId": $scope.parking_id,
                "planOutTime": $scope.plan_out_time
            };
            $basic.post($host.api_url + "/user/" + userId + "/carStorageRel", obj_car).then(function (data) {
                if (data.success == true) {
                    $('ul.tabs li').removeClass("active");
                    $(".tab_box").removeClass("active");
                    $(".tab_box").hide();
                    $('ul.tabs li.test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    searchAll();
                    $scope.Picture_carId = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }

    };
    // 立刻出库
    $scope.outStorageCar = function (rel_id, relSta, p_id, s_id, car_id) {
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                $basic.put($host.api_url + "/user/" + userId + "/carStorageRel/" + rel_id + "/relStatus/" + relSta, {
                    parkingId: p_id,
                    storageId: s_id,
                    carId: car_id
                }).then(function (data) {
                    if (data.success = true) {
                        swal("出库成功!", "", "success");
                        searchAll();
                    }
                });
            }
        );
    };
    // 车位转移
    $scope.changeStorageCar = function (val, id, row, col) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $scope.now_row = row;
        $scope.now_col = col;
        $scope.move_carId = id;
        $basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = service_storage_parking.storage_parking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
                // console.log($scope.ageParkingCol,$scope.garageParkingArray)

            }
        })
    };


    // 仓库移位
    $scope.move_box = function (val) {
        if ($(".move_box").attr("flag") == 'true') {
            $(".move_box").show();
            $(".move_box").attr("flag", false);
            $basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true) {
                    $scope.move_storageParking = data.result;
                    $scope.move_parkingArray = service_storage_parking.storage_parking($scope.move_storageParking);
                }
            })
        } else {
            $(".move_box").hide();
            $(".move_box").attr("flag", true);
        }
    };
    $scope.close_move_box = function () {
        $(".move_box").hide();
        $(".move_box").attr("flag", true);
    };
    // 移动位置
    $scope.move_parking = function (parkingId, row, col) {
        // console.log(parkingId,$scope.move_carId);

        swal({
                title: "该车辆确定移位到" + row + "排" + col + "列？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                if (parkingId != null) {
                    $basic.put($host.api_url + "/user/" + userId + "/storageParking/" + parkingId, {
                        carId: $scope.move_carId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("移位成功", "", "success");
                            searchAll();
                            $("#change_storageCar").modal("close");
                        } else {
                            swal(data.msg, "", "error")
                        }
                    })
                }
            }
        )


    };
    // 车辆出库
    $scope.out_storage = function (rel_id, relSta, p_id, s_id, car_id) {
        // swal("该车辆确定要出库吗","","warning")
        swal({
                title: "该车辆确定要出库吗?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                $basic.put($host.api_url + "/user/" + userId + "/carStorageRel/" + rel_id + "/relStatus/" + relSta, {
                    parkingId: p_id,
                    storageId: s_id,
                    carId: car_id
                }).then(function (data) {
                    if (data.success = true) {
                        swal("出库成功!", "", "success");
                        searchAll();
                        $("#look_StorageCar").modal("close");
                    }
                });
            }
        );
    }
}]);
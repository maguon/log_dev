/**
 * Created by ASUS on 2017/5/5.
 */
var storage_car_mapController = angular.module("storage_car_mapController", []);
storage_car_mapController.controller("storage_car_mapController", ["$state", "$rootScope", "$stateParams", "$config_variable", "service_storage_parking", "$scope", "$host", "$basic", function ( $state, $rootScope, $stateParams, $config_variable, service_storage_parking, $scope, $host, $basic) {
    var val = $stateParams.id;
    $scope._form=$stateParams.form;
    var data = new Date();
    var now_date = moment(data).format('YYYYMMDD');
    var userId = $basic.getSession($basic.USER_NAME);
    // 到仓储车辆图
    $scope.LookGarage = function (val) {
        $basic.get($host.api_url + "/storageDate?storageId=" + val + "&dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storage = data.result[0];
            }
        });
        $basic.get($host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = service_storage_parking.storage_parking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
            }
        })
    };
    $scope.LookGarage(val);
    // 车辆品牌查询
    $basic.get($host.api_url + "/carMake").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        if ($scope.curruntId == val) {
        } else {
            $scope.curruntId = val;
            $basic.get($host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true&&data.result.length>0) {
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
            if (data.success == true&&data.result.length>0) {
                $scope.storageParking = data.result;
                $scope.parkingArray = service_storage_parking.storage_parking($scope.storageParking);
            } else {
                swal(data.msg, "", "error");
            }
        });
    },
        // 存放位置联动查询--列
        $scope.changeStorageRow = function (val, array) {
            $scope.colArr = array[val - 1].col;
        };
    // 新增车辆
    $scope.new_garage_parking = function (storage_name, storage_id, row, col, p_id) {
        // 车辆品牌查询
        $basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true&&data.result.length>0) {
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
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test1').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
        $scope.vin = "";
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
    };
    // 新增信息
    $scope.submitForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj_car = {
                "vin": $scope.vin,
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
                "parkingId": $scope.parking_id,
                "planOutTime": $scope.plan_out_time
            };
            $basic.post($host.api_url + "/user/" + userId + "/carStorageRel", $basic.removeNullProps(obj_car)).then(function (data) {
                if (data.success == true) {
                    $('.tabWrap .tab').removeClass("active");
                    $(".tab_box ").removeClass("active");
                    $(".tab_box ").hide();
                    $('.tabWrap .test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    $scope.LookGarage($scope.private_storageId);
                    $scope.Picture_carId = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };
    // 返回
    $scope.return = function () {
        $state.go($stateParams.form, {}, {reload: true})
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
                $basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                    "username": $basic.getSession($basic.USER_NAME),
                    "userId": userId,
                    "userType": $basic.getSession($basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope.imgArr.push({src: $host.file_url + '/image/' + imageId});
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };
}]);

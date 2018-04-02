/**
 * Created by ASUS on 2017/5/5.
 */
app.controller("storage_car_details_controller", [ "$state", "$stateParams", "_config", "_baseService", "$scope", "_host", "_basic", function ( $state, $stateParams, _config, _baseService, $scope, _host, _basic) {
   /**  自定义变量名  */
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;//获取本条信息的id
    var vin = $stateParams.vin;//获取本条信息的vin码
    $scope.imgArr = []; // 图片上传
    $scope.storage_imageBox = [];// 预览详情照片
    $scope.storage_image_i = [];// 照片索引
    $scope.color = _config.config_color;// 颜色
    // 车辆照片跳转
    $scope.lookCarImg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_img ').addClass("active");
        $("#lookCarImg").addClass("active");
        $("#lookCarImg").show();
    };
    $scope.lookMsg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg ').addClass("active");
        $("#lookMsg").addClass("active");
        $("#lookMsg").show();
    };
    $scope.lookCarKey = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_key ').addClass("active");
        $("#lookCarKey").addClass("active");
        $("#lookCarKey").show();
    };

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from, {id: $scope.self_car.storage_id, form: $stateParams._form}, {reload: true})
    };
    // 车辆品牌查询
    _basic.get(_host.api_url + "/carMake").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车库查询
    _basic.get(_host.api_url + "/storage").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.storageName = data.result;

            setTimeout($('select').material_select(), 2000)
        } else {
            swal(data.msg, "", "error");
        }
    });
    //获取委托方信息
    _basic.get(_host.api_url + "/entrust").then(function (data) {
        if (data.success == true) {
            $scope.getEntrust = data.result;
            $('#getEntrustId').select2({
                placeholder: '委托方',
                containerCssClass: 'select2_dropdown'
            });
        }
    });
    // 存放位置联动查询--行
    $scope.changeStorageId = function (val) {
        _basic.get(_host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageParking = data.result;
                $scope.parkingArray =  _baseService.storageParking($scope.storageParking);
            } else {
                swal(data.msg, "", "error");
            }
        });
    },
    // 存放位置联动查询--列
    $scope.changeStorageRow = function (val, array) {
        $scope.colArr = array[val - 1].col;
    };
    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        if ($scope.curruntId == val) {
        } else {
            $scope.curruntId = val;
            _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true&&data.result.length>0) {
                    $scope.carModelName = data.result;
                } else {
                    swal(data.msg, "", "error")
                }
            })
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
                _basic.put(_host.api_url + "/user/" + userId + "/carStorageRel/" + rel_id + "/relStatus/" + relSta, {
                    parkingId: p_id,
                    storageId: s_id,
                    carId: car_id
                }).then(function (data) {
                    if (data.success = true) {
                        swal("出库成功!", "", "success");
                        // searchAll();
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
        _basic.get(_host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.self_storageParking = data.result;
                $scope.garageParkingArray = _baseService.storageParking($scope.self_storageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
            }
        })
    };
    // 查看详情
    $scope.lookStorageCar = function (val, vin) {
        $scope.submitted = false;
        // 照片清空
        $scope.imgArr = [];
        // 预览详情照片
        $scope.storage_imageBox = [];
        // 照片索引
        $scope.storage_image_i = [];
        $(".main_storage_car").hide();
        $("#look_StorageCar").show();
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg').addClass("active");
        $("#lookMsg").addClass("active");
        $("#lookMsg").show();
        $scope.Picture_carId = val;
        $scope.vin = vin;
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.operating_record = data.result[0];
                $scope.comment = $scope.operating_record.comment;
                $scope.storage_image = $scope.operating_record.storage_image;
                $scope.record_id=$scope.operating_record._id;
                for (var i in $scope.storage_image) {
                    $scope.storage_image_i.push(_host.file_url + '/image/' + $scope.storage_image[i].url);
                    $scope.storage_imageBox.push({src: _host.file_url + '/image/' + $scope.storage_image[i].url,record_id:$scope.record_id,time:$scope.storage_image[i].timez,user:$scope.storage_image[i].name});
                }
            } else {
                swal(data.msg, "", "error")
            }
        });
        _basic.get(_host.api_url + "/user/" + userId + "/car?carId=" + val + '&active=1').then(function (data) {
            if (data.success == true && data.result.length>0) {
                $scope.modelId = data.result[0].model_id;
                $scope.self_car = data.result[0];
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id,
                $scope.changeMakeId($scope.look_make_id);
                $scope.look_model_id = $scope.self_car.model_id;
                    if($scope.self_car.pro_date==null){
                        $scope.look_create_time="1970-01-01";
                    }else {
                        $scope.look_create_time = moment($scope.self_car.pro_date).format('YYYY-MM-DD');
                    }
                $scope.look_storageName = $scope.self_car.storage_name + "" + $scope.self_car.row + "排" + $scope.self_car.col + "列";
                // 车辆id
                $scope.look_car_id = $scope.self_car.id;
            } else {
                swal(data.msg, "", "error")
            }
        })
    };
    // 修改仓库详情
    $scope.submitForm = function (isValid, id, r_id) {
        $scope.submitted = true;
        var obj = {
            "vin": $scope.self_car.vin,
            "makeId": $scope.self_car.make_id,
            "makeName": $("#look_makecarName").find("option:selected").text(),
            "modelId": $scope.self_car.model_id,
            "modelName": $("#look_model_name").find("option:selected").text(),
            "proDate": $scope.look_create_time,
            "colour": $scope.self_car.colour,
            "engineNum": $scope.self_car.engine_num,
            "remark": $scope.self_car.remark
        };
        if (isValid) {
            // 修改计划出库时间
            _basic.put(_host.api_url + "/user/" + userId + "/carStorageRel/" + r_id + "/planOutTime", {
                "planOutTime": $scope.self_car.plan_out_time
            }).then(function (data) {
            });
            // 修改仓库信息
            _basic.put(_host.api_url + "/user/" + userId + "/car/" + id, _basic.removeNullProps(obj)).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
    };
    // 移动位置
    $scope.moveParking = function (parkingId, row, col) {
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
                    _basic.put(_host.api_url + "/user/" + userId + "/storageParking/" + parkingId, {
                        carId: $scope.move_carId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("移位成功", "", "success");
                            $scope.lookStorageCar(val, vin);
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
    $scope.outStorage = function (rel_id, p_id, s_id, car_id) {
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
                _basic.put(_host.api_url + "/user/" + userId + "/carStorageRel/" + rel_id + "/relStatus/" + 2, {
                    parkingId: p_id,
                    storageId: s_id,
                    carId: car_id
                }).then(function (data) {
                    if (data.success = true) {
                        swal("出库成功!", "", "success");
                        $scope.self_car.rel_status = 2;
                    }
                });
            }
        );
    }
    // 看大图
    var viewer;
    $scope.renderFinish = function () {
        viewer = new Viewer(document.getElementById('lookImg'), {
            url: 'data-original'
        });
    };
    //图片上传函数
    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
            var max_size_str = $(dom).attr('max_size');
            var max_size = 4 * 1024 * 1024; //default: 4M
            var re = /\d+m/i;
            if (re.test(max_size_str)) {
                max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
            }
            if ($(dom)[0].files[0].size > max_size) {
                swal('图片文件最大:' + max_size_str, "", "error");
                return false;
            }
        }
        else if (filename && filename.length > 0) {
            $(dom).val('');
            swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
        }
        _basic.formPost($(dom).parent().parent(), _host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {
            if (data.success) {
                var imageId = data.imageId;
                _basic.post(_host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope._id=data.result._id;
                        var nowDate=moment(new Date()).format("YYYY-DD-MM hh:ss");
                        $scope.storage_image_i.push(_host.file_url + '/image/' + imageId);
                        $scope.storage_imageBox.push({src: _host.file_url + '/image/' + imageId,record_id:$scope._id,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };
    // 删除照片
    $scope.deleteImg=function (record_id,src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                var url_array=src.split("/");
                var url=url_array[url_array.length-1];
                _basic.delete(_host.record_url+"/user/"+userId+"/record/"+record_id+"/image/"+url).then(function (data) {
                    if(data.success==true){
                        var i=$scope.storage_image_i.indexOf(src);
                        $scope.storage_imageBox.splice(i,1);
                        $scope.storage_image_i.splice(i,1);
                        swal("删除成功!", "", "success");
                    }
                })
            }
        )
    };
    //获取钥匙柜和扇区和位置

    $scope.lookStorageCar(val, vin);
}]);
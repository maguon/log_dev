/**
 * Created by ASUS on 2017/5/4.
 */
app.controller("storage_car_controller", ["$scope", "$rootScope", "$stateParams", "_host", "_basic", "_config", "_baseService",function ($scope, $rootScope, $stateParams, _host, _basic,  _config ,_baseService) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.curruntId = 0;
    $scope.start = 0;
    $scope.size = 10;
    $scope.storage_imageBox = [];
    // 获取颜色
    $scope.color = _config.config_color;
    // 获取车辆状态
    $scope.relStatus = _config.carRelStatus;
    $scope.getRelStatus = 1;
    $scope.addCarKeyCabinet = "";
    $scope.Picture_carId = "";
    // 获取车辆品牌
    function getCarMakeName() {
        _basic.get(_host.api_url + "/carMake").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.makecarName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 获取车库信息
    function getStorageName () {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取委托方信息
    function getEntrust () {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.getEntrust = data.result;
                $('#getEntrustId').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown'
                });
            }
        });
    }

    /**
     * 查询列表 条件查询
     * 
     * */
    $scope.getStorageCar = function () {
        var reqUrl = _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size;
        if ($scope.getRelStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.getRelStatus
        }
        if ($scope.search_storage != null) {
            reqUrl = reqUrl + "&storageId=" + $scope.search_storage
        }
        if ($scope.search_makeId != null) {
            reqUrl = reqUrl + "&makeId=" + $scope.search_makeId
        }
        if ($scope.search_modelId != null) {
            reqUrl = reqUrl + "&modelId=" + $scope.search_modelId
        }
        if ($scope.search_vin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.search_vin
        }
        if ($scope.search_enterTime_start != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.search_enterTime_start
        }
        if ($scope.search_enterTime_end != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.search_enterTime_end
        }
        if ($scope.search_planTime_start != null) {
            reqUrl = reqUrl + "&planStart=" + $scope.search_planTime_start
        }
        if ($scope.search_planTime_end != null) {
            reqUrl = reqUrl + "&planEnd=" + $scope.search_planTime_end
        }
        if ($scope.search_outTime_start != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.search_outTime_start
        }
        if ($scope.search_outTime_end != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.search_outTime_end
        }
        if ($scope.getMOS != null) {
            reqUrl = reqUrl + "&mosStatus=" + $scope.getMOS
        }
        if ($scope.getEntrustId != null) {
            reqUrl = reqUrl + "&entrustId=" + $scope.getEntrustId
        }

        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storageCarBoxList = data.result;
                $scope.storageCar = $scope.storageCarBoxList.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").removeClass("disabled");
                } else {
                    $("#pre").addClass("disabled");
                }
                if ($scope.storageCarBoxList.length < $scope.size) {
                    $("#next").addClass("disabled");
                } else {
                    $("#next").removeClass("disabled");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
   
    /**点击新增按钮*/
    $scope.addStorageCar = function () {
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
        $scope.entrustId = "";
        $scope.carValuation = "";
        $scope.MOS = "";
        $scope.remark = "";
        $scope.storage_name = "";
        // 照片清空
        $scope.imgArr = [];
        // 车辆型号清空
        $scope.carModelName = "";
        // 存放位置清空
        $scope.parkingArray = "";
        $scope.colArr = "";
        $scope.parking_id = "";
        $scope.plan_out_time = "";
        $(".modal").modal({
            height: 500
        });
        $("#newStorageCar").modal("open");

    };

    // 存放位置联动查询--行
    $scope.getStorageId = function (val) {
        if (val) {
            _basic.get(_host.api_url + "/storageParking?storageId=" + val).then(function (data) {
                if (data.success == true&&data.result.length>0) {
                    $scope.storageParking = data.result;
                    $scope.parkingArray =  _baseService.storageParking($scope.storageParking);
                } else {
                    swal(data.msg, "", "error");
                }
            });
        }
    },
    // 存放位置联动查询--列
    $scope.getStorageRow = function (val, array) {
        if (val) {
            $scope.colArr = array[val - 1].col;
        }
    };
    // 车辆型号联动查询
    $scope.getMakeId = function (val) {
        if (val) {
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
        }
    };
    // 图片上传函数
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
                swal('图片文件最大: ' + max_size_str, "", "error");
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
                        $scope.storage_imageBox.push({src: _host.file_url + '/image/' + imageId});
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };
    // 新增信息
    $scope.addCarDataItem = function () {
        if ($scope.vin!==''&& $scope.plan_out_time!=="") {
            var obj_car = {
                "vin": $scope.vin,
                "makeId": $scope.make_name.id,
                "makeName": $scope.make_name.make_name,
                "modelId": $scope.model_name.id,
                "modelName": $scope.model_name.model_name,
                "proDate": $scope.create_time,
                "colour": $scope.car_color,
                "engineNum": $scope.engineNum,
                "entrustId":$scope.entrustId,
                "valuation":$scope.carValuation,
                "mosStatus":$scope.MOS,
                "remark": $scope.remark,
                "storageId": $scope.storage_name.id,
                "storageName": $scope.storage_name.storage_name,
                "parkingId": $scope.parking_id,
                "planOutTime": $scope.plan_out_time
            };
            _basic.post(_host.api_url + "/user/" + userId + "/carStorageRel", _basic.removeNullProps(obj_car)).then(function (data) {
                if (data.success == true) {
                    $('.tabWrap .tab').removeClass("active");
                    $(".tab_box ").removeClass("active");
                    $(".tab_box ").hide();
                    $('.tabWrap .test2').addClass("active");
                    $("#test2").addClass("active");
                    $("#test2").show();
                    $scope.getStorageCar();
                    $scope.Picture_carId = data.id;
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
        else{swal('请填写完整信息', "", "error")}
    };
    //从添加相片跳转到添加钥匙
    $scope.nextp =function (){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test3').addClass("active");
        $("#test3").addClass("active");
        $("#test3").show();
    };
    //列表中点击钥匙 查看钥匙位置
    $scope.getKeyCabinet = function (id){
        $(".modal").modal();
        $("#keyCabinet").modal("open");
        $scope.keyCabinetId = id;
        _basic.get(_host.api_url + "/carKeyPosition?carId=" + id).then(function (data) {
            if(data.success==true){
                $scope.keyCabinetRow = data.result[0].row;
                $scope.keyCabinetCol =data.result[0]. col;
                $scope.addCarKeyCabinet = data.result[0].car_key_cabinet_id;
                $scope.addCarKeyCabinetArea = data.result[0].car_key_cabinet_area_id;
                $scope.changeCarKeyCabinetArea();
            }
        })
    }
    // 钥匙存放位置联动查询--柜
    function addCarKeyCabinet() {
        _basic.get(_host.api_url + "/carKeyCabinet?keyCabinetStatus=1").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.keyCabinetNameList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    //改变 钥匙存放位置  钥匙位置联动查询--扇区
    $scope.changeCarKeyCabinet = function(){
        _basic.get(_host.api_url + "/carKeyCabinetArea?areaStatus=1&carKeyCabinetId="+$scope.addCarKeyCabinet).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.carKeyCabinetAreaList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    //获取二维扇区图
    $scope.changeCarKeyCabinetArea =function (){
        _basic.get(_host.api_url + "/carKeyPosition?carKeyCabinetId="+$scope.addCarKeyCabinet+'&areaId='+$scope.addCarKeyCabinetArea).then(function (data) {
            if (data.success == true) {
                if(data.result.length == 0){
                    return
                }
                else{
                    $scope.carKeyCabinetParking = data.result;
                    $scope.keyCabinetName = data.result[0].key_cabinet_name;
                    $scope.areaName = data.result[0].area_name;
                    $scope.carKeyCabinetParkingArray =_baseService.carKeyParking($scope.carKeyCabinetParking);
                    $scope.carKeyCabinetParkingCol = $scope.carKeyCabinetParkingArray[0].col
                }
            } else {
                swal(data.msg, "", "error");
            }
        });

    }
    //添加钥匙在几排几列
    $scope.addCarKeyCabinetParking = function (id, row, col){
        $scope.addRow = row;
        $scope.addCol = col;
        swal({
            title: "该钥匙确定添加到" + row + "排" + col + "列？",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnConfirm: false
        },
            function () {
                if (id != null) {
                    _basic.put(_host.api_url + "/user/" + userId + "/carKeyPosition/" + id, {
                        carId:$scope.Picture_carId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("成功添加钥匙位置", "", "success");
                            $scope.changeCarKeyCabinet();
                            $scope.changeCarKeyCabinetArea();
                        }
                        else {
                            swal(data.msg, "", "error")
                        }
                    })
                }
            })
    }
    //确定添加成功
    $scope.addcarKeyCabinetItem =function (){
        $("#newStorageCar").modal("close");
         swal('成功添加入库车辆', "", "success");
        $scope.getStorageCar();
    }
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
                        $scope.getStorageCar();
                    }
                });
            }
        );
    };
    // 车位转移
    $scope.changeStorageCar = function (val, id, row, col) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $scope.nowRow = row;
        $scope.nowCol = col;
        $scope.moveCarId = id;
        _basic.get(_host.api_url + "/storageParking?storageId=" + val).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.selfStorageParking = data.result;
                $scope.garageParkingArray =_baseService.storageParking($scope.selfStorageParking);
                $scope.ageParkingCol = $scope.garageParkingArray[0].col
            }
        })
    };
    // 打开车辆重新入库模态框
    $scope.loginStorageCar = function (el, id) {
        $scope.self_vin = el;
        $scope.self_car_id = id;
        $(".modal").modal();
        $("#loginStorageCar").modal("open");
    };
    //车辆重新入库
    $scope.loginStorageCarOnce = function (valid, id, name, p_id, p_time) {
        $scope.submitted = true;
        if (valid) {
            var obj = {
                "parkingId": p_id,
                "storageId": id,
                "storageName": name,
                "planOutTime": p_time
            };
            _basic.post(_host.api_url + "/user/" + userId + "/againCarStorageRel?carId=" + $scope.self_car_id + "&vin=" + $scope.self_vin, obj).then(function (data) {
                if (data.success == true) {
                    swal('成功', "", "success");
                    $("#loginStorageCar").modal("close");
                    $scope.getStorageCar();
                } else {
                    swal(data.msg, "", "error")
                }
            })
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
                        carId: $scope.moveCarId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("移位成功", "", "success");
                            $scope.getStorageCar();
                            $("#change_storageCar").modal("close");
                        } else {
                            swal(data.msg, "", "error")
                        }
                    })
                }
            }
        )


    };
    // 上一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.getStorageCar();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.getStorageCar();
    };
    //获取数据
    $scope.queryData = function () {
        getCarMakeName();
        getStorageName();
        getEntrust();
        $scope.getStorageCar();
        addCarKeyCabinet();
    };
    $scope.queryData();

}]);
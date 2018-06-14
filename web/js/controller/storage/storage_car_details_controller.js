/**
 * Created by star on 2018/4/8.
 */
app.controller("storage_car_details_controller", [ "$scope","$state", "$stateParams", "_config", "_baseService",  "_host", "_basic", "$location", function ( $scope,$state, $stateParams, _config, _baseService,  _host, _basic, $location) {

   //自定义变量名
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;//获取本条信息的id
    var vin = $stateParams.vin;//获取本条信息的vin码
    $scope.imgArr = []; // 图片上传
    $scope.storage_imageBox = [];// 预览详情照片
    $scope.storage_image_i = [];// 照片索引
    $scope.color = _config.config_color;// 颜色
    $scope.purchaseTypes = _config.purchaseTypes; //是否是金融車輛
    $scope.Picture_carId = "";
    $scope.getCarKeyCabinetId = "";
    $scope.carKeyCabinetParkingArray ='';
    $scope.show = true;
    $scope.parkingArrayRow=[];
    $scope.parkingArrayLot =[];
    $scope.parkingArrayR =[];
    $scope.parkingArrayL =[];
    // 仓库详情（头部）
    $scope.storageNm = "";

    // 仓库详情（头部）区域列表
    $scope.zoneList = [];

    // 仓库详情（头部）行
    $scope.row = 0;

    // 仓库详情（头部）列
    $scope.col = 0;

    // 仓库详情（头部）单元存车位
    $scope.lot = 0;

    // 仓库详情（头部）剩余位置
    $scope.leftPosition = 0;

    // 一行一列内，多个停车位区分用 (A-Z)
    $scope.characters = _config.characters;

    // 画面是否有区域详细信息
    $scope.hasPosition = false;

    // 画面显示停车情况数据
    $scope.storageParkingArray = [];
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
        // 获取url参数

        // 仓库详情画面 （storage_store_detail）
        if ($stateParams.from == 'storage_store_detail') {
            $state.go($stateParams.from, {
                reload: true,
                id: $location.search()._id,
                from: $location.search()._from
            });
        } else {
            $state.go($stateParams.from, {reload: true});
        }
    };
    // 车辆品牌查询
    _basic.get(_host.api_url + "/carMake").then(function (data) {
        if (data.success&&data.result.length>0) {
            $scope.makecarName = data.result;
        } else {
            swal(data.msg, "", "error");
        }
    });
    // 车库查询
    _basic.get(_host.api_url + "/storage").then(function (data) {
        if (data.success&&data.result.length>0) {
            $scope.storageName = data.result;

            setTimeout($('select').material_select(), 2000)
        } else {
            swal(data.msg, "", "error");
        }
    });
    //获取委托方信息
    _basic.get(_host.api_url + "/entrust").then(function (data) {
        if (data.success) {
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
            if (data.success&&data.result.length>0) {
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
                if (data.success&&data.result.length>0) {
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
    $scope.changeStorageCar = function (val,area, id) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $scope.storageId  =val;
        $scope.moveCarId = id;
        $scope.area =area;
        _basic.get(_host.api_url +"/user/"+userId+ "/car?carId=" + id).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    $scope.storageInfo = data.result[0];
                    $scope.getStorageInfo();
                }
            }
        });
    };
    //获取仓储详细信息
    $scope.getStorageInfo = function () {

        // 检索仓储详细信息URL
        var url = _host.api_url + "/storageArea?areaStatus=1&storageId=" +  $scope.storageId;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {

                // 仓库区域列表
                $scope.zoneList = data.result;

                // 有仓库区域的时候
                if (data.result.length > 0) {
                    // 画面仓储 名称
                    $scope.storageNm = data.result[0].storage_name;
                    $scope.selectedZone = $scope.area;
                    // 获取仓储（分区）详细信息
                    $scope.getStorageAreaInfo($scope.selectedZone);
                } else {
                    swal("该仓库没有对应的区域信息！", "", "warning");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取仓储（分区）详细信息
    $scope.getStorageAreaInfo = function (selectedZone) {
        if (selectedZone == null || selectedZone == '') {
            return;
        }
        // 检索仓储详细信息URL
        var url = _host.api_url + "/storageArea?areaStatus=1&storageId=" + $scope.storageId + "&areaId=" + selectedZone;
        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 行
                    $scope.row = data.result[0].row;
                    // 列
                    $scope.col = data.result[0].col;
                    // 单元存车位
                    $scope.lot = data.result[0].lot;
                    // 取得剩余位置
                    $scope.getLeftPosition(selectedZone);
                    // 获取仓储分区停车信息
                    $scope.getStorageParkingInfo(selectedZone);
                } else {
                    // 该仓库没有对应的区域信息
                    $scope.hasPosition = false;
                    swal("该仓库没有对应的区域信息！", "", "warning");
                }
            } else {
                $scope.hasPosition = false;
                swal(data.msg, "", "error");
            }
        });
    };
    //获取仓储（分区）剩余位置信息。
    $scope.getLeftPosition = function (selectZoneId) {

        // 检索仓储剩余位置信息URL
        var url = _host.api_url + "/storageParkingBalanceCount?storageId=" + $scope.storageId + "&areaId=" + selectZoneId;

        // 调用API取得
        _basic.get(url).then(function (data) {
            if (data.success && data.result.length > 0) {
                // 剩余位置
                $scope.leftPosition = data.result[0].parking_balance_count;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    //获取仓储分区停车信息列表

    $scope.getStorageParkingInfo = function (selectedZone) {

        var url = _host.api_url + "/storageParking?storageId=" + $scope.storageId + '&areaId=' + selectedZone;

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    $scope.storageParking = data.result;
                    $scope.storageParkingArray = _baseService.storageParking($scope.storageParking);

                    if ($scope.storageParkingArray.length > 0) {
                        $scope.storageParkingCol = $scope.storageParkingArray[0].col;
                    }

                    $scope.hasPosition = true;
                } else {
                    $scope.hasPosition = false;
                    swal("未取到该分区的详细信息！", "", "warning");
                }
            } else {
                $scope.hasPosition = false;
                swal(data.msg, "", "error");
            }
        });
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
            if (data.success&&data.result.length>0) {
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
            if (data.success && data.result.length>0) {
                $scope.modelId = data.result[0].model_id;
                $scope.self_car = data.result[0];
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id,
                $scope.changeMakeId($scope.look_make_id);
                $scope.look_model_id = $scope.self_car.model_id;
                    if($scope.self_car.pro_date!==null){
                         $scope.look_create_time = $scope.self_car.pro_date;
                    }else {
                        $scope.look_create_time='';
                    }
                    if($scope.self_car.lot&&$scope.self_car.lot!==null){
                        var selfLot = $scope.characters[$scope.self_car.lot-1].name;
                    }
                $scope.look_storageName = $scope.self_car.storage_name + " " +$scope.self_car.area_name+"扇区"+ $scope.self_car.row + "排" + $scope.self_car.col + "列"+selfLot;
                // 车辆id
                $scope.look_car_id = $scope.self_car.id;
            } else {
                swal(data.msg, "", "error")
            }
        });
    };
    //获取钥匙柜和扇区和位置
    function getCarKeyPosition (){
        _basic.get(_host.api_url + "/carKeyPosition?carId=" + val).then(function (data) {
            if(data.success==true&&data.result.length>0){
                $scope.keyCabinetId = val;
                $scope.getCarKeyCabinet = data.result[0].car_key_cabinet_id;
                $scope.getCarKeyCabinetArea = data.result[0].car_key_cabinet_area_id;
                $scope.keyCabinetRow = data.result[0].row;
                $scope.keyCabinetCol = data.result[0].col;
                getCarKeyCabinetArea ();
                getCarKeyCabinetList();
                $scope.flag = true;
            }
            else{
                $scope.flag = false;
            }
        })
    }
    // 钥匙存放位置联动查询--柜
    function getCarKeyCabinet() {
        _basic.get(_host.api_url + "/carKeyCabinet?keyCabinetStatus=1").then(function (data) {
            if (data.success && data.result.length>0) {
                $scope.keyCabinetNameList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    //扇区的获取
    function getCarKeyCabinetArea (){
        _basic.get(_host.api_url + "/carKeyCabinetArea?areaStatus=1&carKeyCabinetId="+$scope.getCarKeyCabinetId).then(function (data) {
            if (data.success) {
                $scope.carKeyCabinetAreaList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }
    $scope.changeCarKeyCabinet = function(id){
        $scope.show = false;
        $scope.getCarKeyCabinetId = id;
        _basic.get(_host.api_url + "/carKeyCabinetArea?areaStatus=1&carKeyCabinetId="+$scope.getCarKeyCabinetId).then(function (data) {
            if (data.success) {
                $scope.carKeyCabinetAreaList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取二维扇区图
    function getCarKeyCabinetList (){
        _basic.get(_host.api_url + "/carKeyPosition?carKeyCabinetId="+$scope.getCarKeyCabinetId+'&areaId='+ $scope.getCarKeyCabinetArea).then(function (data) {
            if (data.success) {
                if(data.result==null){
                    return;
                }
                else{
                    $scope.carKeyCabinetParking = data.result;
                    $scope.carKeyCabinetParkingArray =_baseService.carKeyParking($scope.carKeyCabinetParking);
                    if( $scope.carKeyCabinetParkingArray.length===0){
                        return
                    }
                    $scope.carKeyCabinetParkingCol = $scope.carKeyCabinetParkingArray[0].col;
                    $scope.flag = true;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    $scope.changeCarKeyCabinetArea =function (id){
        $scope.show = true;
        _basic.get(_host.api_url + "/carKeyPosition?carKeyCabinetId="+$scope.getCarKeyCabinetId+'&areaId='+id).then(function (data) {
            if (data.success) {
                if(data.result==null){
                    return;
                }
                else{
                    $scope.carKeyCabinetParking = data.result;
                    $scope.carKeyCabinetParkingArray =_baseService.carKeyParking($scope.carKeyCabinetParking);
                    if( $scope.carKeyCabinetParkingArray.length===0){
                        return
                    }
                    $scope.carKeyCabinetParkingCol = $scope.carKeyCabinetParkingArray[0].col;
                    $scope.flag = true;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //钥匙移动
    $scope.moveCarKey = function(parkingId, row, col){
        swal({
            title: "该钥匙放置到" + row + "排" + col + "列？",
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
                    _basic.put(_host.api_url + "/user/" + userId + "/carKeyPosition/" + parkingId, {
                        carId: val
                    }).then(function (data) {
                        if (data.success) {
                            swal("移位成功", "", "success");
                            $scope.keyCabinetRow = row;
                            $scope.keyCabinetCol = col;
                            _basic.get(_host.api_url + "/carKeyPosition?carId="+val).then(function (data) {
                                if(data.success){
                                    $scope.getCarKeyCabinetId=data.result[0].car_key_cabinet_id;
                                    $scope.getCarKeyCabinetArea=data.result[0].car_key_cabinet_area_id;
                                    getCarKeyCabinetList();
                                }
                                else {
                                    swal(data.msg, "", "error")
                                }
                            })
                        }
                        else {
                            swal(data.msg, "", "error")
                        }
                    })
                }
            })
    };
    //有钥匙占位
    $scope.noMoveCarKey =function(){
        swal('该位置已存放钥匙，请存放到其他没有被暂用的位置', '','error')
    }
    // 修改仓库详情
    $scope.submitForm = function (isValid, id, r_id) {
        $scope.submitted = true;
        var obj = {
            vin: $scope.self_car.vin,
            makeId: $scope.self_car.make_id,
            makeName: $("#look_makecarName").find("option:selected").text(),
            modelId: $scope.self_car.model_id,
            modelName: $("#look_model_name").find("option:selected").text(),
            proDate: $scope.look_create_time,
            colour: $scope.self_car.colour,
            engineNum: $scope.self_car.engine_num,
            entrustId:  $scope.self_car.entrust_id,
            valuation:  $scope.self_car.valuation,
            purchaseType:$scope.self_car.purchase_type,
            msoStatus:  $scope.self_car.mso_status,
            remark: $scope.self_car.remark
        };

        // 如果年份没有输入，就去掉此属性
        if ($scope.look_create_time == null || $scope.look_create_time === "") {
            delete obj.proDate;
        }

        if ($scope.self_car.plan_out_time !== "" && $scope.self_car.plan_out_time !== undefined && $scope.self_car.valuation !== "") {
            // 修改计划出库时间
            _basic.put(_host.api_url + "/user/" + userId + "/carStorageRel/" + r_id + "/planOutTime", {
                "planOutTime": $scope.self_car.plan_out_time
            }).then(function (data) {
            });
            // 修改车辆信息
            _basic.put(_host.api_url + "/user/" + userId + "/car/" + id, obj).then(function (data) {
                if (data.success) {
                    swal("修改成功", "", "success");
                } else {
                    swal(data.msg, "", "error")
                }
            });
        } else {
            swal('请填写完整信息', "", "error");
        }
    };
    // 移动位置
    $scope.getCarInfo = function (parkingId, row, col,lot) {
        lot =$scope.characters[lot-1].name
        swal({
                title: "该车辆确定移位到" + row + "排" + col + "列"+lot+"?",
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
                        if (data.success) {
                            swal("移位成功", "", "success");
                            $scope.return();
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
                    if (data.success) {
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
    $scope.queryData = function () {
        getCarKeyPosition ();
        getCarKeyCabinet();
        $scope.lookStorageCar(val, vin);
    };
    $scope.queryData();
}]);
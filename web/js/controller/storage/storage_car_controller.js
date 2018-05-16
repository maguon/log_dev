/**
 * Created by star on 2018/4/8.
 */
app.controller("storage_car_controller", ["$scope", "$rootScope", "$stateParams", "_host", "_basic", "_config", "_baseService",function ($scope, $rootScope, $stateParams, _host, _basic,  _config ,_baseService) {
    //用戶
    var userId = _basic.getSession(_basic.USER_ID);

    //联动车牌型号
    $scope.curruntId = 0;

    //翻页
    $scope.start = 0;
    $scope.size = 11;

    //相片
    $scope.storageImageBox = [];
    $scope.storage_image_i = [];

    //仓库Id
    $scope.storageId ='';

    // 获取颜色
    $scope.color = _config.config_color;

    // 获取车辆状态
    $scope.relStatus = _config.carRelStatus;

    //添加钥匙
    $scope.addCarKeyCabinet = "";

    //添加新车辆后得到的Id
    $scope.pictureCarId = "";

    //添加入库车辆 判断基本信息
    $scope.showStorageData = 2;

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

    $scope.baseList = [];

    $scope.relCarStatus = '';

    //是否是金融車輛
    $scope.purchaseTypes = _config.purchaseTypes;


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
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
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
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                if(data.result.length==0){
                    return;
                }
                $scope.getStorageCar();
            }
        });
    }

    // 点击按钮进行查询
    $scope.getStorageCarList = function () {
        $scope.start = 0;
        $scope.getStorageCar();
    };


    //组装检索条件。
    function makeConditions() {
        var entrust = {};

        if ($("#entrustSelect").val() == "") {
            entrust = {id:"",text:""};
        } else {
            entrust = $("#entrustSelect").select2("data")[0] ;
        }

        var obj = {
            active:1,
            relStatus: $scope.getRelStatus,
            storageId: $scope.storageIdItem,
            makeId:$scope.makeIdItem,
            modelId: $scope.modelIdItem,
            vin:$scope.vinItem,
            enterStart:$scope.search_enterTime_start,
            enterEnd:$scope.search_enterTime_end,
            planStart:$scope.search_planTime_start,
            planEnd:$scope.search_planTime_end,
            realStart:$scope.search_outTime_start,
            realEnd:$scope.search_outTime_end,
            msoStatus:$scope.MSOItem,
            entrustId:entrust.id
        };
        return obj;
    }


    //查询列表 条件查询
    $scope.getStorageCar = function () {
        // 基本检索URL
        var reqUrl = _host.api_url + "/user/" + userId + "/car?start="+ $scope.start+"&size="+ $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        reqUrl = conditions.length > 0 ? reqUrl + "&" + conditions : reqUrl;
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storageCarBoxList = data.result;
                $scope.storageCar = $scope.storageCarBoxList.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = _host.api_url + "/car.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    };
    // 存放位置联动查询--扇区
    $scope.getStorageId = function (val) {
        if (val) {
            $scope.val =val;
            _basic.get(_host.api_url + "/storageArea?storageId=" + val+ "&&areaStatus=1").then(function (data) {
                if (data.success == true) {
                    if(data.result.length==0){
                        return;
                    }
                    $scope.storageAreaParking = data.result;
                }
                else if(data.success == true&&data.result.length==0){
                    $scope.storageAreaParking = "";
                }
                else{
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 存放位置联动查询--行
    $scope.getStorageAreaParking = function (val) {
        if (val) {
            $scope.areaVal = val;
            _basic.get(_host.api_url + "/storageParkingRow?storageId=" + $scope.val + "&areaId=" + val).then(function (data) {
                if (data.success == true) {
                    if (data.result.length == 0) {
                        return;
                    }
                    $scope.storageParking = data.result;
                }
                else if (data.success == true && data.result.length == 0) {
                    $scope.storageParking = "";
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 存放位置联动查询--列
    $scope.getStorageRow = function (Row) {
        _basic.get(_host.api_url + "/storageParkingCol?storageId=" + $scope.val+"&areaId="+ $scope.areaVal+'&row='+Row).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.storageRow = data.result;
            }
            else if(data.success == true&&data.result.length==0){
                $scope.storageRow = "";
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    //存放位置联动查询--格
    $scope.getStorageCol = function (Row,Col) {
        _basic.get(_host.api_url + "/storageParkingLot?storageId=" + $scope.val+"&areaId="+ $scope.areaVal+'&row='+Row+'&col='+Col).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.storageCol = data.result;
            }
            else if(data.success == true&&data.result.length==0){
                $scope.storageCol = "";
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 车辆型号联动查询
    $scope.getMakeId = function (val) {
        $scope.curruntId = val;
        _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.carModelName = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        })
    };
    //添加页面的车辆型号联动查询
    function addCarMakeId() {
        if($scope.baseList.make_id&&$scope.baseList.make_id!==null){
            _basic.get(_host.api_url + "/carMake/" + $scope.baseList.make_id + "/carModel").then(function (data) {
                if (data.success == true) {
                    if(data.result.length==0){
                        return;
                    }
                    $scope.carModelName = data.result;
                } else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };
    //点击新增入库车辆
    $scope.addStorageCar = function () {
        step0();
        $scope.create_time = "";
        $scope.storage_name = "";
        $scope.parking_area ="";
        $scope.addCarKeyCabinet = '';
        $scope.addCarKeyCabinetArea = '';
        // 照片清空
        $scope.imgArr = [];
        // 车辆型号清空
        $scope.carModelName = "";
        // 存放位置清空
        $scope.area = '';
        $scope.parking_id = "";
        $scope.storageAreaParking=[];
        $scope.plan_out_time = "";
        $(".modal").modal({
            height: 500
        });
        $("#newStorageCar").modal("open");

    };
    //点击跳转到vin
    function step0(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test0').addClass("active");
        $("#test0").addClass("active");
        $("#test0").show();
        $scope.demandVin='';
    }
    //点击跳转到基本信息
    function step1(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test1').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
        $scope.makeNameId='';
        $scope.modelNameId='';
        $scope.create_time='';
        $scope.car_color='';
        $scope.engineNum='';
        $scope.entrustId='';
        $scope.carValuation='';
        $scope.condPurchaseType='';
        $scope.MSO='';
        $scope.remark=''
        $scope.putEntrust=$scope.baseList.entrust_id;
    }
    //点击跳转到相片
    function step2(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test2').addClass("active");
        $("#test2").addClass("active");
        $("#test2").show();
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + $scope.pictureCarId + "/record").then(function (data) {
            if (data.success == true) {
                $scope.operating_record = data.result[0];
                $scope.comment = $scope.operating_record.comment;
                $scope.storage_image = $scope.operating_record.storage_image;
                for (var i in $scope.storage_image) {
                    $scope.storage_image_i.push(_host.file_url + '/image/' + $scope.storage_image[i].url);
                    $scope.storageImageBox.push({
                        src: _host.file_url + '/image/' + $scope.storage_image[i].url,
                        record_id: $scope.operating_record._id,
                        time: $scope.storage_image[i].timez,
                        user: $scope.storage_image[i].name
                    });
                }
            }
            else {
                swal(data.msg, "", "error")
            }
        })
    }
    //点击跳转到鑰匙
    function step3(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test3').addClass("active");
        $("#test3").addClass("active");
        $("#test3").show();
    }
    //点击跳转到倉儲
    function step4(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test4').addClass("active");
        $("#test4").addClass("active");
        $("#test4").show();
        $scope.addRow="";
        $scope.addCol="";
        $scope.addLot="";
        $scope.storageParking=[];
        $scope.storageRow=[];
        $scope.storageCol=[];
    }
    //模糊查询
    var vinObjs ={}
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 10,
        onAutocomplete: function(val) {
        },
        minLength: 6,
    });
    $scope.shortSearch=function () {
        if($scope.demandVin!=undefined){
            if($scope.demandVin.length>=6){
                _basic.get(_host.api_url+"/carList?vinCode="+$scope.demandVin,{}).then(function (data) {
                    if(data.success==true&&data.result.length>0){
                        $scope.vinMsg=data.result;
                        vinObjs ={};
                        for(var i in $scope.vinMsg){
                            vinObjs[$scope.vinMsg[i].vin]=null;
                        }
                        return vinObjs;
                    }else{
                        return {};
                    }
                }).then(function(vinObjs){
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input').focus();

                })
            }else {
                $('#autocomplete-input').autocomplete({minLength:6});
                $scope.vinMsg={}
            }
            queryRelStatus();
        }
    };
    function queryRelStatus(){
        _basic.get(_host.api_url+"/user/"+userId+"/car?vin="+$scope.demandVin+'&active=1').then(function (data) {
            if(data.success=true){
                if(data.result.length==0){
                    $scope.relCarStatus='';
                    return;
                }else{
                    $scope.relCarStatus=data.result[0].rel_status;
                }
            }
        })
    }
    // 查询vin码
    $scope.demandCar=function () {
        _basic.get(_host.api_url+"/carList?vin="+$scope.demandVin).then(function (data) {
            if(data.success=true){
                if(data.result.length==0){
                    $scope.showStorageData = 2;
                    step1();
                }
                else{
                    $scope.baseList=data.result[0];
                    $scope.baseList.model_id=data.result[0].model_id;
                    $scope.baseList.make_id=data.result[0].make_id;
                    if( $scope.baseList.model_id==0|| $scope.baseList.make_id==0){
                        $scope.baseList.model_id='';
                        $scope.baseList.make_id='';
                    }
                    $scope.baseListDate = moment( $scope.baseList.created_on).format("YYYY-MM-DD");
                    for (var i in _config.config_color) {
                        if (_config.config_color[i].colorId == $scope.baseList.colour) {
                            $scope.baseListColor = _config.config_color[i].colorName;
                        }
                    }
                    if( $scope.relCarStatus==1){
                        swal('本车已在库中', "", "error");
                    }else {
                        $scope.pictureCarId = $scope.baseList.id;
                        $scope.showStorageData = 1;
                        step1();
                        addCarMakeId();
                    }
                }
            }
            else{
                swal(data.msg, "", "error");
            }
        })
    };
    // 新增信息
    $scope.addCarDataItem = function () {
        var entrust = $("#addEntrustSelect").select2("data")[0] ;
        if ( entrust.id!==""&& $scope.carValuation!==""&&$scope.MSO!==""&&$scope.condPurchaseType!=="") {
            if($scope.create_time==''|| $scope.makeNameId==""||$scope.modelNameId==''){
                $scope.create_time=null;
                $scope.makeNameId=0;
                $scope.modelNameId=0;
            }
            var objCar = {
                vin: $scope.demandVin,
                makeName:  $("#makeNameId").find("option:selected").text(),
                makeId: $scope.makeNameId,
                modelName: $("#modelNameId").find("option:selected").text(),
                modelId: $scope.modelNameId,
                proDate: $scope.create_time,
                colour: $scope.car_color,
                engineNum: $scope.engineNum,
                entrustId:entrust.id,
                valuation:$scope.carValuation,
                purchaseType:$scope.condPurchaseType,
                msoStatus:$scope.MSO,
                remark: $scope.remark
            };
            _basic.post(_host.api_url + "/user/" + userId + '/car', objCar).then(function (data) {
                if (data.success == true) {
                    $scope.pictureCarId = data.id;
                    step4();
                    $scope.getStorageCar();
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
        else{swal('请填写完整信息', "", "error")}
    };
    //出库后入库
    $scope.putCarDataItem = function (){
        if ( $scope.baseList.vin!==""&& $scope.baseList.entrust_id!==""&&$scope.baseList.valuation!==null&&$scope.baseList.mso_status!==""&&$scope.baseList.purchase_type!=='') {
            if($scope.baseListDate==''|| $scope.baseList.model_id==""||$scope.baseList.make_id==''){
                $scope.baseListDate=null;
                $scope.baseList.model_id=0;
                $scope.baseList.make_id=0;
            }
            var obj_car = {
                vin: $scope.baseList.vin,
                makeId: $scope.baseList.make_id,
                makeName: $("#makecarName1").find("option:selected").text(),
                modelId: $scope.baseList.model_id,
                modelName: $("#model_name1").find("option:selected").text(),
                proDate: $scope.baseListDate,
                colour: $scope.baseList.colour,
                engineNum: $scope.baseList.engine_num,
                entrustId:$scope.baseList.entrust_id,
                valuation:$scope.baseList.valuation,
                purchaseType:$scope.baseList.purchase_type,
                msoStatus:$scope.baseList.mso_status,
                remark: $scope.baseList.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + '/car/'+$scope.pictureCarId, obj_car).then(function (data) {
                if (data.success == true) {
                    step4();
                    $scope.getStorageCar();
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }
        else{swal('请填写完整信息', "", "error")}
    }
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
                _basic.post(_host.record_url + "/car/" + $scope.pictureCarId + "/vin/" + $scope.demandVin + "/storageImage", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope.storageImageBox.push({src: _host.file_url + '/image/' + imageId});
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };
    //新增车辆仓储
    $scope.addStorageCarOnce = function (id, name, p_id, p_time) {
        if(id!==''&& name!==''&& p_id!==''&& p_time!==''){
            var obj = {
                parkingId: p_id,
                storageId: id,
                storageName: name,
                planOutTime: p_time
            }
            _basic.put(_host.api_url + "/user/" + userId +'/car/'+ $scope.pictureCarId+ "/vin/" + $scope.demandVin+ "/carStorageRel" , obj).then(function (data) {
                if (data.success == true) {
                    step2();
                } else {
                    swal(data.msg, "", "error")
                }
            })
        }
        else{
            swal('请填写完整入库信息','','error')
        }

    };
    //从添加相片跳转到添加钥匙
    $scope.nextStep =function (){
        step3();
    };
    //列表中点击钥匙 查看钥匙位置
    $scope.getKeyCabinet = function (id){
        $(".modal").modal();
        $("#keyCabinet").modal("open");
        $scope.keyCabinetId = id;
        _basic.get(_host.api_url + "/carKeyPosition?carId=" + id).then(function (data) {
            if(data.success==true){
                if(data.result.length==0){
                    $scope.flag = false;
                    return;
                }
                $scope.keyCabinetRow = data.result[0].row;
                $scope.keyCabinetCol =data.result[0]. col;
                $scope.addCarKeyCabinet = data.result[0].car_key_cabinet_id;
                $scope.addCarKeyCabinetArea = data.result[0].car_key_cabinet_area_id;
                $scope.changeCarKeyCabinetArea();
                $scope.flag = true;
            }
            else{
                $scope.flag = false;
            }
        })
    }
    $scope. closeCarKeyCabinetModal = function (){
        $(".modal").modal();
        $("#keyCabinet").modal("close");
    }
    // 钥匙存放位置联动查询--柜
    function addCarKeyCabinet() {
        _basic.get(_host.api_url + "/carKeyCabinet?keyCabinetStatus=1").then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.keyCabinetNameList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    //改变 钥匙存放位置  钥匙位置联动查询--扇区
    $scope.changeCarKeyCabinet = function(){
        $scope.show = false;
        _basic.get(_host.api_url + "/carKeyCabinetArea?areaStatus=1&carKeyCabinetId="+$scope.addCarKeyCabinet).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.carKeyCabinetAreaList = data.result;
            }
            else if(data.success == true&&data.result.length==0){
                $scope.carKeyCabinetAreaList = "";
            }
            else{
                swal(data.msg, "", "error");
            }
        });
    };
    //获取二维扇区图
    $scope.changeCarKeyCabinetArea =function (){
        $scope.show = true;
        if($scope.addCarKeyCabinetArea==undefined){
            $scope.carKeyCabinetParkingArray = "";
            $scope.carKeyCabinetParkingCol = "";
        }else{
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
                        carId:$scope.pictureCarId
                    }).then(function (data) {
                        if (data.success == true) {
                            swal("成功添加钥匙位置", "", "success");
                            _basic.get(_host.api_url + "/carKeyPosition?carId="+$scope.pictureCarId).then(function (data) {
                                if(data.success == true){
                                    $scope.addCarKeyCabinet=data.result[0].car_key_cabinet_id;
                                    $scope.addCarKeyCabinetArea=data.result[0].car_key_cabinet_area_id;
                                    $scope.changeCarKeyCabinetArea();
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
    $scope.changeStorageCar = function (val,area, id) {
        $(".modal").modal();
        $("#change_storageCar").modal("open");
        $scope.storageId  =val;
        $scope.moveCarId = id;
        $scope.area =area;
        _basic.get(_host.api_url +"/user/"+userId+ "/car?carId=" + id).then(function (data) {
            if (data.success == true) {
                if (data.result.length > 0) {
                    $scope.storageInfo = data.result[0];
                    $scope.getStorageInfo();
                }
            }
        });
    };
    //获取仓储详细信息。
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
                    // 默认选中 区域
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
    // 获取仓储（分区）详细信息。

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
            if (data.success==true ) {
                if (data.result.length == 0) {
                    return;
                }
                // 剩余位置
                $scope.leftPosition = data.result[0].parking_balance_count;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取仓储分区停车信息列表
    $scope.getStorageParkingInfo = function (selectedZone) {

        var url = _host.api_url + "/storageParking?storageId=" + $scope.storageId + '&areaId=' + selectedZone;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
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

    // 打开车辆重新入库模态框
    $scope.loginStorageCar = function (el, id) {
        $scope.storage_name = "";
        $scope.area = '';
        $scope.outRow= '';
        $scope.outCol= '';
        $scope.parking_id = "";
        $scope.storageAreaParking=[];
        $scope.plan_out_time = "";
        $scope.self_vin = el;
        $scope.self_car_id = id;
        $(".modal").modal();
        $("#loginStorageCar").modal("open");
    };
    //车辆重新入库
    $scope.loginStorageCarOnce = function (valid, id, name, p_id, p_time) {
        if (valid) {
            var obj = {
                "parkingId": p_id,
                "storageId": id,
                "storageName": name,
                "planOutTime": p_time
            };
            _basic.put(_host.api_url + "/user/" + userId +'/car/'+$scope.self_car_id+ "/vin/" + $scope.self_vin+ "/carStorageRel" , obj).then(function (data) {
                if (data.success == true) {
                    swal('成功', "", "success");
                    step3();
                    $("#loginStorageCar").modal("close");
                    $scope.getStorageCar();
                } else {
                    swal(data.msg, "", "error")
                }
            })
        }

    };
    // 移动位置
    $scope.getCarInfo = function (parkingId, row, col,lot) {
        lot =$scope.characters[lot-1].name;
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
        $scope.start = $scope.start - ($scope.size - 1) ;
        $scope.getStorageCar();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        $scope.getStorageCar();
    };
    //获取数据
    $scope.queryData = function () {
        getCarMakeName();
        getStorageName();
        getEntrust();
        addCarKeyCabinet();
    };
    $scope.queryData();

}]);

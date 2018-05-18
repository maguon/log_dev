/**
 * Created by star on 2018/4/3.
 * 委托方详情
 */
app.controller("client_info_detail_controller", ["$scope", "$rootScope","$state", "$stateParams","_host", "_basic", "_config", function ($scope, $rootScope,$state,$stateParams, _host, _basic, _config) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;//获取本条信息的id
    $scope.start = 0;
    $scope.size = 11;
    $scope.sizeDetail = 6;
    $scope.valuation = 0;
    $scope.characters = _config.characters;
    $scope.carStatusList =_config.carRelStatus;
    $scope.MSOList= _config.msoFlags;
    $scope.actualFee=0;
    $scope.shipTransFee=0;
    // 支付状态 列表
    $scope.payStatusList = _config.payStatus;
    // 颜色 列表
    $scope.configColor = _config.config_color;
    // 运送状态 列表
    $scope.orderStatus = _config.shipTransStatus;
    $scope.portList = [];

    // 支付方式 列表
    $scope.paymentMethodList = _config.paymentType;
    $scope.paymentStatusList= _config.paymentStatus;
    $("#pre").hide();
    $("#next").hide();
    /*
    * 跳转页面
    * */
    $scope.inventoryRecord = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.inventoryRecord ').addClass("active");
        $("#inventoryRecord").addClass("active");
        $("#inventoryRecord").show();
    };
    $scope.relStatus = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .relStatus').addClass("active");
        $("#relStatus").addClass("active");
        $("#relStatus").show();
        $scope.start = 0;
        getRelStatus();
    };
    $scope.msoStatus = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .msoStatus').addClass("active");
        $("#msoStatus").addClass("active");
        $("#msoStatus").show();
        $scope.start = 0;
        getMsoStatus();
    };
    $scope.storageOrder = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .storageOrder').addClass("active");
        $("#storageOrder").addClass("active");
        $("#storageOrder").show();
        queryOrderData();
    };
    $scope.seaTransportOrder = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .seaTransportOrder').addClass("active");
        $("#seaTransportOrder").addClass("active");
        $("#seaTransportOrder").show();
        querySeaTransportOrder();
    };
    $scope.paymentDetail = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .paymentDetail').addClass("active");
        $("#paymentDetail").addClass("active");
        $("#paymentDetail").show();
        querypaymentHistoryData();
    };
    $scope.seaTransportOrderDetails = function () {
        $('ul.tabWrapDetail li').removeClass("active");
        $(".tab_box_detail ").removeClass("active");
        $(".tab_box_detail ").hide();
        $('.tabWrapDetail .seaTransportOrderDetails').addClass("active");
        $("#seaTransportOrderDetails").addClass("active");
        $("#seaTransportOrderDetails").show();
        getSeaTransportOrderDetails();
    };
    $scope.storageOrderDetails = function () {
        $('ul.tabWrapDetail li').removeClass("active");
        $(".tab_box_detail ").removeClass("active");
        $(".tab_box_detail ").hide();
        $('ul.tabWrapDetail li.storageOrderDetails ').addClass("active");
        $("#storageOrderDetails").addClass("active");
        $("#storageOrderDetails").show();
        getStorageOrderDetails();
    }

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true})
    };
    // 获取车库信息
    function getStorageName () {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageNameList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }
    /**
     * 【始发港口 目的港口】列表查询
     */
    function getPortList() {
        _basic.get(_host.api_url + "/port").then(function (data) {
            if (data.success) {
                $scope.portList = data.result;
            }
        });
    }


    /**
     * 【船公司】列表查询，用来填充查询条件：船公司
     */
    function getShippingCoList() {
        // 调用API取得，画面数据
        _basic.get(_host.api_url + "/shipCompany").then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.shippingCoList = data.result;
            }
        });
    }



    /**
     * 车辆品牌列表查询，用来填充查询条件：车辆品牌
     */
    function getCarMakerList() {
        _basic.get(_host.api_url + "/carMake").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.carMakerList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 当车辆品牌变更时，车辆型号要进行联动刷新。
     * @param val 车辆品牌ID
     */
    $scope.changeMakerId = function (val) {
        if (val) {
            if ($scope.curruntId == val) {
            } else {
                $scope.curruntId = val;
                _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.carModelList = data.result;
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        }
    };
    //获取头部基本信息
    function getHeaderInfo (){
        _basic.get(_host.api_url + "/entrust?entrustId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.headerInfoList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    //获取估值 在库车辆 非MSO车辆库值
    function getEntrustBase (){
        _basic.get( _host.api_url + "/entrustBase?entrustId="+val).then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    // 库存记录中 查询列表 条件查询
    function getStorageCar () {
        var obj={
            relStatus:$scope.carRelStatus,
            vin:$scope.VIN,
            storageId:$scope.storageId,
            msoStatus:$scope.MSO,
            enterStart:$scope.enterStart,
            enterEnd:$scope.enterEnd,
            realStart:$scope.realStart,
            realEnd:$scope.realEnd,
            entrustId:val,
            start:$scope.start.toString(),
            size:$scope.size
        }
        var reqUrl = _host.api_url + "/user/" + userId + "/car?active=1&";
        _basic.get(reqUrl+_basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.storageCarBox =  data.result;
                $scope.storageCar = $scope.storageCarBox.slice(0,10);
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
    //点击查询按钮
    $scope.searchStorageCar = function (){
        $scope.start= 0;
        getStorageCar();
    }
    // 在库车辆 查询列表 条件查询
    function getRelStatus() {
         _basic.get(_host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size+"&entrustId="+val+"&relStatus=1").then(function (data) {
             if (data.success == true) {
                 $scope.storageCarBox2 =  data.result;
                 $scope.storageCar2 = $scope.storageCarBox2.slice(0,10);
                 if ($scope.start > 0) {
                     $("#pre2").show();
                 }
                 else {
                     $("#pre2").hide();
                 }
                 if (data.result.length < $scope.size) {
                     $("#next2").hide();
                 }
                 else {
                     $("#next2").show();
                 }
             } else {
                 swal(data.msg, "", "error");
             }
         });
     };

    //非mso 查询列表 条件查询
    function getMsoStatus() {
        _basic.get( _host.api_url + "/user/" + userId + "/car?active=1&relStatus=1"+ "&start=" + $scope.start + "&size=" + $scope.size+"&entrustId="+val+"&msoStatus=1").then(function (data) {
            if (data.success == true) {
                $scope.storageCarBox3 =  data.result;
                $scope.storageCar3 = $scope.storageCarBox3.slice(0,10);
                if ($scope.start > 0) {
                    $("#pre3").show();
                }
                else {
                    $("#pre3").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next3").hide();
                }
                else {
                    $("#next3").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    //点击打开模态框
    $scope.getModalRecord = function(id){
        $(".modal").modal();
        $("#getInventoryRecord").modal("open");
        _basic.get( _host.api_url + "/user/" + userId + "/car?carId="+id+"&active=" + 1).then(function (data) {
            if (data.success == true) {
                $scope.clientList = data.result[0];
                for (var i in _config.config_color) {
                    if (_config.config_color[i].colorId == $scope.clientList.colour) {
                        $scope.clientColor = _config.config_color[i].colorName;
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    //点击关闭模态框
    $scope.closeModalRecord= function(){
        $(".modal").modal();
        $("#getInventoryRecord").modal("close");
    };


    /**
     * 根据画面输入的查询条件，进行仓储订单数据查询。
     */
    function queryOrderData() {
        // 检索用url
        var reqUrl = _host.api_url + "/storageOrder?entrustId="+val+'&';
        var obj = {
            storageOrderId:$scope.conditionOrderNo,
            vin:$scope.conditionVin,
            makeId:$scope.conditionMakeId,
            modelId:$scope.conditionModelId,
            enterStart:$scope.conditionEnterTimeStart,
            enterEnd:$scope.conditionEnterTimeEnd,
            realStart:$scope.conditionOutTimeStart,
            realEnd:$scope.conditionOutTimeEnd,
            orderStatus:$scope.conditionPayStatus,
            start:$scope.start,
            size:$scope.size
        };

        _basic.get(reqUrl+_basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.orderResult = data.result;
                $scope.orderList = $scope.orderResult.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre4").show();
                }
                else {
                    $("#pre4").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next4").hide();
                }
                else {
                    $("#next4").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /*
    点击：查询按钮，进行数据查询
    */
    $scope.queryOrderList = function () {
        // 默认第一页
        $scope.start = 0;
        // 查询
        queryOrderData();
    };

    //点击打开仓储订单模态框
    $scope.openStorageOrder = function(id){
        $(".modal").modal();
        $("#openStorageOrder").modal("open");
        _basic.get( _host.api_url + "/storageOrder?storageOrderId="+id).then(function (data) {
            if (data.success == true) {
                $scope.orderInfo = data.result[0];
                for (var i in _config.config_color) {
                    if (_config.config_color[i].colorId == $scope.orderInfo.colour) {
                        $scope.color = _config.config_color[i].colorName;
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get( _host.api_url + "/orderPayment?storageOrderId="+id).then(function (data) {
            if (data.success == true) {
                $scope.orderPaymentInfo = data.result[0];

            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    //点击关闭仓储订单模态框
    $scope.closeModalStorageOrder= function(){
        $(".modal").modal();
        $("#openStorageOrder").modal("close");
    };

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function querySeaTransportOrder() {
        // 检索用url
        var reqUrl = _host.api_url + "/shipTransOrder?entrustId="+val+'&';
        var obj = {
            vin:$scope.conditionOrderVIN,
            shipTransId:$scope.conditionOrderId,
            makeId:$scope.conditionMakeId,
            modelId:$scope.conditionModelId,
            shipTransStatus:$scope.conditionOrderStatus,
            orderStatus:$scope.conditionPayStatus,
            shipCompanyId:$scope.conditionShipCompanyId,
            container:$scope.conditionContainer,
            startPortId:$scope.conditionStartPortId,
            endPortId:$scope.conditionEndPortId,
            startShipDateStart:$scope.conditionStartShipDateStart,
            startShipDateEnd:$scope.conditionStartShipDateEnd,
            endShipDateStart:$scope.conditionEnterTimeStart,
            endShipDateEnd:$scope.conditionEndShipDateEnd,
            start:$scope.start,
            size:$scope.size
        };
        _basic.get(reqUrl+_basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.seaTransportOrderResult = data.result;
                $scope.seaTransportOrderList = $scope.seaTransportOrderResult.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre5").show();
                }
                else {
                    $("#pre5").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next5").hide();
                }
                else {
                    $("#next5").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.querySeaTransportOrderList = function () {
        // 默认第一页
        $scope.start = 0;
        // 查询
        querySeaTransportOrder();
    };


    //点击打开海运订单模态框
    $scope.openSeaTranModal = function(vin){
        $(".modal").modal();
        $("#openSeaTranModal").modal("open");
        _basic.get(_host.api_url + "/shipTransOrder?vin="+vin).then(function (data) {
            if (data.success == true) {
                $scope.paymentInfo = data.result[0];
                getOrderPayment( $scope.paymentInfo.id);
                for (var i in _config.config_color) {
                    if (_config.config_color[i].colorId == $scope.paymentInfo.colour) {
                        $scope.SeaTranOrderColor = _config.config_color[i].colorName;
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        })
    };


    /*
   * 获取支付信息
   * */
    function getOrderPayment(id){
        _basic.get( _host.api_url + "/orderPayment?shipTransOrderId="+id).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.orderPaymentList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    //点击关闭海运订单模态框
    $scope.closeSeaTranModal= function(){
        $(".modal").modal();
        $("#openSeaTranModal").modal("close");
    };


    /**
     * 根据画面输入的查询条件，进行付款记录查询。
     */
    function querypaymentHistoryData() {
        // 检索用url
        var reqUrl = _host.api_url + "/orderPayment?entrustId="+ val+'&';
        var obj={
            orderPaymentId:$scope.paymentHistoryOrderPaymentId,
            entrustType:$scope.paymentHistoryPaymentType,
            number:$scope.paymentHistoryNumber,
            createdOnStart:$scope.createdOnStart,
            createdOnEnd:$scope.createdOnEnd,
            paymentStatus:$scope.paymentHistoryPaymentStatus,
            start:$scope.start,
            size:$scope.size
        };
        _basic.get(reqUrl+_basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.paymentHistoryResult = data.result;
                $scope.paymentHistoryList = $scope.paymentHistoryResult.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre6").show();
                }
                else {
                    $("#pre6").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next6").hide();
                }
                else {
                    $("#next6").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryPaymentHistoryList = function () {
        // 默认第一页
        $scope.start = 0;
        // 查询
        querypaymentHistoryData();
    };


    //点击打开付款记录模态框
    $scope.openPaymentHistoryModal = function(id){
        $(".modal").modal();
        $("#openPaymentHistory").modal("open");
        _basic.get(_host.api_url + "/orderPayment?orderPaymentId="+id).then(function (data) {
            if (data.success == true) {
                $scope.storagePaymentArray = data.result[0];
                $scope.seaTransportOrderDetails();
                $scope.storageOrderDetails();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    //仓储详情
    function getStorageOrderDetails(){
        $scope.actualFee=0;
        _basic.get(_host.api_url + "/orderPaymentRel?orderPaymentId="+$scope.storagePaymentArray.id+"&start=" + $scope.start + "&size=" + $scope.sizeDetail).then(function (data) {
            if (data.success == true) {
                $scope.storageOrderDetailsBoxArray = data.result;
                $scope.storageOrderDetailsArray = $scope.storageOrderDetailsBoxArray.slice(0, 5);
                for(var i=0;i<$scope.storageOrderDetailsArray.length;i++){
                    $scope.actualFee= $scope.actualFee+$scope.storageOrderDetailsArray[i].actual_fee;
                }
                if ($scope.start > 0) {
                    $("#pre7").show();
                }
                else {
                    $("#pre7").hide();
                }
                if (data.result.length <$scope.sizeDetail) {
                    $("#next7").hide();
                }
                else {
                    $("#next7").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    //海运详情
    function getSeaTransportOrderDetails(){
        $scope.shipTransFee=0;
        _basic.get(_host.api_url + "/shipTransOrderPaymentRel?orderPaymentId="+$scope.storagePaymentArray.id+"&start=" + $scope.start + "&size=" + $scope.sizeDetail).then(function (data) {
            if (data.success == true) {
                $scope.seaTransportOrderDetailsBoxArray = data.result;
                $scope.seaTransportOrderDetailsArray = $scope.seaTransportOrderDetailsBoxArray.slice(0,5);
                for(var i=0;i<$scope.seaTransportOrderDetailsArray.length;i++){
                    $scope.shipTransFee= $scope.shipTransFee+$scope.seaTransportOrderDetailsArray[i].ship_trans_fee;
                }
                if ($scope.start > 0) {
                    $("#pre8").show();
                }
                else {
                    $("#pre8").hide();
                }
                if (data.result.length < $scope.sizeDetail) {
                    $("#next8").hide();
                }
                else {
                    $("#next8").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        })
    }



    //点击关闭付款记录模态框
    $scope.closePaymentHistory= function(){
        $(".modal").modal();
        $("#openPaymentHistory").modal("close");
        $scope.storageOrderDetails();
    };

    // 上一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        getStorageCar();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        getStorageCar();
    };
    // 上一页
    $scope.preBtn2 = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        getRelStatus();

    };
    // 下一页
    $scope.nextBtn2 = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        getRelStatus();

    };
    // 上一页
    $scope.preBtn3 = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        getMsoStatus();
    };
    // 下一页
    $scope.nextBtn3 = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        getMsoStatus();
    };
    // 上一页
    $scope.preBtn4 = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        queryOrderData();
    };
    // 下一页
    $scope.nextBtn4 = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        queryOrderData();
    };
    // 上一页
    $scope.preBtn5 = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        querySeaTransportOrder();
    };
    // 下一页
    $scope.nextBtn5 = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        querySeaTransportOrder();
    };
    // 上一页
    $scope.preBtn6 = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        querypaymentHistoryData();
    };
    // 下一页
    $scope.nextBtn6 = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        querypaymentHistoryData();
    };
    // 上一页
    $scope.preBtn7 = function () {
        $scope.start = $scope.start - ($scope.sizeDetail - 1);
        getStorageOrderDetails();
    };
    // 下一页
    $scope.nextBtn7 = function () {
        $scope.start = $scope.start + ($scope.sizeDetail - 1);
        getStorageOrderDetails();
    };
    // 上一页
    $scope.preBtn8 = function () {
        $scope.start = $scope.start - ($scope.sizeDetail - 1);
        getSeaTransportOrderDetails();
    };
    // 下一页
    $scope.nextBtn8 = function () {
        $scope.start = $scope.start + ($scope.sizeDetail - 1);
        getSeaTransportOrderDetails();
    };
    //获取数据
    $scope.queryData = function () {
        $scope.inventoryRecord();
        getHeaderInfo ();
        getStorageName();
        getEntrustBase ();
        // 汽车品牌
        getCarMakerList();
        // 取得查询条件【始发港口 目的港口】列表
        getPortList();
        // 取得查询条件【船公司】列表
        getShippingCoList();
    };
    $scope.queryData();

}])
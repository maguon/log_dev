/**
 * Created by star on 2018/4/3.
 * 委托方详情
 */
app.controller("client_info_detail_controller", ["$scope", "$rootScope","$state", "$stateParams","_host", "_basic", "_config", function ($scope, $rootScope,$state,$stateParams, _host, _basic, _config) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;//获取本条信息的id
    $scope.start = 0;
    $scope.size = 11;
    $scope.valuation = 0;
    $scope.characters = _config.characters;
    $scope.carStatusList =_config.carRelStatus;
    $scope.MSOList= _config.msoFlags;
    // 支付状态 列表
    $scope.payStatusList = _config.payStatus;

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
    };
    $scope.paymentDetail = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .paymentDetail').addClass("active");
        $("#paymentDetail").addClass("active");
        $("#paymentDetail").show();
    };

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
    //获取头部基本信息
    function getHeaderInfo (){
        _basic.get(_host.api_url + "/entrust?entrustId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.headerInfoList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
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
        _basic.get( _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size+"&entrustId="+val+"&msoStatus=1").then(function (data) {
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



    /**
     * 根据画面输入的查询条件，进行仓储订单数据查询。
     */
    function queryOrderData() {
        // 检索用url
        var reqUrl = _host.api_url + "/storageOrder?entrustId="+val+"&start=" + $scope.start + "&size=" + $scope.size;

        // 订单编号
        if ($scope.conditionOrderNo != null) {
            reqUrl = reqUrl + "&storageOrderId=" + $scope.conditionOrderNo;
        }
        // vin码
        if ($scope.conditionVin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.conditionVin;
        }
        // 品牌
        if ($scope.conditionMakeId != null) {
            reqUrl = reqUrl + "&makeId=" + $scope.conditionMakeId;
        }
        // 型号
        if ($scope.conditionModelId != null) {
            reqUrl = reqUrl + "&modelId=" + $scope.conditionModelId;
        }
        // 入库时间 开始
        if ($scope.conditionEnterTimeStart != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.conditionEnterTimeStart
        }
        // 入库时间 终了
        if ($scope.conditionEnterTimeEnd != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.conditionEnterTimeEnd
        }
        // 实际出库时间 开始
        if ($scope.conditionOutTimeStart != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.conditionOutTimeStart
        }
        // 实际出库时间 终了
        if ($scope.conditionOutTimeEnd != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.conditionOutTimeEnd
        }
        // 支付状态
        if ($scope.conditionPayStatus != null) {
            reqUrl = reqUrl + "&orderStatus=" + $scope.conditionPayStatus
        }
        _basic.get(reqUrl).then(function (data) {
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
    $scope.preBtn3 = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;

    };
    // 下一页
    $scope.nextBtn3 = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;

    };
    //获取数据
    $scope.queryData = function () {
        $scope.inventoryRecord();
        getHeaderInfo ();
        getStorageName();
        getEntrustBase ();
        // 汽车品牌
        getCarMakerList();
    };
    $scope.queryData();

}])
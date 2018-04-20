/**
 * 主菜单：车辆查询 控制器
 */
app.controller("ship_trans_order_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "_baseService", function ($scope, $rootScope, _host, _basic, _config, _baseService) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 查询条件【目的港】列表
    $scope.portList = [];

    // 查询条件【船公司】列表
    $scope.shippingCoList = [];

    // 是否分单 列表
    $scope.partTypes = _config.partTypes;
    // 订单状态 列表
    $scope.orderStatus = _config.orderStatus;

    // 订单信息：修改价格画面用
    $scope.newShippingOrder = {
        // 始发港口
        leavingPort: "",
        // 目的港口
        destinationPort: "",
        // 开船日期
        sailDay: "",
        // 到港日期
        arrivalDay: "",
        // 船公司
        shippingCo: "",
        // 船名
        shippingNm: "",
        // 货柜
        counter: "",
        // booking
        booking: "",
        // 封签
        seal: "",
        // VIN
        vin: "",
        // 分单
        split: "",
        // 运费
        freight: "",
        // 订舱备注
        remark: ""
    };

    // 新增海运订单画面 VIN码 查询结果
    $scope.carList = [];

    // 新增海运订单画面 VIN码 尾部 对应追加按钮
    $scope.hasCarInfoList = false;


    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryShipTransOrderList() {

        // 基本检索URL
        var reqUrl = _host.api_url + "/shipTransOrder?start=" + $scope.start + "&size=" + $scope.size;

        // 订单编号
        if ($scope.condShipTransOrderId != null) {
            reqUrl = reqUrl + "&shipTransOrderId=" + $scope.condShipTransOrderId;
        }
        // 目的港
        if ($scope.condEndPortId != null) {
            reqUrl = reqUrl + "&endPortId=" + $scope.condEndPortId;
        }
        // 开始日期 开始
        if ($scope.condStartShipDateStart != null) {
            reqUrl = reqUrl + "&startShipDateStart=" + $scope.condStartShipDateStart;
        }
        // 开始日期 终了
        if ($scope.condStartShipDateEnd != null) {
            reqUrl = reqUrl + "&startShipDateEnd=" + $scope.condStartShipDateEnd;
        }
        // 船公司
        if ($scope.condShipCompanyId != null) {
            reqUrl = reqUrl + "&shipCompanyId=" + $scope.condShipCompanyId;
        }
        // 船名
        if ($scope.condShipName != null) {
            reqUrl = reqUrl + "&shipName=" + $scope.condShipName;
        }
        // 到港日期 开始
        if ($scope.condEndShipDateStart != null) {
            reqUrl = reqUrl + "&endShipDateStart=" + $scope.condEndShipDateStart;
        }
        // 到港日期 终了
        if ($scope.condEndShipDateEnd != null) {
            reqUrl = reqUrl + "&endShipDateEnd=" + $scope.condEndShipDateEnd;
        }
        // 货柜
        if ($scope.condContainer != null) {
            reqUrl = reqUrl + "&container=" + $scope.condContainer;
        }
        // booking
        if ($scope.condBooking != null) {
            reqUrl = reqUrl + "&booking=" + $scope.condBooking;
        }
        // 封签
        if ($scope.condTab != null) {
            reqUrl = reqUrl + "&tab=" + $scope.condTab;
        }
        // 运送状态
        if ($scope.condOrderStatus != null) {
            reqUrl = reqUrl + "&orderStatus=" + $scope.condOrderStatus;
        }

        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.shipTransOrder = data.result;
                $scope.shipTransOrderList = $scope.shipTransOrder.slice(0, 10);
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
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryShipTransOrder = function () {
        // 默认第一页
        $scope.start = 0;
        queryShipTransOrderList();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        queryShipTransOrderList();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryShipTransOrderList();
    };

    /**
     * 打开修改价格模态窗口。
     */
    $scope.openSeaTransportOrderDiv = function () {
        $('.modal').modal();
        $('#newSeaTransportOrderDiv').modal('open');
        // 实际应付
        // $scope.modifyActualFee = $filter('number')($scope.orderInfo.actualFee,2);
        // $scope.modifyActualFee = $scope.orderInfo.actualFee.toFixed(2);


        // $('#autocomplete-input').autocomplete('onSelected()');
        // instance.selectOption(el);
    };

    $scope.changeVin = function () {

        console.log('changeVin inner');
        var url = _host.api_url + "/user/" + userId + "/car?relStatus=2&active=1&paymentStatus=1&vinCode=" + $scope.newShippingOrder.vin;
        url= "http://stg.myxxjs.com:8001/api/user/4/car?vinCode=123456&relStatus=2&active=1&paymentStatus=1";
        // console.log($scope.demand_vin);
        if($scope.newShippingOrder.vin!=undefined){
            if($scope.newShippingOrder.vin.length>=6){
                _basic.get(url).then(function (data) {
                    if(data.success==true&&data.result.length>0){
                        $scope.carList=data.result;
                        vinObjs =[];
                        for(var i in $scope.carList){
                            vinObjs[$scope.carList[i].vin]=null;
                        }
                        return vinObjs;
                    }else{
                        return {};
                    }
                }).then(function(vinObjs){
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6,
                        // data: {
                        //     "Apple": null,
                        //     "Apple1": null,
                        //     "Apple2": null,
                        //     "Apple3": null,
                        //     "Apple4": null,
                        //     "Apple5": null,
                        //     "Apple6": null,
                        //     "Apple7": null,
                        //     "Apple8": null,
                        //     "Microsoft": null,
                        //     "Google": 'https://placehold.it/250x250'
                        // },
                        onAutocomplete: function(val) {
                            console.log('------------------' + val);
                            $scope.hasCarInfoList = true;
                            console.log('++++++++++++++++++++++' + val);
                            // var driverNameAndTel = val.split("-");
                            // $scope.searchAccurateDriver(driverNameAndTel);
                        },

                        // onAutocomplete: onAutocompleted(),
                        // limit: 6
                    });
                    //
                    // $('#autocomplete-input').autocomplete({
                    //     data: vinObjs,
                    //     minLength: 6
                    // });
                    // $('#autocomplete-input').focus();

                })
            }else {
                $('#autocomplete-input').autocomplete({minLength:6});
                $scope.carList=[];
            }
        }
    }

    /**
     * 根据vin码查询车辆列表
     */
    function getCarListByVin() {
        // http://stg.myxxjs.com:8001/api/user/4/car?vinCode=123456&relStatus=2&active=1&paymentStatus=1
        var url = _host.api_url + "/user/" + userId + "/car?relStatus=2&active=1&paymentStatus=1&vinCode=" + $scope.newShippingOrder.vin;
        _basic.get(url).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.carList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 仓库列表查询，用来填充查询条件：所在仓库
     */
    function getStorageList() {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.storageList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 【目的港】列表查询，用来填充查询条件：目的港
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得查询条件【目的港】列表
        getPortList();
        // 取得查询条件【船公司】列表
        getShippingCoList();

        // 查询数据
        queryShipTransOrderList();
    };
    $scope.initData();
}]);


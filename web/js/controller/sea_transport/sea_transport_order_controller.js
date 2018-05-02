/**
 * 主菜单：海运管理 --订单管理   by star 2018/4/24
 */
app.controller("sea_transport_order_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", function ($scope, $rootScope, _host, _basic, _config) {
    // 翻页用
    $scope.start = 0;
    $scope.size = 11;
    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);
    // 支付状态 列表
    $scope.payStatusList = _config.payStatus;
    $scope.portList = [];


    /*
    * 数据导出*
    * */
    $scope.export = function () {
        var obj = {
            vin:$scope.conditionOrderVIN,
            makeId:$scope.conditionMakeId,
            modelId:$scope.conditionModelId,
            orderStatus:$scope.conditionPayStatus,
            conditionEntrust:$scope.entrustName,
            shipCompanyId:$scope.conditionShipCompanyId,
            shipName:$scope.conditionShipName,
            container:$scope.conditionContainer,
            startPortId:$scope.conditionStartPortId,
            endPortId:$scope.conditionEndPortId,
            startShipDateStart:$scope.conditionStartShipDateStart,
            startShipDateEnd:$scope.conditionStartShipDateEnd,
            endShipDateStart:$scope.conditionEnterTimeStart,
            endShipDateEnd:$scope.conditionEndShipDateEnd,
            booking:$scope.conditionBooking
        };
        window.open(_host.api_url + "/shipTransOrder.csv?" + _basic.objToUrl(obj));
    };



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
     * 获取委托方信息
     * @param type 委托方类型
     */
    /**
     * 【委托方】列表查询
     */
    function getEntrustInfo() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }


    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryOrderData() {
        var entrust = {};

        if ($("#entrustSelect").val() == "") {
            entrust = {id: "", text: ""};
        } else {
            entrust = $("#entrustSelect").select2("data")[0];
        }
        // 检索用url
        var reqUrl = _host.api_url + "/shipTransOrder?start=" + $scope.start + "&size=" + $scope.size;

        // vin码
        if ($scope.conditionOrderVIN != null) {
            reqUrl = reqUrl + "&vin=" + $scope.conditionOrderVIN;
        }

        // 制造商
        if ($scope.conditionMakeId != null) {
            reqUrl = reqUrl + "&makeId=" + $scope.conditionMakeId;
        }
        // 型号
        if ($scope.conditionModelId != null) {
            reqUrl = reqUrl + "&modelId=" + $scope.conditionModelId;
        }
        // 委托方
        if (entrust.id!= null && entrust.id!= 0) {
            reqUrl = reqUrl + "&entrustId=" + entrust.id;
        }
        // 支付状态
        if ($scope.conditionPayStatus != null) {
            reqUrl = reqUrl + "&orderStatus=" + $scope.conditionPayStatus
        }
        // 船公司
        if ($scope.conditionShipCompanyId != null) {
            reqUrl = reqUrl + "&shipCompanyId=" + $scope.conditionShipCompanyId
        }
        // 船名
        if ($scope.conditionShipName != null) {
            reqUrl = reqUrl + "&shipName=" + $scope.conditionShipName
        }
        // 货柜
        if ($scope.conditionContainer != null) {
            reqUrl = reqUrl + "&container=" + $scope.conditionContainer
        }
        // 始发港口
        if ($scope.conditionStartPortId != null) {
            reqUrl = reqUrl + "&startPortId=" + $scope.conditionStartPortId
        }
        // 目的港口
        if ($scope.conditionEndPortId != null) {
            reqUrl = reqUrl + "&endPortId=" + $scope.conditionEndPortId
        }
        // 开船日期(始)
        if ($scope.conditionStartShipDateStart != null) {
            reqUrl = reqUrl + "&startShipDateStart=" + $scope.conditionStartShipDateStart
        }
        // 开船日期(终)
        if ($scope.conditionStartShipDateEnd != null) {
            reqUrl = reqUrl + "&startShipDateEnd=" + $scope.conditionStartShipDateEnd
        }
        // 到港日期(始)
        if ($scope.conditionEnterTimeStart != null) {
            reqUrl = reqUrl + "&endShipDateStart=" + $scope.conditionEnterTimeStart
        }
        // 到港日期(终)
        if ($scope.conditionEndShipDateEnd != null) {
            reqUrl = reqUrl + "&endShipDateEnd=" + $scope.conditionEndShipDateEnd
        }

        // booking
        if ($scope.conditionBooking != null) {
            reqUrl = reqUrl + "&booking=" + $scope.conditionBooking
        }

        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.orderResult = data.result;
                $scope.orderList = $scope.orderResult.slice(0, 10);
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
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryOrderList = function () {
        // 默认第一页
        $scope.start = 0;
        // 查询
        queryOrderData();
    };


    /*
    * 删除
    * */
    $scope.deletePriceOrder=function(shipTransId,carId){
        swal({
                title: "确定删除当前订单吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function(){
                _basic.delete(_host.api_url + "/user/" + userId + "/shipTrans/"+shipTransId+'/car/'+carId).then(function (data) {
                    if (data.success === true) {
                        queryOrderData();
                        swal("删除成功", "", "success");
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            });
    }

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        queryOrderData();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryOrderData();
    };


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得查询条件【始发港口 目的港口】列表
        getPortList();
        // 取得查询条件【车辆品牌】列表
        getCarMakerList();
        // 取得查询条件【船公司】列表
        getShippingCoList();

        getEntrustInfo();

        queryOrderData();
    };
    $scope.initData();
}])
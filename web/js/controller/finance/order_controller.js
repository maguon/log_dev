/**
 * 主菜单：仓储管理 -> 订单管理 控制器
 */
app.controller("order_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$filter", function ($scope, $rootScope, _host, _basic, _config, $filter) {

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 支付状态 列表
    $scope.payStatusList = _config.payStatus;

    // 当前汽车品牌ID
    $scope.curruntId = 0;

    // 订单信息：修改价格画面用
    $scope.orderInfo = {
        id: "",
        entrustName: "",
        vin: "",
        makeName: "",
        modelName: "",
        enterTime: "",
        realOutTime: "",
        planFee: "",
        actualFee: ""
    };

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryOrderData() {

        var entrust = {};

        if ($("#entrustIdSelect").val() == "") {
            entrust = {id:"",text:""};
        } else {
            entrust = $("#entrustIdSelect").select2("data")[0] ;
        }

        // 检索用url
        var reqUrl = _host.api_url + "/storageOrder?start=" + $scope.start + "&size=" + $scope.size;

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
        // 委托方
        if (entrust.id != null && entrust.id != 0) {
            reqUrl = reqUrl + "&entrustId=" + entrust.id;
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

    /**
     * 打开修改价格模态窗口。
     */
    $scope.openChangePriceDiv = function (el) {
        $('.modal').modal();
        $('#changePriceDiv').modal('open');

        $scope.orderInfo.id = el.id;
        // 委托方
        $scope.orderInfo.entrustName = el.entrust_name;
        // VIN
        $scope.orderInfo.vin = el.vin;
        // 车型
        $scope.orderInfo.makeName = el.make_name;
        $scope.orderInfo.modelName = el.model_name;
        // 入库时间
        $scope.orderInfo.enterTime = el.enter_time;
        // 出库时间
        $scope.orderInfo.realOutTime = el.real_out_time;
        // 预计支付
        $scope.orderInfo.planFee = el.plan_fee;
        // 实际应付
        // $scope.orderInfo.actualFee = $filter('number')(el.actual_fee,2);
        $scope.orderInfo.actualFee = el.actual_fee.toFixed(2);
    };

    /**
     * 修改价格，并刷新画面。
     */
    $scope.updateOrder = function () {

        if ($scope.orderInfo.actualFee !== "") {
            // 修改画面数据
            var obj = {
                actualFee: $scope.orderInfo.actualFee
            };

            var url = _host.api_url + "/user/" + userId + "/storageOrder/" + $scope.orderInfo.id;

            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#changePriceDiv').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    queryOrderData();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写实际应付价格！", "", "warning");
        }
    };

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
     * 委托方列表查询，用来填充查询条件：委托方
     */
    function getEntrustList() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustIdSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                // }).on("select2:unselecting", function(e) {
                //     // 点击清除(x)按钮，设定状态
                //     $(this).data('state', 'unselected');
                // }).on("select2:open", function(e) {
                //     // 打开时判断，如果是点击清除(x)按钮，则关闭下拉
                //     if ($(this).data('state') === 'unselected') {
                //         $(this).removeData('state');
                //         var self = $(this);
                //         setTimeout(function() {
                //             self.select2('close');
                //         }, 1);
                //     }
                });
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得查询条件列表
        // 汽车品牌
        getCarMakerList();
        // 委托方
        getEntrustList();
        // 查询数据
        queryOrderData();
    };
    $scope.initData();
}]);


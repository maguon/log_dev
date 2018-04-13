/**
 * 主菜单：仓储管理 -> 订单管理(详细画面) 控制器
 */
app.controller("storage_order_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "_baseService", function ($scope, $state, $stateParams, _basic, _config, _host, _baseService) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 订单 ID
    $scope.storageOrderId = $stateParams.id;

    // 支付状态 列表
    $scope.payStatusList = _config.payStatus;

    // 支付方式 列表
    $scope.paymentMethodList = _config.payMethods;

    // 颜色列表
    $scope.configColor = _config.config_color;

    // 是否显示关联订单详情部分（支付信息画面）
    $scope.otherOrderList = false;

    // 关联仓储订单列表
    $scope.relOrderList = [];

    // 预计支付合计
    $scope.totalPlanFee = 0;
    // 实际应付合计
    $scope.totalActualFee = 0;

    // 订单信息
    $scope.orderInfo = {
        orderStatus:"",
        entrustId: 0,
        entrustName: "",
        vin: "",
        makeName: "",
        modelName: "",
        color:"",
        enterTime: "",
        realOutTime: "",
        dayCount: "",
        planFee: "",
        actualFee: ""
    };

    // 支付信息
    $scope.paymentInfo = {
        // 订单ID
        id: 0,
        // 订单ID
        storageOrderIds: 0,
        // 委托人ID
        entrustId: 0,
        // 支付方式
        paymentType: "",
        // 编号
        number: "",
        // 支付金额(美元)
        paymentMoney: "",
        // 支付描述
        remark: "",
        // 操作员
        paymentUserName: "",
        // 支付时间
        paymentEndDate:""
    };

    /**
     * 返回到前画面（订单管理）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * 打开模态画面（查看关联的仓储订单）。
     */
    $scope.openAssociatedOrder = function () {
        $('.modal').modal();
        $('#associatedOrderInfoDiv').modal('open');
    };


    $scope.openOtherOrderList = function () {
        $scope.otherOrderList = true;
        // 取得关联其他订单数据。
        getOtherOrderPayment();
    };

    /**
     * 打开修改价格模态窗口。
     */
    $scope.openChangePriceDiv = function () {
        $('.modal').modal();
        $('#changePriceDiv').modal('open');
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

            var url = _host.api_url + "/user/" + userId + "/storageOrder/" + $scope.storageOrderId;

            console.log(url);

            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#changePriceDiv').modal('close');
                    swal("修改成功", "", "success");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写实际应付价格！", "", "warning");
        }
    };

    /**
     * 打开[支付信息]模态窗口。
     */
    $scope.openPaymentInfoDiv = function (el) {
        $('.modal').modal();
        $('#paymentInfoDiv').modal('open');
        $scope.otherOrderList = false;

        // 委托人ID
        $scope.paymentInfo.entrustId = $scope.orderInfo.entrustId;
        // 订单ID
        $scope.paymentInfo.storageOrderIds = $scope.storageOrderId;
    };

    /**
     * 执行[支付]操作。
     */
    $scope.orderPayment = function () {

        if ($scope.paymentInfo.paymentType !== "" && $scope.paymentInfo.number !== "" && $scope.paymentInfo.paymentMoney !== "" ) {

            // 修改订单状态为【2：已支付】
            var url = _host.api_url + "/user/" + userId + "/storageOrder/" + $scope.storageOrderId + "/orderStatus/" + $scope.payStatusList[1].id;

            _basic.put(url, {}).then(function (data) {
                if (data.success) {
                    _basic.post(_host.api_url + "/user/" + userId + "/payment", $scope.paymentInfo).then(function (data) {
                        if (data.success) {
                            $('#paymentInfoDiv').modal('close');
                            swal("支付成功", "", "success");
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                } else {
                    swal(data.msg, "", "error");
                }
            });
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    // /**
    //  * 获取钥匙柜（分区）详细信息。
    //  */
    // $scope.getLeftPosition = function (selectZoneId) {
    //
    //     // GET /carKeyCabinet/{carKeyCabinetId}/carKeyPositionCount
    //
    //     // 检索钥匙柜详细信息URL
    //     var url = _host.api_url + "/carKeyCabinet/" + keyCabinetId + "/carKeyPositionCount?areaId=" + selectZoneId;
    //
    //     // 调用API取得，画面数据
    //     _basic.get(url).then(function (data) {
    //         if (data.success) {
    //             // 检索取得数据集
    //             $scope.leftPosition = data.result[0].position_count;
    //         } else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };
    //
    // /**
    //  * 获取钥匙柜（分区）详细信息。
    //  */
    // $scope.getKeyCabinetAreaInfo = function () {
    //
    //     // 检索钥匙柜详细信息URL
    //     var url = _host.api_url + "/carKeyCabinetArea?areaStatus=1&carKeyCabinetId=" + keyCabinetId;
    //
    //     // 调用API取得，画面数据
    //     _basic.get(url).then(function (data) {
    //         if (data.success) {
    //             // 检索取得数据集
    //             $scope.zoneList = data.result;
    //
    //             // 画面钥匙柜 名称
    //             if (data.result.length > 0) {
    //                 $scope.selectedZone = $scope.zoneList[0].id;
    //                 $scope.keyCabinetNm = data.result[0].key_cabinet_name;
    //                 $scope.getKeyCabinetZoneList($scope.selectedZone);
    //             } else {
    //                 $scope.keyCabinetNm = keyCabinetNm;
    //             }
    //         } else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };


    /**
     * 取得订单详情
     */
    function getOrderDetails() {
        // 检索用url
        var url = _host.api_url + "/storageOrder?storageOrderId=" + $scope.storageOrderId;

        console.log(url);

        _basic.get(url).then(function (data) {
            if (data.success == true) {

                if (data.result.length == 0) {
                    return;
                }

                // 订单是已支付时，取得支付详情
                if (data.result[0].order_status == 2) {
                    getPaymentDetails();
                }
                // 支付状态
                $scope.orderInfo.orderStatus = data.result[0].order_status == null ? '0' : data.result[0].order_status;
                // 委托方
                $scope.orderInfo.entrustId = data.result[0].entrust_id == null ? 0 : data.result[0].entrust_id;
                $scope.orderInfo.entrustName = data.result[0].entrust_name == null ? '未知' : data.result[0].entrust_name;
                // vin
                $scope.orderInfo.vin = data.result[0].vin == null ? '未知' : data.result[0].vin;
                // 制造商
                $scope.orderInfo.makeName = data.result[0].make_name == null ? '未知' : data.result[0].make_name;
                // 型号
                $scope.orderInfo.modelName = data.result[0].model_name == null ? '未知' : data.result[0].model_name;
                // 颜色
                $scope.orderInfo.color = '未知';
                for (var i = 0; i < $scope.configColor.length; i++) {
                    if ($scope.configColor[i].colorId == data.result[0].colour) {
                        $scope.orderInfo.color = $scope.configColor[i].colorName;
                    }
                }
                // 入库
                $scope.orderInfo.enterTime = data.result[0].enter_time == null ? '未知' : data.result[0].enter_time;
                // 出库
                $scope.orderInfo.realOutTime = data.result[0].real_out_time == null ? '未知' : data.result[0].real_out_time;
                // 合计天数
                $scope.orderInfo.dayCount = data.result[0].day_count == null ? 0 : data.result[0].day_count;
                // 预计支付(美元)：
                $scope.orderInfo.planFee = data.result[0].plan_fee == null ? 0 : data.result[0].plan_fee;
                // 实际应付(美元)：
                $scope.orderInfo.actualFee = data.result[0].plan_fee == null ? 0 : data.result[0].actual_fee;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 取得支付详情
     */
    function getPaymentDetails() {
        // 检索用url
        var url = _host.api_url + "/storageOrderPayment?storageOrderId=" + $scope.storageOrderId;

        console.log(url);

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                // 支付编号
                $scope.paymentInfo.id = data.result[0].id == null ? '' : data.result[0].id;
                // 支付方式
                $scope.paymentInfo.paymentType = data.result[0].payment_type == null ? '未知' : data.result[0].payment_type;
                // 编号
                $scope.paymentInfo.number = data.result[0].number == null ? 0 : data.result[0].number;
                // 支付金额(美元)
                $scope.paymentInfo.paymentMoney = data.result[0].payment_money == null ? '未知' : data.result[0].payment_money;
                // 支付描述
                $scope.paymentInfo.remark = data.result[0].remark == null ? '' : data.result[0].remark;
                // 操作员
                $scope.paymentInfo.paymentUserName = data.result[0].payment_user_name == null ? '未知' : data.result[0].payment_user_name;
                // 支付时间
                $scope.paymentInfo.paymentEndDate = data.result[0].payment_end_date;
                // 查看关联的仓储订单
                getOrderPaymentRel(data.result[0].id);
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 查看关联的仓储订单
     */
    function getOrderPaymentRel(paymentId) {
        // 检索用url
        var url = _host.api_url + "/storageOrderPaymentRel?storageOrderPaymentId=" + paymentId;

        console.log(url);

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                console.log(data.result);
                $scope.relOrderList = data.result;

                var totalPlanFee = 0;
                var totalActualFee = 0;
                data.result.reduce(function(previousValue, currentValue) {
                    totalPlanFee =  previousValue.plan_fee + currentValue.plan_fee;
                    totalActualFee = previousValue.actual_fee + currentValue.actual_fee;
                });

                $scope.totalPlanFee = totalPlanFee;
                $scope.totalActualFee = totalActualFee;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 关联其他订单
     */
    function getOtherOrderPayment() {

        // 查询状态为[1：未支付]的所有订单
        var url = _host.api_url + "/storageOrder?orderStatus=" +  + $scope.payStatusList[0].id;;

        console.log('----------------------------' + url);

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                console.log(data.result);
                $scope.relOrderList = data.result;

                var totalPlanFee = 0;
                var totalActualFee = 0;
                // $scope.relOrderList.reduce(function(previousValue, currentValue) {
                //     console.log("previousValue.plan_fee is : " + previousValue.plan_fee);
                //     console.log("previousValue.actual_fee is : " + previousValue.actual_fee);
                //     totalPlanFee =  previousValue.plan_fee + currentValue.plan_fee;
                //     totalActualFee = previousValue.actual_fee + currentValue.actual_fee;
                // });

                // $scope.totalPlanFee = totalPlanFee;
                // $scope.totalActualFee = totalActualFee;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    $scope.selected = [];
   $scope.selectedTags = [];

    var updateSelected = function(action,id,name){
         if(action == 'add' && $scope.selected.indexOf(id) == -1){
                    $scope.selected.push(id);
                $scope.selectedTags.push(name);
                 }
             if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
                var idx = $scope.selected.indexOf(id);
                     $scope.selected.splice(idx,1);
                      $scope.selectedTags.splice(idx,1);
               }
           }

    $scope.updateSelection = function($event, id){
             var checkbox = $event.target;
             console.log(checkbox);
        console.log('id si : ' + id);

               var action = (checkbox.checked?'add':'remove');
             // updateSelected(action,id,checkbox.name);
       }

    $scope.isSelected = function(id){
        console.log($scope.selected);
               return $scope.selected.indexOf(id)>=0;
        };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得订单详情
        getOrderDetails();
        // 取得支付信息
        // getOrderPaymentInfo();
    };
    $scope.initData();
}]);

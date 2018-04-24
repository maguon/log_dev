/**
 * 主菜单：仓储管理 -> 订单管理(详细画面) 控制器
 */
app.controller("ship_trans_order_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "$filter", function ($scope, $state, $stateParams, _basic, _config, _host, $filter) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 海运订舱管理，订舱 ID
    $scope.shipTransId = $stateParams.id;

    // 订单状态 列表
    $scope.orderStatus = _config.orderStatus;
    // 是否分单 列表
    $scope.partTypes = _config.partTypes;
    // 支付状态 列表
    $scope.payStatus = _config.payStatus;

    // 海运订舱管理，订舱详情 基本信息
    $scope.shippingOrder = {
        // 海运订单编号
        shipTransId: "",
        // 状态
        status: "",
        // 始发港口
        startPortId: "",
        startPortNm: "",
        // 目的港口
        endPortId: "",
        endPortNm: "",
        // 开船日期
        sailingDay: "",
        // 到港日期
        arrivalDay: "",
        // 船公司
        shippingCoId: "",
        shippingCoNm: "",
        // 船名
        shipName: "",
        // 货柜
        container: "",
        // booking
        booking: "",
        // 封签
        tab: "",
        // 分单
        partStatus: "1",
        // 订舱备注
        remark: "",
        // 生成时间
        createdOn: ""
    };

    // 海运订舱管理，订舱详情 运载车辆列表
    $scope.shipTransCarList = [];

    // 海运订舱管理，订舱详情 运载车辆信息
    $scope.newShippingOrder = {
        // VIN（单纯画面使用）
        vin: "",
        // 运费合计（单纯画面使用）
        totalShipTransFees: 0
    };














    // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
    $scope.newCarInfo = {
        // car id
        carId: "",
        // vin
        vin: "",
        // 制造商
        maker: "",
        // 型号
        model: "",
        // 生产日期
        proDate: "",
        // 颜色
        colour: "",
        // 发动机号
        engineNum: "",
        // 委托方
        entrustId: 0,
        entrustNm: "",
        // 车价(美元)
        valuation: "",
        msoStatus: 0,
        remark: ""
    };















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

    // 选中的关联订单(selected状态)
    $scope.selectedRelOrder = [];

    // 预计支付合计
    $scope.totalPlanFee = 0;
    // 实际应付合计
    $scope.totalActualFee = 0;

    // 修改价格画面、实际应付
    $scope.modifyActualFee = 0;


    // 支付信息
    $scope.paymentInfo = {
        // 支付ID
        id: 0,
        // 订单ID
        storageOrderIds: [],
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
        paymentEndDate: ""
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

    /**
     * 取得订单详情
     */
    function getTransOrderDetails() {
        // 检索用url
        var url = _host.api_url + "/shipTrans?shipTransId=" + $scope.shipTransId;

        _basic.get(url).then(function (data) {
            if (data.success == true) {

                if (data.result.length == 0) {
                    return;
                }

                // // 订单是已支付时，取得支付详情
                // if (data.result[0].ship_trans_status == 2) {
                //     getPaymentDetails();
                // }

                // 海运编号
                $scope.shippingOrder.shipTransId = data.result[0].id;
                // 状态
                $scope.shippingOrder.status = data.result[0].ship_trans_status;
                // 始发港口
                $scope.shippingOrder.startPortId = data.result[0].start_port_id;
                $scope.shippingOrder.startPortNm = data.result[0].start_port_name;
                // 目的港口
                $scope.shippingOrder.endPortId = data.result[0].end_port_id;
                $scope.shippingOrder.endPortNm = data.result[0].end_port_name;
                // 开船日期
                $scope.shippingOrder.sailingDay = data.result[0].start_ship_date;
                // 到港日期
                $scope.shippingOrder.arrivalDay = data.result[0].end_ship_date;
                // 船公司
                $scope.shippingOrder.shippingCoId = data.result[0].ship_company_id;
                $scope.shippingOrder.shippingCoNm = data.result[0].ship_company_name;
                // 船名
                $scope.shippingOrder.shipName = data.result[0].ship_name;
                // 货柜
                $scope.shippingOrder.container = data.result[0].container;
                // booking
                $scope.shippingOrder.booking = data.result[0].booking;
                // 封签
                $scope.shippingOrder.tab = data.result[0].tab;
                // 订舱备注
                $scope.shippingOrder.remark = data.result[0].remark;
                // 生成时间
                $scope.shippingOrder.createdOn = data.result[0].created_on;
                // 分单
                $scope.shippingOrder.partStatus= data.result[0].part_status;

                // 取得运载车辆详情 （画面下部分）
                getShipTransCarRel();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 取得运载车辆详情
     */
    function getShipTransCarRel() {
        // 检索用url
        var url = _host.api_url + "/shipTransCarRel?shipTransId=" + $scope.shippingOrder.shipTransId;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.shipTransCarList = data.result;
                $scope.calcTotalFees();
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
        var url = _host.api_url + "/orderPaymentRel?orderPaymentId=" + paymentId;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                var totalPlanFee = 0;
                var totalActualFee = 0;
                $scope.relOrderList = [];
                data.result.forEach(function (value, index, array) {
                    // 去掉自己
                    if (value.storage_order_id != $scope.shipTransId) {
                        $scope.relOrderList.push(value);
                        totalPlanFee = totalPlanFee + value.plan_fee;
                        totalActualFee = totalActualFee + value.actual_fee;
                    }
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
        var url = _host.api_url + "/storageOrder?orderStatus=" + +$scope.payStatusList[0].id;

        _basic.get(url).then(function (data) {
            if (data.success == true) {

                data.result.forEach(function (value, index, array) {
                    // 去掉自己
                    if (value.id != $scope.shipTransId) {
                        $scope.relOrderList.push(value);
                    }
                });
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 判定关联订单全选按钮是否是选中状态。
     *
     * @returns {boolean} true 选中，false 未选
     */
    $scope.isSelectedAllRelOrder = function () {
        // 选中的情况
        if ($scope.relOrderList.length > 0 && $scope.selectedRelOrder.length == $scope.relOrderList.length) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 点击全选按钮。
     * @param $event
     */
    $scope.selectAllRelOrder = function ($event) {
        var checkbox = $event.target;
        $scope.selectedRelOrder = [];
        $scope.totalPlanFee = 0;
        $scope.totalActualFee = 0;
        // 选中的情况
        if (checkbox.checked) {
            $scope.relOrderList.forEach(function (value, index, array) {
                $scope.selectedRelOrder.push(value.id);
                $scope.totalPlanFee = $scope.totalPlanFee + value.plan_fee;
                $scope.totalActualFee = $scope.totalActualFee + value.actual_fee;
            });
        }
    };

    /**
     * 点击某一行关联订单时，修改选中数据列表以及合并金额。
     * @param $event
     * @param id
     * @param planFee
     * @param actualFee
     */
    $scope.clickRelOrder = function ($event, id, planFee, actualFee) {
        var checkbox = $event.target;

        // 选中的情况
        if (checkbox.checked) {
            $scope.totalPlanFee = $scope.totalPlanFee + planFee;
            $scope.totalActualFee = $scope.totalActualFee + actualFee;
            $scope.selectedRelOrder.push(id);

        } else {
            $scope.totalPlanFee = $scope.totalPlanFee - planFee;
            $scope.totalActualFee = $scope.totalActualFee - actualFee;
            var idx = $scope.selectedRelOrder.indexOf(id);
            $scope.selectedRelOrder.splice(idx, 1);
        }
        // 判定是否是全部选中，修改全部按钮状态
        $scope.isSelectedAllRelOrder();
    };

    /**
     * 当前行是否选中。
     * @param id
     * @returns {boolean}
     */
    $scope.isRelOrderSelected = function (id) {
        return $scope.selectedRelOrder.indexOf(id) >= 0;
    };


    /***************************************************************************************************************/


    /**
     * TODO
     */
    $scope.openSeaTransportOrderDiv = function () {
        $('.modal').modal();
        $('#newSeaTransportOrderDiv').modal('open');
        // 取得制造商列表
        getCarMakerList();

        $scope.newShippingOrder = {};
        $scope.shipTransCarList = [];
        // 隐藏 新增车辆信息 画面
        $scope.showCustomCarDiv = false;


        // 实际应付
        // $scope.modifyActualFee = $filter('number')($scope.orderInfo.actualFee,2);
        // $scope.modifyActualFee = $scope.orderInfo.actualFee.toFixed(2);


        // $('#vinInput').autocomplete('onSelected()');
        // instance.selectOption(el);
    };


    $scope.closeCustomCarDiv = function () {
        $scope.showCustomCarDiv = false;
        // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
        $scope.customCarInfo = {};
    };

    /**
     * 打开 xxxxxx 模态窗口。
     */
    $scope.addCarInfo = function () {
        //
        if ($scope.newShippingOrder.vin.length > 17) {
            // TODO 追加check 判断 是否有重复的数据在
            var url = _host.api_url + "/user/" + userId + "/car?vin=" + $scope.newShippingOrder.vin.substr(0, 17);
            console.log(url);

            _basic.get(url).then(function (data) {
                if (data.success) {
                    console.log('------------------');
                    $scope.newCarInfo.carId = data.result[0].id;
                    $scope.newCarInfo.vin = data.result[0].vin;
                    $scope.newCarInfo.maker = {id: data.result[0].make_id, make_name: data.result[0].make_name};
                    $scope.newCarInfo.model = {id: data.result[0].model_id, model_name: data.result[0].model_name};
                    $scope.newCarInfo.proDate = data.result[0].pro_date;
                    $scope.newCarInfo.colour = data.result[0].colour;
                    $scope.newCarInfo.engineNum = data.result[0].engine_num;
                    $scope.newCarInfo.entrustId = data.result[0].entrust_id;
                    $scope.newCarInfo.entrustNm = data.result[0].entrust_name;
                    $scope.newCarInfo.valuation = data.result[0].valuation;
                    $scope.newCarInfo.msoStatus = data.result[0].mso_status;
                    $scope.newCarInfo.remark = data.result[0].remark;

                    addCar($scope.newCarInfo);

                    $scope.showCarListDiv = true;
                } else {
                    swal(data.msg, "", "error");
                }
            });

        } else if ($scope.newShippingOrder.vin.length == 17) {
            // 自定义车辆 画面 VIN码 不可变项目
            $scope.customCarInfo.vin = $scope.newShippingOrder.vin;
            // 数据初始化
            // 委托方select2初期化
            $("#addEntrustSelect").val(null).trigger("change");
            getEntrustInfo();

            // 显示追加画面
            $scope.showCustomCarDiv = true;

        } else {

        }


        // 清空VIN输入框
        $scope.newShippingOrder.vin = '';
        // 使追加按钮灰掉
        $scope.addCarInfoFlg = false;


        // 实际应付
        // $scope.modifyActualFee = $filter('number')($scope.orderInfo.actualFee,2);
        // $scope.modifyActualFee = $scope.orderInfo.actualFee.toFixed(2);


        // $('#vinInput').autocomplete('onSelected()');
        // instance.selectOption(el);
    };

    // $scope.data={};


    /**
     * 追加自定义car信息。
     */
    $scope.createCustomCar = function () {
        var entrust = $("#addEntrustSelect").select2("data")[0]; //单选

        // TODO delete
        entrust = {id: '1', text: '委托人A'};

        if ($scope.customCarInfo.maker !== "" && $scope.customCarInfo.model !== ""
            && $scope.customCarInfo.proDate !== "" && $scope.customCarInfo.colour !== ""
            && $scope.customCarInfo.engineNum !== "" && entrust.id !== "" && $scope.customCarInfo.valuation !== "") {
            // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
            var obj = {
                // vin
                vin: $scope.customCarInfo.vin,
                // 制造商
                makeId: $scope.customCarInfo.maker.id,
                makeName: $scope.customCarInfo.maker.make_name,
                // 型号
                modelId: $scope.customCarInfo.model.id,
                modelName: $scope.customCarInfo.model.model_name,
                // 生产日期
                proDate: $scope.customCarInfo.proDate,
                // 颜色
                colour: $scope.customCarInfo.colour,
                // 发动机号
                engineNum: $scope.customCarInfo.engineNum,
                // 委托方
                entrustId: entrust.id,
                // 车价(美元)
                valuation: $scope.customCarInfo.valuation
            };

            console.log(obj);
            _basic.post(_host.api_url + "/user/" + userId + "/car", obj).then(function (data) {
                if (data.success) {

                    // 隐藏 新增车辆信息 画面
                    $scope.showCustomCarDiv = false;
                    // 显示 新增车辆列表
                    $scope.showCarListDiv = true;
                    //
                    $scope.customCarInfo.entrustNm = entrust.text;
                    // car id
                    $scope.customCarInfo.carId = data.id;
                    // 将当前的数据追加的列表中。
                    addCar($scope.customCarInfo);
                    //
                    // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
                    $scope.customCarInfo = {};
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整车辆信息！", "", "warning");
        }
    };


    /**
     * 新增海运订单,
     */
    $scope.createShipTransOrder = function () {
        //
        var carIds = [];
        var shipTransFees = [];
        // 车辆信息运费 标记
        var hasAllCarTransFeeFlg = false;

        if ($scope.shipTransCarList.length == 0) {
            swal("请填写完整海运订单信息！", "", "warning");
        } else {

            // 遍历新增车辆列表
            for (var i = 0; i < $scope.shipTransCarList.length; i++) {
                var carId = $scope.shipTransCarList[i].carId;
                var shipTransFee = $scope.shipTransCarList[i].shipTransFees;

                if (shipTransFee != undefined && shipTransFee != "") {
                    carIds.push(carId);
                    shipTransFees.push(parseFloat(shipTransFee));
                    hasAllCarTransFeeFlg = true;
                }
            }
        }

        if ($scope.newShippingOrder.startPort !== "" && $scope.newShippingOrder.endPort !== ""
            && $scope.newShippingOrder.sailingDay !== ""
            && $scope.newShippingOrder.shippingCoId !== "" && $scope.newShippingOrder.shipName !== ""
            && $scope.newShippingOrder.container !== "" && $scope.newShippingOrder.booking !== "" && hasAllCarTransFeeFlg
        ) {
            // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
            var obj = {
                startPortId: $scope.newShippingOrder.startPort.id,
                startPortName: $scope.newShippingOrder.startPort.port_name,
                endPortId: $scope.newShippingOrder.endPort.id,
                endPortName: $scope.newShippingOrder.endPort.port_name,
                startShipDate: $scope.newShippingOrder.sailingDay,
                endShipDate: $scope.newShippingOrder.arrivalDay,
                shipCompanyId: $scope.newShippingOrder.shippingCoId,
                shipName: $scope.newShippingOrder.shipName,
                container: $scope.newShippingOrder.container,
                booking: $scope.newShippingOrder.booking,
                tab: $scope.newShippingOrder.tab,
                partStatus: $scope.shippingOrder.partStatus,
                remark: $scope.newShippingOrder.remark,
                carIds: carIds,
                shipTransFees: shipTransFees
            };

            console.log(obj);

            _basic.post(_host.api_url + "/user/" + userId + "/shipTransOrder", obj).then(function (data) {
                if (data.success) {

                    // 关闭新增海运订单画面
                    $('#newSeaTransportOrderDiv').modal('close');
                    // 成功后，刷新页面数据 TODO
                    queryShipTransOrderList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整海运订单信息！", "", "warning");
        }
    };

    $scope.removeCar = function ($index) {
        $scope.shipTransCarList.splice($index, 1);
        console.log("new" + JSON.stringify($scope.shipTransCarList));

        // 计算合计运费
        $scope.calcTotalFees();
    };

    $scope.changeVin = function () {

        console.log('changeVin inner');

        var url = _host.api_url + "/carList?vinCode=" + $scope.newShippingOrder.vin;
        // console.log($scope.demand_vin);
        if ($scope.newShippingOrder.vin != undefined) {
            console.log($scope.newShippingOrder.vin);
            $scope.addCarInfoFlg = false;

            if ($scope.newShippingOrder.vin.length >= 6) {
                console.log('if');

                _basic.get(url).then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.carList = data.result;
                        vinObjs = {};
                        for (var i in $scope.carList) {
                            vinObjs[$scope.carList[i].vin + "  " + $scope.carList[i].make_name + "/" + $scope.carList[i].model_name + "  委托方：" + $scope.carList[i].entrust_id] = null;
                        }
                        return vinObjs;
                    } else {
                        return {};
                    }
                }).then(function (vinObjs) {
                    $('#vinInput').autocomplete({
                        data: vinObjs,
                        minLength: 6,
                        onAutocomplete: function (val) {
                            $scope.addCarInfoFlg = true;
                            // $scope.newShippingOrder.vin = val;
                        },
                        // limit: 6
                    });
                    $('#vinInput').focus();
                })
            } else {
                $('#vinInput').autocomplete({minLength: 6});
                console.log('else');

                vinObjs = {};
                //
                // $('#vinInput').autocomplete('updateData', {});
                //
                // $scope.carList=[];
            }


            // 根据填充完毕的完整vin码信息进行精确查询
            if ($scope.newShippingOrder.vin.length === 17) {
                $scope.addCarInfoFlg = true;
            } else {
                $scope.addCarInfoFlg = false;
            }
        }
    };

    function addCar(carInfo) {

        console.log('add car inner');
        // 是否分单, 默认 分单：否
        $scope.shippingOrder.partStatus = "1";

        var hasError = false;
        // 遍历新增车辆列表
        for (var i = 0; i < $scope.shipTransCarList.length; i++) {
            var vin = $scope.shipTransCarList[i].vin;
            var entrustId = $scope.shipTransCarList[i].entrust_id;
            // 已经追加过
            if (vin == carInfo.vin) {
                hasError = true;
            }

            // 分单：否 时，进行判定
            if ($scope.shippingOrder.partStatus == "1") {
                if (entrustId != carInfo.entrustId) {
                    // 委托人不同，分单：是
                    $scope.shippingOrder.partStatus = "2";
                }
            }
        }
        if (hasError) {
            swal("不能重复添加相同车辆！", "", "warning");
        } else {
            $scope.shipTransCarList.push(angular.copy(carInfo));
        }
    }

    /***************************************************************************************************************/

    /**
     * 计算合计运费。
     */
    $scope.calcTotalFees = function () {
        // 合计
        $scope.newShippingOrder.totalShipTransFees = 0;

        // 遍历新增车辆列表
        for (var i = 0; i < $scope.shipTransCarList.length; i++) {
            var fee = $scope.shipTransCarList[i].ship_trans_fee;
            // 有运费时，计算合计
            if (fee != undefined && fee != NaN && fee != null && fee != "") {
                $scope.newShippingOrder.totalShipTransFees = $scope.newShippingOrder.totalShipTransFees + parseFloat(fee);
            }
        }
    };

    /**
     * 【委托方】列表查询
     */
    function getEntrustInfo() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }

    /**
     * 【港口】列表查询
     */
    function getPortList() {
        _basic.get(_host.api_url + "/port").then(function (data) {
            if (data.success) {
                $scope.portList = data.result;
            }
        });
    }

    /**
     * 【船公司】列表查询
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
     * 【车辆品牌】列表查询
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得【港口】列表
        getPortList();
        // 取得【船公司】列表
        getShippingCoList();
        // 取得【车辆品牌】列表
        getCarMakerList();
        // 取得订舱详情
        getTransOrderDetails();
    };
    $scope.initData();
}]);

/**
 * 主菜单：海运管理 -> 海运信息(详细画面) 控制器
 */
app.controller("ship_trans_info_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", "$filter", function ($scope, $state, $stateParams, _basic, _config, _host, $filter) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 海运订舱管理，订舱 ID
    $scope.shipTransId = $stateParams.id;

    // 运送状态 列表
    $scope.shipTransStatus = _config.shipTransStatus;
    // 是否分单 列表
    $scope.partTypes = _config.partTypes;
    // 支付状态 列表
    $scope.payStatus = _config.payStatus;
    // 颜色 列表
    $scope.configColor = _config.config_color;
    // 是否MSO车辆
    $scope.msoFlags = _config.msoFlags;
    // 海运费用类别
    $scope.shipTransFeeTypes = _config.shipTransFeeTypes;

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
        // 预计开船日期
        sailingDay: "",
        // 预计到港日期
        arrivalDay: "",
        // 实际开船日期
        actualStartDay: "",
        // 实际到港日期
        actualEndDay: "",
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
        createdOn: "",
        // VIN（单纯画面使用）
        vin: "",
        // 运费合计（单纯画面使用）
        totalShipTransFees: 0
    };

    // 海运订舱管理，订舱详情 运载车辆列表
    $scope.shipTransCarList = [];
    // // 海运订舱管理，订舱详情 运载车辆列表(已关联，用来check)
    // $scope.relShipTransCarList = [];

    // 新建 车辆信息用
    $scope.customCarInfo = {};

    // 新增 海运费用 画面默认数据
    var defaultCustomCarInfo = {
        // vin
        vin: "",
        // 制造商
        maker: "",
        // 型号
        model: "",
        // 年份
        proDate: "",
        // 颜色
        colour: "",
        // 发动机号
        engineNum: "",
        // 委托方
        entrust: "",
        // 车价(美元)
        valuation: ""
    };

    // 新增 运载车辆信息 用
    $scope.newCarInfo = {
        // car id
        car_id: "",
        // 委托方
        entrust_id: 0,
        short_name: "",
        // 支付状态
        order_status: "",
        // vin
        vin: "",
        // 制造商
        make_name: "",
        // 型号
        model_name: "",
        // 年份
        pro_date: "",
        // 车价(美元)
        valuation: "",
        // 运费(美元)
        total_fee: 0
    };

    // 新增 海运费用 画面默认数据
    var defaultShipTransFee = {
        // 前画面订单ID
        shipTransOrderId: "",
        // 画面区分
        pageType: "",
        // 选择付费项目
        type: "",
        // 数量
        qty: "",
        // 金额(美元)
        fee: "",
        // 备注
        remark: "",
        // 合计费用(美元)
        totalFee: 0
    };

    // 新增 海运费用 画面用
    $scope.newShipTransFee = {};

    /**
     * 返回到前画面（海运 订舱管理）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"ship_trans_info_detail"}, {reload: true})
    };

    /**
     * 取得订单详情
     */
    function getTransOrderDetails() {
        // 检索用url
        var url = _host.api_url + "/shipTrans?shipTransId=" + $scope.shipTransId;

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
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
                    // 预计开船日期
                    $scope.shippingOrder.sailingDay = $filter("date")(data.result[0].start_ship_date, 'yyyy-MM-dd');
                    // 预计到港日期
                    $scope.shippingOrder.arrivalDay = $filter("date")(data.result[0].end_ship_date, 'yyyy-MM-dd');
                    // 实际开船日期
                    $scope.shippingOrder.actualStartDay = $filter("date")(data.result[0].actual_start_date, 'yyyy-MM-dd');
                    // 实际到港日期
                    $scope.shippingOrder.actualEndDay = $filter("date")(data.result[0].actual_end_date, 'yyyy-MM-dd');
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
                    $scope.shippingOrder.partStatus = data.result[0].part_status != null ? parseInt(data.result[0].part_status) : data.result[0].part_status;

                    // 取得运载车辆详情 （画面下部分）
                    getShipTransCarRel();
                }
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
            if (data.success) {
                $scope.shipTransCarList = data.result;
                // 计算 运载车辆 部分 合计运费
                $scope.calcTotalFees();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 画面vin码 输入框 变更时，触发方法
     */
    $scope.changeVin = function () {

        if ($scope.shippingOrder.vin != undefined) {
            $scope.addCarInfoFlg = false;
            var url = _host.api_url + "/carList?vinCode=" + $scope.shippingOrder.vin;

            if ($scope.shippingOrder.vin.length >= 6) {
                _basic.get(url).then(function (data) {
                    if (data.success && data.result.length > 0) {
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
                        },
                        // limit: 6
                    });
                    $('#vinInput').focus();
                    if ($scope.shippingOrder.vin.length > 17 && $scope.addCarInfoFlg) {
                        $scope.addCarInfo();
                    }
                })
            }

            // 根据填充完毕的完整vin码信息进行精确查询
            $scope.addCarInfoFlg = false;
            if ($scope.shippingOrder.vin.length === 17) {
                $scope.addCarInfoFlg = true;
            }
        }
    };

    /**
     * 点击 vin码 后的 追加按钮。(打开追加画面 或追加列表数据)
     */
    $scope.addCarInfo = function () {
        // 新追加的车辆VIN码
        var newVin = $scope.shippingOrder.vin;

        // 如果是从自动填充中，选择出来的话，需要截取前面17位
        if ($scope.shippingOrder.vin.length > 17) {
            newVin = $scope.shippingOrder.vin.substr(0, 17);
        }

        // 遍历新增车辆列表
        var hasError = false;
        for (var i = 0; i < $scope.shipTransCarList.length; i++) {
            var vin = $scope.shipTransCarList[i].vin;
            // 已经追加过
            if (vin === newVin) {
                hasError = true;
                break;
            }
        }
        if (hasError) {
            swal("不能重复添加相同车辆！", "", "warning");
        } else {
            var url = _host.api_url + "/user/" + userId + "/car?vin=" + newVin;

            _basic.get(url).then(function (data) {
                if (data.success) {

                    // 新的vin码，(不存在的车辆)，打开新建画面
                    if (data.result.length === 0) {
                        // 初期化数据
                        angular.copy(defaultCustomCarInfo, $scope.customCarInfo);
                        // 自定义车辆 画面 VIN码 不可变项目
                        $scope.customCarInfo.vin = newVin;

                        // 委托方select2初期化
                        $("#addEntrustSelect").val(null).trigger("change");
                        getEntrustInfo();

                        // 显示追加画面
                        $scope.showCustomCarDiv = true;
                    } else {
                        // car id
                        $scope.newCarInfo.car_id = data.result[0].id;
                        // 委托方
                        $scope.newCarInfo.entrust_id = data.result[0].entrust_id;
                        $scope.newCarInfo.short_name = data.result[0].short_name;
                        // 支付状态 默认未支付
                        $scope.newCarInfo.order_status = 1;
                        // vin
                        $scope.newCarInfo.vin = data.result[0].vin;
                        // 制造商
                        $scope.newCarInfo.make_name = data.result[0].make_name;
                        // 型号
                        $scope.newCarInfo.model_name = data.result[0].model_name;
                        // 年份
                        $scope.newCarInfo.pro_date = data.result[0].pro_date;
                        // 车价(美元)
                        $scope.newCarInfo.valuation = data.result[0].valuation;
                        // 运费(美元)
                        $scope.newCarInfo.total_fee = 0;

                        addCar($scope.newCarInfo);
                    }
                } else {
                    swal(data.msg, "", "error");
                }
            });
        }

        // 清空VIN输入框
        $scope.shippingOrder.vin = '';
        // 使追加按钮灰掉
        $scope.addCarInfoFlg = false;
    };

    /**
     * 将指定汽车信息追加到列表中。（共通方法）
     * @param carInfo 汽车信息
     */
    function addCar(carInfo) {
        var hasError = false;
        // 遍历新增车辆列表
        for (var i = 0; i < $scope.shipTransCarList.length; i++) {
            var vin = $scope.shipTransCarList[i].vin;
            // 已经追加过
            if (vin === carInfo.vin) {
                hasError = true;
            }
        }
        if (hasError) {
            swal("不能重复添加相同车辆！", "", "warning");
        } else {
            $scope.shipTransCarList.push(angular.copy(carInfo));
            addShipTransCarRel(carInfo);
        }
    }

    /**
     * 追加自定义car信息。
     */
    $scope.createCustomCar = function () {
        var entrust = $("#addEntrustSelect").select2("data")[0]; //单选

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
                // 年代
                proDate: $scope.customCarInfo.proDate,
                // 颜色
                colour: $scope.customCarInfo.colour,
                // 发动机号
                engineNum: $scope.customCarInfo.engineNum,
                // 委托方
                entrustId: entrust.id,
                // 车价(美元)
                valuation: $scope.customCarInfo.valuation,
                // 是否MSO车辆 ： 默认 是MSO车辆
                msoStatus: $scope.msoFlags[1].id
            };

            _basic.post(_host.api_url + "/user/" + userId + "/car", obj).then(function (data) {
                if (data.success) {

                    // 隐藏 新增车辆信息 画面
                    $scope.showCustomCarDiv = false;

                    // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
                    // car id
                    $scope.newCarInfo.car_id = data.id;
                    // 委托方
                    $scope.newCarInfo.entrust_id= entrust.id;
                    $scope.newCarInfo.short_name= entrust.text;
                    // 支付状态
                    $scope.newCarInfo.order_status= 1;
                    // vin
                    $scope.newCarInfo.vin= $scope.customCarInfo.vin;
                    // 制造商
                    $scope.newCarInfo.make_name= $scope.customCarInfo.maker.make_name;
                    // 型号
                    $scope.newCarInfo.model_name= $scope.customCarInfo.model.model_name;
                    // 年代
                    $scope.newCarInfo.pro_date= $scope.customCarInfo.proDate;
                    // 车价(美元)
                    $scope.newCarInfo.valuation= $scope.customCarInfo.valuation;
                    // 运费(美元)
                    $scope.newCarInfo.total_fee = 0;

                    // 将当前的数据追加的列表中。
                    addCar($scope.newCarInfo);

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
     * 关闭追加运载车辆模态画面。
     */
    $scope.closeCustomCarDiv = function () {
        $scope.showCustomCarDiv = false;
        // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
        $scope.customCarInfo = {};
    };

    /**
     * 打开追加【海运费用】模态画面。
     * @param shipTransOrderId 海运订单ID
     * @param pageType 画面区分(新建/编辑)
     */
    $scope.showEditShipFeeDiv = function (shipTransOrderId, pageType) {
        $('.modal').modal();
        $('#editShipFeeDiv').modal('open');

        // 初期化数据
        angular.copy(defaultShipTransFee, $scope.newShipTransFee);
        $scope.newShipTransFee.shipTransOrderId = shipTransOrderId;
        $scope.newShipTransFee.pageType = pageType;

        // 取得海运费用一览
        getShipTransOrderFeeRel(shipTransOrderId);
    };

    /**
     * 取得海运费用一览
     */
    function getShipTransOrderFeeRel(shipTransOrderId) {
        // 检索用url
        var url = _host.api_url + "/shipTransOrderFeeRel?shipTransOrderId=" + shipTransOrderId;

        // 合计费用(美元)
        $scope.newShipTransFee.totalFee = 0;
        var thisFee = 0;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.shipTransOrderFeeRelList = data.result;
                // 计算 合计费用(美元)
                for (var i = 0; i < $scope.shipTransOrderFeeRelList.length; i++) {
                    thisFee = $scope.shipTransOrderFeeRelList[i].pay_money;
                    $scope.newShipTransFee.totalFee = $scope.newShipTransFee.totalFee + thisFee;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 追加海运费用 （画面加号按钮）
     */
    $scope.addShipTransOrderFeeRel = function () {
        if ($scope.newShipTransFee.type !== "" && $scope.newShipTransFee.fee !== "") {
            var obj = {
                payType: $scope.newShipTransFee.type,
                qty: $scope.newShipTransFee.qty,
                payMoney: $scope.newShipTransFee.fee,
                remark: $scope.newShipTransFee.remark
            };

            // 如果数量没有输入，就去掉此属性
            if ($scope.newShipTransFee.qty == null || $scope.newShipTransFee.qty === "") {
                delete obj.qty;
            }

            _basic.post(_host.api_url + "/user/" + userId + "/shipTransOrder/" + $scope.newShipTransFee.shipTransOrderId + "/shipTransOrderFeeRel", obj).then(function (data) {
                if (data.success) {
                    swal("追加成功", "", "success");

                    // 初期化数据
                    $scope.newShipTransFee.type = "";
                    $scope.newShipTransFee.qty = "";
                    $scope.newShipTransFee.fee = "";
                    $scope.newShipTransFee.remark = "";

                    // 取得海运费用一览
                    getShipTransOrderFeeRel($scope.newShipTransFee.shipTransOrderId);
                    // 取得运载车辆详情 （画面下部分）
                    getShipTransCarRel();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整海运费用信息！", "", "warning");
        }
    };

    /**
     * 从列表中，修改指定海运费用
     *
     * @param shipTransFeeInfo 海运费用信息
     */
    $scope.updShipTransOrderFeeRel = function (shipTransFeeInfo) {
        if (shipTransFeeInfo.pay_money !== "") {
            swal({
                    title: "",
                    text: "确认修改？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        var obj = {
                            payType: shipTransFeeInfo.pay_type,
                            qty: shipTransFeeInfo.qty,
                            payMoney: shipTransFeeInfo.pay_money,
                            remark: shipTransFeeInfo.remark
                        };
                        // 如果数量没有输入，就去掉此属性
                        if (shipTransFeeInfo.qty == null || shipTransFeeInfo.qty === "") {
                            delete obj.qty;
                        }
                        // 修改费用
                        var url = _host.api_url + "/user/" + userId + "/shipTransOrderFeeRel/" + shipTransFeeInfo.id;
                        _basic.put(url, obj).then(function (data) {
                            if (data.success) {
                                swal("修改费用成功", "", "success");
                                // 取得海运费用一览
                                getShipTransOrderFeeRel($scope.newShipTransFee.shipTransOrderId);
                                // 取得运载车辆详情 （画面下部分）
                                getShipTransCarRel();
                            } else {
                                swal(data.msg, "", "error");
                            }
                        })
                    } else {
                        swal.close();
                    }
                });
        } else {
            swal("请填写费用金额！", "", "warning");
        }
    };

    /**
     * 从列表中，删除指定海运费用
     *
     * @param shipTransOrderFeeRelId 删除费用ID
     */
    $scope.delShipTransOrderFeeRel = function (shipTransOrderFeeRelId) {
        swal({
                title: "",
                text: "确认删除？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrderFeeRel/" + shipTransOrderFeeRelId, {}).then(
                        function (data) {
                            if (data.success) {
                                swal("删除费用成功", "", "success");
                                // 取得海运费用一览
                                getShipTransOrderFeeRel($scope.newShipTransFee.shipTransOrderId);
                                // 取得运载车辆详情 （画面下部分）
                                getShipTransCarRel();
                            } else {
                                swal(data.msg, "", "error");
                            }
                        });
                } else {
                    swal.close();
                }
            });
    };

    /**
     * 追加运载车辆。
     * @param car 汽车信息
     */
    function addShipTransCarRel(car) {
        var obj = {
            shipTransId: $scope.shipTransId,
            carId: car.car_id,
            vin: car.vin,
            entrustId: car.entrust_id
        };

        _basic.post(_host.api_url + "/user/" + userId + "/shipTransCarRel", obj).then(function (data) {
            if (data.success) {
                swal("运载车辆追加成功！", "", "info");
                // 取得运载车辆详情 （画面下部分）
                getShipTransCarRel();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * 从列表中，删除运载车辆。
     *
     * @param $index 删除车辆的索引
     * @param car 删除车辆的具体信息
     */
    $scope.removeCar = function ($index, car) {

        // // 新关联车辆
        // var newCarFlag = true;
        //
        // // 遍历新增车辆列表
        // for (var i = 0; i < $scope.relShipTransCarList.length; i++) {
        //     var carId = $scope.relShipTransCarList[i].car_id;
        //     if (newCarFlag && carId == car.car_id) {
        //         // 已经存在的车辆
        //         newCarFlag = false;
        //     }
        // }

        // // 新追加的运载车辆
        // if (newCarFlag) {
        //     $scope.shipTransCarList.splice($index, 1);
        // } else {
            swal({
                    title: "",
                    text: "确认删除？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        _basic.delete(_host.api_url + "/user/" + userId + "/shipTrans/" + $scope.shipTransId + '/car/' + car.car_id, {}).then(
                            function (data) {
                                if (data.success === true) {
                                    $scope.shipTransCarList.splice($index, 1);
                                    // 取得运载车辆详情 （画面下部分）
                                    getShipTransCarRel();
                                    swal("删除运载车辆成功", "", "success");
                                }
                                else {
                                    swal(data.msg, "", "error");
                                }
                            });
                    } else {
                        swal.close();
                    }
                });
        // }
        // 计算合计运费
        $scope.calcTotalFees();
    };

    /**
     * 修改海运订单基本信息 （画面保存按钮）
     */
    $scope.saveShipTransOrder = function () {
        if ($scope.shippingOrder.startPortId !== "" && $scope.shippingOrder.endPortId !== ""
            && $scope.shippingOrder.sailingDay !== ""
            && $scope.shippingOrder.shippingCoId !== "" && $scope.shippingOrder.shipName !== ""
            && $scope.shippingOrder.container !== "" && $scope.shippingOrder.booking !== ""
        ) {
            // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
            var obj = {
                startPortId: $scope.shippingOrder.startPortId,
                startPortName: $('#startPortSelect').find("option:selected").text(),
                endPortId: $scope.shippingOrder.endPortId,
                endPortName: $('#endPortSelect').find("option:selected").text(),
                startShipDate: $scope.shippingOrder.sailingDay,
                endShipDate: $scope.shippingOrder.arrivalDay,
                shipCompanyId: $scope.shippingOrder.shippingCoId,
                shipName: $scope.shippingOrder.shipName,
                container: $scope.shippingOrder.container,
                booking: $scope.shippingOrder.booking,
                tab: $scope.shippingOrder.tab,
                partStatus: $scope.shippingOrder.partStatus,
                remark: $scope.shippingOrder.remark
            };

            _basic.put(_host.api_url + "/user/" + userId + "/shipTrans/" + $scope.shipTransId, obj).then(function (data) {
                if (data.success) {
                    swal("修改成功", "", "success");
                    // 取得订舱详情
                    getTransOrderDetails();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整海运订单信息！", "", "warning");
        }
    };

    /**
     * 修改海运订单状态。 (出发 或 送达 按钮动作)
     */
    $scope.changeTransOrderStatus = function (status) {
        var msg = '确认出发？';
        if (status === $scope.shipTransStatus[2].id) {
            msg = '确认送达？';
        }
        swal({
                title: "",
                text: msg,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    // 修改海运订单状态
                    var url = _host.api_url + "/user/" + userId + "/shipTrans/" + $scope.shipTransId + "/shipTransStatus/" + status;

                    _basic.put(url, {}).then(function (data) {
                        if (data.success) {
                            swal("修改成功", "", "success");
                            // 取得订舱详情
                            getTransOrderDetails();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                } else {
                    swal.close();
                }
            });
    };

    /**
     * 计算合计运费。
     */
    $scope.calcTotalFees = function () {
        // 合计
        $scope.shippingOrder.totalShipTransFees = 0;

        // 遍历新增车辆列表
        for (var i = 0; i < $scope.shipTransCarList.length; i++) {
            var fee = $scope.shipTransCarList[i].total_fee;
            // 有运费时，计算合计
            if (fee != undefined && fee != NaN && fee != null && fee != "") {
                $scope.shippingOrder.totalShipTransFees = $scope.shippingOrder.totalShipTransFees + parseFloat(fee);
            }
        }
    };

    /**
     * 【委托方】列表查询
     */
    function getEntrustInfo() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success) {
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 取得【港口】列表
        getPortList();
        // 取得【船公司】列表
        getShippingCoList();
        // 取得【车辆品牌】列表
        getCarMakerList();
        // 取得订舱详情
        getTransOrderDetails();
    }
    initData();
}]);

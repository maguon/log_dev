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
    // 颜色 列表
    $scope.configColor = _config.config_color;

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
        createdOn: "",
        // VIN（单纯画面使用）
        vin: "",
        // 运费合计（单纯画面使用）
        totalShipTransFees: 0
    };

    // 海运订舱管理，订舱详情 运载车辆列表
    $scope.shipTransCarList = [];
    // 海运订舱管理，订舱详情 运载车辆列表(已关联，用来check)
    $scope.relShipTransCarList = [];

    // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
    $scope.customCarInfo = {
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
        entrust: "",
        // 车价(美元)
        valuation: ""
    };


    // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
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
        // 生产日期
        pro_date: "",
        // 车价(美元)
        valuation: "",
        // 运费(美元)
        ship_trans_fee: 0
    };


    /**
     * 返回到前画面（海运 订舱管理）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
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
                $scope.shippingOrder.sailingDay = $filter("date")(data.result[0].start_ship_date, 'yyyy-MM-dd');
                // 到港日期
                $scope.shippingOrder.arrivalDay = $filter("date")(data.result[0].end_ship_date, 'yyyy-MM-dd');
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
                $scope.shippingOrder.partStatus = data.result[0].part_status;

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
                angular.copy(data.result, $scope.relShipTransCarList);
                $scope.calcTotalFees();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /***************************************************************************************************************/


    /**
     * 点击 vin码 后的 追加按钮。(打开追加画面 或追加列表数据)
     */
    $scope.addCarInfo = function () {
        //
        if ($scope.shippingOrder.vin.length > 17) {
            // TODO 追加check 判断 是否有重复的数据在
            var url = _host.api_url + "/user/" + userId + "/car?vin=" + $scope.shippingOrder.vin.substr(0, 17);
            console.log(url);

            _basic.get(url).then(function (data) {
                if (data.success) {
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
                    // 生产日期
                    $scope.newCarInfo.pro_date = data.result[0].pro_date;
                    // 车价(美元)
                    $scope.newCarInfo.valuation = data.result[0].valuation;
                    // 运费(美元)
                    $scope.newCarInfo.ship_trans_fee = '';

                    addCar($scope.newCarInfo);
                    $scope.showCarListDiv = true;
                } else {
                    swal(data.msg, "", "error");
                }
            });

        } else if ($scope.shippingOrder.vin.length == 17) {
            // 自定义车辆 画面 VIN码 不可变项目
            $scope.customCarInfo.vin = $scope.shippingOrder.vin;
            // 数据初始化
            // 委托方select2初期化
            $("#addEntrustSelect").val(null).trigger("change");
            getEntrustInfo();

            // 显示追加画面
            $scope.showCustomCarDiv = true;

        } else {

        }

        // 清空VIN输入框
        $scope.shippingOrder.vin = '';
        // 使追加按钮灰掉
        $scope.addCarInfoFlg = false;
    };


    function addCar(carInfo) {
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

    /**
     * 追加自定义car信息。 TODO
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
     * 关闭追加运载车辆模态画面。 TODO
     */
    $scope.closeCustomCarDiv = function () {
        $scope.showCustomCarDiv = false;
        // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
        $scope.customCarInfo = {};
    };

    /**
     * 点击每个运载车辆中，运费后 的按钮。(运载车辆 或 修改运费)
     */
    $scope.modifyCarInfo = function (car) {

        if (car.ship_trans_fee !== "") {
            // 新关联车辆
            var newCarFlag = true;
            // 判定是否是新追加的关联车辆
            for (var i = 0; i < $scope.relShipTransCarList.length; i++) {
                var carId = $scope.relShipTransCarList[i].car_id;
                console.log(carId);
                console.log(car.car_id);
                if (carId == car.car_id) {
                    newCarFlag = false;
                    break;
                }
            }

            console.log('newCarFlag is : ' + newCarFlag);
            // 新追加的运载车辆，追加关联运载车辆
            if (newCarFlag) {
                var obj = {
                    //
                    shipTransId: $scope.shipTransId,
                    carId: car.car_id,
                    entrustId: car.entrust_id,
                    shipTransFee: car.ship_trans_fee
                };

                console.log(obj);
                _basic.post(_host.api_url + "/user/" + userId + "/shipTransCarRel", obj).then(function (data) {
                    if (data.success) {
                        // 取得运载车辆详情 （画面下部分）
                        getShipTransCarRel();
                        car.id = data.result[0].id;
                        $scope.relShipTransCarList.push(angular.copy(car));
                        swal("运载车辆追加成功！", "", "info");
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {
                // 已存在的运载车辆，修改价格
                // 修改运费
                var url = _host.api_url + "/user/" + userId + "/car/" + car.car_id + "/ShipTransOrderFee";

                _basic.put(url, {shipTransFee: car.ship_trans_fee}).then(function (data) {
                    if (data.success) {
                        swal("修改运费成功", "", "success");
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        } else {
            swal("请填写运费信息！", "", "warning");
        }
    };

    /**
     * 从列表中，删除运载车辆。
     *
     * @param $index 删除车辆的索引
     * @param car 删除车辆的具体信息
     */
    $scope.removeCar = function ($index, car) {

        // 是否分单, 默认 分单：否
        $scope.shippingOrder.partStatus = "1";
        // 新关联车辆
        var newCarFlag = true;

        var hasError = false;
        // 遍历新增车辆列表
        for (var i = 0; i < $scope.shipTransCarList.length; i++) {
            var entrustId = $scope.shipTransCarList[i].entrust_id;
            var carId = $scope.relShipTransCarList[i].car_id;
            if (newCarFlag && carId == car.car_id) {
                // 已经存在的车辆
                newCarFlag = false;
            }

            // 分单：否 时，进行判定
            if ($scope.shippingOrder.partStatus == "1" && entrustId != carInfo.entrustId) {
                // 委托人不同，分单：是
                $scope.shippingOrder.partStatus = "2";
            }
        }

        // 新追加的运载车辆
        if (newCarFlag) {
            $scope.shipTransCarList.splice($index, 1);
        } else {
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
        }

        // 计算合计运费
        $scope.calcTotalFees();
    };

    $scope.changeVin = function () {
        var url = _host.api_url + "/carList?vinCode=" + $scope.shippingOrder.vin;
        // console.log($scope.demand_vin);

        if ($scope.shippingOrder.vin != undefined) {
            console.log($scope.shippingOrder.vin);


            $scope.addCarInfoFlg = false;

            if ($scope.shippingOrder.vin.length >= 6) {
                _basic.get(url).then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.carList = data.result;
                        vinObjs = {};
                        for (var i in $scope.carList) {
                            // vinObjs[$scope.carList[i].vin] = null;
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
                            console.log(vinObjs);

                            $scope.addCarInfoFlg = true;
                            // $scope.shippingOrder.vin = val;
                        },
                        // limit: 6
                    });
                    $('#vinInput').focus();
                })
            } else {
                // $('#vinInput').autocomplete({minLength: 6});
                console.log('else');

                // vinObjs = {};
                //
                // $('#vinInput').autocomplete('updateData', {});
                //
                // $scope.carList=[];
            }


            // // 根据填充完毕的完整vin码信息进行精确查询
            // if ($scope.shippingOrder.vin.length === 17) {
            //     $scope.addCarInfoFlg = true;
            // } else {
            //     $scope.addCarInfoFlg = false;
            // }
        }
    };

    /**
     * 修改海运订单基本信息 （画面保存按钮）
     */
    $scope.saveShipTransOrder = function () {

        if ($scope.shipTransCarList.length == 0) {
            swal("请填写完整海运订单信息！", "", "warning");
        }

        if ($scope.shippingOrder.startPort !== "" && $scope.shippingOrder.endPort !== ""
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

            console.log(obj);
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
        console.log('changeTransOrderStatus status is : ' + status);

        var msg = '确认出发？';
        if (status == $scope.orderStatus[2].id) {
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

                    console.log(url);

                    _basic.put(url, {}).then(function (data) {
                        console.log(data.success);
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
            var fee = $scope.shipTransCarList[i].ship_trans_fee;
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

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
    // 颜色列表
    $scope.configColor = _config.config_color;

    // 订单信息：修改价格画面用
    $scope.newShippingOrder = {
        // 始发港口
        startPort: "",
        // 目的港口
        endPortId: "",
        // 开船日期
        sailingDay: "",
        // 到港日期
        arrivalDay: "",
        // 船公司
        shippingCoId: "",
        // 船名
        shipName: "",
        // 货柜
        container: "",
        // booking
        booking: "",
        // 封签
        tab: "",
        // VIN（单纯画面使用）
        vin: "",
        // 分单
        partStatus: "1",
        // 运费合计（单纯画面使用）
        totalShipTransFees: 0,
        // 订舱备注
        remark: ""
    };

    // 新增海运订单画面 VIN码 查询结果
    $scope.carList = [];

    // 新增海运订单画面 VIN码 后 追加按钮 追加结果List
    $scope.newCarList = [];

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
        entrustId: 0,
        entrustNm: "",
        // 车价(美元)
        valuation: ""
    };

    // 新增海运订单画面 VIN码 尾部 对应追加（新增车辆信息画面）
    $scope.showCustomCarDiv = false;


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
     *
     */
    $scope.openSeaTransportOrderDiv = function () {
        $('.modal').modal();
        $('#newSeaTransportOrderDiv').modal('open');
        getCarMakerList();

        $scope.newCarList = [];

        // 实际应付
        // $scope.modifyActualFee = $filter('number')($scope.orderInfo.actualFee,2);
        // $scope.modifyActualFee = $scope.orderInfo.actualFee.toFixed(2);


        // $('#autocomplete-input').autocomplete('onSelected()');
        // instance.selectOption(el);
    };


    $scope.closeCustomCarDiv = function () {
        $scope.showCustomCarDiv = false;
        // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
        $scope.customCarInfo = {};
    };

    /**
     * 打开xxxxxx模态窗口。
     */
    $scope.addCarInfo = function () {


        console.log($scope.newShippingOrder.vin);

        //
        if ($scope.newShippingOrder.vin.length > 17 ) {
            // TODO 追加check 判断 是否有重复的数据在
            var url = _host.api_url + "/user/" + userId + "/car?vin=" + $scope.newShippingOrder.vin.substr(0,17);
            console.log(url);

            _basic.get(url).then(function (data) {
                if (data.success) {
                    console.log('------------------');
                    $scope.newCarInfo.carId = data.result[0].id;
                    $scope.newCarInfo.vin = data.result[0].vin;
                    $scope.newCarInfo.maker = {id:data.result[0].make_id,make_name:data.result[0].make_name};
                    $scope.newCarInfo.model = {id:data.result[0].model_id,model_name:data.result[0].model_name};
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
            $scope.getEntrustInfo();

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


        // $('#autocomplete-input').autocomplete('onSelected()');
        // instance.selectOption(el);
    };

    // $scope.data={};


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

            $scope.showCustomCarDiv = false;
            $scope.showCarListDiv = true;
            // 将当前的数据追加的列表中。
            $scope.customCarInfo.entrustNm = entrust.text;
            addCar($scope.customCarInfo);
            //
            // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
            $scope.customCarInfo = {
                vin: "",
                maker: "",
                model: "",
                proDate: "",
                colour: "",
                engineNum: "",
                entrustId: 0,
                entrustNm: "",
                valuation: ""
            };

            console.log(obj);
            // _basic.post(_host.api_url + "/user/" + userId + "/car", obj).then(function (data) {
            //     if (data.success) {
            //         // 成功后，刷新页面数据 TODO
            //         // $scope.lookRelatedOrder();
            //     } else {
            //         swal(data.msg, "", "error");
            //     }
            // })
        }
        else {
            swal("请填写完整车辆信息！", "", "warning");
        }
    };


    $scope.createShipTransOrder = function (id) {
        var entrust = $("#addEntrustSelect").select2("data")[0]; //单选

        console.log($scope.newCarInfo.maker);

        if ($scope.newCarInfo.maker !== "" && $scope.newCarInfo.model !== ""
            && $scope.newCarInfo.proDate !== "" && $scope.newCarInfo.colour !== ""
            && $scope.newCarInfo.engineNum !== "" && entrust.id !== "" && $scope.newCarInfo.valuation !== "") {

            // 新增海运订单画面 VIN码 后 追加按钮 追加结果Info
            var obj = {
                startPortId: $scope.newShippingOrder.startPort.id,
                startPortName: $scope.newShippingOrder.startPort.port_name,
                endPortId: $scope.newShippingOrder.endPortId.id,
                endPortName: $scope.newShippingOrder.endPortId.port_name,
                startShipDate: $scope.newShippingOrder.sailingDay,
                endShipDate: $scope.newShippingOrder.arrivalDay,
                shipCompanyId: $scope.newShippingOrder.shippingCoId,
                shipName: $scope.newShippingOrder.shipName,
                container: $scope.newShippingOrder.container,
                booking: $scope.newShippingOrder.booking,
                tab: $scope.newShippingOrder.tab,
                partStatus: $scope.newShippingOrder.partStatus,
                remark: $scope.newShippingOrder.remark,
                carIds: 0,
                shipTransFees: 0
            };


            $scope.showCustomCarDiv = false;
            $scope.showCarListDiv = true;

            console.log(obj);
            _basic.post(_host.api_url + "/user/" + userId + "/car", obj).then(function (data) {
                if (data.success) {
                    // 成功后，刷新页面数据 TODO
                    // $scope.lookRelatedOrder();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整车辆信息！", "", "warning");
        }


    };

    $scope.removeCar = function ($index) {
        console.log("$index is : " + $index);

        console.log("old" + JSON.stringify($scope.newCarList));
        $scope.newCarList.splice($index, 1);
        console.log("new" + JSON.stringify($scope.newCarList));

        // 计算合计运费
        $scope.calcTotalFees();
        // ['a','b']
        // for (var i = 0; i < $scope.newCarList.length; i++) {
        //
        // }
        // ['a',,'b'].filter(x => true);
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
                        vinObjs = [];
                        for (var i in $scope.carList) {
                            vinObjs[$scope.carList[i].vin + "  " + $scope.carList[i].make_name + "/" + $scope.carList[i].model_name + "  委托方：" + $scope.carList[i].entrust_id] = null;
                        }
                        return vinObjs;
                    } else {
                        return {};
                    }
                }).then(function (vinObjs) {
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6,
                        onAutocomplete: function (val) {
                            $scope.addCarInfoFlg = true;
                            // $scope.newShippingOrder.vin = val;
                        },
                        // limit: 6
                    });
                    $('#autocomplete-input').focus();
                })
            } else {
                console.log('else');
                //
                // $('#autocomplete-input').autocomplete('updateData', {});
                //
                // $scope.carList=[];
            }


            // 根据填充完毕的完整vin码信息进行精确查询
            if ($scope.newShippingOrder.vin.length == 17) {
                $scope.addCarInfoFlg = true;
            } else {
                $scope.addCarInfoFlg = false;
            }
        }
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

    //获取委托方信息
    $scope.getEntrustInfo = function () {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                // $("#addEntrustSelect").select2({
                //     placeholder: '委托方',
                //     containerCssClass: 'select2_dropdown',
                //     allowClear: true
                // }).on("select2:unselecting", function(e) {
                //     console.log('unselecting');
                //     $(this).data('state', 'unselected');
                // }).on("select2:open", function(e) {
                //     console.log('open');
                //     if ($(this).data('state') === 'unselected') {
                //         $(this).removeData('state');
                //         var self = $(this);
                //         setTimeout(function() {
                //             self.select2('close');
                //         }, 1);
                //     }
                // });
            }
        });
    };

    function addCar(carInfo) {

        // 是否分单, 默认 分单：否
        $scope.newShippingOrder.partStatus = "1";

        var hasError = false;
        // 遍历新增车辆列表
        for (var i = 0; i < $scope.newCarList.length; i++) {
            var vin = $scope.newCarList[i].vin;
            var entrustId = $scope.newCarList[i].entrust_id;
            // 已经追加过
            if (vin == carInfo.vin) {
                hasError = true;
            }

            // 分单：否 时，进行判定
            if ($scope.newShippingOrder.partStatus == "1") {
                if (entrustId != carInfo.entrustId) {
                    // 委托人不同，分单：是
                    $scope.newShippingOrder.partStatus = "2";
                }
            }
        }
        if (hasError) {
            swal("不能重复添加相同车辆！", "", "warning");
        } else {
            $scope.newCarList.push(angular.copy(carInfo));
        }
    }

    /**
     * 去除当前索引的car信息。
     * @param $index
     */
    $scope.removeCar = function ($index) {
        // 删除
        $scope.newCarList.splice($index, 1);

        // 计算合计运费
        $scope.calcTotalFees();
    };

    /**
     * 计算合计运费。
     */
    $scope.calcTotalFees = function () {
        // 合计
        $scope.newShippingOrder.totalShipTransFees = 0;

        // 遍历新增车辆列表
        for (var i = 0; i < $scope.newCarList.length; i++) {
            var fee = $scope.newCarList[i].shipTransFees;
            // 有运费时，计算合计
            if (fee != undefined && fee != NaN && fee != null && fee != "") {
                $scope.newShippingOrder.totalShipTransFees = $scope.newShippingOrder.totalShipTransFees + parseFloat(fee);
            }
        }
    };

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


/**
 * 主菜单：财务管理 -> 金融贷出(详细) 控制器
 */
app.controller("finance_loan_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state", function ($scope, $stateParams, _basic, _host, _config, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 贷款编号
    var loanId = $stateParams.id;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 抵押状态
    $scope.mortgageStatus = _config.mortgageStatus;
    // 金融贷出(订单) 状态
    $scope.loanStatus = _config.loanStatus;
    // 颜色列表
    $scope.configColor = _config.config_color;
    // 是否MSO车辆
    $scope.msoFlags = _config.msoFlags;
    // 是否金融车 列表
    $scope.purchaseTypes = _config.purchaseTypes;

    // 金融贷出(TAB1) 订单 基本信息
    $scope.loanInfo = {};

    // 抵押车辆(TAB2) 抵押总金额(美元)
    $scope.totalMortgageMoney = 0;

    // 购买车辆(TAB3) 基本信息
    $scope.buyingCar = {};

    // 购买车辆(TAB3) 新增金融车画面
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
        valuation: "",
        // MSO
        mso: ""
    };

    // 还款记录(TAB4) 基本信息
    $scope.paymentInfo = {};

    // 还款记录(TAB4) 新增还款 基本信息
    $scope.newPayment = {};

    // 还款记录(TAB4) 新增还款 基本信息(默认数据)
    $scope.newPayment = {
        // 本次还贷金额(美元)
        paymentMoney: "",
        // 利率
        rate: "",
        // 产生利息金额(美元)
        principal: "",
        // 产生利息时长
        interestDay: "",
        // 利息
        interest: "",
        // 手续费
        poundage: "",
        // 利率
        paymentMoney: "",
        // 利率
        paymentMoney: ""

    };

    /***************************************************************************/

    // 支付状态
    $scope.paymentStatusList = _config.paymentStatus;
    // 支付方式
    $scope.paymentTypeList = _config.paymentType;


    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_loan_detail"}, {reload: true})
    };

    /**
     * Tab跳转 1:贷出信息
     */
    $scope.lookLoanInfo = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookLoanFinfoDiv').addClass("active");
        $("#lookLoanFinfoDiv").addClass("active");
        $("#lookLoanFinfoDiv").show();

        // 取得订单详情
        getLoanInfo();
    };

    /**
     * 取得贷出信息详情。
     */
    function getLoanInfo() {
        // 检索用url
        var url = _host.api_url + "/loan?loanId=" + loanId;
        _basic.get(url).then(function (data) {
            if (data.success) {

                if (data.result.length == 0) {
                    return;
                }

                // 订单是已支付时，取得支付详情 TODO
                if (data.result[0].order_status == 2) {
                    // getPaymentDetails();
                }

                // 贷出编号
                $scope.loanInfo.id = loanId;
                // 贷出订单 状态
                $scope.loanInfo.loanStatus = data.result[0].loan_status;

                // 委托方性质
                $scope.loanInfo.entrustType = data.result[0].entrust_type;
                // 委托方
                $scope.loanInfo.entrustId = data.result[0].entrust_id;
                $scope.loanInfo.entrustName = data.result[0].short_name == null ? '未知' : data.result[0].short_name;
                // 贷出时间
                $scope.loanInfo.createdOn = data.result[0].created_on;

                // 定金
                $scope.loanInfo.deposit = data.result[0].deposit == null ? 0 : data.result[0].deposit;
                // 贷出金额
                $scope.loanInfo.loanMoney = data.result[0].loan_money == null ? 0 : data.result[0].loan_money;
                $("#depositLabel").addClass("active");
                $("#loanMoneyLabel").addClass("active");

                // 备注
                $scope.loanInfo.remark = data.result[0].remark;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 修改贷出信息。
     * */
    $scope.updateFinanceLoan = function () {
        var obj = {
            // 委托方
            entrustId: $scope.loanInfo.entrustId,
            // 定金
            deposit: $scope.loanInfo.deposit === "" ? 0 : $scope.loanInfo.deposit,
            // 贷出金额
            loanMoney: $scope.loanInfo.loanMoney === "" ? 0 : $scope.loanInfo.loanMoney,
            // 备注
            remark: $scope.loanInfo.remark
        };
        _basic.put(_host.api_url + "/user/" + userId + "/loan/" + loanId, obj).then(function (data) {
            if (data.success) {
                swal("修改成功", "", "success");
                // 默认显示 贷出信息 TAB
                $scope.lookLoanInfo();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * Tab跳转 2: 抵押车辆
     */
    $scope.lookMortgageCar = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookMortgageCar').addClass("active");
        $("#lookMortgageCar").addClass("active");
        $("#lookMortgageCar").show();

        // 取得 左侧 委托方拥有车辆 列表
        _basic.get(_host.api_url + "/user/" + userId + "/car?relStatus=1&entrustId=" + $scope.loanInfo.entrustId).then(function (data) {
            if (data.success) {
                $scope.entrustCarList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 取得 右侧关联列表
        var url = _host.api_url + "/loanMortgageCarRel?loanId=" + loanId;
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                // 本次贷款抵押车辆列表
                $scope.mortgageCarRelList = data.result;
                // 抵押总金额
                $scope.totalMortgageMoney = 0;
                // 计算抵押总金额
                for (var i = 0; i < $scope.mortgageCarRelList.length; i++) {
                    if ($scope.mortgageCarRelList[i].valuation == null) {
                        $scope.mortgageCarRelList[i].valuation = 0;
                    }
                    $scope.totalMortgageMoney = $scope.mortgageCarRelList[i].valuation + $scope.totalMortgageMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 添加贷款抵押车辆信息。
     * @param carId 汽车ID
     */
    $scope.addMortgageCarRel = function (carId) {
        // 追加画面数据
        var obj = {
            loanId: loanId,
            carId: carId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/loanMortgageCarRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookMortgageCar();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 删除贷款抵押车辆信息。
     * @param carId 汽车ID
     */
    $scope.deleteMortgageCarRel = function (carId) {
        swal({
                title: "确定要移除当前抵押车辆与该次贷出订单的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/loan/" + loanId + '/car/' + carId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookMortgageCar();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * Tab跳转 3: 购买车辆
     */
    $scope.lookBuyingCars = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookBuyingCars').addClass("active");
        $("#lookBuyingCars").addClass("active");
        $("#lookBuyingCars").show();

        // 取得 该贷款 购买的金融车列表
        _basic.get(_host.api_url + "/loanBuyCarRel?loanId=" + loanId).then(function (data) {
            if (data.success) {
                // 购买车辆 列表
                $scope.buyingCarList = data.result;
                // 购买车辆 数量
                $scope.buyingCar.carLength = data.result.length;
                // 车价总额
                $scope.buyingCar.totalMoney = 0;

                // 计算抵押总金额
                for (var i = 0; i < $scope.buyingCarList.length; i++) {
                    if ($scope.buyingCarList[i].valuation == null) {
                        $scope.buyingCarList[i].valuation = 0;
                    }
                    $scope.buyingCar.totalMoney = $scope.buyingCarList[i].valuation + $scope.buyingCar.totalMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 画面vin码 输入框 变更时，触发方法
     */
    $scope.changeVin = function () {

        if ($scope.buyingCar.vin !== undefined) {
            if ($scope.buyingCar.vin.length >= 6) {

                // 条件【purchaseType=1】金融车
                _basic.get(_host.api_url + "/carList?purchaseType=1&vinCode=" + $scope.buyingCar.vin).then(function (data) {
                    if (data.success && data.result.length > 0) {
                        $scope.carList = data.result;
                        vinObjs = [];
                        for (var i in $scope.carList) {
                            vinObjs[$scope.carList[i].vin + "  " + $scope.carList[i].make_name + "/" + $scope.carList[i].model_name] = null;
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
                        },
                        limit: 6
                    });
                    $('#autocomplete-input').focus();
                    if ($scope.buyingCar.vin.length > 17 && $scope.addCarInfoFlg) {
                        $scope.addCarInfo();
                    }
                })
            }

            $scope.addCarInfoFlg = false;
            // 根据填充完毕的完整vin码信息进行精确查询
            if ($scope.buyingCar.vin.length === 17) {
                $scope.addCarInfoFlg = true;
            }
        }
    };

    /**
     * 点击 vin码 后的 追加按钮。(打开追加画面 或 执行追加关联列表数据)
     */
    $scope.addCarInfo = function () {

        // 新追加的车辆VIN码
        var newVin = $scope.buyingCar.vin;

        // 如果是从自动填充中，选择出来的话，需要截取前面17位
        if (newVin.length > 17) {
            newVin = newVin.substr(0, 17);
        }

        var url = _host.api_url + "/user/" + userId + "/car?vin=" + newVin;

        _basic.get(url).then(function (data) {
            if (data.success) {
                // 新的vin码，(不存在的车辆)，打开新建画面
                if (data.result.length === 0) {
                    // 自定义车辆 画面 VIN码 不可变项目
                    $scope.customCarInfo.vin = newVin;

                    // 显示追加画面
                    $scope.showCustomCarDiv = true;
                } else {
                    if (data.result[0].purchase_type === 1) {
                        // 添加购买车辆信息。
                        $scope.addBuyingCarRel(data.result[0].id);
                    } else {
                        swal("该VIN码车辆已存在，请输入正确的新车VIN码。", "", "error");
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 清空VIN输入框
        $scope.buyingCar.vin = '';
        // 使追加按钮灰掉
        $scope.addCarInfoFlg = false;
    };

    /**
     * 追加自定义car信息。
     */
    $scope.createCustomCar = function () {
        if ($scope.customCarInfo.maker !== "" && $scope.customCarInfo.model !== ""
            && $scope.customCarInfo.valuation !== ""  && $scope.customCarInfo.msoStatus) {
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
                entrustId: $scope.loanInfo.entrustId,
                // 车价(美元)
                valuation: $scope.customCarInfo.valuation,
                // 是否MSO车辆
                msoStatus: $scope.customCarInfo.msoStatus,
                // 是否金融车
                purchaseType: $scope.purchaseTypes[1].id,
                // 备注
                remark: $scope.customCarInfo.remark
            };

            // 如果生产日期没有输入，就去掉此属性
            if ($scope.customCarInfo.proDate == null || $scope.customCarInfo.proDate === "") {
                delete obj.proDate;
            }

            _basic.post(_host.api_url + "/user/" + userId + "/car", obj).then(function (data) {
                if (data.success) {

                    // 隐藏 新增车辆信息 画面
                    $scope.showCustomCarDiv = false;
                    // 清空 新增金融车画面 数据
                    $scope.customCarInfo = {};

                    // 成功后，追加关联信息
                    $scope.addBuyingCarRel(data.id);
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
     * 添加购买车辆信息。
     * @param carId 汽车ID
     */
    $scope.addBuyingCarRel = function (carId) {
        // 追加画面数据
        var obj = {
            loanId: loanId,
            carId: carId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/loanBuyCarRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookBuyingCars();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 删除购买车辆信息。
     * @param carId 汽车ID
     */
    $scope.deleteBuyingCarRel = function (carId) {
        swal({
                title: "确定要移除当前购买车辆与该次贷出订单的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/loan/" + loanId + '/car/' + carId + '/loanBuyCarRel', {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookBuyingCars();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /*********************************************************************************************/

    /**
     * Tab跳转 4: 还款记录
     */
    $scope.lookPaymentHistory = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookPaymentHistory').addClass("active");
        $("#lookPaymentHistory").addClass("active");
        $("#lookPaymentHistory").show();

        // TODO
        // 基本信息 合计归还本金(美元)
        $scope.paymentInfo.paymentMoney = 10000;
        // 基本信息 合计利息(美元)
        $scope.paymentInfo.totalInterest = 100;
        // 基本信息 合计手续费(美元)
        $scope.paymentInfo.paymentPoundage = 100;
        // 基本信息 未还金额(美元)
        $scope.paymentInfo.leftPaymentMoney = 530.33;
        // 基本信息 起始时间
        $scope.paymentInfo.startDay = 0;
        // 基本信息 产生利息时长
        $scope.paymentInfo.interestDay = 10;



        // // 取得 左侧一览 未完结
        // _basic.get(_host.api_url + "/shipTransOrder?entrustId=" + $scope.storagePaymentArray.entrust_id + '&orderStatus=' + $scope.paymentStatusList[0].id).then(function (data) {
        //     if (data.success == true) {
        //         $scope.shipTransOrderList = data.result;
        //     } else {
        //         swal(data.msg, "", "error");
        //     }
        // });
        //
        // // 取得 右侧，已关联
        // var url = _host.api_url + "/shipTransOrderPaymentRel?loanId=" + loanId;
        // _basic.get(url).then(function (data) {
        //     if (data.success == true) {
        //         $scope.shipTransOrderRelList = data.result;
        //         $scope.totalShipTransMoney = 0;
        //         for (var i = 0; i < $scope.shipTransOrderRelList.length; i++) {
        //             if ($scope.shipTransOrderRelList[i].ship_trans_fee == null) {
        //                 $scope.shipTransOrderRelList[i].ship_trans_fee = 0;
        //             }
        //             $scope.totalShipTransMoney = $scope.shipTransOrderRelList[i].ship_trans_fee + $scope.totalShipTransMoney;
        //         }
        //     } else {
        //         swal(data.msg, "", "error");
        //     }
        // });
    };

    /**
     * 打开【新增金融贷出】模态画面。
     */
    $scope.openNewFinanceLoanPaymentDiv = function () {
        $('.modal').modal();
        $('#newFinanceLoanPaymentDiv').modal('open');
        // // 激活定金label状态
        // $('#earnestMoneyLabel').addClass('active');
        // 初始数据
        // angular.copy($scope.newLoanInfo, $scope.loanInfo);
        // // 获取委托方信息
        // $scope.getEntrustInfo();

        $scope.lookPaymentInfo();
    };

    /**
     * Tab跳转 贷出信息
     */
    $scope.lookPaymentInfo = function () {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .paymentInfoDiv').addClass("active");
        $("#paymentInfoDiv").addClass("active");
        $("#paymentInfoDiv").show();


        // 本次还贷金额(美元)
        $scope.newPayment.paymentMoney = "";
        // 利率
        $scope.newPayment.rate = 0;
        // 产生利息金额(美元)
        $scope.newPayment.principal = $scope.paymentInfo.leftPaymentMoney;
        // 产生利息时长(天)
        $scope.newPayment.interestDay = $scope.paymentInfo.interestDay;
        // 利息(美元)
        $scope.newPayment.interest = 0;
        // 手续费(美元)
        $scope.newPayment.poundage = "";
        $("#rateLabel").addClass("active");
        $("#interestLabel").addClass("active");
        // 本次应还总金额(美元)
        $scope.newPayment.totalPaymentMoney = "";
        // 剩余未还金额(美元)
        $scope.newPayment.leftPaymentMoney = "";
    };

    /**
     * Tab跳转 贷出信息
     */
    $scope.lookCreditPayment = function () {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .creditPaymentDiv').addClass("active");
        $("#creditPaymentDiv").addClass("active");
        $("#creditPaymentDiv").show();

    };

    /**
     * Tab跳转 贷出信息
     */
    $scope.lookOtherPayment = function () {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .otherPaymentDiv').addClass("active");
        $("#otherPaymentDiv").addClass("active");
        $("#otherPaymentDiv").show();

    };


    /**
     * 利息计算用方法。
     */
    $scope.calculateInterest = function () {
        if ($scope.newPayment.rate === "" || $scope.newPayment.principal === "") {
            $scope.newPayment.interest = 0;
        } else {
            $scope.newPayment.interest = $scope.newPayment.rate * $scope.newPayment.principal * $scope.newPayment.interestDay / 100;
            $scope.newPayment.interest = $scope.newPayment.interest.toFixed(2);
        }

        // 计算 本次应还总金额/剩余未还金额
        $scope.calculatePaymentMoney();
    };

    /**
     * 本次应还总金额/剩余未还金额 计算用方法。
     */
    $scope.calculatePaymentMoney = function () {
        // 手续费
        var poundage = 0;
        if ($scope.newPayment.poundage !== "") {
            poundage = parseFloat($scope.newPayment.poundage);
        }

        // 本次还贷金额
        if ($scope.newPayment.paymentMoney === "") {
            $scope.newPayment.totalPaymentMoney = "";
        } else {
            // 本次应还总金额 = 本次还贷金额 + 利息 + 手续费
            $scope.newPayment.totalPaymentMoney = parseFloat($scope.newPayment.paymentMoney) + parseFloat($scope.newPayment.interest) + poundage;
            $scope.newPayment.totalPaymentMoney = $scope.newPayment.totalPaymentMoney.toFixed(2);
            $scope.newPayment.leftPaymentMoney = parseFloat($scope.paymentInfo.leftPaymentMoney) - parseFloat($scope.newPayment.paymentMoney);
            $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney.toFixed(2);
        }
    };






    /**
     * *
     * 添加海运关联
     * */
    $scope.addShipTransOderRel = function (shipTransOrderId) {
        // 追加画面数据
        var obj = {
            shipTransOrderId: shipTransOrderId,
            loanId: loanId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/shipTransOrderPaymentRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookPaymentHistory();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * *
     * 删除海运关联
     * */
    $scope.deleteShipTransOderRel = function (shipTransOrderId) {
        swal({
                title: "确定要移除当前订单与该次支付的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrder/" + shipTransOrderId + '/orderPayment/' + loanId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookPaymentHistory();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };


    /**
     * 点击完结
     * */
    $scope.updatePaymentStatus = function () {
        swal({
                title: "确定支付完结吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                // 修改状态为已完结【2：已完结】
                var url = _host.api_url + "/user/" + userId + "/orderPayment/" + loanId + "/paymentStatus/" + $scope.paymentStatusList[1].id;
                _basic.put(url, {}).then(function (data) {
                    if (data.success == true) {
                        getBaseInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /*********************************************************************************************/

    /**
     * 车辆品牌列表查询，用来填充查询条件：车辆品牌
     */
    function getCarMakerList() {
        _basic.get(_host.api_url + "/carMake").then(function (data) {
            if (data.success && data.result.length > 0) {
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
            if ($scope.curruntId === val) {
            } else {
                $scope.curruntId = val;
                _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success && data.result.length > 0) {
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
        // 取得 车辆品牌列表
        getCarMakerList();
        // 默认显示 贷出信息 TAB
        $scope.lookLoanInfo();
    };
    $scope.initData();
}]);
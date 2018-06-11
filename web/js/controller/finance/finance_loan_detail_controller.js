/**
 * 主菜单：财务管理 -> 金融贷出(详细) 控制器
 */
app.controller("finance_loan_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state","_baseService", function ($scope, $stateParams, _basic, _host, _config, $state,_baseService) {
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
    // 支付状态
    $scope.paymentStatus = _config.paymentStatus;
    // 支付方式
    $scope.paymentType = _config.paymentType;

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
        // 年份
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

    // 还款记录(TAB4) 新增还款 信用证还款
    $scope.creditPayment = {};

    // 还款记录(TAB4) 新增还款 其他方式还款
    $scope.otherPayment = {};

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

                if (data.result.length === 0) {
                    return;
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
                $scope.loanInfo.loanStartDate = data.result[0].loan_start_date;

                // 定金
                $scope.loanInfo.deposit = data.result[0].deposit == null ? 0 : data.result[0].deposit;
                // 贷出金额
                $scope.loanInfo.loanMoney = data.result[0].loan_money == null ? 0 : data.result[0].loan_money;
                $("#depositLabel").addClass("active");
                $("#loanMoneyLabel").addClass("active");

                // 备注
                $scope.loanInfo.remark = data.result[0].remark;

                // textarea 高度调整
                $('#loadRemarkText').val($scope.loanInfo.remark);
                $('#loadRemarkText').trigger('autoresize');

                // 未还金额(美元)
                $scope.loanInfo.notRepaymentMoney = data.result[0].not_repayment_money;

                // TAB 还款记录 用画面基本数据

                // 基本信息 未还金额(美元)
                $scope.paymentInfo.leftPaymentMoney = $scope.loanInfo.notRepaymentMoney;
                // 基本信息 起始时间
                $scope.paymentInfo.loanStartDate = $scope.loanInfo.loanStartDate;

                // 当前 日期
                var now = moment(new Date()).format('YYYY-MM-DD');
                // 利息起算 日期
                var loanStartDate = moment($scope.paymentInfo.loanStartDate).format("YYYY-MM-DD");

                // 基本信息 产生利息时长
                $scope.paymentInfo.interestDay = _baseService.dateDiffIncludeToday(loanStartDate, now);
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 修改贷出信息。
     * */
    $scope.updateFinanceLoan = function () {
        swal({
                title: "确定要修改贷出信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                var obj = {
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
            });
    };

    /**
     * 修改贷款订单状态。(放款/完结 按钮动作)
     * @param status 状态
     */
    $scope.changeLoanStatus = function (status) {
        var title = status === 2 ? "本次贷出确定放款吗？" : "本次贷出确定完结吗？";
        var text = status === 2 ? "放款后，将不能再进行基本信息修改！" : "完结后，将不能再进行贷出信息修改！";

        swal({
                title: title,
                text: text,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.put(_host.api_url + "/user/" + userId + "/loan/" + loanId + "/loanStatus/" + status, {}).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        // 默认显示 贷出信息 TAB
                        $scope.lookLoanInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
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
                // 年份
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

            // 如果年份没有输入，就去掉此属性
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

        // 基本信息 合计归还本金(美元) 默认值
        $scope.paymentInfo.paymentMoney = 0;
        // 基本信息 合计利息(美元) 默认值
        $scope.paymentInfo.totalInterest = 0;
        // 基本信息 合计手续费(美元) 默认值
        $scope.paymentInfo.paymentPoundage = 0;

        // 取得订单详情
        getLoanInfo();
        // 查询还款记录列表
        queryLoanRepayment();
    };

    /**
     * 查询还款记录列表。
     */
    function queryLoanRepayment() {

        // 检索用url
        var url = _host.api_url + "/loanRepayment?loanId=" + loanId;

        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.loanRepaymentList = data.result;

                // 计算 合计归还本金，合计利息，合计手续费
                for (var i = 0; i < $scope.loanRepaymentList.length; i++) {
                    // 归还本金
                    if ($scope.loanRepaymentList[i].repayment_money == null) {
                        $scope.loanRepaymentList[i].repayment_money = 0;
                    }
                    // 利息
                    if ($scope.loanRepaymentList[i].interest_money == null) {
                        $scope.loanRepaymentList[i].interest_money = 0;
                    }
                    // 手续费
                    if ($scope.loanRepaymentList[i].fee == null) {
                        $scope.loanRepaymentList[i].fee = 0;
                    }
                    // 基本信息 合计归还本金(美元) 默认值
                    $scope.paymentInfo.paymentMoney = $scope.loanRepaymentList[i].repayment_money + $scope.paymentInfo.paymentMoney;
                    // 基本信息 合计利息(美元) 默认值
                    $scope.paymentInfo.totalInterest = $scope.loanRepaymentList[i].interest_money + $scope.paymentInfo.totalInterest;
                    // 基本信息 合计手续费(美元) 默认值
                    $scope.paymentInfo.paymentPoundage = $scope.loanRepaymentList[i].fee + $scope.paymentInfo.paymentPoundage;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 打开【新增还款】模态画面。
     */
    $scope.openNewLoanPaymentDiv = function () {
        $('.modal').modal();
        $('#saveLoanPaymentDiv').modal('open');
        // 画面ID：新增还款
        $scope.modalFlag = "newPaymentInfo";
        $scope.newPayment.repaymentStatus = "-1";

        $scope.lookPaymentInfo();
    };

    /**
     * 打开【还款信息】模态画面。
     * @param repaymentId 还款编号
     */
    $scope.openLoanPaymentDiv = function (repaymentId) {
        $('.modal').modal();
        $('#saveLoanPaymentDiv').modal('open');
        // 画面ID：还款信息
        $scope.modalFlag = "editPaymentInfo";

        $scope.lookPaymentInfo(repaymentId);
    };

    /**
     * Tab跳转 基本信息
     * @param repaymentId 还款编号
     */
    $scope.lookPaymentInfo = function (repaymentId) {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .paymentInfoDiv').addClass("active");
        $("#paymentInfoDiv").addClass("active");
        $("#paymentInfoDiv").show();
        // TAB 画面ID：基本信息
        $scope.tabId = "paymentInfo";
        // TAB 信用证还款 信用证号 初期化
        $scope.newCreditId = "";

        if ($scope.modalFlag === "newPaymentInfo") {
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
            $scope.newPayment.poundage = 0;
            // 本次应还总金额(美元)
            $scope.newPayment.totalPaymentMoney = 0;
            // 剩余未还金额(美元)
            $scope.newPayment.leftPaymentMoney = $scope.paymentInfo.leftPaymentMoney;
            // 备注
            $scope.newPayment.remark = "";
        } else {
            // 根据还款编号 查询该条记录的详细信息
            queryLoanRepaymentById(repaymentId);
            // 信用证还款金额(美元)
            queryCreditRepMoney(repaymentId);
            // 其他方式还款金额
            queryOtherRepMoney(repaymentId);
        }
    };

    /**
     * 查询还款记录基本信息。
     */
    function queryLoanRepaymentById(repaymentId){

        // 检索用url
        var url = _host.api_url + "/loanRepayment?loanId=" + loanId + "&repaymentId=" + repaymentId;

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款状态
                    $scope.newPayment.repaymentStatus = data.result[0].repayment_status;
                    // 还款编号
                    $scope.newPayment.repaymentId = repaymentId;
                    // 还款时间
                    $scope.newPayment.repaymentDate = data.result[0].created_on;
                    // 本次还贷金额(美元)
                    $scope.newPayment.paymentMoney = data.result[0].repayment_money;
                    // 利率
                    $scope.newPayment.rate = data.result[0].rate;
                    // 产生利息金额(美元)
                    $scope.newPayment.principal = data.result[0].create_interest_money;
                    // 产生利息时长(天)
                    $scope.newPayment.interestDay = data.result[0].day_count;
                    // 利息(美元)
                    $scope.newPayment.interest = data.result[0].interest_money;
                    // 手续费(美元)
                    $scope.newPayment.poundage = data.result[0].fee;
                    // 本次应还总金额(美元)
                    $scope.newPayment.totalPaymentMoney = parseFloat($scope.newPayment.paymentMoney) + parseFloat($scope.newPayment.interest) + parseFloat($scope.newPayment.poundage);
                    $scope.newPayment.totalPaymentMoney = $scope.newPayment.totalPaymentMoney.toFixed(2);
                    $scope.newPayment.oldTotalPaymentMoney = $scope.newPayment.totalPaymentMoney;

                    // 备注
                    $scope.newPayment.remark = data.result[0].remark;
                } else {
                    swal("未查到该还款编号的详细信息！", "", "warning");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 查询信用证还款金额。
     */
    function queryCreditRepMoney(repaymentId){
        // 还款金额
        $scope.newPayment.creditRepMoney = 0;
        $scope.creditPayment.paymentMoney = 0;
        // 检索用url
        var url = _host.api_url + "/repayment/" + repaymentId + "/creditRepMoney";

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款金额
                    $scope.newPayment.creditRepMoney = data.result[0].credit_rep_money == null ? 0 : data.result[0].credit_rep_money;
                    $scope.creditPayment.paymentMoney = $scope.newPayment.creditRepMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 查询其他方式还款金额。
     */
    function queryOtherRepMoney(repaymentId){
        // 还款金额
        $scope.newPayment.otherRepMoney = 0;
        $scope.otherPayment.paymentMoney = 0;
        // 检索用url
        var url = _host.api_url + "/repayment/" + repaymentId + "/paymentRepMoney";

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款金额
                    $scope.newPayment.otherRepMoney = data.result[0].payment_rep_money == null ? 0 : data.result[0].payment_rep_money;
                    $scope.otherPayment.paymentMoney = $scope.newPayment.otherRepMoney;

                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * Tab跳转 其他方式还款
     */
    $scope.gotoNextPage = function () {
        if ($scope.tabId === "paymentInfo") {
            // 已还金额(美元)
            $scope.creditPayment.paymentMoney = 0;
            // 已还金额(美元)
            $scope.otherPayment.paymentMoney = 0;
            // 新增还款基本信息。
            addLoanRepayment();
        } else if ($scope.tabId === "creditPayment") {
            // 去除元画面状态
            $('.tabWrap .modal_tab').removeClass("active");
            $(".modal_tab_box ").removeClass("active");
            $(".modal_tab_box ").hide();
            // 成功后，跳转到TAB【其他方式还款】
            $('.tabWrap .otherPaymentDiv').addClass("active");
            $("#otherPaymentDiv").addClass("active");
            $("#otherPaymentDiv").show();
            // TAB 画面ID：其他方式还款
            $scope.tabId = "otherPayment";

            // 本次应还总金额(美元)
            $scope.otherPayment.totalPaymentMoney = $scope.creditPayment.leftPaymentMoney;
            // 未还金额(美元)
            $scope.otherPayment.leftPaymentMoney = $scope.creditPayment.leftPaymentMoney;
            // 清空 支付编号
            $scope.newOtherPaymentId = "";
            // 清空其他方式列表
            $scope.loanRepPaymentRelList = {};

        } else {
            // 关闭模态
            $('#saveLoanPaymentDiv').modal('close');
        }
    };

    /**
     * 新增还款基本信息。
     */
    function addLoanRepayment() {
        if ($scope.newPayment.paymentMoney !== "" && $scope.newPayment.interestDay !== "") {
            // 追加画面数据
            var obj = {
                loanId: loanId,
                repaymentMoney: $scope.newPayment.paymentMoney,
                rate: $scope.newPayment.rate === "" ? 0 : $scope.newPayment.rate,
                createInterestMoney: $scope.newPayment.principal,
                dayCount: $scope.newPayment.interestDay,
                interestMoney: $scope.newPayment.interest,
                fee: $scope.newPayment.poundage === "" ? 0 : $scope.newPayment.poundage,
                remark: $scope.newPayment.remark
            };
            _basic.post(_host.api_url + "/user/" + userId + "/loanRepayment", obj).then(function (data) {
                if (data.success) {
                    // 取得 还款编号
                    $scope.newPayment.repaymentId = data.id;
                    // TAB 画面ID：信用证还款
                    $scope.tabId = "creditPayment";
                    // 去除元画面状态
                    $('.tabWrap .modal_tab').removeClass("active");
                    $(".modal_tab_box ").removeClass("active");
                    $(".modal_tab_box ").hide();
                    // 成功后，跳转到TAB【信用证还款】
                    $('.tabWrap .creditPaymentDiv').addClass("active");
                    $("#creditPaymentDiv").addClass("active");
                    $("#creditPaymentDiv").show();

                    // 本次应还总金额(美元)
                    $scope.creditPayment.totalPaymentMoney = $scope.newPayment.totalPaymentMoney;
                    $scope.newPayment.oldTotalPaymentMoney = $scope.newPayment.totalPaymentMoney;
                    // 未还金额(美元)
                    $scope.creditPayment.leftPaymentMoney = $scope.newPayment.totalPaymentMoney;
                    // 清空 信用证号
                    $scope.newCreditId = "";
                    // 清空信用证列表
                    $scope.loanRepCreditRelList = {};

                    // 刷新 还款记录 画面
                    $scope.lookPaymentHistory();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写必需还款信息！", "", "warning");
        }
    }

    /**
     * 修改还款信息。
     */
    $scope.updatePayment = function () {
        if ($scope.tabId === "paymentInfo") {
            swal({
                    title: "确定修改本次还款信息吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function () {
                    var obj = {
                        loanId: loanId,
                        repaymentMoney: $scope.newPayment.paymentMoney,
                        rate: $scope.newPayment.rate === "" ? 0 : $scope.newPayment.rate,
                        createInterestMoney: $scope.newPayment.principal,
                        dayCount: $scope.newPayment.interestDay,
                        interestMoney: $scope.newPayment.interest,
                        fee: $scope.newPayment.poundage === "" ? 0 : $scope.newPayment.poundage,
                        remark: $scope.newPayment.remark
                    };
                    // 修改本次支付金额
                    var url = _host.api_url + "/user/" + userId + "/repayment/" + $scope.newPayment.repaymentId;
                    _basic.put(url, obj).then(function (data) {
                        if (data.success) {
                            // 关闭模态
                            $('#saveLoanPaymentDiv').modal('close');
                            // 查询还款记录列表
                            $scope.lookPaymentHistory();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                });
        } else {
            // 关闭模态
            $('#saveLoanPaymentDiv').modal('close');
        }
    };

    /**
     * 利息计算用方法。
     */
    $scope.calculateInterest = function () {
        var rate = 0;
        if ($scope.newPayment.rate !== "") {
            rate = parseFloat($scope.newPayment.rate);
        }

        $scope.newPayment.interest = rate * $scope.newPayment.principal * $scope.newPayment.interestDay / 100;
        $scope.newPayment.interest = $scope.newPayment.interest.toFixed(2);

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
        var paymentMoney = 0;
        if ($scope.newPayment.paymentMoney !== "") {
            paymentMoney = parseFloat($scope.newPayment.paymentMoney);
        }

        // 本次应还总金额 = 本次还贷金额 + 利息 + 手续费
        $scope.newPayment.totalPaymentMoney = paymentMoney + parseFloat($scope.newPayment.interest) + poundage;
        $scope.newPayment.totalPaymentMoney = $scope.newPayment.totalPaymentMoney.toFixed(2);
        $scope.newPayment.leftPaymentMoney = parseFloat($scope.paymentInfo.leftPaymentMoney) - paymentMoney;
        $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney < 0 ? 0 : $scope.newPayment.leftPaymentMoney;
        $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney.toFixed(2);
    };

    /**
     * Tab跳转 信用证还款
     */
    $scope.lookCreditPayment = function () {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .creditPaymentDiv').addClass("active");
        $("#creditPaymentDiv").addClass("active");
        $("#creditPaymentDiv").show();

        // TAB 画面ID：信用证还款
        $scope.tabId = "creditPayment";
        // 清空 信用证号
        $scope.newCreditId = "";

        // 取得信用证 还款信息
        getCreditPaymentInfo();
    };

    /**
     * 取得信用证 还款信息。
     */
    function getCreditPaymentInfo() {

        // 本次应还总金额 = 本次应还总额 - 其他方式还款金额
        $scope.creditPayment.totalPaymentMoney = $scope.newPayment.oldTotalPaymentMoney - $scope.otherPayment.paymentMoney;
        // 如果小于0 ，则显示0
        $scope.creditPayment.totalPaymentMoney = $scope.creditPayment.totalPaymentMoney < 0 ? 0 : $scope.creditPayment.totalPaymentMoney;

        // 信用证 已还金额
        $scope.creditPayment.paymentMoney = 0;

            // 取得信用证还款列表
        _basic.get(_host.api_url + "/loanRepCreditRel?repaymentId=" + $scope.newPayment.repaymentId).then(function (data) {
            if (data.success) {
                $scope.loanRepCreditRelList = data.result;

                // 计算已还金额
                for (var i = 0; i < $scope.loanRepCreditRelList.length; i++) {
                    if ($scope.loanRepCreditRelList[i].actual_money == null) {
                        $scope.loanRepCreditRelList[i].actual_money = 0;
                    }
                    $scope.creditPayment.paymentMoney = $scope.loanRepCreditRelList[i].actual_money + $scope.creditPayment.paymentMoney;
                }

                // 本次应还总金额(美元) = 本次应还总额 - 其他方式还款金额
                $scope.creditPayment.totalPaymentMoney = $scope.newPayment.oldTotalPaymentMoney - $scope.otherPayment.paymentMoney;
                // 如果小于0 ，则显示0
                $scope.creditPayment.totalPaymentMoney = $scope.creditPayment.totalPaymentMoney < 0 ? 0 : $scope.creditPayment.totalPaymentMoney;
                // 未还金额(美元) = 本次应还总金额 - 已还金额
                $scope.creditPayment.leftPaymentMoney = $scope.creditPayment.totalPaymentMoney - $scope.creditPayment.paymentMoney;
                // 如果小于0 ，则显示0
                $scope.creditPayment.leftPaymentMoney = $scope.creditPayment.leftPaymentMoney < 0 ? 0 : $scope.creditPayment.leftPaymentMoney;
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * Tab跳转 其他方式还款
     */
    $scope.lookOtherPayment = function () {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .otherPaymentDiv').addClass("active");
        $("#otherPaymentDiv").addClass("active");
        $("#otherPaymentDiv").show();

        // TAB 画面ID：其他方式还款
        $scope.tabId = "otherPayment";
        // 清空 支付编号
        $scope.newOtherPaymentId = "";

        // 取得其他还款 还款信息
        getOtherPaymentInfo();
    };

    /**
     * 取得其他还款 还款信息。
     */
    function getOtherPaymentInfo() {
        $scope.otherPayment.paymentMoney = 0;

        // 取得信用证还款列表
        _basic.get(_host.api_url + "/paymentLoanRepRel?repaymentId=" + $scope.newPayment.repaymentId).then(function (data) {
            if (data.success) {
                $scope.loanRepPaymentRelList = data.result;
                // 计算已还金额
                for (var i = 0; i < $scope.loanRepPaymentRelList.length; i++) {
                    if ($scope.loanRepPaymentRelList[i].this_payment_money == null) {
                        $scope.loanRepPaymentRelList[i].this_payment_money = 0;
                    }
                    $scope.otherPayment.paymentMoney = $scope.loanRepPaymentRelList[i].this_payment_money + $scope.otherPayment.paymentMoney;
                }

                // 本次应还总金额(美元) = 本次应还总额 - 其他方式还款金额
                $scope.otherPayment.totalPaymentMoney = $scope.newPayment.oldTotalPaymentMoney - $scope.creditPayment.paymentMoney;
                // 如果小于0 ，则显示0
                $scope.otherPayment.totalPaymentMoney = $scope.otherPayment.totalPaymentMoney < 0 ? 0 : $scope.otherPayment.totalPaymentMoney;
                // 未还金额(美元) = 本次应还总金额 - 已还金额
                $scope.otherPayment.leftPaymentMoney = $scope.otherPayment.totalPaymentMoney - $scope.otherPayment.paymentMoney;
                // 如果小于0 ，则显示0
                $scope.otherPayment.leftPaymentMoney = $scope.otherPayment.leftPaymentMoney < 0 ? 0 : $scope.otherPayment.leftPaymentMoney;
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * 点击 追加信用证还款按钮
     */
    $scope.addCreditPayment = function () {

        // 未完结ID = 1
        var unfinished = $scope.paymentStatus[0].id;
        // 信用证号
        var creditNumber = $scope.newCreditId;

        // 检索用url
        var url = _host.api_url + "/credit?creditNumber=" + creditNumber + "&entrustId=" + $scope.loanInfo.entrustId  + "&creditStatus=" + unfinished;
        _basic.get(url).then(function (data) {
            if (data.success) {

                if (data.result.length === 0) {
                    swal("请填写正确的委托方信用证号！", "", "warning");
                } else {
                    addLoanRepCreditRel(data.result[0].id);
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 新增还款信用证。
     * @param creditId 信用证ID
     */
    function addLoanRepCreditRel(creditId) {
        // 追加画面数据
        var obj = {
            repaymentId: $scope.newPayment.repaymentId,
            creditId: creditId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/loanRepCreditRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.newCreditId = "";
                // 取得信用证 还款信息
                getCreditPaymentInfo();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * 从还款信息中删除指定信用证。
     * @param creditId 信用证ID
     */
    $scope.deleteCreditPayment = function ($event, creditId) {
        $event.stopPropagation();
        swal({
                title: "确定要移除当前信用证与该次还款的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + $scope.newPayment.repaymentId + '/credit/' + creditId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookCreditPayment();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 取得指定信用证关联车辆。
     * @param creditId 信用证ID
     */
    $scope.getCreditCarRel = function ($event, creditId) {
        // 检索用url
        var url = _host.api_url + "/creditCarRel?creditId=" + creditId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.creditCarRelList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 点击 追加其他还款按钮
     */
    $scope.addOtherPayment = function () {

        // 未完结
        var unfinished = $scope.paymentStatus[0].id;
        // 支付单号
        var paymentId = $scope.newOtherPaymentId;

        // 检索用url
        var url = _host.api_url + "/payment?paymentId=" + paymentId + "&entrustId=" + $scope.loanInfo.entrustId  + "&paymentStatus=" + unfinished;
        _basic.get(url).then(function (data) {
            if (data.success) {

                if (data.result.length === 0) {
                    swal("请填写正确的委托方支付单号！", "", "warning");
                } else {
                    // 新增还款支付订单
                    addLoanRepPaymentRel(data.result[0].id);
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 新增还款支付订单。
     * @param paymentId 支付单号
     */
    function addLoanRepPaymentRel(paymentId) {
        // 追加画面数据
        var obj = {
            repaymentId: $scope.newPayment.repaymentId,
            paymentId: paymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/paymentLoanRepRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookOtherPayment();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * 从还款信息中删除指定信用证。
     * @param $event
     * @param paymentId 支付单号
     */
    $scope.deleteOtherPayment = function ($event, paymentId) {
        $event.stopPropagation();
        swal({
                title: "确定要移除当前支付订单与该次还款的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + $scope.newPayment.repaymentId + '/payment/' + paymentId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookOtherPayment();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 修改本次支付金额。
     * @param paymentInfo 支付订单信息
     */
    $scope.updatePaymentMoney = function (paymentInfo) {
        swal({
                title: "确定修改本次支付金额吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                var obj = {thisPaymentMoney : paymentInfo.this_payment_money};
                // 修改本次支付金额
                var url = _host.api_url + "/user/" + userId + "/repayment/" + paymentInfo.repayment_id + "/payment/" + paymentInfo.payment_id + "/paymentRepMoney" ;

                _basic.put(url, obj).then(function (data) {
                    if (data.success) {
                        $scope.lookOtherPayment();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * 本次还款确定完结。
     * @param repaymentId 还款编号
     */
    $scope.updatePaymentStatus = function (repaymentId) {
        swal({
                title: "本次还款确定完结吗？",
                text: "完结后，将不能再进行修改！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                // 修改状态为已完结【2：已完结】
                var url = _host.api_url + "/user/" + userId + "/repayment/" + repaymentId + "/repaymentStatus/" + $scope.paymentStatus[1].id;

                _basic.put(url, {}).then(function (data) {
                    if (data.success) {
                        $scope.lookPaymentHistory();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

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
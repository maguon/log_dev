/**
 * 主菜单：财务管理 -> 金融贷入(详细) 控制器
 */
app.controller("finance_loan_in_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state","_baseService", function ($scope, $stateParams, _basic, _host, _config, $state,_baseService) {
    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);
    // 贷款编号
    var loanId = $stateParams.id;
    // 金融贷入 状态
    $scope.loanStatus = _config.loanInStatus;
    // 支付状态
    $scope.paymentStatus = _config.paymentStatus;
    // 颜色列表
    $scope.configColor = _config.config_color;
    // 是否MSO车辆
    $scope.msoFlags = _config.msoFlags;
    // 是否金融车 列表
    $scope.purchaseTypes = _config.purchaseTypes;

    // 金融贷入(TAB1) 订单 基本信息
    $scope.loanInfo = {};

    // 关联车辆(TAB2) 基本信息
    $scope.buyingCar = {};

    // 关联车辆(TAB2) 新增金融车画面
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
        entrustId: "",
        // 车价(美元)
        valuation: "",
        // MSO
        mso: ""
    };

    // 还款记录(TAB3) 基本信息
    $scope.paymentInfo = {};

    // 还款记录(TAB3) 新增还款 基本信息
    $scope.newPayment = {};

    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_loan_in_detail"}, {reload: true})
    };

    /**
     * Tab跳转 1:贷入信息
     */
    $scope.lookLoanInfo = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .loanInfoDiv').addClass("active");
        $("#loanInfoDiv").addClass("active");
        $("#loanInfoDiv").show();

        // 取得订单详情
        getLoanInfo();
    };

    /**
     * 取得贷入信息详情。
     */
    function getLoanInfo() {
        // 检索用url
        var url = _host.api_url + "/loanInto?loanIntoId=" + loanId;
        _basic.get(url).then(function (data) {
            if (data.success) {

                if (data.result.length === 0) {
                    return;
                }

                // 贷入编号
                $scope.loanInfo.id = loanId;
                // 贷入订单 状态
                $scope.loanInfo.loanStatus = data.result[0].loan_into_status;

                // 贷入时间
                $scope.loanInfo.loanStartDate = data.result[0].loan_into_start_date;

                // 贷入公司
                $scope.loanInfo.loanCo = data.result[0].loan_into_company_id;
                $scope.loanInfo.loanCoNm = data.result[0].company_name;
                // 贷入金额
                $scope.loanInfo.loanMoney = data.result[0].loan_into_money == null ? 0 : data.result[0].loan_into_money;
                $("#loanMoneyLabel").addClass("active");

                // 备注
                $scope.loanInfo.remark = data.result[0].remark;

                // textarea 高度调整
                $('#loadRemarkText').val($scope.loanInfo.remark);
                $('#loadRemarkText').trigger('autoresize');

                // 未还金额(美元)
                $scope.loanInfo.notRepaymentMoney = data.result[0].not_repayment_money;

                // TAB 还款记录 用画面基本数据

                // 基本信息 未还本金(美元)
                $scope.paymentInfo.leftPaymentMoney = $scope.loanInfo.notRepaymentMoney;
                // 基本信息 贷入日期
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
     * 修改贷入信息。
     * */
    $scope.updateFinanceLoan = function () {
        swal({
                title: "确定要修改贷入信息吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                var obj = {
                    // 贷入公司
                    loanIntoCompanyId: $scope.loanInfo.loanCo,
                    // 贷入金额
                    loanIntoMoney: $scope.loanInfo.loanMoney,
                    // 备注
                    remark: $scope.loanInfo.remark
                };
                _basic.put(_host.api_url + "/user/" + userId + "/loanInto/" + loanId, obj).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        // 默认显示 贷入信息 TAB
                        $scope.lookLoanInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * 修改贷入订单状态。(放款/完结 按钮动作)
     * @param status 状态
     */
    $scope.changeLoanStatus = function (status) {
        var title = status === 2 ? "本次贷入确定收款吗？" : "本次贷入确定完结吗？";
        var text = status === 2 ? "收款后，将不能再进行基本信息修改！" : "完结后，将不能再进行贷入信息修改！";

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
                _basic.put(_host.api_url + "/user/" + userId + "/loanInto/" + loanId + "/loanIntoStatus/" + status, {}).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        // 默认显示 贷入信息 TAB
                        $scope.lookLoanInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * Tab跳转 2: 关联车辆
     */
    $scope.lookBuyingCars = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .buyingCarsDiv').addClass("active");
        $("#buyingCarsDiv").addClass("active");
        $("#buyingCarsDiv").show();

        // 取得 该贷款 购买的金融车列表
        _basic.get(_host.api_url + "/loanIntoBuyCarRel?loanIntoId=" + loanId).then(function (data) {
            if (data.success) {
                // 关联车辆 列表
                $scope.buyingCarList = data.result;
                // 关联车辆 数量
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
                        swal("该VIN车辆已存在，请输入正确的新车VIN。", "", "error");
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
        if ($scope.customCarInfo.entrustId !== "" && $scope.customCarInfo.maker !== "" && $scope.customCarInfo.model !== ""
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
                entrustId: $scope.customCarInfo.entrustId,
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
            loanIntoId: loanId,
            carId: carId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/loanIntoBuyCarRel", obj).then(function (data) {
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
                _basic.delete(_host.api_url + "/user/" + userId + "/loanInto/" + loanId + '/car/' + carId, {}).then(
                    function (data) {
                        if (data.success) {
                            $scope.lookBuyingCars();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * Tab跳转 3: 还款记录
     */
    $scope.lookPaymentHistory = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .payHistoryDiv').addClass("active");
        $("#payHistoryDiv").addClass("active");
        $("#payHistoryDiv").show();

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
        var url = _host.api_url + "/loanIntoRepayment?loanIntoId=" + loanId;

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
     * 打开【还款详情】模态画面。
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

        if ($scope.modalFlag === "newPaymentInfo") {
            // 本次还贷金额(美元)
            $scope.newPayment.paymentMoney = "";
            // 利率
            $scope.newPayment.rate = 0.0222;
            // 产生利息时长(天)
            $scope.newPayment.interestDay = $scope.paymentInfo.interestDay;
            // 利息(美元)
            $scope.newPayment.interest = 0;
            // 手续费(美元)
            $scope.newPayment.poundage = 0;
            // 本次应还总金额(美元)
            $scope.newPayment.totalPaymentMoney = 0;
            // // 剩余未还金额(美元)
            // $scope.newPayment.leftPaymentMoney = $scope.paymentInfo.leftPaymentMoney;
            // 备注
            $scope.newPayment.remark = "";
        } else {
            // 根据还款编号 查询该条记录的详细信息
            queryLoanRepaymentById(repaymentId);
        }
    };

    /**
     * 查询还款记录基本信息。
     */
    function queryLoanRepaymentById(repaymentId){

        // 检索用url
        var url = _host.api_url + "/loanIntoRepayment?loanIntoId=" + loanId + "&repaymentId=" + repaymentId;

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款状态
                    $scope.newPayment.repaymentStatus = data.result[0].repayment_status;
                    // 还款编号
                    $scope.newPayment.repaymentId = repaymentId;
                    // 还款时间
                    $scope.newPayment.repaymentDate = data.result[0].created_on;
                    // 本次归还本金(美元)
                    $scope.newPayment.paymentMoney = data.result[0].repayment_money;
                    // 利率
                    $scope.newPayment.rate = data.result[0].rate;
                    // 产生利息时长(天)
                    $scope.newPayment.interestDay = data.result[0].day_count;
                    // 利息(美元)
                    $scope.newPayment.interest = data.result[0].interest_money;
                    // 手续费(美元)
                    $scope.newPayment.poundage = data.result[0].fee;
                    // 本次应还总金额(美元)
                    $scope.newPayment.totalPaymentMoney = data.result[0].repayment_total_money;

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
     * 新增/修改还款信息。
     */
    $scope.updatePayment = function () {

        // 本次归还本金 , 产生利息时长 为必须输入项
        if ($scope.newPayment.paymentMoney !== "" && $scope.newPayment.interestDay !== "") {
            // 追加画面数据
            var obj = {
                loanIntoId: loanId,
                repaymentMoney: $scope.newPayment.paymentMoney,
                rate: $scope.newPayment.rate === "" ? 0.0222 : $scope.newPayment.rate,
                dayCount: $scope.newPayment.interestDay,
                interestMoney: $scope.newPayment.interest,
                fee: $scope.newPayment.poundage === "" ? 0 : $scope.newPayment.poundage,
                repaymentTotalMoney: $scope.newPayment.totalPaymentMoney,
                remark: $scope.newPayment.remark
            };

            if ($scope.modalFlag === "newPaymentInfo") {
                _basic.post(_host.api_url + "/user/" + userId + "/loanIntoRepayment", obj).then(function (data) {
                    if (data.success) {
                        // 关闭模态
                        $('#saveLoanPaymentDiv').modal('close');
                        swal("新增成功", "", "success");

                        // 刷新 还款记录 画面
                        $scope.lookPaymentHistory();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {

                _basic.put(_host.api_url + "/user/" + userId + "/loanIntoRepayment/" + $scope.newPayment.repaymentId, obj).then(function (data) {
                    if (data.success) {
                        // 关闭模态
                        $('#saveLoanPaymentDiv').modal('close');
                        swal("修改成功", "", "success");

                        // 刷新 还款记录 画面
                        $scope.lookPaymentHistory();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }

        } else {
            swal("请填写必需还款信息！", "", "warning");
        }
    };

    /**
     * 本次应还总金额/剩余未还金额 计算用方法。
     */
    $scope.calculatePaymentMoney = function () {
        // 产生利息金额(美元) = 本次还贷金额(美元)
        $scope.newPayment.principal = $scope.newPayment.paymentMoney;

        // 利息
        var rate = 0.0222;
        if ($scope.newPayment.rate !== "") {
            rate = parseFloat($scope.newPayment.rate);
        }

        $scope.newPayment.interest = rate * $scope.newPayment.principal * $scope.newPayment.interestDay / 100;
        $scope.newPayment.interest = $scope.newPayment.interest.toFixed(2);

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
        // $scope.newPayment.leftPaymentMoney = parseFloat($scope.paymentInfo.leftPaymentMoney) - paymentMoney;
        // $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney < 0 ? 0 : $scope.newPayment.leftPaymentMoney;
        // $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney.toFixed(2);
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
                var url = _host.api_url + "/user/" + userId + "/loanIntoRepayment/" + repaymentId + "/repaymentStatus/" + $scope.paymentStatus[1].id;

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
     * 取得贷入公司列表
     */
    function getLoanIntoCompany() {
        _basic.get(_host.api_url + "/loanIntoCompany").then(function (data) {
            if (data.success) {
                $scope.loanInCoList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


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
     * 获取委托方信息
     */
    $scope.getEntrustInfo = function () {

        // 取得委托方url
        var url = _host.api_url + "/entrust";

        // 新增画面 委托方select2初期化
        $('#addEntrustSelect').select2({
            placeholder: "委托方",
            containerCssClass: 'select2_dropdown',
            ajax : {
                type:'GET',
                url : url,
                dataType : 'json',
                delay : 400,
                data : function(params) {
                    return {
                        // 委托方简称
                        shortNameCode : params.term
                    };
                },
                processResults : function(data, params) {
                    var options = [];
                    $(data.result).each(function(i, o) {
                        // 获取 select2 必要的字段，id与text
                        options.push({
                            id : o.id,
                            text : o.short_name
                        });
                    });
                    // 返回组装后 select2 列表
                    return {
                        results : options
                    };
                },
                // 开启缓存
                cache : true
            },
            allowClear: false
        }).on('change', function () {
            // 委托方 下拉选中 内容
            if ($("#addEntrustSelect").val() != null && $("#addEntrustSelect").val() !== "") {
                $scope.customCarInfo.entrustId = $("#addEntrustSelect").select2("data")[0].id;
                // $scope.customCarInfo.entrustNm = $("#addEntrustSelect").select2("data")[0].text;
            }
        });
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得 车辆品牌列表
        getCarMakerList();
        // 取得贷入公司列表
        getLoanIntoCompany();
        // 获取委托方信息
        $scope.getEntrustInfo();
        // 默认显示 贷入信息 TAB
        $scope.lookLoanInfo();
    };
    $scope.initData();
}]);
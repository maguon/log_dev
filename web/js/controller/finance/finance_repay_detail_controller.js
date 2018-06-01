/**
 * 主菜单：财务管理 -> 金融还贷(详细) 控制器
 */
app.controller("finance_repay_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state","_baseService", function ($scope, $stateParams, _basic, _host, _config, $state,_baseService) {
    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);
    // 还款编号
    var repayId = $stateParams.id;

    // 支付状态
    $scope.paymentStatus = _config.paymentStatus;
    // 支付方式
    $scope.paymentType = _config.paymentType;

    // 金融还贷 基本信息(TAB1)
    $scope.repay = {};

    // 金融还贷 基本信息(TAB1) 贷出编号信息
    $scope.loanInfo = {};

    // 金融还贷 信用证还款(TAB2)
    $scope.creditPayment = {};

    // 金融还贷 其他方式还款(TAB3)
    $scope.otherPayment = {};




    /************************************** TODO ********************************************************/


    // 还款记录(TAB4) 基本信息
    $scope.paymentInfo = {};

    // 还款记录(TAB4) 新增还款 基本信息
    $scope.newPayment = {};

















    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_repay_detail"}, {reload: true})
    };

    /************************************** TODO ********************************************************/

    /**
     * Tab跳转 1:基本信息
     */
    $scope.lookPaymentInfo = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .paymentInfoDiv').addClass("active");
        $("#paymentInfoDiv").addClass("active");
        $("#paymentInfoDiv").show();
        // TAB 画面ID：基本信息 TODO delete
        $scope.tabId = "paymentInfo";
        // TAB 信用证还款 信用证号 初期化
        $scope.newCreditId = "";

        // 根据还款编号 查询该条记录的详细信息
        queryLoanRepaymentById();

        // 信用证还款金额(美元) TODO
        queryCreditRepMoney();
        // 其他方式还款金额 TODO
        queryOtherRepMoney();
    };

    /**
     * 查询信用证还款金额。
     */
    function queryCreditRepMoney(){
        // 还款金额
        $scope.newPayment.creditRepMoney = 0;
        $scope.creditPayment.paymentMoney = 0;
        // 检索用url
        var url = _host.api_url + "/repayment/" + repayId + "/creditRepMoney";

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
    function queryOtherRepMoney(){
        // 还款金额
        $scope.newPayment.otherRepMoney = 0;
        $scope.otherPayment.paymentMoney = 0;
        // 检索用url
        var url = _host.api_url + "/repayment/" + repayId + "/repPaymentMoney";

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
     * 查询还款记录基本信息。
     */
    function queryLoanRepaymentById(){

        // 检索用url
        var url = _host.api_url + "/loanRepayment?repaymentId=" + repayId;

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款编号
                    $scope.repay.repaymentId = repayId;
                    // 还款状态
                    $scope.repay.repaymentStatus = data.result[0].repayment_status;
                    // 还款时间
                    $scope.repay.repaymentDate = data.result[0].created_on;

                    // 委托方性质
                    $scope.repay.entrustType = data.result[0].entrust_type;
                    // 委托方
                    $scope.repay.entrustId = data.result[0].entrust_id;
                    $scope.repay.entrustName = data.result[0].short_name;
                    // 贷出编号
                    $scope.repay.loanId = data.result[0].loan_id;

                    // 取得贷出编号 信息
                    $scope.getLoanInfo($scope.repay.loanId);

                    // 本次还贷金额(美元)
                    $scope.repay.paymentMoney = data.result[0].repayment_money;
                    // 利率/天
                    $scope.repay.rate = data.result[0].rate;
                    // 产生利息时长(天)
                    $scope.repay.interestDay = data.result[0].day_count;

                    // 利息(美元)
                    $scope.repay.interest = data.result[0].interest_money;
                    // 手续费(美元)
                    $scope.repay.poundage = data.result[0].fee;
                    // 本次应还总金额(美元)
                    $scope.repay.totalPaymentMoney = parseFloat($scope.repay.paymentMoney) + parseFloat($scope.repay.interest) + parseFloat($scope.repay.poundage);
                    $scope.repay.totalPaymentMoney = $scope.repay.totalPaymentMoney.toFixed(2);
                    $scope.repay.oldTotalPaymentMoney = $scope.repay.totalPaymentMoney;

                    // 剩余未还金额 = 前次未还本金 - 本次还贷金额
                    $scope.repay.leftPaymentMoney = parseFloat($scope.loanInfo.notRepaymentMoney) - $scope.repay.totalPaymentMoney;
                    $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney < 0 ? 0 : $scope.repay.leftPaymentMoney;
                    $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney.toFixed(2);

                    // 备注
                    $scope.repay.remark = data.result[0].remark;
                } else {
                    swal("未查到该还款编号的详细信息！", "", "warning");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 获取贷出基本信息
     * @param loanId 贷出编号
     */
    $scope.getLoanInfo = function (loanId) {
        // 基本检索URL
        var url = _host.api_url + "/loan?loanId=" + loanId;

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 追加 基本信息显示区域
                    $scope.hasLoanInfo = true;

                    // 贷出编号
                    $scope.loanInfo.id = data.result[0].id;
                    // 贷出时间
                    $scope.loanInfo.loanStartDate = data.result[0].loan_start_date;
                    // 贷出总金额(美元)
                    $scope.loanInfo.loanMoney = data.result[0].loan_money;
                    // 未还本金(美元)
                    $scope.loanInfo.notRepaymentMoney = data.result[0].not_repayment_money;
                    // 上次还款时间
                    $scope.loanInfo.lastRepaymentDate = data.result[0].last_repayment_date;
                } else {
                    // 隐藏 基本信息显示区域
                    $scope.hasLoanInfo = false;
                    $scope.loanInfo = {};
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 保存还款信息。
     */
    $scope.updatePayment = function () {
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
                    loanId: $scope.repay.loanId,
                    repaymentMoney: $scope.repay.paymentMoney,
                    rate: $scope.repay.rate === "" ? 0 : $scope.repay.rate,
                    createInterestMoney: $scope.loanInfo.notRepaymentMoney,
                    dayCount: $scope.repay.interestDay,
                    interestMoney: $scope.repay.interest,
                    fee: $scope.repay.poundage === "" ? 0 : $scope.repay.poundage,
                    remark: $scope.newPayment.remark
                };
                // 修改本次支付金额
                var url = _host.api_url + "/user/" + userId + "/repayment/" + $scope.newPayment.repaymentId;
                _basic.put(url, obj).then(function (data) {
                    if (data.success) {
                        // 关闭模态
                        $('#newLoanPaymentDiv').modal('close');
                        // 查询还款记录列表
                        $scope.lookPaymentInfo();
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
    $scope.updatePaymentStatus = function () {
        swal({
                title: "本次还款确定完结吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                // 修改状态为已完结【2：已完结】
                var url = _host.api_url + "/user/" + userId + "/repayment/" + repayId + "/repaymentStatus/" + $scope.paymentStatus[1].id;
                _basic.put(url, {}).then(function (data) {
                    if (data.success) {
                        $scope.lookPaymentInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };








    /**
     * Tab跳转 2:信用证还款
     */
    $scope.lookCreditPayment = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
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
        $scope.creditPayment.totalPaymentMoney = $scope.repay.oldTotalPaymentMoney - $scope.otherPayment.paymentMoney;
        // 如果小于0 ，则显示0
        $scope.creditPayment.totalPaymentMoney = $scope.creditPayment.totalPaymentMoney < 0 ? 0 : $scope.creditPayment.totalPaymentMoney;

        // 信用证 已还金额
        $scope.creditPayment.paymentMoney = 0;

            // 取得信用证还款列表
        _basic.get(_host.api_url + "/loanRepCreditRel?repaymentId=" + $scope.repay.repaymentId).then(function (data) {
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
                $scope.creditPayment.totalPaymentMoney = $scope.repay.oldTotalPaymentMoney - $scope.otherPayment.paymentMoney;
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
     * 点击 追加信用证还款按钮
     */
    $scope.addCreditPayment = function () {

        // 未完结ID = 1
        var unfinished = $scope.paymentStatus[0].id;
        // 信用证号
        var creditNumber = $scope.newCreditId;

        // 检索用url
        var url = _host.api_url + "/credit?creditNumber=" + creditNumber + "&entrustId=" + $scope.repay.entrustId  + "&creditStatus=" + unfinished;
        console.log(url);

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
            repaymentId: $scope.repay.repaymentId,
            creditId: creditId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/loanRepCreditRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookCreditPayment();
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
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + $scope.repay.repaymentId + '/credit/' + creditId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            // 成功后，刷新页面数据
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
     * Tab跳转 3:其他方式还款
     */
    $scope.lookOtherPayment = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
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
        _basic.get(_host.api_url + "/loanRepPaymentRel?repaymentId=" + $scope.repay.repaymentId).then(function (data) {
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
                $scope.otherPayment.totalPaymentMoney = $scope.repay.oldTotalPaymentMoney - $scope.creditPayment.paymentMoney;
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
     * 点击 追加其他还款按钮
     */
    $scope.addOtherPayment = function () {

        // 未完结
        var unfinished = $scope.paymentStatus[0].id;
        // 支付单号
        var paymentId = $scope.newOtherPaymentId;

        // 检索用url
        var url = _host.api_url + "/payment?paymentId=" + paymentId + "&entrustId=" + $scope.repay.entrustId  + "&paymentStatus=" + unfinished;

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
            repaymentId: $scope.repay.repaymentId,
            paymentId: paymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/loanRepPaymentRel", obj).then(function (data) {
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
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + $scope.repay.repaymentId + '/payment/' + paymentId, {}).then(
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
                var url = _host.api_url + "/user/" + userId + "/repayment/" + paymentInfo.repayment_id + "/payment/" + paymentInfo.payment_id + "/repPaymentMoney" ;
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






















    /**************************************************************************************************/



    /**
     * 利息计算用方法。
     */
    $scope.calculateInterest = function () {
        // 利率/天
        var rate = 0;
        if ($scope.repay.rate !== "") {
            rate = parseFloat($scope.repay.rate);
        }
        // 利息 = 利率/天 * 未还本金 * 产生利息时长
        $scope.repay.interest = rate * $scope.loanInfo.notRepaymentMoney * $scope.repay.interestDay / 100;
        $scope.repay.interest = $scope.repay.interest.toFixed(2);

        // 计算 本次应还总金额/剩余未还金额
        $scope.calculatePaymentMoney();
    };

    /**
     * 本次应还总金额/剩余未还金额 计算用方法。
     */
    $scope.calculatePaymentMoney = function () {
        // 本次还贷金额
        var paymentMoney = 0;
        if ($scope.repay.paymentMoney !== "") {
            paymentMoney = parseFloat($scope.repay.paymentMoney);
        }

        // 手续费
        var poundage = 0;
        if ($scope.repay.poundage !== "") {
            poundage = parseFloat($scope.repay.poundage);
        }

        // 本次应还总金额 = 本次还贷金额 + 利息 + 手续费
        $scope.repay.totalPaymentMoney = paymentMoney + parseFloat($scope.repay.interest) + poundage;
        $scope.repay.totalPaymentMoney = $scope.repay.totalPaymentMoney.toFixed(2);

        // 剩余未还金额 = 前次未还本金 - 本次还贷金额
        $scope.repay.leftPaymentMoney = parseFloat($scope.repay.notRepaymentMoney) - paymentMoney;
        $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney < 0 ? 0 : $scope.repay.leftPaymentMoney;
        $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney.toFixed(2);
    };



    /**
     * 本次还款确定完结。
     * @param repaymentId 还款编号
     */
    $scope.updatePaymentStatus = function (repaymentId) {
        swal({
                title: "本次还款确定完结吗？",
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
                        queryLoanRepayment();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * Tab跳转 其他方式还款
     */
    $scope.lookOtherPayment = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 默认显示 还款基本信息
        $scope.lookPaymentInfo();
    };
    $scope.initData();
}]);
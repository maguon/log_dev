/**
 * 主菜单：财务管理 -> 贷出还款(详细) 控制器
 */
app.controller("finance_loan_out_repay_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state","_baseService", function ($scope, $stateParams, _basic, _host, _config, $state,_baseService) {
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

    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_loan_out_repay_detail"}, {reload: true})
    };

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

        // 根据还款编号 查询该条记录的详细信息
        queryLoanRepaymentById();
    };

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
                    getLoanInfo($scope.repay.loanId);
                    // 取得 贷出编号 对应的 购买车辆列表
                    getBuyingCarsByLoanId($scope.repay.loanId);

                    // 本次还贷金额(美元)
                    $scope.repay.paymentMoney = data.result[0].repayment_money;
                    // 利率/天
                    $scope.repay.rate = data.result[0].rate;
                    // 产生利息时长(天)
                    $scope.repay.interestDay = data.result[0].day_count;
                    // 利息(美元)
                    $scope.repay.interest = data.result[0].interest_money;
                    // // 手续费(美元)
                    // $scope.repay.poundage = data.result[0].fee;
                    // 实际还款金额(美元)
                    // $scope.repay.totalPaymentMoney = parseFloat($scope.repay.paymentMoney) + parseFloat($scope.repay.interest) + parseFloat($scope.repay.poundage);
                    $scope.repay.totalPaymentMoney = parseFloat($scope.repay.paymentMoney) + parseFloat($scope.repay.interest);
                    $scope.repay.totalPaymentMoney = $scope.repay.totalPaymentMoney.toFixed(2);

                    // 备注
                    $scope.repay.remark = data.result[0].remark;

                    // 信用证还款金额
                    $scope.creditPayment.paymentMoney = 0;
                    // 其他方式还款金额
                    $scope.otherPayment.paymentMoney = 0;

                    // 信用证还款金额
                    queryCreditRepMoney();
                    // 其他方式还款金额
                    queryOtherRepMoney();
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
    function getLoanInfo(loanId) {
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
    }

    /**
     * 取得 贷出编号 对应的 购买车辆列表
     */
    function getBuyingCarsByLoanId (loanId) {
        // 取得 该贷款 购买的金融车列表
        _basic.get(_host.api_url + "/loanBuyCarRel?loanId=" + loanId).then(function (data) {
            if (data.success) {
                // 购买车辆 列表
                $scope.buyingCarList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 查询信用证还款金额。
     */
    function queryCreditRepMoney(){
        // 检索用url
        var url = _host.api_url + "/repayment/" + repayId + "/creditRepMoney";

        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款金额
                    $scope.creditPayment.paymentMoney = data.result[0].credit_rep_money == null ? 0 : data.result[0].credit_rep_money;
                }
                // 未还金额 = 本次应还总金额(美元) - 信用证还款金额 - 其他方式还款金额
                $scope.repay.leftPaymentMoney = $scope.repay.totalPaymentMoney - $scope.creditPayment.paymentMoney - $scope.otherPayment.paymentMoney;
                // // 如果小于0 ，则显示0
                // $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney < 0 ? 0 : $scope.repay.leftPaymentMoney;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 查询其他方式还款金额。
     */
    function queryOtherRepMoney(){
        // 检索用url
        var url = _host.api_url + "/repayment/" + repayId + "/paymentRepMoney";
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 还款金额
                    $scope.otherPayment.paymentMoney = data.result[0].payment_rep_money == null ? 0 : data.result[0].payment_rep_money;
                }
                // 未还金额 = 本次应还总金额(美元) - 信用证还款金额 - 其他方式还款金额
                $scope.repay.leftPaymentMoney = $scope.repay.totalPaymentMoney - $scope.creditPayment.paymentMoney - $scope.otherPayment.paymentMoney;
                // // 如果小于0 ，则显示0
                // $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney < 0 ? 0 : $scope.repay.leftPaymentMoney;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 保存还款信息。(保存按钮)
     */
    $scope.updatePayment = function () {
        // 本次归还本金 , 产生利息时长 为必须输入项
        if ($scope.repay.paymentMoney !== "" && $scope.repay.interestDay !== "") {
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
                        // 本次还贷金额
                        repaymentMoney: $scope.repay.paymentMoney,
                        // 利率
                        rate: $scope.repay.rate === "" ? 0.0333 : $scope.repay.rate,
                        // 产生利息金额(美元)
                        createInterestMoney: $scope.repay.paymentMoney,
                        // 产生利息时长(天)
                        dayCount: $scope.repay.interestDay,
                        // 利息
                        interestMoney: $scope.repay.interest,
                        // 2019-04-08 去掉手续费
                        // fee: $scope.repay.poundage === "" ? 0 : $scope.repay.poundage,
                        // 备注
                        remark: $scope.repay.remark
                    };
                    // 修改本次支付金额
                    var url = _host.api_url + "/user/" + userId + "/repayment/" + repayId;
                    _basic.put(url, obj).then(function (data) {
                        if (data.success) {
                            swal("保存成功", "", "success");
                            // 查询还款记录列表
                            $scope.lookPaymentInfo();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                });

        } else {
            swal("请填写必需还款信息！", "", "warning");
        }
    };

    /**
     * 本次还款确定完结。
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

        // 取得可以用来还款的信用证列表
        getCreditListByLoan();
        // 取得信用证 还款信息
        getCreditPaymentList();
    };

    /**
     * 取得可以使用的信用证列表。
     */
    function getCreditListByLoan() {
        _basic.get(_host.api_url + '/creditBase?creditStatus=1&loanId=' + $scope.repay.loanId + '&entrustId=' + $scope.repay.entrustId).then(function (data) {
            if (data.success) {
                $scope.creditList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 取得已还款的信用证列表。
     */
    function getCreditPaymentList() {
        // 取得信用证还款列表
        _basic.get(_host.api_url + "/loanRepCreditRel?repaymentId=" + repayId).then(function (data) {
            if (data.success) {
                $scope.loanRepCreditRelList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    // /**
    //  * 点击 追加信用证还款按钮
    //  */
    // $scope.addCreditPayment = function () {
    //
    //     // 未完结ID = 1
    //     var unfinished = $scope.paymentStatus[0].id;
    //     // 信用证号
    //     var creditNumber = $scope.newCreditId;
    //
    //     // 检索用url
    //     // var url = _host.api_url + "/credit?creditNumber=" + creditNumber + "&entrustId=" + $scope.repay.entrustId  + "&creditStatus=" + unfinished;
    //     var url = _host.api_url + "/credit?creditNumber=" + creditNumber + "&entrustId=" + $scope.repay.entrustId;
    //
    //     _basic.get(url).then(function (data) {
    //         if (data.success) {
    //
    //             if (data.result.length === 0) {
    //                 swal("请填写正确的委托方信用证号！", "", "warning");
    //             } else {
    //                 addLoanRepCreditRel(data.result[0].id);
    //             }
    //         } else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };

    /**
     * 新增还款信用证。 TODO 需要根据接口确定，添加过的 信用证 后的按钮 是否 变灰
     * @param creditId 信用证ID
     */
    $scope.addLoanRepCreditRel = function (creditId) {
    // function addLoanRepCreditRel(creditId) {
        // 追加画面数据
        var obj = {
            repaymentId: repayId,
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
    };

    /**
     * 从还款信息中删除指定信用证。 TODO ，追加一个判断，最好接口处理，接口判断：信用证关联的车辆，是否已经还款，还款了，则不能移除
     * @param creditId 信用证ID
     */
    $scope.deleteCreditPayment = function ($event, creditId) {
        // 阻止事件冒泡到父元素，阻止任何父事件处理程序被执行。
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
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + repayId + '/credit/' + creditId, {}).then(
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
    $scope.getCreditCarRel = function (creditId) {
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
     * 打开【修改车辆手续费】模态画面。
     */
    $scope.openEditCarServiceFeeDiv = function (creditId, carId, lcHandlingFee, bankServicesFee) {
        // 打开画面
        $('.modal').modal();
        $('#editCarServiceFeeDiv').modal('open');

        // 信用证ID
        $scope.editCreditId = creditId;
        // car id
        $scope.editCarId = carId;
        // lc fee
        $scope.editLcFee = lcHandlingFee;
        // bank service fee
        $scope.editBankServicesFee = bankServicesFee;

        // 激活label状态
        $('#lcFeeLabel').addClass('active');
        $('#bankServiceFeeLabel').addClass('active');
    };

    // 修改车辆手续费
    $scope.editCarServiceFee=function () {
        _basic.put(_host.api_url + "/user/" + userId + "/credit/" + $scope.editCreditId + '/car/' + $scope.editCarId ,{
            lcHandlingFee: $scope.editLcFee,
            bankServicesFee: $scope.editBankServicesFee
        }).then(function (data) {
            if (data.success) {
                // $('.modal').modal();
                $('#editCarServiceFeeDiv').modal('close');
                $scope.getCreditCarRel($scope.editCreditId);
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 信用证关联车辆，进行支付，或者，取消支付
     * @param creditId 信用证号
     * @param carId 车辆ID
     * @param selectRepaymentId 车辆关联还款编号
     */
    $scope.setCreditCarRepRel = function (creditId, carId, selectRepaymentId) {
        var repaymentId = 0;
        var title = '';
        if (selectRepaymentId === 0) {
            repaymentId = repayId;
            title = '确定要支付该车辆吗？';
        } else {
            title = '确定要移除该支付吗？';
            if (selectRepaymentId !== parseInt(repayId)) {
                swal("不能移除非本次还款的支付！", "", "error");
                return;
            }
        }

        swal({
                title: title,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.put(_host.api_url + "/user/" + userId + "/credit/" + creditId + '/car/' + carId + '/creditCarRepRel', {repaymentId: repaymentId}).then(
                    function (data) {
                        if (data.success === true) {
                            // 成功后，刷新页面数据
                            $scope.getCreditCarRel(creditId);
                            // 取得 信用证还款金额
                            queryCreditRepMoney();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
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

        // 清空 支付编号
        $scope.newOtherPaymentId = "";

        // 取得其他还款 还款信息
        getOtherPaymentInfo();
    };

    /**
     * 取得其他还款 还款信息。
     */
    function getOtherPaymentInfo() {
        _basic.get(_host.api_url + "/paymentLoanRepRel?repaymentId=" + repayId).then(function (data) {
            if (data.success) {
                $scope.loanRepPaymentRelList = data.result;
                // 取得 其他方式还款金额
                queryOtherRepMoney();
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
            repaymentId: repayId,
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
     * 从还款信息中删除指定还款。
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
                _basic.delete(_host.api_url + "/user/" + userId + "/repayment/" + repayId + '/payment/' + paymentId, {}).then(
                    function (data) {
                        if (data.success) {
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
                var obj = {thisPaymentMoney : paymentInfo.this_payment_money === "" ? 0 : paymentInfo.this_payment_money};
                // 修改本次支付金额
                var url = _host.api_url + "/user/" + userId + "/repayment/" + repayId + "/payment/" + paymentInfo.payment_id + "/paymentRepMoney" ;
                _basic.put(url, obj).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        $scope.lookOtherPayment();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * 本次应还总金额/剩余未还金额 计算用方法。
     */
    $scope.calculatePaymentMoney = function () {
        // 利率/天
        var rate = 0.0333;
        if ($scope.repay.rate !== "") {
            rate = parseFloat($scope.repay.rate);
        }
        // 利息 = 利率/天 * 本次还贷金额 * 产生利息时长
        $scope.repay.interest = rate * $scope.repay.paymentMoney * $scope.repay.interestDay / 100;
        $scope.repay.interest = $scope.repay.interest.toFixed(2);

        // 本次还贷金额
        var paymentMoney = 0;
        if ($scope.repay.paymentMoney !== "") {
            paymentMoney = parseFloat($scope.repay.paymentMoney);
        }
        // 本次应还总金额 = 本次还贷金额 + 利息
        $scope.repay.totalPaymentMoney = paymentMoney + parseFloat($scope.repay.interest);
        $scope.repay.totalPaymentMoney = $scope.repay.totalPaymentMoney.toFixed(2);
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
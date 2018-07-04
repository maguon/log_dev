/**
 * 主菜单：财务管理 -> 贷入还款(详细) 控制器
 */
app.controller("finance_loan_in_repay_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state","_baseService", function ($scope, $stateParams, _basic, _host, _config, $state,_baseService) {
    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);
    // 还款编号
    var repayId = $stateParams.id;

    // 支付状态
    $scope.paymentStatus = _config.paymentStatus;

    // 金融还贷 基本信息
    $scope.repay = {};

    // 金融还贷 基本信息 贷入编号信息
    $scope.loanInfo = {};

    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_loan_in_repay_detail"}, {reload: true})
    };

    /**
     * 查询还款记录基本信息。
     */
    function queryLoanRepaymentById(){
        // 检索用url
        var url = _host.api_url + "/loanIntoRepayment?repaymentId=" + repayId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 贷入还款编号
                    $scope.repay.repaymentId = repayId;
                    // 还款状态
                    $scope.repay.repaymentStatus = data.result[0].repayment_status;
                    // 还款时间
                    $scope.repay.repaymentDate = data.result[0].created_on;


                    // 贷入编号
                    $scope.repay.loanId = data.result[0].loan_into_id;

                    // 取得贷入编号 信息
                    getLoanInfo($scope.repay.loanId);

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
                    $scope.repay.totalPaymentMoney = data.result[0].repayment_total_money;

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
     * 获取贷入基本信息
     * @param loanId 贷入编号
     */
    function getLoanInfo(loanId) {
        // 基本检索URL
        var url = _host.api_url + "/loanInto?loanIntoId=" + loanId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 追加 基本信息显示区域
                    $scope.hasLoanInfo = true;

                    // 贷入公司
                    $scope.loanInfo.companyName = data.result[0].company_name;
                    // 贷入编号
                    $scope.loanInfo.id = data.result[0].id;
                    // 贷入时间
                    $scope.loanInfo.loanStartDate = data.result[0].loan_into_start_date;
                    // 贷入总金额(美元)
                    $scope.loanInfo.loanMoney = data.result[0].loan_into_money;
                    // 未还本金(美元)
                    $scope.loanInfo.notRepaymentMoney = data.result[0].not_repayment_money;
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
                        loanIntoId: $scope.repay.loanId,
                        repaymentMoney: $scope.repay.paymentMoney,
                        rate: $scope.repay.rate === "" ? 0.0222 : $scope.repay.rate,
                        dayCount: $scope.repay.interestDay,
                        interestMoney: $scope.repay.interest,
                        fee: $scope.repay.poundage === "" ? 0 : $scope.repay.poundage,
                        repaymentTotalMoney: $scope.repay.totalPaymentMoney,
                        remark: $scope.repay.remark
                    };
                    // 修改本次支付金额
                    _basic.put(_host.api_url + "/user/" + userId + "/loanIntoRepayment/" + $scope.repay.repaymentId, obj).then(function (data) {
                        if (data.success) {
                            swal("保存成功", "", "success");

                            // 刷新 还款记录 画面
                            queryLoanRepaymentById();
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
                var url = _host.api_url + "/user/" + userId + "/loanIntoRepayment/" + repayId + "/repaymentStatus/" + $scope.paymentStatus[1].id;

                _basic.put(url, {}).then(function (data) {
                    if (data.success) {
                        queryLoanRepaymentById();
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
        var rate = 0.0222;
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

        // 手续费
        var poundage = 0;
        if ($scope.repay.poundage !== "") {
            poundage = parseFloat($scope.repay.poundage);
        }

        // 本次应还总金额 = 本次还贷金额 + 利息 + 手续费
        $scope.repay.totalPaymentMoney = paymentMoney + parseFloat($scope.repay.interest) + poundage;
        $scope.repay.totalPaymentMoney = $scope.repay.totalPaymentMoney.toFixed(2);
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 默认显示 还款基本信息
        queryLoanRepaymentById();
    };
    $scope.initData();
}]);
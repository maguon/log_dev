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
    // 支付方式
    $scope.paymentType = _config.paymentType;

    // 金融贷入(TAB1) 订单 基本信息
    $scope.loanInfo = {};

    // 还款记录(TAB2) 基本信息
    $scope.paymentInfo = {};

    // 还款记录(TAB2) 新增还款 基本信息
    $scope.newPayment = {};

    // 还款记录(TAB2) 新增还款 信用证还款
    $scope.creditPayment = {};

    // 还款记录(TAB2) 新增还款 其他方式还款
    $scope.otherPayment = {};

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
        $('.tabWrap .lookLoanFinfoDiv').addClass("active");
        $("#lookLoanFinfoDiv").addClass("active");
        $("#lookLoanFinfoDiv").show();

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
     * Tab跳转 2: 还款记录
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

        if ($scope.modalFlag === "newPaymentInfo") {
            // 本次还贷金额(美元)
            $scope.newPayment.paymentMoney = "";
            // 利率
            $scope.newPayment.rate = 0.0222;
            // 产生利息金额(美元)
            $scope.newPayment.principal = 0;
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
                rate: $scope.newPayment.rate === "" ? 0 : $scope.newPayment.rate,
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



        // if ($scope.tabId === "paymentInfo") {
        //     swal({
        //             title: "确定修改本次还款信息吗？",
        //             type: "warning",
        //             showCancelButton: true,
        //             confirmButtonColor: "#DD6B55",
        //             confirmButtonText: "确认",
        //             cancelButtonText: "取消",
        //             closeOnConfirm: true
        //         },
        //         function () {
        //             var obj = {
        //                 loanId: loanId,
        //                 repaymentMoney: $scope.newPayment.paymentMoney,
        //                 rate: $scope.newPayment.rate === "" ? 0 : $scope.newPayment.rate,
        //                 createInterestMoney: $scope.newPayment.principal,
        //                 dayCount: $scope.newPayment.interestDay,
        //                 interestMoney: $scope.newPayment.interest,
        //                 fee: $scope.newPayment.poundage === "" ? 0 : $scope.newPayment.poundage,
        //                 remark: $scope.newPayment.remark
        //             };
        //             // 修改本次支付金额
        //             var url = _host.api_url + "/user/" + userId + "/repayment/" + $scope.newPayment.repaymentId;
        //             _basic.put(url, obj).then(function (data) {
        //                 if (data.success) {
        //                     // 关闭模态
        //                     $('#saveLoanPaymentDiv').modal('close');
        //                     // 查询还款记录列表
        //                     $scope.lookPaymentHistory();
        //                 } else {
        //                     swal(data.msg, "", "error");
        //                 }
        //             })
        //         });
        // } else {
        //     // 关闭模态
        //     $('#saveLoanPaymentDiv').modal('close');
        // }
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
        $scope.newPayment.leftPaymentMoney = parseFloat($scope.paymentInfo.leftPaymentMoney) - paymentMoney;
        $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney < 0 ? 0 : $scope.newPayment.leftPaymentMoney;
        $scope.newPayment.leftPaymentMoney = $scope.newPayment.leftPaymentMoney.toFixed(2);
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得贷入公司列表
        getLoanIntoCompany();
        // 默认显示 贷入信息 TAB
        $scope.lookLoanInfo();
    };
    $scope.initData();
}]);
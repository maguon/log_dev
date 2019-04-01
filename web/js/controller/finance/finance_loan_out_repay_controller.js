/**
 * 主菜单：财务管理 -> 贷出还款 控制器
 */
app.controller("finance_loan_out_repay_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams","_baseService", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams,_baseService) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 支付状态
    $scope.paymentStatus = _config.paymentStatus;
    // 支付方式
    $scope.paymentType = _config.paymentType;

    // 新增还款 基本画面数据
    $scope.repay = {};

    // 新增还款 默认数据
    $scope.newRepay = {
        // 委托方性质
        entrustType: "",
        // 委托方
        entrustId: "",
        entrustNm: "",
        // 贷出编号
        loanId: "",
        // 本次还贷金额
        paymentMoney: "",
        // 利率/天
        rate: 0.0333,
        // 产生利息时长(天)
        interestDay: 1,
        // 利息(美元)
        interest: 0,
        // 手续费(美元)
        poundage: 0,
        // 手续费(美元)
        realPaymentMoney: 0,
        // 备注
        remark: ""
    };

    // 新增还款 基本画面 选中贷出编号信息
    $scope.loanInfo = {};
    // 新增还款 信用证还款
    $scope.creditPayment = {};
    // 新增还款 其他方式还款
    $scope.otherPayment = {};

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryLoanRepayment() {
        // 基本检索URL
        var url = _host.api_url + "/loanRepayment?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {
            if (data.success) {

                // 保存选中委托方名称
                conditionsObj.entrustNm = $scope.condEntrustNm;

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "finance_loan_out_repay",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                $scope.loanRepaymentList = data.result;
                $scope.loanRepaymentList = $scope.loanRepaymentList.slice(0, 10);
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
     * 数据导出
     */
    $scope.export = function () {
        // 基本检索URL
        var url = _host.api_url + "/loanRepayment.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        // 还款编号
        $scope.condRepaymentId = conditions.repaymentId;
        // 委托方
        $scope.condEntrustId = conditions.entrustId;
        // 关联贷出订单编号
        $scope.condLoanId = conditions.loanId;
        // 还款状态
        $scope.condRepaymentStatus = conditions.repaymentStatus;
        // 信用证号
        $scope.condCreditId = conditions.creditId;
        // 支付编号
        $scope.condPaymentId = conditions.paymentId;
        // 还款时间 开始
        $scope.condCreatedOnStart = conditions.createdOnStart;
        // 还款时间 终了
        $scope.condCreatedOnEnd = conditions.createdOnEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // 还款编号
            repaymentId: $scope.condRepaymentId,
            // 委托方
            entrustId: $scope.condEntrustId,
            // 关联贷出订单编号
            loanId: $scope.condLoanId,
            // 还款状态
            repaymentStatus: $scope.condRepaymentStatus,
            // 信用证号
            creditId: $scope.condCreditId,
            // 支付编号
            paymentId: $scope.condPaymentId,
            // 还款时间 开始
            createdOnStart: $scope.condCreatedOnStart,
            // 还款时间 终了
            createdOnEnd: $scope.condCreatedOnEnd
        };
    }

    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryLoanRepaymentInfo = function () {
        // 默认第一页
        $scope.start = 0;
        queryLoanRepayment();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        queryLoanRepayment();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryLoanRepayment();
    };

    /**
     * 打开【新增还款】模态画面。
     */
    $scope.openNewFinanceRepayDiv = function () {
        $('.modal').modal();
        $('#newRepayDiv').modal('open',{
            // 新增还款 模态打开时触发
            ready : function () {},
            // 新增还款 模态关闭时触发
            complete : function () {}
        });
        // 新增还款 基本信息
        $scope.lookPaymentInfo();
    };

    /**
     * Tab跳转 基本信息
     */
    $scope.lookPaymentInfo = function () {
        // 显示画面
        $('.tabWrap .modal_tab').removeClass("active");
        $(".modal_tab_box ").removeClass("active");
        $(".modal_tab_box ").hide();
        $('.tabWrap .paymentInfoDiv').addClass("active");
        $("#paymentInfoDiv").addClass("active");
        $("#paymentInfoDiv").show();
        // TAB 画面ID：基本信息
        $scope.tabId = "paymentInfo";

        // 初始数据
        angular.copy($scope.newRepay, $scope.repay);

        // 取得下拉列表数据
        $("#addEntrustSelect").val(null).trigger("change");
        // 隐藏 贷出信息 显示区域
        $scope.hasLoanInfo = false;
        $scope.loanList = [];
        $scope.loanInfo = {};
    };

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

                    // 本次还贷金额(美元)
                    $scope.repay.paymentMoney = "";
                    // 利率/天
                    $scope.repay.rate = 0.0333;

                    // 当前 日期
                    var now = moment(new Date()).format('YYYY-MM-DD');
                    // 利息起算 日期
                    var loanStartDate = moment($scope.loanInfo.loanStartDate).format("YYYY-MM-DD");
                    // 产生利息时长(天)
                    $scope.repay.interestDay = _baseService.dateDiffIncludeToday(loanStartDate, now);

                    // 利息(美元)
                    $scope.repay.interest = 0;
                    // 手续费(美元)
                    $scope.repay.poundage = 0;
                    // 本次应还总金额(美元)
                    $scope.repay.totalPaymentMoney = 0;
                    // // 剩余未还金额(美元)
                    // $scope.repay.leftPaymentMoney = $scope.loanInfo.notRepaymentMoney;
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
     * Tab跳转 其他方式还款
     */
    $scope.gotoNextPage = function () {
        if ($scope.tabId === "paymentInfo") {
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
            $('#newRepayDiv').modal('close');
        }
    };

    /**
     * 新增还款基本信息。
     */
    function addLoanRepayment() {
        // 必须项：委托方，贷出编号，本次还贷金额，产生利息时长
        if ($scope.repay.entrustId !== "" && $scope.repay.loanId !== "" && $scope.repay.paymentMoney !== "" && $scope.repay.interestDay !== "") {
            // 追加画面数据
            var obj = {
                // 贷出编号
                loanId: $scope.repay.loanId,
                // 本次还贷金额(美元)
                repaymentMoney: $scope.repay.paymentMoney,
                // 利率/天
                rate: $scope.repay.rate === "" ? 0.0333 : $scope.repay.rate,
                // 产生利息金额(美元)
                createInterestMoney: $scope.loanInfo.notRepaymentMoney,
                // 产生利息时长(天)
                dayCount: $scope.repay.interestDay,
                // 利息(美元)
                interestMoney: $scope.repay.interest,
                // 手续费
                fee: $scope.repay.poundage === "" ? 0 : $scope.repay.poundage,
                // 备注
                remark: $scope.repay.remark
            };
            _basic.post(_host.api_url + "/user/" + userId + "/loanRepayment", obj).then(function (data) {
                if (data.success) {
                    // 取得 还款编号
                    $scope.repay.repaymentId = data.id;
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
                    $scope.creditPayment.totalPaymentMoney = $scope.repay.totalPaymentMoney;
                    // 未还金额(美元)
                    $scope.creditPayment.leftPaymentMoney = $scope.repay.totalPaymentMoney;
                    // 清空 信用证号
                    $scope.newCreditId = "";
                    // 清空信用证列表
                    $scope.loanRepCreditRelList = {};

                    // 刷新 还款记录 画面
                    queryLoanRepayment();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写必需还款信息！", "", "warning");
        }
    }

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

        // 手续费
        var poundage = 0;
        if ($scope.repay.poundage !== "") {
            poundage = parseFloat($scope.repay.poundage);
        }

        // 本次应还总金额 = 本次还贷金额 + 利息 + 手续费
        $scope.repay.totalPaymentMoney = paymentMoney + parseFloat($scope.repay.interest) + poundage;
        $scope.repay.totalPaymentMoney = $scope.repay.totalPaymentMoney.toFixed(2);

        // // 剩余未还金额 = 前次未还本金 - 本次还贷金额
        // $scope.repay.leftPaymentMoney = parseFloat($scope.loanInfo.notRepaymentMoney) - paymentMoney;
        // $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney < 0 ? 0 : $scope.repay.leftPaymentMoney;
        // $scope.repay.leftPaymentMoney = $scope.repay.leftPaymentMoney.toFixed(2);
    };

    /**
     * 点击 追加信用证还款按钮
     */
    $scope.addCreditPayment = function () {

        // 未完结ID = 1
        var unfinished = $scope.paymentStatus[0].id;
        // 信用证号
        var creditNumber = $scope.newCreditId;

        // 检索用url
        var url = _host.api_url + "/credit?creditNumber=" + creditNumber + "&entrustId=" + $scope.repay.entrustId;
        // var url = _host.api_url + "/credit?creditNumber=" + creditNumber + "&entrustId=" + $scope.repay.entrustId  + "&creditStatus=" + unfinished;
        _basic.get(url).then(function (data) {
            if (data.success) {

                if (data.result.length === 0) {
                    swal("请填写正确的委托方信用证号！", "", "warning");
                } else {
                    // 若输入为正确的信用证号，则 追加信用证关联
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
            // 还款编号
            repaymentId: $scope.repay.repaymentId,
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
     * 取得信用证 还款信息。
     */
    function getCreditPaymentInfo() {

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
                        if (data.success) {
                            // 取得信用证 还款信息
                            getCreditPaymentInfo();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 点击 追加其他还款按钮
     */
    $scope.addOtherPayment = function () {

        // 未完结
        var unfinished = $scope.paymentStatus[0].id;
        // 支付编号
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
     * @param paymentId 支付编号
     */
    function addLoanRepPaymentRel(paymentId) {
        // 追加画面数据
        var obj = {
            // 还款编号
            repaymentId: $scope.repay.repaymentId,
            paymentId: paymentId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/paymentLoanRepRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.newOtherPaymentId = "";
                // 取得信用证 还款信息
                getOtherPaymentInfo();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * 取得其他还款 还款信息。
     */
    function getOtherPaymentInfo() {
        // 已还金额
        $scope.otherPayment.paymentMoney = 0;

        // 取得信用证还款列表
        _basic.get(_host.api_url + "/paymentLoanRepRel?repaymentId=" + $scope.repay.repaymentId).then(function (data) {
            if (data.success) {
                $scope.loanRepPaymentRelList = data.result;
                // 计算已还金额
                for (var i = 0; i < $scope.loanRepPaymentRelList.length; i++) {
                    if ($scope.loanRepPaymentRelList[i].this_payment_money == null) {
                        $scope.loanRepPaymentRelList[i].this_payment_money = 0;
                    }
                    $scope.otherPayment.paymentMoney = $scope.loanRepPaymentRelList[i].this_payment_money + $scope.otherPayment.paymentMoney;
                }

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
                        if (data.success) {
                            // 取得信用证 还款信息
                            getOtherPaymentInfo();
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
                var url = _host.api_url + "/user/" + userId + "/repayment/" + paymentInfo.repayment_id + "/payment/" + paymentInfo.payment_id + "/paymentRepMoney" ;

                _basic.put(url, obj).then(function (data) {
                    if (data.success) {
                        // 取得信用证 还款信息
                        getOtherPaymentInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * 清空委托方选中
     */
    $scope.clearSelectEntrust = function () {
        $scope.condEntrustId = "";
        $scope.condEntrustNm = "委托方";
        $("#select2-condEntrustSelect-container").text("委托方").trigger("change");

        $scope.repay.entrustId = "";
        $scope.repay.entrustNm = "委托方";
        $("#select2-addEntrustSelect-container").text("委托方").trigger("change");
    };

    /**
     * 获取 指定委托方 对应的 信用证 列表
     * @param entrustId 委托方ID
     */
    function getCreditList(entrustId) {
        // 基本检索URL
        var url = _host.api_url + "/credit?entrustId=" + entrustId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.creditList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取 指定委托方 对应的 支付编号 列表
     * @param entrustId 委托方ID
     */
    function getPaymentList(entrustId) {
        // 基本检索URL
        var url = _host.api_url + "/payment?entrustId=" + entrustId;
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.paymentList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取 指定委托方 对应的 贷出编号 列表
     * @param entrustId 委托方ID
     */
    function getLoanList(entrustId) {
        // 基本检索URL
        var url = _host.api_url + "/loan?entrustId=" + entrustId + "&loanStatusArr=2,3";
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.loanList = data.result;
                $scope.loanList = $scope.loanList.slice(0, 10);
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取委托方信息
     * @param selectText 默认选中项文字
     */
    $scope.getEntrustInfo = function (selectText) {

        // 取得委托方url
        var url = _host.api_url + "/entrust";

        // 检索画面 委托方select2初期化
        $('#condEntrustSelect').select2({
            // 因为有返回时默认值，所以动态赋值
            placeholder: selectText,
            containerCssClass: 'select2_dropdown',
            ajax : {
                type:'GET',
                url : url,
                dataType : 'json',
                delay : 400,
                data : function(params) {
                    return {
                        // 检索条件 检索画面委托方性质
                        entrustType : $scope.condEntrustType,
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
            allowClear: true
        }).on("select2:unselecting", function(e) {
            $scope.condEntrustId = "";
            $scope.condEntrustNm = "委托方";
            // 选中某个委托方后，触发事件
        }).on('change', function () {
            // 委托方 下拉选中 内容
            if ($("#condEntrustSelect").val() != null && $("#condEntrustSelect").val() !== "") {
                $scope.condEntrustId = $("#condEntrustSelect").select2("data")[0].id;
                $scope.condEntrustNm = $("#condEntrustSelect").select2("data")[0].text;
            }
            // 信用证号 列表
            getCreditList($scope.condEntrustId);
            // 支付编号 列表
            getPaymentList($scope.condEntrustId);
        });

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
                        // 检索条件 新增画面委托方性质
                        entrustType : $scope.repay.entrustType,
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
            // templateResult: function(item) {
            //     // Display institution name as tag option
            //     return $("<div>" + item.text + "</div>");
            // },
            // templateSelection: function(item) {
            //     // Display institution name as tag option
            //     return $("<div>" + item.text + "</div>");
            // }
            allowClear: true
        })
        // 选中某个委托方后，触发事件
        .on('change', function () {
        // .on("select2:select", function () {
            // if($('#newRepayDiv').hasClass('open')){
            // }
            // 這裡呼叫回調並傳入現在選取的 value
            // self.params.onChange(this.value)

            // 委托方 下拉选中 内容
            if ($("#addEntrustSelect").val() != null && $("#addEntrustSelect").val() !== "") {
                $scope.repay.entrustId = $("#addEntrustSelect").select2("data")[0].id;
                $scope.repay.entrustNm = $("#addEntrustSelect").select2("data")[0].text;
            }

            if ($scope.repay.entrustId !== "") {
                getLoanList($scope.repay.entrustId);
            }
        });
        // $("#condEntrustSelect").val(null).trigger("change");
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {

        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "finance_loan_out_repay_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "finance_loan_out_repay") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                // 委托方（select2）选择项
                $scope.condEntrustNm = pageItems.conditions.entrustNm;
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
            // 初始显示时，委托方名称 默认项：委托方
            $scope.condEntrustNm = "委托方";
        }

        // 取得 检索条件：委托方信息 列表
        $scope.getEntrustInfo($scope.condEntrustNm);
        // 取得 检索条件：信用证号 列表
        getCreditList("");
        // 取得 检索条件：支付编号 列表
        getPaymentList("");

        // 查询数据
        queryLoanRepayment();
    }
    initData();
}]);
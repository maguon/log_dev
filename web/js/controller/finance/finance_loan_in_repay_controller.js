/**
 * 主菜单：财务管理 -> 贷入还款 控制器
 */
app.controller("finance_loan_in_repay_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams","_baseService", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams,_baseService) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 支付状态
    $scope.paymentStatus = _config.paymentStatus;

    // 新增还款 基本画面数据
    $scope.repay = {};

    // 新增还款 默认数据
    $scope.newRepay = {
        // 贷入公司
        loanCoId: "",
        // 贷入编号
        loanId: "",
        // 归还本金
        paymentMoney: "",
        // 备注
        remark: ""
    };

    // 新增还款 基本画面 选中贷入编号信息
    $scope.loanInfo = {};

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryLoanRepayment() {
        // 基本检索URL
        var url = _host.api_url + "/loanIntoRepayment?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {
            if (data.success) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "finance_loan_in_repay",
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
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        // 贷入还款编号
        $scope.condRepaymentId = conditions.repaymentId;
        // 贷入公司
        $scope.condLoanCoId = conditions.loanIntoCompanyId;
        // 贷入编号
        $scope.condLoanInId = conditions.loanIntoId;
        // 还款时间 开始
        $scope.condCreatedOnStart = conditions.createdOnStart;
        // 还款时间 终了
        $scope.condCreatedOnEnd = conditions.createdOnEnd;
        // 还款状态
        $scope.condRepaymentStatus = conditions.repaymentStatus;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // 贷入还款编号
            repaymentId: $scope.condRepaymentId,
            // 贷入公司
            loanIntoCompanyId: $scope.condLoanCoId,
            // 贷入编号
            loanIntoId: $scope.condLoanInId,
            // 还款时间 开始
            createdOnStart: $scope.condCreatedOnStart,
            // 还款时间 终了
            createdOnEnd: $scope.condCreatedOnEnd,
            // 还款状态
            repaymentStatus: $scope.condRepaymentStatus
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
        // 初始数据
        angular.copy($scope.newRepay, $scope.repay);

        // 贷入编号列表 初期为空
        $scope.loanList = [];
    };

    /**
     * 获取 贷入公司 对应的 贷入编号 列表
     */
    $scope.getLoanList = function (loanCoId) {
        // 基本检索URL
        var url = _host.api_url + "/loanInto?loanIntoCompanyId=" + loanCoId + "&loanIntoStatusArr=2,3";
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.loanList = data.result;
                $scope.loanList = $scope.loanList.slice(0, 10);
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 新增还款基本信息。
     */
    $scope.addLoanRepayment = function () {
        // 必须项：贷入公司，贷入编号，归还本金
        if ($scope.repay.loanCoId !== "" && $scope.repay.loanId !== "" && $scope.repay.paymentMoney !== "") {

            // 基本检索URL
            var url = _host.api_url + "/loanInto?loanIntoId=" + $scope.repay.loanId;

            _basic.get(url).then(function (data) {
                if (data.success) {
                    if (data.result.length > 0) {

                        // 当前 日期
                        var now = moment(new Date()).format('YYYY-MM-DD');
                        // 利息起算 日期
                        var loanStartDate = moment(data.result[0].loan_into_start_date).format("YYYY-MM-DD");
                        // 产生利息时长(天)
                        var dayCount = _baseService.dateDiffIncludeToday(loanStartDate, now);

                        var rate = 0.0222;
                        // 利息 = 本次还贷金额 * 利率/天 * 产生利息时长
                        var interestMoney = $scope.repay.paymentMoney * rate * dayCount / 100;
                        interestMoney = interestMoney.toFixed(2);

                        // 手续费(美元)
                        var poundage = 0;
                        // 本次应还总金额(美元)
                        var totalPaymentMoney = parseFloat($scope.repay.paymentMoney) + parseFloat(interestMoney) + parseFloat(poundage);

                        // 追加画面数据
                        var obj = {
                            // 贷入编号
                            loanIntoId: $scope.repay.loanId,
                            // 归还本金(美元)
                            repaymentMoney: $scope.repay.paymentMoney,
                            // 利率/天
                            rate: rate,
                            // 产生利息时长(天)
                            dayCount: dayCount,
                            // 利息(美元)
                            interestMoney: interestMoney,
                            // 手续费
                            fee: poundage,
                            // 本次还款总额
                            repaymentTotalMoney: totalPaymentMoney,
                            // 备注
                            remark: $scope.repay.remark
                        };

                        _basic.post(_host.api_url + "/user/" + userId + "/loanIntoRepayment", obj).then(function (data) {
                            if (data.success) {
                                $('#newRepayDiv').modal('close');
                                // 跳转到 详情画面
                                $state.go('finance_loan_in_repay_detail', {
                                    reload: true,
                                    id: data.id,
                                    from: 'finance_loan_in_repay'
                                });
                            } else {
                                swal(data.msg, "", "error");
                            }
                        })
                    }
                } else {
                    swal(data.msg, "", "error");
                }
            });
        } else {
            swal("请填写必需还款信息！", "", "warning");
        }
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

        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "finance_loan_in_repay_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "finance_loan_in_repay") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }

        // 取得贷入公司列表
        getLoanIntoCompany();

        // 查询数据
        queryLoanRepayment();
    };
    $scope.initData();
}]);
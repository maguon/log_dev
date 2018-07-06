/**
 * 主菜单：财务管理 -> 金融贷入 控制器
 */
app.controller("finance_loan_in_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 金融贷入 状态
    $scope.loanStatus = _config.loanInStatus;

    // 新增 画面金融贷入显示用数据
    $scope.loanInfo = {};

    // 新增金融贷入 默认数据
    $scope.newLoanInfo = {
        // 贷入公司
        loanCo: "",
        // 贷入金额
        loanMoney: "",
        // 备注
        remark: ""
    };

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryFinanceLoanList() {
        // 基本检索URL
        var url = _host.api_url + "/loanInto?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {
            if (data.success) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "finance_loan_in",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                $scope.financeLoanInfo = data.result;
                $scope.financeLoanList = $scope.financeLoanInfo.slice(0, 10);
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
        var url = _host.api_url + "/loanInto.csv";
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
        // 贷入编号
        $scope.condLoanId = conditions.loanId;
        // 贷入公司
        $scope.condLoanCoId = conditions.loanIntoCompanyId;
        // 贷入状态
        $scope.condLoanStatus = conditions.loanIntoStatus;
        // 贷入日期 开始
        $scope.condLoanIntoStartDateStart = conditions.loanIntoStartDateStart;
        // 贷入日期 终了
        $scope.condLoanIntoStartDateEnd = conditions.loanIntoStartDateEnd;
        // 完结日期 开始
        $scope.condLoanEndDateStart = conditions.loanIntoEndDateStart;
        // 完结日期 终了
        $scope.condLoanEndDateEnd = conditions.loanIntoEndDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // 贷入编号
            loanIntoId: $scope.condLoanId,
            // 贷入公司
            loanIntoCompanyId: $scope.condLoanCoId,
            // 贷入状态
            loanIntoStatus: $scope.condLoanStatus,
            // 贷入日期 开始
            loanIntoStartDateStart: $scope.condLoanIntoStartDateStart,
            // 贷入日期 终了
            loanIntoStartDateEnd: $scope.condLoanIntoStartDateEnd,
            // 完结日期 开始
            loanIntoEndDateStart: $scope.condLoanEndDateStart,
            // 完结日期 终了
            loanIntoEndDateEnd: $scope.condLoanEndDateEnd
        };
    }

    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryFinanceLoanInfo = function () {
        // 默认第一页
        $scope.start = 0;
        queryFinanceLoanList();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        queryFinanceLoanList();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryFinanceLoanList();
    };

    /**
     * 打开【新增金融贷入】模态画面。
     */
    $scope.openNewFinanceLoanDiv = function () {
        $('.modal').modal();
        $('#newFinanceLoanDiv').modal('open');

        // 初始数据
        angular.copy($scope.newLoanInfo, $scope.loanInfo);

        // textarea 高度调整
        $('#remarkText').val('');
        $('#remarkText').trigger('autoresize');

    };

    /**
     * 新增 金融贷入。
     */
    $scope.addFinanceLoan = function () {

        if ($scope.loanInfo.loanCo !== "" && $scope.loanInfo.loanMoney !== "") {
            var obj = {
                // 贷入公司
                loanIntoCompanyId: $scope.loanInfo.loanCo,
                // 贷入金额
                loanIntoMoney: $scope.loanInfo.loanMoney,
                // 备注
                remark: $scope.loanInfo.remark
            };

            // 新增金融贷入。
            _basic.post(_host.api_url + "/user/" + userId + "/loanInto", obj).then(function (data) {
                if (data.success) {
                    $('#newFinanceLoanDiv').modal('close');
                    // 跳转到 详情画面
                    $state.go('finance_loan_in_detail', {
                        reload: true,
                        id: data.id,
                        from: 'finance_loan_in'
                    });
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整贷入信息！", "", "warning");
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
        if ($stateParams.from === "finance_loan_in_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "finance_loan_in") {
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
        queryFinanceLoanList();
    };
    $scope.initData();
}]);


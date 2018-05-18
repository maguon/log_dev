/**
 * 主菜单：财务管理 -> 金融贷出 控制器
 */
app.controller("finance_loan_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams","$filter", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams,$filter) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 金融贷出 状态
    $scope.loanStatus = _config.loanStatus;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;

    // 新增/修改 画面金融贷出显示用数据
    $scope.loanInfo = {};

    // 新增金融贷出 默认数据
    $scope.newLoanInfo = {
        // 委托方性质
        entrustType: "",
        // 委托方
        entrustId: "",
        entrustNm: "",
        // 定金
        deposit: 0,
        // 贷出金额(美元)
        loanMoney: "",
        // 备注
        remark: ""
    };

    /***************************** 华丽的分割线 TODO start ***********************************/

    // 检索条件 委托方
    $scope.condEntrustId = "";

    /***************************** 华丽的分割线 TODO end ***********************************/

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryFinanceLoanList() {
        // 基本检索URL
        var url = _host.api_url + "/financialLoan?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {
            if (data.success === true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "finance_loan",
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
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        // 贷出编号
        $scope.condLoanId = financialLoanId;
            // 委托方性质
        $scope.condEntrustType = entrustType;
            // 委托方
        $scope.condEntrustId = entrustId;
            // 订单状态
        $scope.condLoanStatus = loanStatus;
            // 贷款时间 开始
        $scope.condCreatedOnStart = createdOnStart;
            // 贷款时间 终了
        $scope.condCreatedOnEnd = createdOnEnd;
            // 完结时间 开始
        $scope.condLoanEndDateStart = createdOnStart;
            // 完结时间 终了
        $scope.condLoanEndDateEnd = createdOnEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // 贷出编号
            financialLoanId: $scope.condLoanId,
            // 委托方性质
            entrustType: $scope.condEntrustType,
            // 委托方
            entrustId: $scope.condEntrustId,
            // 订单状态
            loanStatus: $scope.condLoanStatus,
            // 贷款时间 开始
            createdOnStart: $scope.condCreatedOnStart,
            // 贷款时间 终了
            createdOnEnd: $scope.condCreatedOnEnd,
            // 完结时间 开始
            createdOnStart: $scope.condLoanEndDateStart,
            // 完结时间 终了
            createdOnEnd: $scope.condLoanEndDateEnd
        };
    }

    /**
     * 取得检索条件委托方ID。
     */
    function getEntrustId() {
        // 委托方ID
        var entrustId = "";
        if ($("#condEntrustSelect").val() != null && $("#condEntrustSelect").val() !== "") {
            entrustId = $("#condEntrustSelect").select2("data")[0].id;
        }
        return entrustId;
    }

    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryFinanceLoanInfo = function () {
        // 默认第一页
        $scope.start = 0;
        // 检索条件 委托方
        $scope.condEntrustId = getEntrustId();
        queryFinanceLoanList();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        // 检索条件 委托方
        $scope.condEntrustId = getEntrustId();
        queryFinanceLoanList();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        // 检索条件 委托方
        $scope.condEntrustId = getEntrustId();
        queryFinanceLoanList();
    };

    /**
     * 打开【新增金融贷出】模态画面。
     */
    $scope.openNewFinanceLoanDiv = function () {
        $('.modal').modal();
        $('#newFinanceLoanDiv').modal('open');
        // 激活定金label状态
        $('#earnestMoneyLabel').addClass('active');
        // 初始数据
        angular.copy($scope.newLoanInfo, $scope.loanInfo);
        // 获取委托方信息
        $scope.getEntrustInfo();
    };

    /**
     * 新增 金融贷出。
     */
    $scope.addFinanceLoan = function () {

        // 委托方ID
        var entrustId = "";

        // 委托方 下拉选中 内容
        if ($("#addEntrustSelect").val() != null && $("#addEntrustSelect").val() !== "") {
            entrustId = $("#addEntrustSelect").select2("data")[0].id;
        }

        if (entrustId !== "" && $scope.loanInfo.loanMoney !== "") {
            var obj = {
                // 委托方
                entrustId: entrustId,
                // 定金
                deposit: $scope.loanInfo.deposit === "" ? 0 : $scope.loanInfo.deposit,
                // 贷出金额(美元)
                loanMoney: $scope.loanInfo.loanMoney,
                // 备注
                remark: $scope.loanInfo.remark
            };

            // 新增金融贷出。
            _basic.post(_host.api_url + "/user/" + userId + "/financialLoan", obj).then(function (data) {
                if (data.success) {
                    $('#newFinanceLoanDiv').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    queryFinanceLoanList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整贷出信息！", "", "warning");
        }
    };

    /**
     * 获取委托方信息
     * @param type 委托方类型
     */
    $scope.getEntrustInfo = function (type, selectText) {
        var url = _host.api_url + "/entrust";
        if (type != null && type !== undefined) {
            url = _host.api_url + "/entrust?entrustType=" + type;
        }
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.entrustList = data.result;

                // 委托方select2初期化
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $("#addEntrustSelect").val(null).trigger("change");

                // 委托方select2初期化
                $('#condEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $("#condEntrustSelect").val(null).trigger("change");
            }
        });
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 如果是从后画面跳回来时，取得上次检索条件 TODO
        if ($stateParams.from === "finance_loan_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "finance_loan") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
            }
        } else {
            $rootScope.refObj = {pageArray: []};
        }
        // 取得 检索条件：委托方信息
        $scope.getEntrustInfo();

        // 查询数据
        queryFinanceLoanList();
    };
    $scope.initData();
}]);


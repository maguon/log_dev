/**
 * 主菜单：财务管理 -> 金融贷出 控制器
 */
app.controller("finance_loan_out_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams) {

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
        // 可抵押车辆总数
        unMortgageCarCount: 0,
        // 可抵押车辆总值
        unMortgageCarValuation: 0,
        // 定金
        deposit: 0,
        // 贷出金额(美元)
        loanMoney: "",
        // 备注
        remark: ""
    };

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryFinanceLoanList() {

        // 基本检索URL
        var url = _host.api_url + "/loan?start=" + $scope.start + "&size=" + $scope.size;
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
                    pageId: "finance_loan_out",
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
        var url = _host.api_url + "/loan.csv";
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
        // 贷出编号
        $scope.condLoanId = conditions.loanId;
        // 委托方性质
        $scope.condEntrustType = conditions.entrustType;
        // 委托方
        $scope.condEntrustId = conditions.entrustId;
        $scope.condEntrustNm = conditions.entrustNm;
        // 订单状态
        $scope.condLoanStatus = conditions.loanStatus;
        // 贷款时间 开始
        $scope.condLoanStartDateStart = conditions.loanStartDateStart;
        // 贷款时间 终了
        $scope.condLoanStartDateEnd = conditions.loanStartDateEnd;
        // 完结时间 开始
        $scope.condLoanEndDateStart = conditions.loanEndDateStart;
        // 完结时间 终了
        $scope.condLoanEndDateEnd = conditions.loanEndDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // 贷出编号
            loanId: $scope.condLoanId,
            // 委托方性质
            entrustType: $scope.condEntrustType,
            // 委托方
            entrustId: $scope.condEntrustId,
            // 订单状态
            loanStatus: $scope.condLoanStatus,
            // 贷出时间 开始
            loanStartDateStart: $scope.condLoanStartDateStart,
            // 贷出时间 终了
            loanStartDateEnd: $scope.condLoanStartDateEnd,
            // 完结时间 开始
            loanEndDateStart: $scope.condLoanEndDateStart,
            // 完结时间 终了
            loanEndDateEnd: $scope.condLoanEndDateEnd
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
     * 打开【新增金融贷出】模态画面。
     */
    $scope.openNewFinanceLoanDiv = function () {
        $('.modal').modal();
        $('#newFinanceLoanDiv').modal('open');
        // 激活定金label状态
        $('#earnestMoneyLabel').addClass('active');

        // 初始数据
        angular.copy($scope.newLoanInfo, $scope.loanInfo);

        // textarea 高度调整
        $('#remarkText').val('');
        $('#remarkText').trigger('autoresize');

        // 获取委托方信息
        $scope.getEntrustInfo(null,"委托方");
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
            _basic.post(_host.api_url + "/user/" + userId + "/loan", obj).then(function (data) {
                if (data.success) {
                    $('#newFinanceLoanDiv').modal('close');
                    // swal("新增成功", "", "success");
                    // // 成功后，刷新页面数据
                    // queryFinanceLoanList();

                    // 跳转到 详情画面
                    $state.go('finance_loan_out_detail', {
                        reload: true,
                        id: data.id,
                        from: 'finance_loan_out'
                    });
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整贷出信息！", "", "warning");
        }
    };

    // 车辆估值 TAB 画面 数据查询

    /**
     * 根据委托方取得可抵押车辆总数，可抵押车辆总值
     * @param entrustId
     */
    function getCarValuation(entrustId) {
        _basic.get(_host.api_url + "/carMortgageStatusCount?relStatus=1&active=1&entrustId=" + entrustId).then(function (data) {
            if (data.success) {
                if (data.result.length === 0) {
                    // 可抵押车辆总数
                    $scope.loanInfo.unMortgageCarCount = 0;
                    // 可抵押车辆总值
                    $scope.loanInfo.unMortgageCarValuation = 0;
                } else {
                    for (var i = 0; i < data.result.length; i++) {
                        if (data.result[i].mortgage_status === 1) {
                            // 可抵押车辆总数
                            $scope.loanInfo.unMortgageCarCount = data.result[i].car_count;
                            // 可抵押车辆总值
                            $scope.loanInfo.unMortgageCarValuation = data.result[i].valuation;
                        }
                    }
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 清空委托方选中
     */
    $scope.clearSelectEntrust = function () {
        $("#condEntrustSelect").val(null).trigger("change");
        $("#addEntrustSelect").val(null).trigger("change");
    };

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
                        entrustType : $scope.loanInfo.entrustType,
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
        }).on('change', function () {
            var entrustId = "";

            // 委托方 下拉选中 内容
            if ($("#addEntrustSelect").val() != null && $("#addEntrustSelect").val() !== "") {
                entrustId = $("#addEntrustSelect").select2("data")[0].id;
            }
            if (entrustId !== "") {
                getCarValuation(entrustId);
            }
        });
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "finance_loan_out_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "finance_loan_out") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.condEntrustNm = pageItems.conditions.entrustNm;
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
            // 初始显示时，委托方性质 默认项：空
            $scope.condEntrustType = null;
            // 初始显示时，委托方名称 默认项：委托方
            $scope.condEntrustNm = "委托方";
        }

        // 取得 检索条件：委托方信息
        $scope.getEntrustInfo($scope.condEntrustNm);

        // 查询数据
        queryFinanceLoanList();
    };
    $scope.initData();
}]);


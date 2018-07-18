/**
 * 主菜单：财务管理 -> 发票管理 控制器
 */
app.controller("invoice_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 发票 状态
    $scope.invoiceStatus = _config.invoiceStatus;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;

    // 新增 发票信息
    $scope.invoiceInfo = {};

    // 新增发票信息 默认数据
    $scope.newInvoiceInfo = {
        // 发票编号
        invoiceNum: "",
        // 发票金额
        invoiceMoney: "",
        // 委托方性质
        entrustType: "",
        // 委托方
        entrustId: "",
        entrustNm: "",
        // 备注
        remark: ""
    };

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryInvoiceList() {
        // 基本检索URL
        var url = _host.api_url + "/invoice?start=" + $scope.start + "&size=" + $scope.size;
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
                    pageId: "invoice",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                $scope.financeInvoiceInfo = data.result;
                $scope.financeInvoiceList = $scope.financeInvoiceInfo.slice(0, 10);
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
        // 发票编号
        $scope.condInvoiceNum = conditions.invoiceNum;
        // 委托方性质
        $scope.condEntrustType = conditions.entrustType;
        // 委托方
        $scope.condEntrustId = conditions.entrustId;
        $scope.condEntrustNm = conditions.entrustNm;
        // 状态
        $scope.condInvoiceStatus = conditions.invoiceStatus;
        // 开票日期 开始
        $scope.condCreatedOnStart = conditions.createdOnStart;
        // 开票日期 终了
        $scope.condCreatedOnEnd = conditions.createdOnEnd;
        // 发放时间 开始
        $scope.condGrantDateStart = conditions.grantDateStart;
        // 发放时间 终了
        $scope.condGrantDateEnd = conditions.grantDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // 发票编号
            invoiceNum: $scope.condInvoiceNum,
            // 委托方性质
            entrustType: $scope.condEntrustType,
            // 委托方
            entrustId: $scope.condEntrustId,
            // 状态
            invoiceStatus: $scope.condInvoiceStatus,
            // 开票日期 开始
            createdOnStart: $scope.condCreatedOnStart,
            // 开票日期 终了
            createdOnEnd: $scope.condCreatedOnEnd,
            // 发放时间 开始
            grantDateStart: $scope.condGrantDateStart,
            // 发放时间 终了
            grantDateEnd: $scope.condGrantDateEnd
        };
    }

    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryFinanceInvoiceInfo = function () {
        // 默认第一页
        $scope.start = 0;
        queryInvoiceList();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        queryInvoiceList();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryInvoiceList();
    };

    /**
     * 打开【新增发票信息】模态画面。
     */
    $scope.openNewInvoiceDiv = function () {
        $('.modal').modal();
        $('#newInvoiceDiv').modal('open');

        // 初始数据
        angular.copy($scope.newInvoiceInfo, $scope.invoiceInfo);

        // textarea 高度调整
        $('#remarkText').val('');
        $('#remarkText').trigger('autoresize');

        // 获取委托方信息
        $scope.getEntrustInfo(null,"委托方");
    };

    /**
     * 新增 发票信息。
     */
    $scope.addInvoice = function () {

        // 委托方ID
        var entrustId = "";

        // 委托方 下拉选中 内容
        if ($("#addEntrustSelect").val() != null && $("#addEntrustSelect").val() !== "") {
            entrustId = $("#addEntrustSelect").select2("data")[0].id;
        }

        if ($scope.invoiceInfo.invoiceNum !== "" && $scope.invoiceInfo.invoiceMoney !== "" && entrustId !== "") {
            var obj = {
                // 发票编号
                invoiceNum: $scope.invoiceInfo.invoiceNum,
                // 发票金额
                invoiceMoney: $scope.invoiceInfo.invoiceMoney,
                // 委托方
                entrustId: entrustId,
                // 备注
                remark: $scope.invoiceInfo.remark
            };

            // 新增发票信息。
            _basic.post(_host.api_url + "/user/" + userId + "/invoice", obj).then(function (data) {
                if (data.success) {
                    // 关闭模态
                    $('#newInvoiceDiv').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    queryInvoiceList();

                    // // 跳转到 详情画面
                    // $state.go('invoice_detail', {
                    //     reload: true,
                    //     id: data.id,
                    //     from: 'invoice'
                    // });
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整发票信息！", "", "warning");
        }
    };

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
                        entrustType : $scope.condEntrustType
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

        // 点击清除(x)按钮，设定状态
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
                        entrustType : $scope.invoiceInfo.entrustType
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
        });
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {

        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "invoice_detail" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "invoice") {
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
        queryInvoiceList();
    };
    $scope.initData();
}]);


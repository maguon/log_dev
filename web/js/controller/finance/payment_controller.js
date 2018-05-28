/**
 * 主菜单：财务管理 -> 支付管理 控制器
 */
app.controller("payment_controller", ["$scope", "_basic", "_host", "_config", function ($scope, _basic, _host, _config) {
    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);
    // 翻页用
    $scope.start = 0;
    $scope.size = 11;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 支付状态
    $scope.paymentStatusList = _config.paymentStatus;
    // 支付方式
    $scope.paymentTypeList = _config.paymentType;

    /**
     * 获取委托方信息
     * @param type 委托方类型
     */
    $scope.getEntrustInfo = function (type) {
        var url = '';
        if (type == undefined) {
            url = _host.api_url + "/entrust";
        } else {
            url = _host.api_url + "/entrust?entrustType=" + type;
        }
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    /**
     * 打开 新增支付信息模态框
     * */
    $scope.addPayment = function () {
        $(".modal").modal();
        $("#addPaymentModal").modal("open");
        $scope.addEntrustType = "";
        // 委托方select2初期化
        $("#addEntrustSelect").val(null).trigger("change");
        // 或者
        // $("#addEntrustSelect").val("委托方").trigger("change");
        $scope.addPaymentType = "";
        $scope.addPatmentNumber = "";
        $scope.addPaymentMoney = "";
        $scope.addRemark = "";
    };

    /**
     * 确认新增支付信息
     * */
    $scope.addPaymentInfo = function () {

        // 委托方 下拉选中 内容
        var entrust = $("#addEntrustSelect").select2("data")[0]; //单选

        if (entrust.id !== "" && $scope.addPaymentType !== "" && $scope.addPatmentNumber !== "" && $scope.addPaymentMoney !== "") {

            // 追加画面数据
            var obj = {
                entrustId: entrust.id,
                paymentType: $scope.addPaymentType,
                number: $scope.addPatmentNumber,
                paymentMoney: $scope.addPaymentMoney,
                remark: $scope.addRemark
            };

            _basic.post(_host.api_url + "/user/" + userId + "/paymentOrder", obj).then(function (data) {
                if (data.success) {
                    $('#addPaymentModal').modal('close');
                    seachPayment();
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据

                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请输入完整信息！", "", "warning");
        }
    };

    /**
     * 查询列表
     * */
    function seachPayment() {
        // 基本检索URL
        var reqUrl = _host.api_url + "/payment?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        reqUrl = conditions.length > 0 ? reqUrl + "&" + conditions : reqUrl;
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storagePaymentBoxArray = data.result;
                $scope.storagePaymentArray = $scope.storagePaymentBoxArray.slice(0, 10);
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
     * 点击查询按钮
     * */
    $scope.getPayment = function () {
        $scope.start = 0;
        seachPayment();
    };



    /**
     * 数据导出
     */
    $scope.export = function () {
        // 基本检索URL
        var url = _host.api_url + "/payment.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    };


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var entrust = {};

        if ($("#entrustSelect").val() == "") {
            entrust = {id:"",text:""};
        } else {
            entrust = $("#entrustSelect").select2("data")[0] ;
        }

        var obj = {
            paymentId: $scope.paymentId,
            entrustType: $scope.entrustType,
            entrustId: entrust.id,
            paymentStatus: $scope.paymentStatus,
            paymentType: $scope.paymentType,
            number: $scope.patmentNumber,
            createdOnStart: $scope.paymentTimeStart,
            createdOnEnd: $scope.paymentTimeEnd
        };
        return obj;
    }

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        seachPayment();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        seachPayment();
    };

    /**
     * 获取画面初期数据。
     */
    function initData() {
        // 获取委托方信息
        $scope.getEntrustInfo();
        // 查询画面数据
        seachPayment();
    }

    initData();
}]);
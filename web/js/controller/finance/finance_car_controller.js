/**
 * 主菜单：财务管理 -> 金融车辆 控制器
 */
app.controller("finance_car_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 颜色列表
    $scope.configColor = _config.config_color;
    // 是否金融车 列表
    $scope.purchaseTypes = _config.purchaseTypes;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 是否MSO车辆
    $scope.msoFlags = _config.msoFlags;

    // 新建 / 修改 标记
    $scope.newFinanceCar = true;

    // 新增/修改 画面金融车显示用数据
    $scope.carInfo = {};

    // 新增金融车 默认数据
    $scope.newCarInfo = {
        // vin
        vin: "",
        // 年份
        proDate: "",
        // 制造商
        makerId: "",
        // 型号
        modelId: "",
        // 颜色
        colour: "",
        // 委托方性质
        entrustType: "",
        // 委托方
        entrustId: "",
        entrustNm: "",
        // 发动机号
        engineNum: "",
        // 车价(美元)
        valuation: "",
        // 是否金融车：默认 是
        purchaseType: 1,
        // 是否MSO：默认 否
        msoStatus: 1,
        // 备注
        remark: ""
    };

    // 检索条件 委托方
    $scope.condEntrustId = "";

    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryFinanceCarList() {
        // 基本检索URL
        var url = _host.api_url + "/carList?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success === true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "finance_car",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);

                $scope.financeCarInfo = data.result;
                $scope.financeCarList = $scope.financeCarInfo.slice(0, 10);
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
     */
    function setConditions(conditions) {
        // vin码
        $scope.condVin = conditions.vin;
        // 制造商
        $scope.conditionMakeId = conditions.makeId;
        // 根据制造商，取得品牌列表
        $scope.changeMakerId($scope.conditionMakeId);
        // 品牌
        $scope.conditionModelId = conditions.modelId;
        // 录入时间 开始
        $scope.condEntryDateStart = conditions.createdOnStart;
        // 录入时间 终了
        $scope.condEntryDateEnd = conditions.createdOnEnd;
        // 委托方
        $scope.condEntrustId = conditions.entrustId;
        // 是否金融车
        $scope.condPurchaseType = conditions.purchaseType;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            // vin码
            vin: $scope.condVin,
            // 制造商
            makeId: $scope.conditionMakeId,
            // 品牌
            modelId: $scope.conditionModelId,
            // 录入时间 开始
            createdOnStart: $scope.condEntryDateStart,
            // 录入时间 终了
            createdOnEnd: $scope.condEntryDateEnd,
            // 委托方
            entrustId: $scope.condEntrustId,
            // 是否金融车
            purchaseType: $scope.condPurchaseType
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
    $scope.queryFinanceCarInfo = function () {
        // 默认第一页
        $scope.start = 0;
        // 检索条件 委托方
        $scope.condEntrustId =getEntrustId();
        queryFinanceCarList();
    };

    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        // 检索条件 委托方
        $scope.condEntrustId =getEntrustId();
        queryFinanceCarList();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        // 检索条件 委托方
        $scope.condEntrustId =getEntrustId();
        queryFinanceCarList();
    };

    /**
     * 打开【新增金融车】模态画面。
     */
    $scope.openNewFinanceCarDiv = function () {
        $('.modal').modal();
        $('#newFinanceCarDiv').modal('open');
        // 新增金融车辆 flag
        $scope.newFinanceCar = true;
        // 初始数据
        angular.copy($scope.newCarInfo, $scope.carInfo);
        // 获取委托方信息
        $scope.getEntrustInfo();
    };

    /**
     * 打开【修改金融车】模态画面。
     */
    $scope.openEditFinanceCarDiv = function (carInfo) {
        $('.modal').modal();
        $('#newFinanceCarDiv').modal('open');
        // 修改金融车辆 flag
        $scope.newFinanceCar = false;

        // 画面数据
        // id
        $scope.carInfo.carId = carInfo.id;
        // vin
        $scope.carInfo.vin = carInfo.vin;
        // 制造商
        $scope.carInfo.makerId = carInfo.make_id;
        $scope.changeMakerId(carInfo.make_id);
        // 型号
        $scope.carInfo.modelId = carInfo.model_id;
        // 颜色
        $scope.carInfo.colour = carInfo.colour;
        // 年份
        $scope.carInfo.proDate = carInfo.pro_date;
        // 委托性质
        $scope.carInfo.entrustType = carInfo.entrust_type;
        // 委托方
        $scope.carInfo.entrustId = carInfo.entrust_id;
        $scope.carInfo.entrustNm = carInfo.short_name;
        $scope.getEntrustInfo(carInfo.entrust_type, $scope.carInfo.entrustNm);
        // 发动机号
        $scope.carInfo.engineNum = carInfo.engine_num;
        // 车价(美元)
        $scope.carInfo.valuation = carInfo.valuation;
        // 是否金融车：默认 是
        $scope.carInfo.purchaseType = carInfo.purchase_type;
        // 是否MSO：默认 否
        $scope.carInfo.msoStatus = carInfo.mso_status;
        // 备注
        $scope.carInfo.remark = carInfo.remark;
        // 备注
        $scope.carInfo.createdOn = carInfo.created_on;
    };

    /**
     * 新增 / 修改金融车。
     */
    $scope.updateFinanceCar = function () {

        // 委托方ID
        var entrustId = "";

        // 新增金融车。
        if ($scope.newFinanceCar) {
            // 委托方 下拉选中 内容
            if ($("#addEntrustSelect").val() != null && $("#addEntrustSelect").val() !== "") {
                entrustId = $("#addEntrustSelect").select2("data")[0].id;
            }
        } else {
            // 委托方 下拉选中 内容
            if ($("#editEntrustSelect").val() != null && $("#editEntrustSelect").val() !== "") {
                entrustId = $("#editEntrustSelect").select2("data")[0].id;
            } else {
                if ($('#select2-editEntrustSelect-container').text() !== "委托方") {
                    entrustId = $scope.carInfo.entrustId;
                }
            }
        }

        if ($scope.carInfo.vin !== "" && $scope.carInfo.makerId !== "" && $scope.carInfo.modelId !== ""
            && entrustId !== "" && $scope.carInfo.valuation !== "" && $scope.carInfo.msoStatus !== "" && $scope.carInfo.purchaseType !== "") {
            var obj = {
                // vin
                vin: $scope.carInfo.vin,
                // 制造商
                makeId: $scope.carInfo.makerId,
                makeName: $('#makerSelect').find("option:selected").text(),
                // 型号
                modelId: $scope.carInfo.modelId,
                modelName: $('#modelSelect').find("option:selected").text(),
                // 年份
                proDate: $scope.carInfo.proDate,
                // 颜色
                colour: $scope.carInfo.colour,
                // 发动机号
                engineNum: $scope.carInfo.engineNum,
                // 委托方
                entrustId: entrustId,
                // 车价(美元)
                valuation: $scope.carInfo.valuation,
                // 是否MSO车辆
                msoStatus: $scope.carInfo.msoStatus,
                // 是否金融车
                purchaseType: $scope.carInfo.purchaseType,
                // 备注
                remark: $scope.carInfo.remark
            };

            // 如果年份没有输入，就去掉此属性
            if ($scope.carInfo.proDate == null || $scope.carInfo.proDate === "") {
                delete obj.proDate;
            }

            // 新增金融车。
            if ($scope.newFinanceCar) {
                _basic.post(_host.api_url + "/user/" + userId + "/car", obj).then(function (data) {
                    if (data.success) {
                        $('#newFinanceCarDiv').modal('close');
                        swal("新增成功", "", "success");
                        // 成功后，刷新页面数据
                        queryFinanceCarList();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {
                _basic.put(_host.api_url + "/user/" + userId + "/car/" + $scope.carInfo.carId, obj).then(function (data) {
                    if (data.success) {
                        $('#newFinanceCarDiv').modal('close');
                        swal("修改成功", "", "success");
                        // 成功后，刷新页面数据
                        queryFinanceCarList();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        } else {
            swal("请填写完整车辆信息！", "", "warning");
        }
    };

    /**
     * 车辆品牌列表查询，用来填充查询条件：车辆品牌
     */
    function getCarMakerList() {
        _basic.get(_host.api_url + "/carMake").then(function (data) {
            if (data.success && data.result.length > 0) {
                $scope.carMakerList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 当车辆品牌变更时，车辆型号要进行联动刷新。
     * @param val 车辆品牌ID
     */
    $scope.changeMakerId = function (val) {
        if (val) {
            if ($scope.curruntId === val) {
            } else {
                $scope.curruntId = val;
                _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                    if (data.success && data.result.length > 0) {
                        $scope.carModelList = data.result;
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
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
                if ($scope.newFinanceCar) {
                    // 新建画面
                    $('#addEntrustSelect').select2({
                        placeholder: '委托方',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                    $("#addEntrustSelect").val(null).trigger("change");
                } else {
                    // 修改画面
                    $('#editEntrustSelect').select2({
                        placeholder: selectText,
                        // data: entrustList,
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
            }
        });
    };

    /**
     * 获取委托方信息
     */
    function getAllEntrustInfo() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success) {
                var entrustList = [{
                    id: "",
                    text: "委托方"
                }];
                for (var i = 0; i < data.result.length; i++) {
                    entrustList.push({
                        id: data.result[i].id,
                        text: data.result[i].short_name
                    });
                }
                // 检索画面用
                $('#condEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    data: entrustList,
                    allowClear: true
                });
                // 委托方（select2）默认选择项
                $("#condEntrustSelect").val($scope.condEntrustId).trigger("change");
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得 检索条件：汽车品牌
        getCarMakerList();

        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "car_demand_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "finance_car") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
            }
        } else {
            $rootScope.refObj = {pageArray: []};
            $scope.condPurchaseType = $scope.purchaseTypes[1].id;
        }
        // 取得 检索条件：委托方
        getAllEntrustInfo();

        // 查询数据
        queryFinanceCarList();
    };
    $scope.initData();
}]);


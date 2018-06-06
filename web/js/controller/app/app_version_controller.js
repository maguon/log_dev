/**
 * 主菜单：APP系统 控制器
 */
app.controller("app_version_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", function ($scope, $state, $stateParams, _basic, _config, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 分页用 画面数据 起始位置
    $scope.start = 0;
    // 分页用 每页画面数据
    $scope.size = 11;

    // 条件：系统 [1:安卓 2:IOS]
    $scope.appSystems = _config.appSystems;

    // 条件：模块 []
    $scope.modules = _config.modules;

    // 条件：是否强制更新 [0：否 1:是]
    $scope.forceUpdates = _config.forceUpdates;

    // 追加画面初期数据
    var initAppInfo = {
        // 系统
        app:"",
        // 模块
        type:"",
        // 版本号
        version:"",
        // 是否强制更新
        forceUpdate:"",
        // 版本序号
        versionNum:"",
        // 最低支持版本序号
        floorVersionNumber:"",
        // 下载地址
        url:"",
        // 描述
        remark:""
    };

    // 追加画面数据
    $scope.appInfo = {};

    // 检索条件：系统
    $scope.conditionApp = "";
    // 检索条件：模块
    $scope.conditionType = "";
    // 检索条件：是否强制更新
    $scope.conditionForceUpdate = "";

    /**
     * 获取app系统详细信息列表
     */
    function getAppSystemList() {
        // 检索条件组装
        var condition = _basic.objToUrl({
            // 条件：系统
            app: $scope.conditionApp,
            // 条件：模块
            type: $scope.conditionType,
            // 条件：是否强制更新
            forceUpdate: $scope.conditionForceUpdate + ""
        });
        condition = condition.length > 0 ? "&" + condition : condition;

        // 检索URL组装
        var url = _host.api_url + "/app?start=" + $scope.start + "&size=" + $scope.size + condition;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.appResult = data.result;
                $scope.appSystemList = $scope.appResult.slice(0, 10);

                // 前一页 按钮 控制
                if ($scope.start > 0) {
                    $("#pre").show();
                } else {
                    $("#pre").hide();
                }
                // 下一页 按钮 控制
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                } else {
                    $("#next").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 点击搜索按钮。
     */
    $scope.searchAppSystem = function () {
        // 默认第一页
        $scope.start = 0;
        // 根据画面条件，检索画面数据
        getAppSystemList();
    };

    /**
     * 打开画面【新增操作】模态框。
     */
    $scope.openAddAppSystem = function () {
        // 画面ID
        $scope.pageId = "add";
        // 初期化数据
        angular.copy(initAppInfo, $scope.appInfo);

        // 打开 模态窗口
        $('.modal').modal();
        $('#modifyAppDiv').modal('open');

        // textarea 高度调整
        $('#remark').val('');
        $('#remark').trigger('autoresize');
    };

    /**
     * 打开画面【操作记录】模态框。
     *
     * @param selectedApp 选中编辑数据
     */
    $scope.openModifyAppSystem = function (selectedApp) {
        // 初期化数据

        // 根据选中数据ID，取得详细信息
        _basic.get(_host.api_url + "/app?appId=" + selectedApp.id).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 画面ID
                    $scope.pageId = "edit";

                    // 打开 模态窗口
                    $('.modal').modal();
                    $('#modifyAppDiv').modal('open');

                    // 系统ID
                    $scope.appInfo.id = data.result[0].id;
                    // 系统
                    $scope.appInfo.app = data.result[0].app;
                    // 模块
                    $scope.appInfo.type = data.result[0].type;
                    // 版本号
                    $scope.appInfo.version = data.result[0].version;
                    // 是否强制更新
                    $scope.appInfo.forceUpdate = data.result[0].force_update;
                    // 版本序号
                    $scope.appInfo.versionNum = data.result[0].version_number;
                    // 最低支持版本序号
                    $scope.appInfo.floorVersionNumber = data.result[0].floor_version_number;
                    // 下载地址
                    $scope.appInfo.url = data.result[0].url;
                    // 描述
                    $scope.appInfo.remark = data.result[0].remark;

                    // textarea 高度调整
                    $('#remark').val($scope.appInfo.remark);
                    $('#remark').trigger('autoresize');
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 追加app系统信息。
     */
    $scope.saveAppInfo = function () {
        // 必须项目 check
        if ($scope.appInfo.app !== "" && $scope.appInfo.type !== "" && $scope.appInfo.version !== ""
            && $scope.appInfo.forceUpdate !== "" && $scope.appInfo.versionNum !== ""
            && $scope.appInfo.floorVersionNumber !== "" && $scope.appInfo.url !== "") {

            // 画面数据
            var obj = {
                app: $scope.appInfo.app,
                appType: $scope.appInfo.type,
                version: $scope.appInfo.version,
                versionNumber: $scope.appInfo.versionNum,
                floorVersionNumber: $scope.appInfo.floorVersionNumber,
                forceUpdate: $scope.appInfo.forceUpdate,
                url: $scope.appInfo.url,
                remark: $scope.appInfo.remark
            };

            if ($scope.pageId === "add") {
                // 调用 API [user create app]
                _basic.post(_host.api_url + "/user/" + userId + "/app", obj).then(function (data) {
                    if (data.success) {
                        swal("新增成功", "", "success");
                        $('#modifyAppDiv').modal('close');
                        // 刷新画面数据
                        $scope.searchAppSystem();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {
                // 调用更新API
                _basic.put(_host.api_url + "/user/" + userId + "/app/" + $scope.appInfo.id, obj).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        $('#modifyAppDiv').modal('close');
                        // 根据画面条件，重新检索画面数据
                        getAppSystemList();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }

        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 前一页
     */
    $scope.getPrePage = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        getAppSystemList();
    };

    /**
     * 下一页
     */
    $scope.getNextPage = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        getAppSystemList();
    };

    /**
     * 初期检索画面数据
     */
    function initData() {
        // 检索画面数据
        $scope.searchAppSystem();
    }

    /**
     * 画面初期数据取得。
     */
    initData();
}]);
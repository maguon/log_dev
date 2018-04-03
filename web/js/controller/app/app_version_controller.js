/**
 * 主菜单：app系统 控制器
 */
app.controller("app_version_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", function ($scope, $state, $stateParams, _basic, _config, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 分页用 画面数据 起始位置
    $scope.start = 0;
    // 分页用 每页画面数据
    $scope.size = 10;

    // 条件：系统 [1:安卓 2:IOS]
    $scope.appSystems = _config.appSystems;

    // 条件：模块 []
    $scope.modules = _config.modules;

    // 条件：是否强制更新 [0：否 1:是]
    $scope.forceUpdates = _config.forceUpdates;

    // 追加画面初期数据
    var initAppInfo = {
        app:"",
        type:"",
        version:"",
        forceUpdate:"",
        versionNum:"",
        minVersionNum:"",
        url:"",
        remark:""
    };

    // 追加画面数据
    $scope.appInfo = {};

    // 条件：系统
    $scope.conditionApp = "";
    // 条件：模块
    $scope.conditionType = "";
    // 条件：是否强制更新
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
                // 检索取得数据集
                $scope.appSystemList = data.result;
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
        // 初期化数据
        angular.copy(initAppInfo, $scope.appInfo);

        $('.modal').modal();
        $('#addAppSystem').modal('open');

        $('#remark').val('');
        $('#remark').trigger('autoresize');
    };

    /**
     * 追加app系统信息。
     */
    $scope.addAppInfo = function () {
        if ($scope.appInfo.app !== "" && $scope.appInfo.type !== "" && $scope.appInfo.version !== ""
            && $scope.appInfo.forceUpdate !== "" && $scope.appInfo.versionNum !== ""
            && $scope.appInfo.minVersionNum !== "" && $scope.appInfo.url !== "") {

            // 追加画面数据
            var obj = {
                app: $scope.appInfo.app,
                appType: $scope.appInfo.type,
                version: $scope.appInfo.version,
                versionNumber: $scope.appInfo.versionNum,
                floorVersionNumber: $scope.appInfo.minVersionNum,
                forceUpdate: $scope.appInfo.forceUpdate,
                url: $scope.appInfo.url,
                remark: $scope.appInfo.remark
            };

            // 调用 API [user create app]
            _basic.post(_host.api_url + "/user/" + userId + "/app", obj).then(function (data) {
                if (data.success) {
                    $('#addAppSystem').modal('close');
                    swal("新增成功", "", "success");
                    $scope.searchAppSystem();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 打开画面【操作记录】模态框。
     *
     * @param appId App id
     */
    $scope.openModifyAppSystem = function (appId) {
        $('.modal').modal();
        $('#showAppSystem').modal('open');
        // 根据选中数据ID，取得详细信息
        _basic.get(_host.api_url + "/app?appId=" + appId).then(function (data) {
            if (data.success) {
                $scope.showAppInfo = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 修改app系统信息。
     * @param appId App id
     */
    $scope.updateAppInfo = function (appId) {
        if ($scope.showAppInfo.app !== "" && $scope.showAppInfo.type !== "" && $scope.showAppInfo.version !== ""
            && $scope.showAppInfo.force_update !== "" && $scope.showAppInfo.version_number !== ""
            && $scope.showAppInfo.floor_version_number !== "" && $scope.showAppInfo.url !== "") {
            // 更新画面数据
            var obj = {
                app: $scope.showAppInfo.app,
                appType: $scope.showAppInfo.type,
                version: $scope.showAppInfo.version,
                versionNumber: $scope.showAppInfo.version_number,
                floorVersionNumber: $scope.showAppInfo.floor_version_number,
                forceUpdate: $scope.showAppInfo.force_update,
                url: $scope.showAppInfo.url,
                remark: $scope.showAppInfo.remark
            };
            // 调用更新API
            _basic.put(_host.api_url + "/user/" + userId + "/app/" + appId, obj).then(function (data) {
                if (data.success) {
                    swal("修改成功", "", "success");
                    $('#showAppSystem').modal('close');
                    // 根据画面条件，重新检索画面数据
                    getAppSystemList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 前一页
     */
    $scope.getPrePage = function () {
        $scope.start = $scope.start - $scope.size;
        getAppSystemList();
    };

    /**
     * 下一页
     */
    $scope.getNextPage = function () {
        $scope.start = $scope.start + $scope.size;
        getAppSystemList();
    };

    /**
     * 画面初期检索。
     */
    $scope.searchAppSystem();
}]);
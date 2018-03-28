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
        var url = _host.api_url + "/app?&start=" + $scope.start + "&size=" + $scope.size + condition;

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
        $scope.start = 0;
        getAppSystemList();
    };

    /**
     * 打开画面【新增操作】模态框。
     */
    $scope.openAddAppSystem = function () {
        $('.modal').modal();
        $('#addAppSystem').modal('open');

        // 初期化数据
        $scope.appInfo = initAppInfo;
    };

    /**
     * 追加app系统信息。
     */
    $scope.addAppInfo = function () {
        if ($scope.appInfo.app !== "" && $scope.appInfo.type !== "" && $scope.appInfo.version !== ""
            && $scope.appInfo.forceUpdate !== "" && $scope.appInfo.versionNum !== ""
            && $scope.appInfo.minVersionNum !== "" && $scope.appInfo.url !== "") {

            // 调用 API [user create app]
            _basic.post(_host.api_url + "/user/" + userId + "/app", {
                app: $scope.appInfo.app,
                appType: $scope.appInfo.type,
                version: $scope.appInfo.version,
                // 版本序号
                versionNumber: $scope.appInfo.versionNum,
                // 最低支持版本序号
                floorVersionNumber: $scope.appInfo.minVersionNum,
                forceUpdate: $scope.appInfo.forceUpdate,
                url: $scope.appInfo.url,
                remark: $scope.appInfo.remark
            }).then(function (data) {
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
     * @param id App id
     */
    $scope.openModifyAppSystem = function (id) {
        $('.modal').modal();
        $('#showAppSystem').modal('open');
        _basic.get(_host.api_url + "/app?appId=" + id).then(function (data) {
            if (data.success) {
                $scope.showAppInfo = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 修改app系统信息。
     * @param id App id
     */
    $scope.updateAppInfo = function (id) {
        if ($scope.showAppInfo.app !== "" && $scope.showAppInfo.type !== "" && $scope.showAppInfo.version !== ""
            && $scope.showAppInfo.force_update !== "" && $scope.showAppInfo.version_number !== ""
            && $scope.showAppInfo.floor_version_number !== "" && $scope.showAppInfo.url !== "") {
            var obj = {
                app: $scope.showAppInfo.app,
                appType: $scope.showAppInfo.type,
                forceUpdate: $scope.showAppInfo.force_update,
                version: $scope.showAppInfo.version,
                // 版本序号
                versionNumber: $scope.showAppInfo.version_number,
                // 最低支持版本序号
                floorVersionNumber: $scope.showAppInfo.floor_version_number,
                url: $scope.showAppInfo.url,
                remark: $scope.showAppInfo.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + "/app/" + id, obj).then(function (data) {
                if (data.success) {
                    swal("修改成功", "", "success");
                    $('#showAppSystem').modal('close');
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
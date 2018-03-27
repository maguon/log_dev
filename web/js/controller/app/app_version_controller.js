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

    /**
     * 获取app系统详细信息列表
     */
    function getAppSystemList() {
        // 检索条件组装
        var condition = _basic.objToUrl({
            // 条件：app区分
            app: $scope.appType,
            // 条件：系统区分
            type: $scope.getSystemType,
            // 条件：是否强制更新
            forceUpdate: $scope.forceUpdate
        });

        condition = condition.length > 0 ? "&" + condition : condition;

        // 检索URL组装
        var url = _host.api_url + "/app?&start=" + $scope.start + "&size=" + $scope.size + condition;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                // 前一页 按钮 控制
                if ($scope.start > 0) {
                    $("#pre").show();
                } else {
                    $("#pre").hide();
                }
                // 下一页 按钮 控制
                if (data.result.length <= $scope.size) {
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
    };

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
        $scope.addSystemType = "";
        $scope.addAppType = "";
        $scope.addAppVersion = "";
        $scope.addForceUpdate = "";
        $scope.addAppVersionNum = "";
        $scope.addAppMinVersionNum = "";
        $scope.uploadUrl = "";
        $scope.appDescription = "";
        $('.modal').modal();
        $('#addAppSystem').modal('open');
    }

    /**
     * 追加app系统信息。
     */
    $scope.addAppInfo = function () {
        if ($scope.addAppType !== "" && $scope.addSystemType !== "" && $scope.addForceUpdate !== ""
            && $scope.addAppVersion !== "" && $scope.uploadUrl !== ""
            && $scope.addAppVersionNum !== "" && $scope.addAppMinVersionNum !== "") {

            // 调用 API user create app
            _basic.post(_host.api_url + "/user/" + userId + "/app", {
                app: $scope.addAppType,
                appType: $scope.addSystemType,
                version: $scope.addAppVersion,
                // 版本序号
                versionNumber: $scope.addAppVersionNum,
                // 最低支持版本序号
                floorVersionNumber: $scope.addAppMinVersionNum,
                forceUpdate: $scope.addForceUpdate,
                url: $scope.uploadUrl,
                remark: $scope.appDescription
            }).then(function (data) {
                if (data.success == true) {
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
    }

    /**
     * 打开画面【操作记录】模态框。
     *
     * @param id App id
     */
    $scope.openModifyAppSystem = function (id) {
        $('.modal').modal();
        $('#showAppSystem').modal('open');
        _basic.get(_host.api_url + "/app?appId=" + id).then(function (data) {
            console.log(data);
            if (data.success == true) {
                $scope.showAppSystemList = data.result[0];
                $scope.showAppSystemList.app = data.result[0].app + "";
                $scope.showAppSystemList.type = data.result[0].type + "";
                // $scope.showAppSystemList.versionNumber = data.result[0].version_number;
                // $scope.showAppSystemList.floorVersionNumber = data.result[0].floor_version_number;
                $scope.showAppSystemList.force_update = data.result[0].force_update + "";
            } else {
                swal(data.msg, "", "error");
            }
        })
    }

    /**
     * 修改app系统信息。
     * @param id App id
     */
    $scope.updateAppInfo = function (id) {
        if ($scope.showAppSystemList.app !== "" && $scope.showAppSystemList.type !== ""
            && $scope.showAppSystemList.force_update !== "" && $scope.showAppSystemList.version !== "" && $scope.showAppSystemList.url !== "") {
            var obj = {
                app: $scope.showAppSystemList.app,
                appType: $scope.showAppSystemList.type,
                forceUpdate: $scope.showAppSystemList.force_update,
                version: $scope.showAppSystemList.version,
                // 版本序号
                versionNumber: $scope.showAppSystemList.versionNumber,
                // 最低支持版本序号
                floorVersionNumber: $scope.showAppSystemList.floorVersionNumber,
                url: $scope.showAppSystemList.url,
                remark: $scope.showAppSystemList.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + "/app/" + id, obj).then(function (data) {
                if (data.success == true) {
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
}])
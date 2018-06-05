/**
 * 主菜单：管理员设置 -> 船舶公司设置 控制器
 */
app.controller("setting_shipping_co_controller", ["$scope", "_basic", "_host", "_config", function ($scope, _basic, _host, _config) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 条件：状态 [0:停用 1:可用]
    $scope.useFlags = _config.useFlags;

    // 检索条件：编号
    $scope.condShippingCoId = "";
    // 检索条件：状态
    $scope.condUseFlags = "";

    // 船务公司名称
    $scope.newShippingCoName = "";

    /**
     * 获取船舶公司列表
     */
    $scope.getShippingCoList = function () {
        // 检索URL组装
        var obj = {
            shipCompanyId:$scope.condShippingCoId,
            shipCompanyStatus:$scope.condUseFlags
        };
        var conditions = _basic.objToUrl(obj);
        conditions = conditions.length > 0 ? "?" + conditions : conditions;

        var url = _host.api_url + "/shipCompany" + conditions;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.shippingCoList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 显示增加船公司画面。
     */
    $scope.showAddShippingCo = function () {
        $("#addShippingCoDiv").show();
        $("#searchShippingCoDiv").hide();
    };

    /**
     * 隐藏增加船公司画面。
     */
    $scope.hideAddShippingCo = function () {
        $("#searchShippingCoDiv").show();
        $("#addShippingCoDiv").hide();
    };

    /**
     * 增加船舶公司。
     */
    $scope.addShippingCo = function () {
        if ($scope.newShippingCoName !== "") {

            // 追加画面数据
            var obj = {
                shipCompanyName: $scope.newShippingCoName
            };

            _basic.post(_host.api_url + "/user/" + userId + "/shipCompany", obj).then(function (data) {
                if (data.success) {
                    swal("新增成功", "", "success");
                    $scope.newShippingCoName = "";
                    $scope.hideAddShippingCo();
                    // 成功后，刷新页面数据
                    $scope.getShippingCoList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请输入船舶公司名称！", "", "warning");
        }
    };

    /**
     * 修改船公司状态。
     *
     * @param shipCompanyId 船公司ID
     * @param shipCompanyStatus 船公司状态
     */
    $scope.changeShipCompanyStatus = function (shipCompanyId, shipCompanyStatus) {

        swal({
                title: "",
                text: "确定停用当前船务公司？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    // 状态
                    var status = 0;
                    if (shipCompanyStatus == 0) {
                        // 启用
                        status = 1
                    } else {
                        // 停用
                        status = 0
                    }

                    // API url
                    var url = _host.api_url + "/user/" + userId + "/shipCompany/" + shipCompanyId + "/shipCompanyStatus/" + status;

                    // 调用更新API
                    _basic.put(url, {}).then(function (data) {
                        if (data.success == true) {
                            swal.close();
                        } else {
                            swal(data.msg, "", "error");
                        }
                        $scope.getShippingCoList();
                    })
                } else {
                    swal.close();
                    $scope.getShippingCoList();
                }
            });
    };

    /**
     * 显示船公司(可用)编辑画面。
     *
     * @param $event 事件
     * @param $index 序号
     */
    $scope.showEditEnableShippingCo = function ($event, $index) {
        $(".show_ship_co_enable" + $index).hide();
        $(".edit_ship_co_enable" + $index).show();
    };

    /**
     * 隐藏船公司(可用)编辑画面。
     *
     * @param $index 序号
     */
    $scope.hideEditEnableShippingCo = function ($index) {
        $(".show_ship_co_enable" + $index).show();
        $(".edit_ship_co_enable" + $index).hide();
    };

    /**
     * 显示船公司(停用)编辑画面。
     *
     * @param $event 事件
     * @param $index 序号
     */
    $scope.showEditDisableShippingCo = function ($event, $index) {
        $(".show_ship_co_disable" + $index).hide();
        $(".edit_ship_co_disable" + $index).show();
    };

    /**
     * 隐藏船公司(停用)编辑画面。
     *
     * @param $index 序号
     */
    $scope.hideEditDisableShippingCo = function ($index) {
        $(".show_ship_co_disable" + $index).show();
        $(".edit_ship_co_disable" + $index).hide();
    };

    /**
     * 修改船公司名称。
     * @param id
     * @param name
     * @param index
     */
    $scope.updateShippingCo = function (id, name, $index) {
        _basic.put(_host.api_url + "/user/" + userId + "/shipCompany/" + id, {
            shipCompanyName: name
        }).then(function (data) {
            if (data.success == true) {
                $(".show_ship_co_enable" + $index).show();
                $(".edit_ship_co_enable" + $index).hide();
                $(".show_ship_co_disable" + $index).show();
                $(".edit_ship_co_disable" + $index).hide();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    $scope.initData = function () {

        // 隐藏追加画面
        $("#addShippingCoDiv").hide();
        // 画面初期检索。
        $scope.getShippingCoList();

    };
    $scope.initData();
}]);

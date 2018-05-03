/**
 * 主菜单：管理员设置 -> 船舶公司设置 控制器
 */
app.controller("setting_shipping_co_controller", ["$scope", "_basic", "_host", "_config", function ($scope, _basic, _host, _config) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 条件：状态 [0:停用 1:可用]
    $scope.useFlags = _config.useFlags;

    // 船务公司名称
    $scope.newShippingCoName = "";

    /**
     * 获取船舶公司列表
     */
    $scope.getShippingCoList = function () {
        // 检索URL组装
        var url = _host.api_url + "/shipCompany";

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
        $(".open_car_brand").show();
        $(".car_Brand_box").hide();
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
     * 画面初期检索。
     */
    $scope.getShippingCoList();
}]);

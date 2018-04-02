/**
 * 主菜单：仓储管理 -> 钥匙管理 控制器
 */
app.controller("key_info_controller", ["$scope", "_basic", "_host", function ($scope, _basic, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    /**
     * 检索钥匙管理画面数据列表。
     */
    $scope.searchKeyInfoList = function () {
        // 检索URL组装
        var url = _host.api_url + "/carKeyCabinet";

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.keyInfoList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 画面初期检索。
     */
    $scope.searchKeyInfoList();
}]);
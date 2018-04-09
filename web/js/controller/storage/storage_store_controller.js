/**
 * 主菜单：仓储管理 -> 仓储存放 控制器
 */
app.controller("storage_store_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {

    /**
     * 检索钥仓库存放数据列表。
     */
    $scope.getStorageStoreList = function () {
        // 取得当天日期
        var data = new Date();
        var nowDate = moment(data).format('YYYYMMDD');

        // TODO test data
        nowDate = 20180408;

        // 检索URL组装
        var url = _host.api_url + "/storageDate?dateStart=" + nowDate + "&dateEnd=" + nowDate;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.storageList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 画面初期检索。
     */
    $scope.getStorageStoreList();
}]);
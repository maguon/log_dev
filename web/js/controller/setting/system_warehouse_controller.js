/**
 * 主菜单：仓库设置 控制器
 */
app.controller("system_warehouse_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
    var adminId = _basic.getSession(_basic.USER_ID);

    /**
     * 取得仓库信息列表。
     */
    function getStorgeList() {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.storage = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    getStorgeList();

    /**
     * 显示追加新仓库画面。
     */
    $scope.showNewStoragePage = function () {
        $scope.submitted = false;
        $scope.newStorageName = "";
        $scope.newStorageCol = "";
        $scope.newStorageRoad = "";
        $scope.newStorageRemark = "";
        $(".modal").modal();
        $("#newStorage").modal("open");

    };

    /**
     * 创建新仓库。
     * @param isValid
     */
    $scope.addStorageInfo = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                storageName: $scope.newStorageName,
                row: Number($scope.newStorageCol),
                col: Number($scope.newStorageRoad),
                remark: $scope.newStorageRemark
            };
            _basic.post(_host.api_url + "/admin/" + adminId + "/storage", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    getStorgeList();
                    $("#newStorage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    /**
     * 根据仓库ID取得仓库信息，并显示到详情画面。
     * @param id
     */
    $scope.getStorageInfo = function (id) {
        $(".modal").modal();
        $("#look_Storage").modal("open");
        _basic.get(_host.api_url + "/storage?storageId=" + id).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.selfStorage = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 根据仓库ID更新仓库信息，并刷新一览画面。
     * @param isValid
     * @param id
     */
    $scope.updateStorageInfo = function (isValid, id) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                storageName: $scope.selfStorage.storage_name,
                remark: $scope.selfStorage.remark
            };
            _basic.put(_host.api_url + "/admin/" + adminId + "/storage/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    getStorgeList();
                    $("#look_Storage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    /**
     * 根据仓库ID修改仓库运营状态，并刷新一览画面。
     * @param id
     * @param status
     */
    $scope.changeStorageStatus = function (id, status) {
        if (status == 0) {
            // str="启用";
            status = 1
        } else {
            // str="停用";
            status = 0
        }
        _basic.put(_host.api_url + "/admin/" + adminId + "/storage/" + id + "/storageStatus/" + status, {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                getStorgeList();
            } else {
                swal(data.msg, "", "error");
                getStorgeList();
            }
        })
    }
}]);

// 仓库设置
app.controller("system_warehouse_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var adminId = _basic.getSession(_basic.USER_ID);
    // 整体查询
    function readStorgeList() {
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storage = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    readStorgeList();
    $scope.addNewStorageItem = function () {
        $scope.submitted = false;
        $scope.newStorageName = "";
        $scope.newStorageCol = "";
        $scope.newStorageRoad = "";
        $scope.newStorageRemark = "";
        $(".modal").modal();
        $("#newStorage").modal("open");

    };
    // 新增
    $scope.addNewStorageForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                storageName: $scope.newStorageName,
                row: Number($scope.newStorageCol),
                col: Number($scope.newStorageRoad),
                remark: $scope.newStorageRemark
            };
            _basic.post($host.api_url + "/admin/" + adminId + "/storage", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    readStorgeList();
                    $("#newStorage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 查看
    $scope.lookStorage = function (id) {
        $(".modal").modal();
        $("#look_Storage").modal("open");
        _basic.get($host.api_url + "/storage?storageId=" + id).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.selfStorage = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 修改
    $scope.lookStorageForm = function (isValid, id) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                storageName: $scope.selfStorage.storage_name,
                remark: $scope.selfStorage.remark
            };
            _basic.put($host.api_url + "/admin/" + adminId + "/storage/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    readStorgeList();
                    $("#look_Storage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 修改仓库运营状态
    $scope.changeStorageStatus = function (id, status) {
        if (status == 0) {
            // str="启用";
            status = 1
        } else {
            // str="停用";
            status = 0
        }
        _basic.put($host.api_url + "/admin/" + adminId + "/storage/" + id + "/storageStatus/" + status, {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                readStorgeList();
            } else {
                swal(data.msg, "", "error");
                readStorgeList();
            }
        })
    }
}]);

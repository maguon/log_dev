/**
 * 主菜单：管理员设置 -> 仓库设置 控制器
 */
app.controller("setting_storage_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 追加画面初期数据
    var initStorageInfo = {
        storageName: "",
        remark: ""
    };
    // 追加画面数据
    $scope.storageInfo = {};

    /**
     * 点击搜索按钮。
     */
    $scope.getStorageList = function () {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                $scope.storageList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 打开画面【增加仓库】模态框。
     */
    $scope.openAddStorage = function () {
        // 初期化数据
        angular.copy(initStorageInfo, $scope.storageInfo);

        $('.modal').modal();
        $('#addStorage').modal('open');

        $('#remark').val('');
        $('#remark').trigger('autoresize');
    };

    /**
     * 增加仓库信息。
     */
    $scope.addStorage = function () {
        if ($scope.storageInfo.storageName !== "") {

            // 追加画面数据
            var obj = {
                storageName: $scope.storageInfo.storageName,
                remark: $scope.storageInfo.remark
            };

            _basic.post(_host.api_url + "/admin/" + userId + "/storage", obj).then(function (data) {
                if (data.success) {
                    $('#addStorage').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.getStorageList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 修改仓库状态。
     *
     * @param storageId 仓库ID
     * @param storageStatus 仓库状态
     */
    $scope.changeStorageStatus = function (storageId, storageStatus) {
        swal({
                title: "",
                text: "确认修改？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    // 状态
                    var status = 0;
                    if (storageStatus == 0) {
                        // "启用";
                        status = 1
                    } else {
                        // "停用";
                        status = 0
                    }

                    // API url
                    var url = _host.api_url + "/admin/" + userId + "/storage/" + storageId + "/storageStatus/" + status

                    // 调用更新API
                    _basic.put(url, {}).then(function (data) {
                        if (data.success) {
                            swal("修改成功", "", "success");
                            // 成功后，刷新页面数据
                            $scope.getStorageList();
                        } else {
                            swal(data.msg, "", "error");
                            $scope.getStorageList();
                        }
                    })
                } else {
                    swal.close();
                    $scope.getStorageList();
                }
            });
    };

    /**
     * 画面初期数据取得。
     */
    $scope.getStorageList();
}]);

/**
 * 主菜单：管理员设置 -> 仓库设置(详细画面) 控制器
 */
app.controller("setting_storage_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", function ($scope, $state, $stateParams, _basic, _config, _host) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 条件：状态 [0:停用 1:可用]
    $scope.useFlags = _config.useFlags;

    // 仓库信息
    $scope.storageInfo = {
        // 仓库ID
        id: $stateParams.id,
        name: "",
        remark: "",
        zoneSize: "",
        // 仓库 状态
        status: $stateParams.status
    };

    // 仓库信息(更新画面用)
    $scope.editStorageInfo = {
        name: "",
        remark: ""
    };

    // 仓库区域信息
    $scope.zoneList = [];

    // 追加画面（增加区域）初期数据
    var initZoneInfo = {
        addZoneName: "",
        addZoneRow: "",
        addZoneCol: "",
        addZoneLot: ""
    };
    $scope.newZoneInfo = {};

    /**
     * 获取仓库分区信息列表
     */
    function getStorageZoneList() {
        // 检索URL组装
        var url = _host.api_url + "/storageArea?storageId=" + $scope.storageInfo.id;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.zoneList = data.result;
                // 画面区域数变更
                $scope.storageInfo.zoneSize = data.result.length;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取仓库信息
     */
    $scope.getStorageInfo = function () {

        // 检索URL组装
        var url = _host.api_url + "/storage?storageId=" + $scope.storageInfo.id;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 画面仓库 名称（表示用）
                $scope.storageInfo.name = data.result[0].storage_name;
                // 画面仓库 备注（表示用）
                $scope.storageInfo.remark = data.result[0].remark;

                // 获取仓库分区信息列表
                getStorageZoneList();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 返回到前画面（仓库设置）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * 打开画面【修改仓库资料】模态框。
     */
    $scope.openEditStorage = function () {
        // 修改仓库资料
        $scope.editStorageInfo.name = $scope.storageInfo.name;
        $scope.editStorageInfo.remark = $scope.storageInfo.remark;

        $('.modal').modal();
        $('#editStorage').modal('open');
    };

    /**
     * 修改仓库资料，并刷新画面。
     */
    $scope.updateStorageInfo = function () {

        if ($scope.editStorageInfo.name !== "") {
            // 修改画面数据
            var obj = {
                storageName: $scope.editStorageInfo.name,
                remark: $scope.editStorageInfo.remark
            };

            var url = _host.api_url + "/admin/" + userId + "/storage/" + $scope.storageInfo.id;

            // 调用 API [update storage info]
            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#editStorage').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.getStorageInfo();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 打开画面【增加区域】模态框。
     */
    $scope.openAddStorageZone = function (id) {
        // 初期化数据
        angular.copy(initZoneInfo, $scope.newZoneInfo);

        $('.modal').modal();
        $('#addStorageZone').modal('open');
    };

    /**
     * 增加区域信息。
     */
    $scope.addStorageZone = function () {
        if ($scope.newZoneInfo.addZoneName !== "" && $scope.newZoneInfo.addZoneRow !== ""
            && $scope.newZoneInfo.addZoneCol !== "" && $scope.newZoneInfo.addZoneLot !== "") {

            // 追加画面数据
            var obj = {
                areaName: $scope.newZoneInfo.addZoneName,
                row: $scope.newZoneInfo.addZoneRow,
                col: $scope.newZoneInfo.addZoneCol,
                lot: $scope.newZoneInfo.addZoneLot
            };

            // 调用 API [user create app]
            _basic.post(_host.api_url + "/user/" + userId + "/storage/" + $scope.storageInfo.id + "/storageArea", obj).then(function (data) {
                if (data.success) {
                    $('#addStorageZone').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    getStorageZoneList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 打开画面【修改区域名称】模态框。
     */
    $scope.openEditStorageZone = function (id, name) {
        $scope.zoneId = id;
        $scope.zoneName = name;

        $('.modal').modal();
        $('#editStorageZone').modal('open');
    };

    /**
     * 修改区域名称，并刷新画面。
     */
    $scope.updateZoneInfo = function () {

        if ($scope.zoneName !== "") {
            // 修改画面数据
            var obj = {
                areaName: $scope.zoneName
            };
            var url = _host.api_url + "/user/" + userId + "/storageArea/" + $scope.zoneId;

            // 调用 API [update storage info]
            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#editStorageZone').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    getStorageZoneList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 根据仓库ID修改仓库运营状态，并刷新一览画面。
     * @param id
     * @param status
     */
    $scope.changeZoneStatus = function (id, status) {
        swal({
                title: "",
                text: "确认修改？",
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
                    if (status == 0) {
                        // str="启用";
                        status = 1
                    } else {
                        // str="停用";
                        status = 0
                    }

                    // PUT /user/{userId}/storageArea/{areaId}/areaStatus/{areaStatus}
                    var url = _host.api_url + "/user/" + userId + "/storageArea/" + id + "/areaStatus/" + status;

                    _basic.put(url, {}).then(function (data) {
                        if (data.success == true) {
                            swal.close();
                        } else {
                            swal(data.msg, "", "error");
                        }
                        getStorageZoneList();
                    })
                } else {
                    swal.close();
                    getStorageZoneList();
                }
            });
    };

    /**
     * 画面初期检索
     */
    $scope.getStorageInfo();
}]);

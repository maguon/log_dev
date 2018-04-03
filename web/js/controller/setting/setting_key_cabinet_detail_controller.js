/**
 * 主菜单：管理员设置 -> 钥匙柜设置(详细画面) 控制器
 */
app.controller("setting_key_cabinet_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", function ($scope, $state, $stateParams, _basic, _config, _host) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 条件：状态 [0:停用 1:可用]
    $scope.useFlags = _config.useFlags;

    // 钥匙柜信息
    $scope.carKeyCabinetInfo = {
        // 钥匙柜ID
        id: $stateParams.id,
        name: "",
        remark: "",
        zoneSize: "",
        // 钥匙柜 状态
        status: $stateParams.status
    };

    // 钥匙柜信息(表示用)
    $scope.keyCabinetInfo = {
        name: "",
        remark: ""
    };

    // 钥匙柜扇区信息
    $scope.zoneList = [];

    // 追加画面（增加扇区）初期数据
    var initZoneInfo = {
        addZoneName: "",
        addZoneRow: "",
        addZoneCol: ""
    };
    $scope.newZoneInfo = {};

    /**
     * 获取钥匙柜分区信息列表
     */
    function getKeyCabinetZoneList() {
        // 检索URL组装
        var url = _host.api_url + "/carKeyCabinetArea?carKeyCabinetId=" + $scope.carKeyCabinetInfo.id;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.zoneList = data.result;
                // 画面扇区数变更
                $scope.carKeyCabinetInfo.zoneSize = data.result.length;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 获取钥匙柜信息
     */
    $scope.getKeyCabinetInfo = function () {

        // 检索URL组装
        var url = _host.api_url + "/carKeyCabinet?carKeyCabinetId=" + $scope.carKeyCabinetInfo.id;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 画面钥匙柜 名称
                $scope.carKeyCabinetInfo.name = data.result[0].key_cabinet_name;
                // 画面钥匙柜 备注
                $scope.carKeyCabinetInfo.remark = data.result[0].remark;

                // 画面钥匙柜 名称（表示用）
                $scope.keyCabinetInfo.name = data.result[0].key_cabinet_name;
                // 画面钥匙柜 备注（表示用）
                $scope.keyCabinetInfo.remark = data.result[0].remark;

                // 获取钥匙柜分区信息列表
                getKeyCabinetZoneList();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 返回到前画面（钥匙柜设置）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };

    /**
     * 打开画面【修改钥匙柜资料】模态框。
     */
    $scope.openEditKeyCabinet = function (id) {
        $('.modal').modal();
        $('#editKeyCabinet').modal('open');
    };

    /**
     * 修改钥匙柜资料，并刷新画面。
     */
    $scope.updateKeyCabinetInfo = function () {

        if ($scope.carKeyCabinetInfo.name !== "") {
            // 修改画面数据
            var obj = {
                keyCabinetName: $scope.carKeyCabinetInfo.name,
                remark: $scope.carKeyCabinetInfo.remark
            };

            var url = _host.api_url + "/user/" + userId + "/carKeyCabinet/" + $scope.carKeyCabinetInfo.id;

            // 调用 API [update carKeyCabinet info]
            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#editKeyCabinet').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.getKeyCabinetInfo();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 打开画面【增加扇区】模态框。
     */
    $scope.openAddKeyCabinetZone = function (id) {
        // 初期化数据
        angular.copy(initZoneInfo, $scope.newZoneInfo);

        $('.modal').modal();
        $('#addKeyCabinetZone').modal('open');
    };

    /**
     * 增加扇区信息。
     */
    $scope.addKeyCabinetZone = function () {
        if ($scope.newZoneInfo.addZoneName !== "" && $scope.newZoneInfo.addZoneRow !== "" && $scope.newZoneInfo.addZoneCol !== "") {

            // 追加画面数据
            var obj = {
                areaName: $scope.newZoneInfo.addZoneName,
                row: $scope.newZoneInfo.addZoneRow,
                col: $scope.newZoneInfo.addZoneCol
            };

            // 调用 API [user create app]
            _basic.post(_host.api_url + "/user/" + userId + "/carKeyCabinet/" + $scope.carKeyCabinetInfo.id + "/carKeyCabinetArea", obj).then(function (data) {
                if (data.success) {
                    $('#addKeyCabinetZone').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    getKeyCabinetZoneList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 打开画面【修改扇区名称】模态框。
     */
    $scope.openEditKeyCabinetZone = function (id, name) {
        $scope.zoneId = id;
        $scope.zoneName = name;

        $('.modal').modal();
        $('#editKeyCabinetZone').modal('open');
    };

    /**
     * 修改扇区名称，并刷新画面。
     */
    $scope.updateZoneInfo = function () {

        if ($scope.zoneName !== "") {
            // 修改画面数据
            var obj = {
                areaName: $scope.zoneName
            };
            var url = _host.api_url + "/user/" + userId + "/carKeyCabinetArea/" + $scope.zoneId;

            // 调用 API [update carKeyCabinet info]
            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#editKeyCabinetZone').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    getKeyCabinetZoneList();
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
        if (status == 0) {
            // str="启用";
            status = 1
        } else {
            // str="停用";
            status = 0
        }

        // PUT /user/{userId}/carKeyCabinetArea/{areaId}/areaStatus/{areaStatus}
        var url = _host.api_url + "/user/" + userId + "/carKeyCabinetArea/" + id + "/areaStatus/" + status;

        _basic.put(url, {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                getKeyCabinetZoneList();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 画面初期检索
     */
    $scope.getKeyCabinetInfo();
}]);

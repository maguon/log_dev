/**
 * 主菜单：管理员设置 -> 钥匙柜设置(详细画面) 控制器
 */
app.controller("setting_key_cabinet_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", function ($scope, $state, $stateParams, _basic, _config, _host) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 条件：状态 [0:停用 1:可用]
    $scope.useFlags = _config.useFlags;

    // 钥匙柜ID
    var carKeyCabinetId = $stateParams.id;

    // 钥匙柜信息
    $scope.carKeyCabinetInfo = {
        id: carKeyCabinetId,
        name: $stateParams.name,
        remark: $stateParams.remark,
        zoneSize: $stateParams.zoneSize,
        // 钥匙柜 状态
        status: $stateParams.status
    };
    $scope.zoneList = [];


    // 追加画面（增加扇区）初期数据
    var initZoneInfo = {
        addZoneName:"",
        addZoneRow:"",
        addZoneCol:""
    };
    $scope.newZoneInfo = {};

    /**
     * 获取钥匙柜分区信息列表
     */
    $scope.getKeyCabinetZoneList = function () {
        // 检索条件组装
        var condition = _basic.objToUrl({
            // 条件：钥匙柜ID
            carKeyCabinetId: carKeyCabinetId + ""
        });
        condition = condition.length > 0 ? "?" + condition : condition;

        // 检索URL组装
        var url = _host.api_url + "/carKeyCabinetArea" + condition;

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
    };

    /**
     * 返回到前画面（钥匙柜设置）。
     */
    $scope.return = function () {
        // if ($stateParams.from == "setting_key_cabinet") {
        //     $state.go($stateParams.from, {id: $scope.self_car.storage_id, form: "storageStore"}, {reload: true})
        // } else {
        $state.go($stateParams.from, {}, {reload: true})
        // }
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

        console.log('updateKeyCabinetInfo inner' + $scope.carKeyCabinetInfo.name);

        if ($scope.carKeyCabinetInfo.name !== "") {
            console.log('if .... ');
            // 修改画面数据
            var obj = {
                keyCabinetName: $scope.carKeyCabinetInfo.name,
                remark: $scope.carKeyCabinetInfo.remark
            };

            var url = _host.api_url + "/user/" + userId + "/carKeyCabinet/" + carKeyCabinetId;
            console.log(url);

            // 调用 API [update carKeyCabinet info]
            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#editKeyCabinet').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.getKeyCabinetZoneList();
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
    $scope.addAppInfo = function () {

        if ($scope.newZoneInfo.addZoneName !== "" && $scope.newZoneInfo.addZoneRow !== "" && $scope.newZoneInfo.addZoneCol !== "") {

            // 追加画面数据
            var obj = {
                areaName: $scope.newZoneInfo.addZoneName,
                row: $scope.newZoneInfo.addZoneRow,
                col: $scope.newZoneInfo.addZoneCol
            };

            // POST /user/{userId}/carKeyCabinet/{carKeyCabinetId}/carKeyCabinetArea


            // 调用 API [user create app]
            _basic.post(_host.api_url + "/user/" + userId + "/carKeyCabinet/" + carKeyCabinetId + "/carKeyCabinetArea", obj).then(function (data) {
                if (data.success) {
                    $('#addKeyCabinetZone').modal('close');
                    swal("新增成功", "", "success");
                    $scope.getKeyCabinetZoneList();
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
        // 初期化数据
        // angular.copy(initKeyCbinetInfo, $scope.kyCbinetInfo);

        $scope.zoneId = id;
        $scope.zoneName = name;

        $('.modal').modal();
        $('#editKeyCabinetZone').modal('open');
    };

    /**
     * 修改扇区名称，并刷新画面。
     */
    $scope.updateZoneInfo = function () {

        console.log('updateKeyCabinetInfo inner' + $scope.carKeyCabinetInfo.name);

        if ($scope.zoneName !== "") {
            console.log('if .... ');
            // 修改画面数据
            var obj = {
                areaName: $scope.zoneName
            };

            // PUT /user/{userId}/carKeyCabinetArea/{areaId}
            var url = _host.api_url + "/user/" + userId + "/carKeyCabinetArea/" + $scope.zoneId;
            console.log(url);

            // 调用 API [update carKeyCabinet info]
            _basic.put(url, obj).then(function (data) {
                if (data.success) {
                    $('#editKeyCabinetZone').modal('close');
                    swal("修改成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.getKeyCabinetZoneList();
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
        console.log(url);

        _basic.put(url, {}).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $scope.getKeyCabinetZoneList();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 画面初期检索
     */
    $scope.getKeyCabinetZoneList();
}]);

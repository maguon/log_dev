/**
 * 主菜单：管理员设置 -> 钥匙柜设置(详细画面) 控制器
 */
app.controller("setting_key_cabinet_detail_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "_host", function ($scope, $state, $stateParams, _basic, _config, _host) {

    var userId = _basic.getSession(_basic.USER_ID);

    // 钥匙柜ID
    var carKeyCabinetId = $stateParams.id;

    var zoneList = [
        {
            id: "1", name: "aaaa",row: "5", col: "10", size: "50", status: "1"
        },
        {
            id: "2", name: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",row: "5", col: "10", size: "50", status: "0"
        },
        {
            id: "3", name: "c",row: "5", col: "10", size: "50", status: "0"
        },
        {
            id: "4", name: "d",row: "5", col: "10", size: "50", status: "0"
        }
    ];

    $scope.zoneList = [];

    // 当前画面 钥匙柜 id
    $scope.cabinetDetailId = "1";

    // 当前画面 钥匙柜 名字
    $scope.cabinetDetailNm = "钥匙柜 名字";

    // 当前画面 钥匙柜 备注
    $scope.remark = "钥匙柜 备注";

    $scope.zoneSize = 5;

    // 当前画面 钥匙柜 备注
    $scope.addZoneRow = "";

    // 当前画面 钥匙柜 备注
    $scope.addZoneCol = "";


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

        console.log(url);

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.zoneList = data.result;
                // $scope.zoneList = zoneList;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    $scope.getKeyCabinetZoneList();

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
     * 打开画面【增加钥匙柜】模态框。
     */
    $scope.openEditKeyCabinet = function (id) {
        console.log('sss');
        // 初期化数据
        // angular.copy(initKeyCbinetInfo, $scope.kyCbinetInfo);

        $('.modal').modal();
        $('#editKeyCabinet').modal('open');
    };

    /**
     * 打开画面【增加钥匙柜】模态框。
     */
    $scope.openAddKeyCabinetZone = function (id) {
        // 初期化数据
        // angular.copy(initKeyCbinetInfo, $scope.kyCbinetInfo);

        $('.modal').modal();
        $('#addKeyCabinetZone').modal('open');
    };

    /**
     * 打开画面【增加钥匙柜】模态框。
     */
    $scope.openEditKeyCabinetZone = function (id) {
        // 初期化数据
        // angular.copy(initKeyCbinetInfo, $scope.kyCbinetInfo);

        $('.modal').modal();
        $('#editKeyCabinetZone').modal('open');
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
}])

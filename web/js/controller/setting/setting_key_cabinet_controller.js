/**
 * 主菜单：管理员设置 -> 钥匙柜设置 控制器
 */
app.controller("setting_key_cabinet_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 条件：状态 [0:停用 1:可用]
    $scope.useFlags = _config.useFlags;

    // 追加画面初期数据
    var initKeyCbinetInfo = {
        keyCabinetName: "",
        remark: ""
    };
    // 追加画面数据
    $scope.keyCbinetInfo = {};

    // 检索条件：钥匙柜名称
    $scope.conditionKeyCabinet = "";
    // 检索条件：钥匙柜 状态
    $scope.conditionKeyCabinetStatus = "";

    /**
     * 获取钥匙柜信息列表
     */
    function getKeyCabinetList() {
        // 检索条件组装
        var condition = _basic.objToUrl({
            // 条件：钥匙柜名称
            keyCabinetName: $scope.conditionKeyCabinet,
            // 条件：状态
            keyCabinetStatus: $scope.conditionKeyCabinetStatus + ""
        });
        condition = condition.length > 0 ? "?" + condition : condition;

        // 检索URL组装
        var url = _host.api_url + "/carKeyCabinet" + condition;

        // 调用API取得，画面数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 检索取得数据集
                $scope.keyCabinetList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 点击搜索按钮。
     */
    $scope.searchKeyCabinetList = function () {
        // 根据画面条件，检索画面数据
        getKeyCabinetList();
    };

    /**
     * 打开画面【增加钥匙柜】模态框。
     */
    $scope.openAddKeyCabinet = function () {
        // 初期化数据
        angular.copy(initKeyCbinetInfo, $scope.keyCbinetInfo);

        $('.modal').modal();
        $('#addKeyCabinet').modal('open');

        $('#remark').val('');
        $('#remark').trigger('autoresize');
    };

    /**
     * 增加钥匙柜信息。
     */
    $scope.addKeyCabinet = function () {
        if ($scope.keyCbinetInfo.keyCabinetName !== "") {

            // 追加画面数据
            var obj = {
                keyCabinetName: $scope.keyCbinetInfo.keyCabinetName,
                remark: $scope.keyCbinetInfo.remark
            };

            // 调用 API [user create carKeyCabinet]
            _basic.post(_host.api_url + "/user/" + userId + "/carKeyCabinet", obj).then(function (data) {
                if (data.success) {
                    $('#addKeyCabinet').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.searchKeyCabinetList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 修改钥匙柜状态。
     *
     * @param keyId 钥匙柜ID
     * @param keyCabinetStatus 钥匙柜状态
     */
    $scope.changeKeyCabinetStatus = function (keyId, keyCabinetStatus) {

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
                    if (keyCabinetStatus == 0) {
                        // 启用
                        status = 1
                    } else {
                        // 停用
                        status = 0
                    }

                    // API url
                    var url = _host.api_url + "/user/" + userId + "/carKeyCabinet/" + keyId + "/keyCabinetStatus/" + status;

                    // 调用更新API
                    _basic.put(url, {}).then(function (data) {
                        if (data.success) {
                            swal("修改成功", "", "success");
                            // 成功后，刷新页面数据
                            $scope.searchKeyCabinetList();
                        } else {
                            swal(data.msg, "", "error");
                            $scope.searchKeyCabinetList();
                        }
                    })
                } else {
                    swal.close();
                }
            });



        // // 检索条件组装
        // var condition = _basic.objToUrl({
        //     // 条件：钥匙柜ID
        //     carKeyCabinetId: keyId + "",
        //     // 条件：钥匙柜分区状态：可用
        //     areaStatus: "1"
        // });
        // condition = condition.length > 0 ? "?" + condition : condition;
        //
        // // 检索URL组装
        // var url = _host.api_url + "/carKeyCabinetArea" + condition;
        //
        // // 调用API取得，画面数据
        // _basic.get(url).then(function (data) {
        //     if (data.success) {
        //         if (data.result.length > 0) {
        //             swal("钥匙柜中还有未清空的扇区，请先清空再执行停用操作！", "", "warning");
        //             $scope.searchKeyCabinetList();
        //         } else {
        //             // API url
        //             var url = _host.api_url + "/user/" + userId + "/carKeyCabinet/" + keyId + "/keyCabinetStatus/" + status;
        //
        //             // 调用更新API
        //             _basic.put(url,{}).then(function (data) {
        //                 if (data.success) {
        //                     swal("修改成功", "", "success");
        //                     // 成功后，刷新页面数据
        //                     $scope.searchKeyCabinetList();
        //                 } else {
        //                     swal(data.msg, "", "error");
        //                 }
        //             })
        //         }
        //     } else {
        //         swal(data.msg, "", "error");
        //     }
        // });
    };

    /**
     * 画面初期检索。
     */
    $scope.searchKeyCabinetList();
}]);

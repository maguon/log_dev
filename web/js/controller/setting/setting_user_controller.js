/**
 * 主菜单：用户管理 控制器
 */
app.controller("setting_user_controller", ["_basic", "_config", "_host", "$scope", function (_basic, _config, _host, $scope) {
    var adminId = _basic.getSession(_basic.USER_ID);

    // 部门信息列表
    var userInfoItem = _config.userTypes;

    /**
     *  画面初期显示时，取得部门信息列表。
     * @returns {Array}
     */
    var getDepartmentInfoList = function () {
        $scope.userInfoArray = [];
        for (var i in userInfoItem) {
            $scope.userInfoArray.push(userInfoItem[i])
        }
        return $scope.userInfoArray
    };
    getDepartmentInfoList();

    /**
     * 画面初期显示时，查询所有用户信息列表。
     */
    var getUserInfoList = function () {
        _basic.get(_host.api_url + "/admin/" + adminId + "/user").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.operator = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    getUserInfoList();

    /**
     * 点击增加操作员按钮，显示追加用户dialog画面。
     */
    $scope.addOperator = function () {
        $scope.submitted = false;
        $scope.newRealName = "";
        $scope.newDepId = "";
        $scope.newUserName = "";
        $scope.newUserSex = "";
        $scope.newUserPassword = "";
        $(".modal").modal();
        $("#newOperator").modal("open");
    };

    /**
     * 提交追加用户请求到后台处理。
     *
     * @param isValid 是否有输入错误
     */
    $scope.createOperator = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var sex_id = $(".sex").attr("sex");
            $scope.newUserSex = sex_id;
            var obj = {
                mobile: $scope.newUserName,
                realName: $scope.newRealName,
                type: $scope.newDepId,
                gender: $scope.newUserSex,
                // mobile:$scope.new_userName,
                password: $scope.newUserPassword
            };
            _basic.post(_host.api_url + "/admin/" + adminId + "/user", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#newOperator').modal('close');
                    getDepartmentInfoList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    /**
     * 根据用户ID查看用户信息（打开用户编辑画面）。
     *
     * @param id 用户ID
     */
    $scope.queryOperator = function (id) {
        $(".modal").modal();
        $("#look_Operator").modal("open");
        _basic.get(_host.api_url + "/admin/" + adminId + "/user?userId=" + id).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.look_operation = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 修改单一用户的使用状态。
     *
     * @param st 状态：停/启用
     * @param id 用户ID
     */
    $scope.changeStatus = function (st, id) {
        if (st == "1") {
            $scope.changeSt = "0"
        } else if (st == "0") {
            $scope.changeSt = "1"
        }

        _basic.put(_host.api_url + "/admin/" + adminId + "/user/" + id + "/status/" + $scope.changeSt
            , {}).then(function (data) {
            if (data.success == true) {
                getUserInfoList();
            } else {
                swal(data.msg, "", "error");
            }

        })
    };

    /**
     * 修改用户信息。
     *
     * @param isValid 是否有输入错误
     * @param id 用户ID
     */
    $scope.updateOperatorInfo = function (isValid, id) {
        $scope.submitted = true;
        if (isValid) {
            var sex_id = $(".sex").attr("sex");
            $scope.newUserSex = sex_id;
            var obj = {
                mobile: $scope.look_operation.mobile,
                realName: $scope.look_operation.real_name,
                type: $scope.look_operation.type,
                status: $scope.look_operation.status,
                gender: $scope.newUserSex
            };
            _basic.put(_host.api_url + "/admin/" + adminId + "/user/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#look_Operator').modal('close');
                    getUserInfoList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    }
}]);

app.controller("setting_user_controller", ["_basic","_config", "$host", "$scope", function (_basic,_config,$host, $scope) {
    var adminId = _basic.getSession(_basic.USER_ID);
    var userInfoItem=_config.userTypes;
    var user_info_fun=function () {
        $scope.userInfoArray=[];
        for(var i in userInfoItem){
            $scope.userInfoArray.push(userInfoItem[i])
        }
        return $scope.userInfoArray
    };
    user_info_fun();
    // 搜索所有查询
    var searchAll = function () {
        _basic.get($host.api_url + "/admin/" + adminId + "/user").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                // console.log(data)
                $scope.operator = data.result;

            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    searchAll();
    $scope.newOperator = function () {
        $scope.submitted = false;
        $scope.newRealName = "";
        $scope.newDepId = "";
        $scope.newUserName = "";
        $scope.newUserSex = "";
        $scope.newUserPassword = "";
        $(".modal").modal();
        $("#newOperator").modal("open");
    };
    // 提交新增
    $scope.submitForm = function (isValid) {
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
            _basic.post($host.api_url + "/admin/" + adminId + "/user", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#newOperator').modal('close');
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 查看详情
    $scope.lookOperation = function (id) {
        $(".modal").modal();
        $("#look_Operator").modal("open");
        _basic.get($host.api_url + "/admin/" + adminId + "/user?userId=" + id).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.look_operation = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 停启用
    $scope.changeStatus = function (st, id) {
                if (st == "1") {
                    $scope.changeSt = "0"
                } else if (st == "0") {
                    $scope.changeSt = "1"
                }

                _basic.put($host.api_url + "/admin/" + adminId + "/user/" + id + "/status/" + $scope.changeSt
                    , {}).then(function (data) {
                    if (data.success == true) {
                        searchAll();
                    } else {
                        swal(data.msg, "", "error");
                    }

                })
    };
    // 修改
    $scope.changeOperatorForm = function (isValid, id) {
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
            _basic.put($host.api_url + "/admin/" + adminId + "/user/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#look_Operator').modal('close');
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    }
}]);
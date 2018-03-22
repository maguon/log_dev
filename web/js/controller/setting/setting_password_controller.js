/**
 * 主菜单：管理员设置（管理员密码修改）
 */
app.controller("setting_password_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
    /**
     * 修改管理员密码。
     *
     * @param isValid 是否有效
     */
    $scope.updateAdminPsw = function (isValid) {
        var adminId = _basic.getSession(_basic.USER_ID);
        $scope.submitted = true;
        if (isValid && $scope.newCode == $scope.confirmPsw) {
            var obj = {
                originPassword: $scope.primaryCode,
                newPassword: $scope.newCode
            };
            _basic.put(_host.api_url + "/admin/" + adminId + "/password", obj).then(function (data) {
                if (data.success == true) {
                    swal("密码重置成功", "", "success");
                    $scope.primaryCode="";
                    $scope.newCode="";
                    $scope.confirmPsw="";
                    $scope.submitted = false;
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    }
}]);

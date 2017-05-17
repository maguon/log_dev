/**
 * Created by ASUS on 2017/5/17.
 */
// 管理员密码设置

settingPW_controller.controller("settingPW_controller", ["$scope", "$host", "$basic", function ($scope, $host, $basic) {
    $scope.settingPswForm = function (isValid) {
        var adminId = $basic.getSession($basic.USER_ID);

        $scope.submitted = true;
        if (isValid && $scope.newCode == $scope.confirmPsw) {
            var obj = {
                originPassword: $scope.primaryCode,
                newPassword: $scope.newCode
            };
            $basic.put($host.api_url + "/admin/" + adminId + "/password", obj).then(function (data) {
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
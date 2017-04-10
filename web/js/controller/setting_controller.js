var settingController=angular.module("settingController",[]);

settingController.controller("settingPW_controller",["$scope","$host","$basic",function ($scope,$host,$basic) {
    $scope.settingPswForm=function (isValid) {
        var adminId=sessionStorage.getItem("userId");
        $scope.submitted=true;
        if(isValid&&$scope.newCode==$scope.confirmPsw){
            var obj={
                originPassword:$scope.primaryCode,
                newPassword:$scope.newCode
            };
            $basic.put($host.api_url+"/admin/"+adminId+"/password",obj).then(function (data) {
                if(data.success==true){
                    swal("密码重置成功","","success");

                }else {
                    swal(data.msg,"","error");
                }
            })
        }

    }



}]);
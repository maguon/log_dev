/**
 * Created by ASUS on 2017/4/7.
 */
var userController=angular.module("userController",[]);
userController.controller("usersController",function () {

});
userController.controller("operator_controller",["$basic","$host","$scope",function ($basic,$host,$scope) {

    var adminId=sessionStorage.getItem("userId");
    $basic.get($host.api_url+"/admin/"+adminId+"/user").then(function (data) {
        if(data.success==true){
           // console.log(data)
            $scope.operator=data.result;

        }else {
            swal(data.msg,"","error");
        }
    })

    $scope.newOperator=function () {
        $scope.submitted = false;
        $scope.new_userName="";
        $scope.new_depId="";
        $scope.user_phone="";
        $scope.user_sex="";
        $scope.user_password="";

        $(".modal").modal();
        $("#newOperator").modal("open")
        $basic.get($host.api_url+"/admin/"+adminId+"/department").then(function (data) {
            if(data.success==true){
                $scope.department=data.result;
                // console.log($scope.Company);
            }else {
                swal(data.msg,"","error");
            }
        })
    };
    $scope.submitForm=function (isValid) {
        $scope.submitted=true;

        if(isValid){
            var sex_id=$(".sex").attr("sex");
            $scope.user_sex=sex_id;

            var obj={
                userName:$scope.new_userName,
                deptId:$scope.new_depId,
                gender:$scope.user_sex,
                mobile:$scope.user_phone,
                password:$scope.user_password
            };
            $basic.post($host.api_url+"/admin/"+adminId+"/user",obj).then(function (data) {
                if(data.success==true){
                    swal("新增成功","","success");
                }else {
                    swal(data.msg,"","error");
                }

            })

        }
    }



}]);
userController.controller("admin_controller",function () {
    
});

/**
 * Created by ASUS on 2017/4/7.
 */
var userController=angular.module("userController",[]);
userController.controller("usersController",function () {

});
userController.controller("operator_controller",["$basic","$host","$scope",function ($basic,$host,$scope) {
    var adminId=sessionStorage.getItem("userId");
    $scope.newOperator=function () {
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


}]);
userController.controller("admin_controller",function () {
    
});

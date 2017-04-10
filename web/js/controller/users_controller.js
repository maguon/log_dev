/**
 * Created by ASUS on 2017/4/7.
 */
var userController=angular.module("userController",[]);
userController.controller("usersController",["$basic","$host","$scope",function ($basic,$host,$scope) {
    var adminId=sessionStorage.getItem("userId");
    // 搜索所有查询
    var searchAll=function () {
        $basic.get($host.api_url+"/admin/"+adminId+"/user").then(function (data) {
            if(data.success==true){
                console.log(data)
                $scope.operator=data.result;

            }else {
                swal(data.msg,"","error");
            }
        });
        $basic.get($host.api_url+"/admin/"+adminId+"/department").then(function (data) {
            if(data.success==true){
                $scope.department=data.result;
                // console.log($scope.Company);
            }else {
                swal(data.msg,"","error");
            }
        })
    };
    searchAll();

    $scope.newOperator=function () {
        $scope.submitted = false;
        $scope.newRealName="";
        $scope.newDepId="";
        $scope.newUserName="";
        $scope.newUserSex="";
        $scope.newUserPassword="";

        $(".modal").modal();
        $("#newOperator").modal("open");

    };
    // 提交新增
    $scope.submitForm=function (isValid) {
        $scope.submitted=true;
        if(isValid){
            var sex_id=$(".sex").attr("sex");
            $scope.newUserSex=sex_id;
            var obj={
                mobile:$scope.newUserName,
                realName:$scope.newRealName,
                deptId:$scope.newDepId,
                gender:$scope.newUserSex,
                // mobile:$scope.new_userName,
                password:$scope.newUserPassword
            };

            $basic.post($host.api_url+"/admin/"+adminId+"/user",obj).then(function (data) {
                if(data.success==true){
                    swal("新增成功","","success");
                    $('#newOperator').modal('close');
                    searchAll();
                }else {
                    swal(data.msg,"","error");
                }

            })

        }
    };
    // 查看详情
    $scope.lookOperation=function (id) {
        $(".modal").modal();
        $("#look_Operator").modal("open");
        $basic.get($host.api_url+"/admin/"+adminId+"/user?userId="+id).then(function (data) {
            if(data.success==true){
                $scope.look_operation=data.result[0];

            }else {
                swal(data.msg,"","error");
            }

        })
    };
    // 停启用
    $scope.changeStatus=function (st,id) {
        var st_txt;
        if(st=="1"){
            st_txt="停用"
        }else if(st=="0"){
            st_txt="启用"
        }
        swal({
                title: "确定"+st_txt+"?",
                // text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: st_txt,
                closeOnConfirm: false,
                cancelButtonText: "取消",
            },
            function(){
                swal("成功!", "", "success");
                if(st=="1"){
                    $scope.changeSt="0"
                }else if(st=="0"){
                    $scope.changeSt="1"
                }

                $basic.put($host.api_url+"/admin/"+adminId+"/user/"+id+"/status/"+$scope.changeSt
                ,{}).then(function (data) {
                    if(data.success==true){
                        searchAll();
                    }else {
                        swal(data.msg,"","error");
                    }

                })
            });
    };
    // 修改
    $scope.changeOperatorForm=function (isValid,id) {
        $scope.submitted=true;
        if(isValid){
            var sex_id=$(".sex").attr("sex");
            $scope.newUserSex=sex_id;
            var obj={
                mobile:$scope.look_operation.mobile,
                realName:$scope.look_operation.real_name,
                deptId:$scope.look_operation.dept_id,
                // gender:$scope.look_operation.gender,
                status:$scope.look_operation.status,
                gender:$scope.newUserSex
                // mobile:$scope.new_userName,
                // password:$scope.look_operation.newUserPassword
            };
            $basic.put($host.api_url+"/admin/"+adminId+"/user/"+id,obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success");
                    $('#look_Operator').modal('close');
                    searchAll();
                }else {
                    swal(data.msg,"","error");
                }

            })
        }

    }
}]);
// userController.controller("settingPW_controller",["$scope",function ($scope) {
//     $scope.settingPswForm=function (isValid) {
//         $scope.submitted=true;
//         if(isValid){
//
//         }
//
//     }
//
//
//
// }]);
userController.controller("admin_controller",function () {
    
});

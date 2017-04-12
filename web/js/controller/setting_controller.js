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
settingController.controller("settingWH_controller",["$scope","$host","$basic",function ($scope,$host,$basic){
    var adminId=sessionStorage.getItem("userId");
    // 整体查询
    var searchAll=function () {
        $basic.get($host.api_url+"/admin/"+adminId+"/storage").then(function (data) {
            if(data.success==true){
                $scope.storage=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });
    };
    searchAll();

    $scope.newStorage=function () {
        $scope.submitted = false;
        $scope.newStorageName="";
        $scope.newStorageCol="";
        $scope.newStorageRoad="";
        $scope.newStorageRemark="";

        $(".modal").modal();
        $("#newStorage").modal("open");

    };

    // 新增
    $scope.newStorageForm=function (isValid) {
        $scope.submitted=true;
        if(isValid){
            var obj={
                storageName:$scope.newStorageName,
                col:Number($scope.newStorageCol),
                road:Number($scope.newStorageRoad),
                remark:$scope.newStorageRemark
            };
            $basic.post($host.api_url+"/admin/"+adminId+"/storage",obj).then(function (data) {
                if(data.success==true){
                    swal("新增成功","","success");
                    searchAll();
                    $("#newStorage").modal("close");
                }else {
                    swal(data.msg,"","error");
                }
            })
        }
    };
    // 查看
    $scope.lookStorage=function (id) {
        $(".modal").modal();
        $("#look_Storage").modal("open");
        $basic.get($host.api_url+"/admin/"+adminId+"/storage?storageId="+id).then(function (data) {
            if(data.success==true){
                $scope.selfStorage=data.result[0];
            }else {
                swal(data.msg,"","error");
            }
        })
    };
    // 修改
    $scope.lookStorageForm=function (isValid,id) {
        $scope.submitted=true;
        console.log(id);
        if(isValid){
            var obj={
                storageName: $scope.selfStorage.storage_name,
                col:  Number($scope.selfStorage.col),
                road: Number($scope.selfStorage.road),
                remark: $scope.selfStorage.remark
            };
            console.log(obj)
            $basic.put($host.api_url+"/admin/"+adminId+"/storage/"+id,obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success");
                    searchAll();
                    $("#look_Storage").modal("close");
                }else {
                    swal(data.msg,"","error");
                }
            })
        }
    };
    // 修改仓库运营状态
    $scope.changeStorage_status=function (id,status) {
        var st;
        if(status==0){
            st=1
        }else {
            st=0
        }
        $basic.put($host.api_url+"/admin/"+adminId+"/storage/"+id+"/storageStatus/"+st,{}).then(function (data) {
            if(data.success==true){
                swal("修改成功","","success");
                searchAll();
            }else {
                swal(data.msg,"","error");
            }
        })
    }
}]);
settingController.controller("settingT_Controller",["$scope","$host","$basic",function ($scope,$host,$basic){

}]);
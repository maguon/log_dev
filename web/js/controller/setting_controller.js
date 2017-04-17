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
                row:Number($scope.newStorageCol),
                col:Number($scope.newStorageRoad),
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
    var adminId=sessionStorage.getItem("userId");
    // 汽车品牌
    $scope.searchAll=function () {
        $basic.get($host.api_url+"/admin/"+adminId+"/carMake/").then(function (data) {
            if(data.success==true){
                // console.log(data.result);
                $scope.brand=data.result;
            }else {
                swal(data.msg,"","error");
            }
        })
    };
    $scope.searchAll();
    // 显示修改
    $scope.remark_brand=function (id,val) {
        $(".remark_brand_box"+id).fadeOut(500);
        $(".change_brand_wrap"+id).fadeIn(500);
        $scope.make_name=val;
        console.log($scope.make_name);
    };
    // 关闭修改
    $scope.close_brand=function (id) {
        $(".remark_brand_box"+id).fadeIn(500);
        $(".change_brand_wrap"+id).fadeOut(500);
        // $scope.el.make_name=$scope.make_name;
        $scope.searchAll();
    };

    // 修改
    $scope.verify_brand=function (id,val) {

        $basic.put($host.api_url+"/admin/"+adminId+"/carMake/"+id,{
            "makeName": val
        }).then(function (data) {
            if(data.success==true){
                // swal("修改成功","","error");
                $(".remark_brand_box"+id).fadeIn(500);
                $(".change_brand_wrap"+id).fadeOut(500);
            }else {
                swal(data.msg,"","error");
            }
        })
    };

    // 汽车型号
    $scope.search_carModel=function (id) {
        $basic.get($host.api_url+"/admin/"+adminId+"/carMake/"+id+"/carModel").then(function (data) {
            if(data.success==true){
                // console.log(data.result);
                $scope.brand_model=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });

    };

    // 打开
    $scope.open_car_model=function ($event,id) {
        console.log($($event.target).attr("flag"));
            if($($event.target).attr("flag")=="true"){
                $scope.search_carModel(id);
                $($event.target).attr("flag","false");
            }else {
                $($event.target).attr("flag","true");
            }
    };
    // 打开新增型号
    $scope.add_brand_model=function (id) {
        $(".add_brand_box"+id).fadeOut(500);
        $(".add_brand_model_wrap"+id).fadeIn(500);
    };
    // 修改汽车型号状态
    $scope.changeSelfBrandStatus=function (id,status,makeId) {
        if(status==0){
            status=1;
        }else {
            status=0
        }
        $basic.put($host.api_url+"/admin/"+adminId+"/carModel/"+id+"/modelStatus/"+status,{}).then(function (data) {
            if(data.success==true){
                swal("更改状态","","success");
                $scope.search_carModel(makeId);
            }else {
                swal(data.msg,"","error");
            }
        });
    };
    // 修改汽车型号
    $scope.remarkSelfBrandModel=function ($event,id) {
        $($event.target).removeAttr("readonly");
        $(".selfBrand_status"+id).hide();
        $(".selfBrand_operation"+id).show();

    };
    // 关闭修改型号界面
    $scope.closeSelfBrandModel=function (id) {
        $(".remarkSelfBrand"+id).attr("readonly","readonly");
        $(".selfBrand_status"+id).show();
        $(".selfBrand_operation"+id).hide();
    };
    // 确认提交修改型号
    $scope.verifySelfBrandModel=function (id,val) {
        $basic.put($host.api_url+"/admin/"+adminId+"/carModel/"+id,{
            modelName:val
        }).then(function (data) {
            if(data.success==true){
                // console.log(data.result);
                $(".remarkSelfBrand"+id).attr("readonly","readonly");
                $(".selfBrand_status"+id).show();
                $(".selfBrand_operation"+id).hide();
            }else {
                swal(data.msg,"","error");
            }
        })
    };
    // $scope.searchModel=function (id) {
    //
    // };
    // $scope.add_brand=function () {
    //
    // }
}]);
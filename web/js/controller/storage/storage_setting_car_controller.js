/**
 * Created by ASUS on 2017/5/12.
 */
var storage_setting_car_controller=angular.module("storage_setting_car_controller",[]);
storage_setting_car_controller.controller("storage_setting_car_controller", ["$scope", "$host", "$basic", function ($scope, $host, $basic) {

    var userId = $basic.getSession($basic.USER_ID);
    // 打开汽车品牌
    $scope.car_Brand_box=function ($event) {
        $($event.target).hide();
        $(".car_Brand_box").show();
    };
    // 关闭汽车品牌
    $scope.closeBrand=function () {
        $(".open_car_brand").show();
        $(".car_Brand_box").hide();
        $scope.b_txt="";
    };
    // 汽车品牌
    $scope.searchAll = function () {
        $basic.get($host.api_url + "/carMake/").then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $scope.brand = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.searchAll();
    // 显示修改
    $scope.remark_brand = function (id, val) {
        $(".remark_brand_box" + id).fadeOut(500);
        $(".change_brand_wrap" + id).fadeIn(500);
        $scope.make_name = val;
        console.log($scope.make_name);
    };
    // 关闭修改
    $scope.close_brand = function (id) {
        $(".remark_brand_box" + id).fadeIn(500);
        $(".change_brand_wrap" + id).fadeOut(500);
        // $scope.el.make_name=$scope.make_name;
        $scope.searchAll();
    };

    // 修改
    $scope.verify_brand = function (id, val) {

        $basic.put($host.api_url + "/user/" + userId + "/carMake/" + id, {
            "makeName": val
        }).then(function (data) {
            if (data.success == true) {
                // swal("修改成功","","error");
                $(".remark_brand_box" + id).fadeIn(500);
                $(".change_brand_wrap" + id).fadeOut(500);
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 汽车型号
    $scope.search_carModel = function (id) {
        $basic.get($host.api_url + "/carMake/" + id + "/carModel").then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $scope.brand_model = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

    };

    // // 打开
    // $scope.open_car_model = function ($event, id) {
    //     // console.log($($event.target).attr("flag"));
    //     if ($($event.target).attr("flag") == "true") {
    //         $scope.search_carModel(id);
    //         $($event.target).attr("flag", "false");
    //     } else {
    //         $($event.target).attr("flag", "true");
    //     }
    // };
    // // 打开新增型号
    // $scope.add_brand_model = function (id) {
    //     $(".add_brand_box" + id).fadeOut(500);
    //     $(".add_brand_model_wrap" + id).fadeIn(500);
    // };
    // 修改汽车型号状态
    $scope.changeSelfBrandStatus = function (id, status, makeId) {
        if (status == 0) {
            status = 1;
        } else {
            status = 0
        }
        $basic.put($host.api_url + "/admin/" + userId + "/carModel/" + id + "/modelStatus/" + status, {}).then(function (data) {
            if (data.success == true) {
                swal("更改状态", "", "success");
                $scope.search_carModel(makeId);
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 修改汽车型号
    $scope.remarkSelfBrandModel = function ($event, id) {
        $($event.target).removeAttr("readonly");
        $(".selfBrand_status" + id).hide();
        $(".selfBrand_operation" + id).show();

    };
    // 关闭修改型号界面
    $scope.closeSelfBrandModel = function (id) {
        $(".remarkSelfBrand" + id).attr("readonly", "readonly");
        $(".selfBrand_status" + id).show();
        $(".selfBrand_operation" + id).hide();
    };
    // 确认提交修改型号
    $scope.verifySelfBrandModel = function (id, val) {
        $basic.put($host.api_url + "/user/" + userId + "/carModel/" + id, {
            modelName: val
        }).then(function (data) {
            if (data.success == true) {
                // console.log(data.result);
                $(".remarkSelfBrand" + id).attr("readonly", "readonly");
                $(".selfBrand_status" + id).show();
                $(".selfBrand_operation" + id).hide();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // $scope.searchModel=function (id) {
    //
    // };
    $scope.add_brand=function () {
        $basic.post($host.api_url + "/user/" +userId + "/carMake/", {
            makeName: $scope.b_txt
        }).then(function (data) {
            if (data.success == true) {
                $scope.searchAll();
                $(".open_car_brand").show();
                $(".car_Brand_box").hide();
                $scope.b_txt="";

            } else {
                swal(data.msg, "", "error");
            }
        })
    }
}]);
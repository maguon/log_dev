/**
 * 主菜单：车辆设置
 */
app.controller("setting_truck_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
    var adminId = _basic.getSession(_basic.USER_ID);

    /**
     * 显示增加品牌详细内容画面。
     * @param $event
     */
    $scope.openBrand = function ($event) {
        $($event.target).hide();
        $(".car_Brand_box").show();
    };

    /**
     * 隐藏增加品牌详细内容画面。
     */
    $scope.closeBrand = function () {
        $(".open_car_brand").show();
        $(".car_Brand_box").hide();
        $scope.b_txt = "";
    };

    /**
     * 初期加载画面时，取得所有汽车制造商列表。
     */
    $scope.initData = function () {
        _basic.get(_host.api_url + "/carMake/").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.brand = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.initData();

    /**
     * 显示车辆品牌(名称)编辑画面。
     *
     * @param $event 事件
     * @param $index 序号
     */
    $scope.showCarMakerUpt = function ($event, $index) {
        $event.stopPropagation();
        $(".brand_box" + $index).hide();
        $(".amend_brand_box" + $index).show();
    };

    /**
     * 阻止父事件处理程序被执行。
     *
     * @param $event 事件
     */
    $scope.stopPropagate = function ($event) {
        $event.stopPropagation();
    };

    /**
     * 关闭车辆品牌(名称)编辑画面。
     * @param $index 序号
     */
    $scope.hideCarMakerUpt = function ($index) {
        $(".brand_box" + $index).show();
        $(".amend_brand_box" + $index).hide();
    };

    /**
     * 修改车辆品牌(名称)。
     * @param iValid 是否有效
     * @param id 车辆品牌ID
     * @param name 车辆品牌名称
     * @param $index 车辆品牌序号
     */
    $scope.updateCarBrand = function (iValid, id, name, $index) {
        if (iValid) {
            _basic.put(_host.api_url + "/admin/" + adminId + "/carMake/" + id, {
                "makeName": name
            }).then(function (data) {
                if (data.success == true) {
                    $(".brand_box" + $index).show();
                    $(".amend_brand_box" + $index).hide();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    /**
     * 检索指定品牌的所有汽车型号。
     * @param id
     */
    $scope.getCarModel = function (id) {
        _basic.get(_host.api_url + "/carMake/" + id + "/carModel").then(function (data) {
            if (data.success == true) {
                $scope.brand_model = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 显示增加汽车型号画面。
     * @param $event
     * @param $index
     */
    $scope.showAddCarModelBox = function ($event, $index) {
        $event.stopPropagation();
        $(".open_car_brand").show();
        $($event.target).hide();
        $(".add_model_wrap").hide();
        $(".add_model_wrap" + $index).show();
        $scope.add_car_model_text = "";
    };

    /**
     * 关闭增加汽车型号画面。
     */
    $scope.hideAddCarModelBox = function () {
        $(".add_model_wrap").hide();
        $(".open_car_brand").show();
        $scope.submitted = false;
    };

    /**
     * 增加汽车型号。
     * @param iValid
     * @param id
     */
    $scope.addCarModel = function (iValid, id) {
        $scope.submitted = true;
        if (iValid) {
            _basic.post(_host.api_url + "/admin/" + adminId + "/carMake/" + id + "/carModel", {
                modelName: $scope.add_car_model_text
            }).then(function (data) {
                if (data.success == true) {
                    $(".add_model_wrap").hide();
                    $(".open_car_brand").show();
                    $scope.submitted = false;
                    $scope.getCarModel(id);
                    swal("新增成功", "", "success");

                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    /**
     * 打开汽车型号明细列表画面。
     * @param $event
     * @param id
     */
    $scope.openCarModel = function ($event, id) {
        if ($($event.target).attr("flag") == "true") {
            $scope.getCarModel(id);
            $(".brand_box").attr("flag", "true");
            $($event.target).attr("flag", "false");
        } else {
            $($event.target).attr("flag", "true");
        }
    };

    /**
     * 打开修改型号编辑画面
     *
     * @param $index
     * @param $event
     */
    $scope.showCarModel = function ($index, $event) {
        $($event.target).hide();
        $(".car_model_name" + $index).removeAttr("readonly");
        $(".amend_car_model_box" + $index).show();
    };

    // $scope.changeSelfBrandStatus = function (id, status, makeId) {
    //     if (status == 0) {
    //         status = 1;
    //     } else {
    //         status = 0
    //     }
    //     _basic.put(_host.api_url + "/admin/" + adminId + "/carModel/" + id + "/modelStatus/" + status, {}).then(function (data) {
    //         if (data.success == true) {
    //             $scope.getCarModel(makeId);
    //         } else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };

    // // 修改汽车型号
    // $scope.remarkSelfBrandModel = function ($event, id) {
    //     $($event.target).removeAttr("readonly");
    //     $(".selfBrand_status" + id).hide();
    //     $(".selfBrand_operation" + id).show();
    // };

    /**
     * 关闭修改型号编辑画面
     *
     * @param index
     */
    $scope.hideCarModel = function (index) {
        $(".car_model_name" + index).attr("readonly", "readonly");
        $(".amend_car_model_box" + index).hide();
        $(".mdi-pencil" + index).show();
    };

    /**
     * 修改汽车型号名称。
     * @param id
     * @param name
     * @param index
     */
    $scope.updateCarModel = function (id, name, index) {
        _basic.put(_host.api_url + "/admin/" + adminId + "/carModel/" + id, {
            modelName: name
        }).then(function (data) {
            if (data.success == true) {
                $(".car_model_name" + index).attr("readonly", "readonly");
                $(".amend_car_model_box" + index).hide();
                $(".mdi-pencil" + index).show();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 修改汽车型号状态。
     * @param id
     * @param sta
     * @param makeId
     */
    $scope.updateCarModelStatus = function (id, sta, makeId) {
        if (sta == 0) {
            sta = 1;
        } else {
            sta = 0
        }
        _basic.put(_host.api_url + "/admin/" + adminId + "/carModel/" + id + "/modelStatus/" + sta, {}).then(function (data) {
            if (data.success == true) {
                swal("更改状态", "", "success");
                $scope.getCarModel(makeId);
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 增加车辆品牌。
     * @param iValid 是否有效
     */
    $scope.addBrand = function (iValid) {
        if (iValid) {
            _basic.post(_host.api_url + "/admin/" + adminId + "/carMake/", {
                makeName: $scope.b_txt
            }).then(function (data) {
                if (data.success == true) {
                    $scope.initData();
                    $scope.b_txt = "";
                    $(".open_car_brand").show();
                    $(".car_Brand_box").hide();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    }
}]);
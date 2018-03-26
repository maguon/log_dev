/**
 * Created by ASUS on 2017/5/5.
 * 主菜单：车辆查询 -> 仓储车辆信息 画面
 */
app.controller("demand_Car_details_controller", ["$state", "$stateParams", "_config", "$scope", "_host", "_basic", function ($state, $stateParams, _config, $scope, _host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 通过url中的信息取得 车辆id 和 VIN码
    var val = $stateParams.id;
    var vin = $stateParams.vin;

    // 颜色列表
    $scope.color = _config.config_color;

    /**
     * 显示仓储车辆基本信息。
     */
    $scope.showCarInfo = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg ').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
    };

    /**
     * 显示仓储车辆照片。
     */
    $scope.showCarImg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_img ').addClass("active");
        $("#look_car_img").addClass("active");
        $("#look_car_img").show();
    };

    var viewer;

    /**
     * 显示车辆照片大图。
     */
    $scope.showImgByViewer = function () {
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };

    /**
     * 返回到前画面（车辆查询）。
     */
    $scope.return = function () {
        if ($stateParams.from == "storage_car_map") {
            $state.go($stateParams.from, {id: $scope.self_car.storage_id, form: "storageStore"}, {reload: true})
        } else {
            $state.go($stateParams.from, {}, {reload: true})
        }
    };

    /**
     * 通过车辆ID，取得仓储车辆信息。
     *
     * @param val 车辆ID
     * @param vin VIN码
     */
    $scope.getStorageCarInfo = function (val, vin) {
        $scope.submitted = false;
        // 照片清空
        $scope.imgArr = [];
        // 预览详情照片
        $scope.storage_imageBox = [];
        $(".main_storage_car").hide();
        $("#look_StorageCar").show();
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
        // TODO 暂时无效声明
        $scope.Picture_carId = val;
        $scope.vin = vin;

        //
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.operating_record = data.result[0];
                $scope.comment = $scope.operating_record.comment;
                $scope.storage_image = $scope.operating_record.storage_image;
                for (var i in $scope.storage_image) {
                    $scope.storage_imageBox.push({
                        src: _host.file_url + '/image/' + $scope.storage_image[i].url,
                        time: $scope.storage_image[i].timez,
                        user: $scope.storage_image[i].name
                    });
                }
            } else {
                swal(data.msg, "", "error")
            }
        });

        //
        _basic.get(_host.api_url + "/user/" + userId + "/car?carId=" + val + '&active=1').then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.modelId = data.result[0].model_id;
                $scope.self_car = data.result[0];
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id,
                $scope.look_model_id = $scope.self_car.model_id,
                $scope.look_create_time = moment($scope.self_car.pro_date).format('YYYY-MM-DD');
                $scope.look_storageName = $scope.self_car.storage_name + "  " + $scope.self_car.row + "排" + $scope.self_car.col + "列";
                // 车辆id
                $scope.look_car_id = $scope.self_car.id;
            } else {
                swal(data.msg, "", "error")
            }
        })
    };
    $scope.getStorageCarInfo(val, vin);
}]);
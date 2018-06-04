/**
 * Created by ASUS on 2017/5/5.
 * 主菜单：车辆查询 -> 车辆信息詳情 画面
 */
app.controller("car_demand_details_controller", ["$state", "$stateParams", "_config", "$scope", "_host", "_basic", function ($state, $stateParams, _config, $scope, _host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 通过url中的信息取得 车辆id 和 VIN码
    var val = $stateParams.id;
    var vin = $stateParams.vin;
    // 一行一列内，多个停车位区分用 (A-Z)
    $scope.characters = _config.characters;
    // 颜色列表
    $scope.color = _config.config_color;
    // 车库状态 列表
    $scope.carStatusList = _config.carRelStatus;
    // 状态船运 列表
    $scope.shipTransStatus = _config.shipTransStatus;
    // 是否MSO车辆 列表
    $scope.msoFlags = _config.msoFlags;

    /**
     * 返回到前画面（车辆查询）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"car_demand_details"}, {reload: true})
    };

    /**
     * 仓储车辆基本信息 仓储车辆照片 仓储操作记录 跳转
     */
    $scope.showCarInfo = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg ').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
    };
    $scope.showCarImg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_img ').addClass("active");
        $("#look_car_img").addClass("active");
        $("#look_car_img").show();
    };
    $scope.showComment = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_comment ').addClass("active");
        $("#look_comment").addClass("active");
        $("#look_comment").show();
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
     * 通过车辆ID，取得仓储车辆信息。
     *
     * @param val 车辆ID
     * @param vin VIN码
     */
    $scope.getStorageCarInfo = function (val, vin) {
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
        //图片获取
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success == true ) {
                if(data.result.length == 0){
                    return;
                }
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

        //基本信息获取
        _basic.get(_host.api_url + "/user/" + userId + "/car?carId=" + val).then(function (data) {
            if (data.success == true ) {
                if (data.result.length == 0) {
                    return;
                }
                else {
                    $scope.modelId = data.result[0].model_id;
                    $scope.self_car = data.result[0];
                    $scope.carColor = '未知';
                    for (var i in _config.config_color) {
                        if (_config.config_color[i].colorId == $scope.self_car.colour) {
                            $scope.carColor = _config.config_color[i].colorName;
                        }
                    }
                    // modelID赋值
                    $scope.look_make_id = $scope.self_car.make_id;
                    $scope.look_model_id = $scope.self_car.model_id;
                    $scope.look_create_time = $scope.self_car.pro_date;
                    if($scope.self_car.lot== null){
                        $scope.selfLot='';
                    }else{
                        $scope.selfLot = $scope.characters[$scope.self_car.lot - 1].name;
                    }
                    $scope.look_storageName = $scope.self_car.storage_name + "" + $scope.self_car.area_name + "" + $scope.self_car.row + "排" + $scope.self_car.col + "列" +$scope.selfLot;
                    // 车辆id
                    $scope.look_car_id = $scope.self_car.id;
                }
            }
                else {
                swal(data.msg, "", "error")
            }

        })
    };
    $scope.getStorageCarInfo(val, vin);
}]);
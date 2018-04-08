/**
 * Created by star on 2018/4/3.
 * 委托方详情
 */
app.controller("client_info_detail_controller", ["$scope", "$rootScope", "$stateParams","_host", "_basic", "_config", "_baseService", function ($scope, $rootScope,$stateParams, _host, _basic, _config, _baseService) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 10;
    //获取传过来的id
    var entrustId = $stateParams.id;
    // 获取车辆状态
    $scope.relStatus = _config.carRelStatus;
    $scope.getRelStatus = "";
    // 跳转
    $('ul.tabWrap li').removeClass("active");
    $(".tab_box").removeClass("active");
    $(".tab_box").hide();
    $('ul.tabWrap li.inventoryRecord ').addClass("active");
    $("#inventoryRecord").addClass("active");
    $("#inventoryRecord").show();
    $scope.inventoryRecord = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.inventoryRecord ').addClass("active");
        $("#inventoryRecord").addClass("active");
        $("#inventoryRecord").show();

    };
    $scope.relStatus = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .relStatus').addClass("active");
        $("#relStatus").addClass("active");
        $("#relStatus").show();
    };
    $scope.mosStatus = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .mosStatus').addClass("active");
        $("#mosStatus").addClass("active");
        $("#mosStatus").show();
    };
    // 获取车库信息
    function getStorageName () {
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }
    //获取头部基本信息
    function getentrust (){
        _basic.get(_host.api_url + "/entrust?entrustId=" + entrustId).then(function (data) {
            if (data.success == true) {
                $scope.clientList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    /**
    * 库存记录中 查询列表 条件查询
    *
    * */
    $scope.getStorageCar = function () {
        var reqUrl = _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size;
        if ($scope.getRelStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.getRelStatus
        }
        if ($scope.search_vin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.search_vin
        }
        if ($scope.search_storage != null) {
            reqUrl = reqUrl + "&storageId=" + $scope.search_storage
        }
        if ($scope.getMOS != null) {
            reqUrl = reqUrl + "&mosStatus=" + $scope.getMOS
        }
        if ($scope.search_enterTime_start != null) {
            reqUrl = reqUrl + "&enterStart=" + $scope.search_enterTime_start
        }
        if ($scope.search_enterTime_end != null) {
            reqUrl = reqUrl + "&enterEnd=" + $scope.search_enterTime_end
        }
        if ($scope.search_outTime_start != null) {
            reqUrl = reqUrl + "&realStart=" + $scope.search_outTime_start
        }
        if ($scope.search_outTime_end != null) {
            reqUrl = reqUrl + "&realEnd=" + $scope.search_outTime_end
        }
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.storageCarBoxList = data.result;
                $scope.storageCar = $scope.storageCarBoxList.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").removeClass("disabled");
                } else {
                    $("#pre").addClass("disabled");
                }
                if ($scope.storageCarBoxList.length < $scope.size) {
                    $("#next").addClass("disabled");
                } else {
                    $("#next").removeClass("disabled");
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 上一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.getStorageCar();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.getStorageCar();
    };
    //获取数据
    $scope.queryData = function () {
        getentrust ();
        getStorageName();
        $scope.getStorageCar();
    };
    $scope.queryData();

}])
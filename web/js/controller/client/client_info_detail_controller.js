/**
 * Created by star on 2018/4/3.
 * 委托方详情
 */
app.controller("client_info_detail_controller", ["$scope", "$rootScope","$state", "$stateParams","_host", "_basic", "_config", "_baseService", function ($scope, $rootScope,$state,$stateParams, _host, _basic, _config, _baseService) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;//获取本条信息的id
    $scope.start = 0;
    $scope.size = 10;
    $scope.valuation = 0;
    $scope.characters = _config.characters;
    //获取传过来的id
    // 跳转
    $('ul.tabWrap li').removeClass("active");
    $(".tab_box").removeClass("active");
    $(".tab_box").hide();
    $('ul.tabWrap li.inventoryRecord ').addClass("active");
    $("#inventoryRecord").addClass("active");
    $("#inventoryRecord").show();
    $("#pre").hide();
    $("#next").hide();
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
        getrelStatus();
    };
    $scope.msoStatus = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .msoStatus').addClass("active");
        $("#msoStatus").addClass("active");
        $("#msoStatus").show();
        getMsoStatus();
    };
    // 返回
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true})
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
        _basic.get(_host.api_url + "/entrust?entrustId=" + val).then(function (data) {
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
        var reqUrl = _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size+"&entrustId="+val;
        if ($scope.getRelStatus != null) {
            reqUrl = reqUrl + "&relStatus=" + $scope.getRelStatus
        }
        if ($scope.search_vin != null) {
            reqUrl = reqUrl + "&vin=" + $scope.search_vin
        }
        if ($scope.search_storage != null) {
            reqUrl = reqUrl + "&storageId=" + $scope.search_storage
        }
        if ($scope.getMSO != null) {
            reqUrl = reqUrl + "&msoStatus=" + $scope.getMSO
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
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
     /**
     * 在库车辆 查询列表 条件查询
     *
     * */
     function getrelStatus() {
         _basic.get(_host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size+"&entrustId="+val+"&relStatus=1").then(function (data) {
             if (data.success == true) {
                 $scope.storageCarBoxList2 = data.result;
                 $scope.storageCar2 = $scope.storageCarBoxList2.slice(0, 10);
                 if ($scope.start > 0) {
                     $("#pre2").show();
                 }
                 else {
                     $("#pre2").hide();
                 }
                 if (data.result.length < $scope.size) {
                     $("#next2").hide();
                 }
                 else {
                     $("#next2").show();
                 }
             } else {
                 swal(data.msg, "", "error");
             }
         });
     };

    /**
     * 非mso 查询列表 条件查询
     *
     * */
    function getMsoStatus() {
        _basic.get( _host.api_url + "/user/" + userId + "/car?active=" + 1 + "&start=" + $scope.start + "&size=" + $scope.size+"&entrustId="+val+"&msoStatus=1").then(function (data) {
            if (data.success == true) {
                $scope.storageCarBoxList3 = data.result;
                $scope.storageCar3 = $scope.storageCarBoxList3.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre3").show();
                }
                else {
                    $("#pre3").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next3").hide();
                }
                else {
                    $("#next3").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.getInventoryRecord = function(id){
        $(".modal").modal();
        $("#getInventoryRecord").modal("open");
        _basic.get( _host.api_url + "/user/" + userId + "/car?carId="+id+"&active=" + 1).then(function (data) {
            if (data.success == true) {
                $scope.clientList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    function getEntrust (){
        _basic.get( _host.api_url + "/entrustBase?entrustId="+val).then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    $scope.closeInventoryRecord= function(){
        $(".modal").modal();
        $("#getInventoryRecord").modal("close");
    };
    // 上一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getStorageCar();
    };
    // 下一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getStorageCar();
    };
    //获取数据
    $scope.queryData = function () {
        getentrust ();
        getStorageName();
        getEntrust ();
    };
    $scope.queryData();

}])
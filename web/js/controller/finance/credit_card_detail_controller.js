/**
 * 主菜单：财务管理 -> 信用证详情 控制器
 */
app.controller("credit_card_detail_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams","$filter", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams,$filter) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;

    // 状态
    $scope.statusList = _config.paymentStatus;

    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;

    // 颜色列表
    $scope.configColor = _config.config_color;

    //获取委托方信息
    $scope.getEntrustInfo = function (type, selectText) {
        var url = _host.api_url + "/entrust";
        if (type != null && type !== undefined) {
            url = _host.api_url + "/entrust?entrustType=" + type;
        }
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.putEntrustList = data.result;
                    // 修改画面
                    $('#putEntrustSelect').select2({
                        placeholder: selectText,
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
        });
    };

    /**
     * 返回到前画面（车辆查询）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"credit_card_detail"}, {reload: true})
    };

    /**
     * 基本信息 关联车辆 跳转
     */
    $scope.showMsgInfo = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookMsg ').addClass("active");
        $("#lookMsg").addClass("active");
        $("#lookMsg").show();
    };
    $scope.showLinkCar = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookLinkCar ').addClass("active");
        $("#lookLinkCar").addClass("active");
        $("#lookLinkCar").show();
        $scope.carId = undefined;
    };

    /**
     * 获取基本信息
     */
    function queryBaseItem (){
        _basic.get(_host.api_url + "/credit?creditId="+val).then(function (data) {
            if (data.success) {
                $scope.showMsgInfo();
                $scope.baseInfoList =data.result[0];
                $scope.baseInfoList.short_name =data.result[0].short_name;
                $scope.baseInfoList.entrust_id =data.result[0].entrust_id;
                $scope.baseInfoList.entrust_type =data.result[0].entrust_type;
                $scope.getEntrustInfo($scope.baseInfoList.entrust_type, $scope.baseInfoList.short_name);
                $scope.baseInfoList.plan_return_date =  moment($scope.baseInfoList.plan_return_date).format("YYYY-MM-DD");
                $scope.baseInfoList.receive_card_date =  moment($scope.baseInfoList.receive_card_date).format("YYYY-MM-DD");
                $scope.baseInfoList.documents_date =  moment($scope.baseInfoList.documents_date).format("YYYY-MM-DD");
                $scope.baseInfoList.actual_return_date =  moment($scope.baseInfoList.actual_return_date).format("YYYY-MM-DD");
                $scope.baseInfoList.documents_send_date =  moment($scope.baseInfoList.documents_send_date).format("YYYY-MM-DD");
                $scope.baseInfoList.documents_receive_date =  moment($scope.baseInfoList.documents_receive_date).format("YYYY-MM-DD");
                $scope.baseInfoList.actual_remit_date =  moment($scope.baseInfoList.actual_remit_date).format("YYYY-MM-DD");
                if($scope.baseInfoList.plan_return_date=='Invalid date'){
                    $scope.baseInfoList.plan_return_date=""
                }
                if($scope.baseInfoList.receive_card_date=='Invalid date'){
                    $scope.baseInfoList.receive_card_date=""
                }
                if($scope.baseInfoList.documents_date=='Invalid date'){
                    $scope.baseInfoList.documents_date=""
                }
                if($scope.baseInfoList.actual_return_date=='Invalid date'){
                    $scope.baseInfoList.actual_return_date=""
                }
                if($scope.baseInfoList.documents_send_date=='Invalid date'){
                    $scope.baseInfoList.documents_send_date=""
                }
                if($scope.baseInfoList.documents_receive_date=='Invalid date'){
                    $scope.baseInfoList.documents_receive_date=""
                }
                if($scope.baseInfoList.actual_remit_date=='Invalid date'){
                    $scope.baseInfoList.actual_remit_date=""
                }
            }
        })
    }

    /**
     * 获取关联车辆信息
     */
    function queryLinkCar(){
        _basic.get(_host.api_url + "/creditCarRel?creditId="+val).then(function (data) {
            if (data.success) {
                if(data.result.length==0){
                    $scope.getLinkCarList=[];
                }else{
                    $scope.getLinkCarList =data.result;
                    $scope.carId = undefined;
                }
            }
        })
    }

    /**
     * 修改基本信息
     */
    $scope.putCurrentBaseInfo = function(){
        // 委托方 下拉选中 内容
        if ($("#putEntrustSelect").val() != null && $("#putEntrustSelect").val() !== "") {
            $scope.entrustId = $("#putEntrustSelect").select2("data")[0].id;
        } else {
            if ($('#select2-editEntrustSelect-container').text() !== "委托方") {
                $scope.entrustId = $scope.baseInfoList.entrust_id;
            }
        }

        if ( $scope.entrustId !== "" && $scope.baseInfoList.credit_number !== "" && $scope.baseInfoList.credit_money!== "" && $scope.baseInfoList.actual_money !== "") {
            var obj = {
                creditNumber:  $scope.baseInfoList.credit_number,
                entrustId:  $scope.entrustId,
                creditMoney:  $scope.baseInfoList.credit_money,
                actualMoney: $scope.baseInfoList.actual_money,
                planReturnDate:  $scope.baseInfoList.plan_return_date,
                actualReturnDate:  $scope.baseInfoList.actual_return_date,
                receiveCardDate:  $scope.baseInfoList.receive_card_date,
                documentsDate:  $scope.baseInfoList.documents_date,
                documentsSendDate:  $scope.baseInfoList.documents_send_date,
                documentsReceiveDate:  $scope.baseInfoList.documents_receive_date,
                actualRemitDate:  $scope.baseInfoList.actual_remit_date,
                invoiceNumber: $scope.baseInfoList.invoice_number,
                remark:  $scope.baseInfoList.remark
            };

            // 如果日期没有输入，就去掉此属性
            if ($scope.baseInfoList.plan_return_date ==  "") {
                delete obj.planReturnDate;
            }
            if ($scope.baseInfoList.actual_return_date ==  "") {
                delete obj.actualReturnDate;
            }
            if ( $scope.baseInfoList.receive_card_date ==  "") {
                delete obj.receiveCardDate;
            }
            if ($scope.baseInfoList.documents_date ==  "") {
                delete obj.documentsDate;
            }
            if ($scope.baseInfoList.documents_send_date ==  "") {
                delete obj.documentsSendDate;
            }
            if ($scope.baseInfoList.documents_receive_date ==  "") {
                delete obj.documentsReceiveDate;
            }
            if (  $scope.baseInfoList.actual_remit_date ==  "") {
                delete obj.actualRemitDate;
            }

            _basic.put(_host.api_url + "/user/" + userId + "/credit/"+val, obj).then(function (data) {
                if (data.success) {
                    swal('修改成功!', "", "success");

                } else {
                    swal(data.msg, "", "error");
                }
            });
        } else {
            swal("请输入完整信息！", "", "warning");
        }
    };


    //模糊查询
    var vinObjs ={};
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 10,
        onAutocomplete: function(val) {
        },
        minLength: 6
    });

    $scope.shortSearch = function (vin) {
        // 委托方 下拉选中 内容
        if ($("#putEntrustSelect").val() != null && $("#putEntrustSelect").val() !== "") {
            $scope.entrustId = $("#putEntrustSelect").select2("data")[0].id;
        } else {
            if ($('#select2-editEntrustSelect-container').text() !== "委托方") {
                $scope.entrustId = $scope.baseInfoList.entrust_id;
            }
        }
        if (vin !== undefined && vin !== "") {
            $scope.addCarInfoFlg = false;

            if (vin.length >= 6) {
                _basic.get(_host.api_url + "/shipTransCarRel?entrustId="+$scope.entrustId+"&vinCode=" +vin, {}).then(function (data) {
                    if (data.success && data.result.length > 0) {
                        $scope.vinMsg = data.result;
                        $scope.carId= data.result[0].car_id;
                        vinObjs = {};
                        for (var i in $scope.vinMsg) {
                            vinObjs[$scope.vinMsg[i].vin] = null;
                        }
                        return vinObjs;
                    } else {
                        return {};
                    }
                }).then(function (vinObjs) {
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6,
                        onAutocomplete: function (val) {
                            $scope.addCarInfoFlg = true;
                        },
                        limit: 6
                    });
                    $('#autocomplete-input').focus();
                })
            } else {
                $('#autocomplete-input').autocomplete({minLength: 6});
                $scope.vinMsg = {}
            }
        }
    };

    // 查询vin码
    $scope.addLinkCar=function () {
        _basic.post(_host.api_url + "/user/"+userId+"/creditCarRel" ,{
            creditId: val,
            carId: $scope.carId
        }).then(function (data) {
            if (data.success) {
                $scope.linkCarId =data.id;
                queryLinkCar();
                // 使追加按钮灰掉
                $scope.addCarInfoFlg = false;
                // 清空VIN输入框
                $scope.creditVin = '';
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    //刪除
    $scope.deleteLinkCar = function(carId){
        _basic.delete(_host.api_url + "/user/" + userId + "/credit/" + val + '/car/' + carId, {}).then(
            function (data) {
                if (data.success === true) {
                    queryLinkCar();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
    };

    //完結
    $scope.endOfProcessing = function(){
        if($scope.getLinkCarList.length==0){
            swal("请先关联车辆", "", "error")
        }else{
            _basic.put(_host.api_url + "/user/" + userId + "/credit/" + val + '/creditStatus/2' , {}).then(
                function (data) {
                    if (data.success === true) {
                        queryBaseItem();
                        queryLinkCar();
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
        }
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        queryBaseItem ();
        queryLinkCar();
    }
    initData();
}]);
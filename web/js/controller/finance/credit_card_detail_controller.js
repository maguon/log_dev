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
    };


    /**
     * 获取基本信息
     */
    function queryBaseItem (){
        _basic.get(_host.api_url + "/financialCredit?financialCreditId="+val).then(function (data) {
            if (data.success == true) {
                $scope.showMsgInfo();
                $scope.baseInfoList =data.result[0];
                $scope.baseInfoList.short_name =data.result[0].short_name;
                $scope.baseInfoList.entrust_type =data.result[0].entrust_type;
                $scope.getEntrustInfo($scope.baseInfoList.entrust_type, $scope.baseInfoList.short_name);
                $scope.baseInfoList.plan_return_date =  moment($scope.baseInfoList.plan_return_date).format("YYYY-MM-DD");
                $scope.baseInfoList.receive_card_date =  moment($scope.baseInfoList.receive_card_date).format("YYYY-MM-DD");
                $scope.baseInfoList.documents_date =  moment($scope.baseInfoList.documents_date).format("YYYY-MM-DD");
                $scope.baseInfoList.actual_return_date =  moment($scope.baseInfoList.actual_return_date).format("YYYY-MM-DD");
                $scope.baseInfoList.documents_send_date =  moment($scope.baseInfoList.documents_send_date).format("YYYY-MM-DD");
                $scope.baseInfoList.documents_receive_date =  moment($scope.baseInfoList.documents_receive_date).format("YYYY-MM-DD");
                $scope.baseInfoList.actual_remit_date =  moment($scope.baseInfoList.actual_remit_date).format("YYYY-MM-DD");

            }
        })
    }




    queryBaseItem ();
}])
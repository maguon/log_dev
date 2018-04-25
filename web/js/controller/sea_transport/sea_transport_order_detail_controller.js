/**
 * 主菜单：海运管理 --订单管理详情   by star 2018/4/24
 */
app.controller("sea_transport_order_detail_controller", ["$scope","$stateParams", "_basic", "_host","_config","$state",  function ($scope,$stateParams, _basic, _host,_config,$state) {

    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);

    // 订单 ID
    $scope.seaTransportOrderId = $stateParams.id;

    $scope.payStatus = _config.payStatus;
    /**
     * 返回到前画面（订单管理）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };


    /**
     * 根据id获得详情。
     */
    function queryOrderData() {
        _basic.get( _host.api_url + "/shipTransOrder?shipTransOrderId="+$scope.seaTransportOrderId).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    return;
                }
                $scope.paymentInfo = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /*
    * 修改运费
    * */
    $scope.changeShipTransFee = function (id){
        var obj = {
            shipTransFee:$scope.paymentInfo.ship_trans_fee
        };
        _basic.put(_host.api_url + "/user/" + userId + "/shipTransOrder/"+id+'/ShipTransOrderFee', obj).then(function (data) {
            if (data.success == true) {
                swal('修改成功!', "", "success");

            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得订单详情
        queryOrderData();
    };
    $scope.initData();
}])
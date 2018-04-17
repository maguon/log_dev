app.controller("payment_detail_controller", ["$scope","$stateParams", "_basic", "_host","_config","$state",  function ($scope,$stateParams, _basic, _host,_config,$state) {
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;//跳转过来的id
    $scope.entrustTypeList = _config.entrustType;//委托方性质
    $scope.paymentStatusList= _config.paymentStatus;
    $scope.paymentTypeList= _config.paymentType;
    $scope.totalMoney = 0;


    //获取委托方信息
    $scope.getEntrustInfo =function(type) {

        if(type == null && type == undefined){
            return;
        }

        var url = _host.api_url + "/entrust?entrustType=" + type;

        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    /**
     * 获取基本信息
     * */
    function getBaseInfo(){
        _basic.get(_host.api_url + "/orderPayment?orderPaymentId=" + val).then(function (data) {
            if (data.success == true) {
                $scope.storagePaymentArray = data.result[0];
                $scope.paymentStatus=data.result[0].payment_status;
                $scope.getEntrustInfo($scope.paymentStatus);
                $scope.storagePaymentArray.entrust_id=data.result[0].entrust_id;
                $scope.lookRelatedOrder();
                $scope.lookPaymentMsg();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * teb跳转 支付信息详情
     * */
    $scope.lookPaymentMsg =function(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookPaymentMsg').addClass("active");
        $("#lookPaymentMsg").addClass("active");
        $("#lookPaymentMsg").show();

    };


    /**
     * 保存修改信息
     * */
    $scope.updatePaymentInfo = function(){
        if($scope.storagePaymentArray.entrust_id !== ""
            && $scope.storagePaymentArray.payment_type !== ""
            && $scope.storagePaymentArray.number!== ""
            && $scope.storagePaymentArray.payment_money !== ""){
            var obj = {
                entrustId: $scope.storagePaymentArray.entrust_id,
                paymentType:$scope.storagePaymentArray.payment_type,
                number:$scope.storagePaymentArray.number,
                paymentMoney:$scope.storagePaymentArray.payment_money,
                remark: $scope.storagePaymentArray.remark
            };
            _basic.put(_host.api_url + "/user/" + userId+"/orderPayment/" + val, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    getBaseInfo();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }

    /**
     * 点击完结
     * */
    $scope.updatePaymentStatus = function () {
        if ($scope.storagePaymentArray.entrust_id !== ""
            && $scope.storagePaymentArray.payment_type !== ""
            && $scope.storagePaymentArray.number !== ""
            && $scope.storagePaymentArray.payment_money !== "") {
            swal({
                    title: "确定支付完结吗？",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function(){
                var url = _host.api_url + "/user/" + userId + "/orderPayment/" + val + "/paymentStatus/"+2;
                    _basic.put(url,{}).then(function (data) {
                        if (data.success == true) {
                            getBaseInfo();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                });
            }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * teb跳转 关联仓储订单
     * */
    $scope.lookRelatedOrder =function(){
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookRelatedOrder').addClass("active");
        $("#lookRelatedOrder").addClass("active");
        $("#lookRelatedOrder").show();
        _basic.get(_host.api_url + "/storageOrder?entrustId=" + $scope.storagePaymentArray.entrust_id +'&orderStatus=1').then(function (data) {
            if (data.success == true) {
                $scope.storageOrderList=data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get(_host.api_url + "/orderPaymentRel?orderPaymentId=" + val ).then(function (data) {
            if (data.success == true) {
                $scope.storageOrderPaymentRelList=data.result;
                for(var i=0;i<$scope.storageOrderPaymentRelList.length;i++){
                    if($scope.storageOrderPaymentRelList[i].actual_fee==null){
                        $scope.storageOrderPaymentRelList[i].actual_fee=0;
                    }
                    $scope.totalMoney=$scope.storageOrderPaymentRelList[i].actual_fee+$scope.totalMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
    * *
    * 添加关联
    * */
    $scope.addOderRel = function (id){
        // 追加画面数据
        var obj = {
            storageOrderId: id,
            orderPaymentId:  val
        };
        _basic.post(_host.api_url + "/user/" + userId + "/orderPaymentRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookRelatedOrder();
            } else {
                swal(data.msg, "", "error");
                }
        })
    };
    /**
     * *
     * 删除关联
     * */
    $scope.deleteOderRel =function (id){
        swal({
                title: "确定要移除当前订单与该次支付的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function(){
                _basic.delete(_host.api_url + "/user/" + userId + "/storageOrder/" +id +'/orderPayment/'+ val, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookRelatedOrder();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                });
            };

    /**
     *返回上层
    * */
    $scope.return = function () {
        $state.go($stateParams.from, {}, {reload: true})
    };



    /**
     * 获取数据‘
     * */
    function getData(){
        getBaseInfo();
    };
    getData();
}])
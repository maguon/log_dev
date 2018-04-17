app.controller("payment_controller", ["$scope", "_basic", "_host","_config",  function ($scope, _basic, _host,_config) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $scope.entrustTypeList = _config.entrustType;//委托方性质
    $scope.paymentStatusList= _config.paymentStatus;
    $scope.paymentTypeList= _config.paymentType;
    var url = '';
    //获取委托方信息
    $scope.getEntrustInfo =function(type) {
        if(type==undefined){
            url=_host.api_url + "/entrust";
        }else{
            url=_host.api_url + "/entrust?entrustType="+type;
        }
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    };

    /**
     * 点击查询按钮
     * */
    $scope.getPayment = function (){
        $scope.start = 0;
        seachPayment();
    }



    /**
     * 查询列表
     * */
    function seachPayment(){
        // 检索条件组装
        var condition = _basic.objToUrl({
            orderPaymentId: $scope.paymentId,
            entrustType: $scope.entrustType,
            entrustId: $scope.entrustId,
            paymentStatus:$scope.paymentStatus,
            paymentType:$scope.paymentType,
            number:$scope.patmentNumber,
            createdOnStart:$scope.paymentTimeStart,
            createdOnEnd:$scope.paymentTimeEnd,
            start: $scope.start.toString(),
            size: $scope.size
        });

        _basic.get(_host.api_url + "/orderPayment?" + condition).then(function (data) {
            if (data.success == true) {
                $scope.storagePaymentBoxArray = data.result;
                $scope.storagePaymentArray = $scope.storagePaymentBoxArray.slice(0,10);
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
     * 新增支付信息模态框
     * */
    $scope.addPayment = function(){
        $(".modal").modal();
        $("#addPaymentModal").modal("open");
        $scope.addEntrustType="";
        $scope.addEntrustId="";
        $scope.addPaymentType="";
        $scope.addPatmentNumber="";
        $scope.addPaymentMoney="";
        $scope.addRemark="";
    };



    /**
     * 确认新增支付信息
     * */
    $scope.addPaymentInfo =function (){
        if ($scope.addEntrustId!== ""&&$scope.addPaymentType!== ""&&$scope.addPatmentNumber!==""&&$scope.addPaymentMoney!=="") {

            // 追加画面数据
            var obj = {
                entrustId: $scope.addEntrustId,
                paymentType:  $scope.addPaymentType,
                number: $scope.addPatmentNumber,
                paymentMoney: $scope.addPaymentMoney,
                remark: $scope.addRemark
            };

            _basic.post(_host.api_url + "/user/" + userId + "/orderPayment", obj).then(function (data) {
                if (data.success) {
                    $('#addPaymentModal').modal('close');
                    seachPayment();
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据

                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请输入完整信息！", "", "warning");
        }
    };




    /**
     * 上一页
     */
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        seachPayment();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachPayment();
    };


    /**
     * 获取数据
     */
    function getData (){
        $scope.getEntrustInfo();
        seachPayment();
    }
    getData();
}])
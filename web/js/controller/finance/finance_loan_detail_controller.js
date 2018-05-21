/**
 * 主菜单：财务管理 -> 金融贷出(详细) 控制器
 */
app.controller("finance_loan_detail_controller", ["$scope", "$stateParams", "_basic", "_host", "_config", "$state", function ($scope, $stateParams, _basic, _host, _config, $state) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 贷款编号
    var financialLoanId = $stateParams.id;
    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;
    // 抵押状态
    $scope.mortgageStatus = _config.mortgageStatus;
    // 金融贷出(订单) 状态
    $scope.loanStatus = _config.loanStatus;

    // 金融贷出(订单) 基本信息
    $scope.loanInfo = {};

    // 抵押总金额(美元)
    $scope.totalMortgageMoney = 0;

    /***************************************************************************/

    // 支付状态
    $scope.paymentStatusList = _config.paymentStatus;
    // 支付方式
    $scope.paymentTypeList = _config.paymentType;
    // // 金融贷出 状态
    // $scope.loanStatus = _config.loanStatus;
    // // 颜色列表
    // $scope.configColor = _config.config_color;
    // // 是否金融车 列表
    // $scope.purchaseTypes = _config.purchaseTypes;
    // // 委托方性质
    // $scope.entrustTypeList = _config.entrustType;
    // // 是否MSO车辆
    // $scope.msoFlags = _config.msoFlags;



    /**
     * 返回前画面。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"finance_loan_detail"}, {reload: true})
    };

    /**
     * Tab跳转 贷出信息
     */
    $scope.lookLoanInfo = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookLoanFinfoDiv').addClass("active");
        $("#lookLoanFinfoDiv").addClass("active");
        $("#lookLoanFinfoDiv").show();

        // 取得订单详情
        getLoanInfo();
    };

    /**
     * 取得贷出信息详情。
     */
    function getLoanInfo() {
        // 检索用url
        var url = _host.api_url + "/financialLoan?financialLoanId=" + financialLoanId;
        _basic.get(url).then(function (data) {
            if (data.success) {

                if (data.result.length == 0) {
                    return;
                }

                // 订单是已支付时，取得支付详情 TODO
                if (data.result[0].order_status == 2) {
                    // getPaymentDetails();
                }

                // 贷出编号
                $scope.loanInfo.id = financialLoanId;
                // 贷出订单 状态
                $scope.loanInfo.loanStatus = data.result[0].loan_status;

                // 委托方性质
                $scope.loanInfo.entrustType = data.result[0].entrust_type;
                // 委托方
                $scope.loanInfo.entrustId = data.result[0].entrust_id;
                $scope.loanInfo.entrustName = data.result[0].short_name == null ? '未知' : data.result[0].short_name;
                // 贷出时间
                $scope.loanInfo.createdOn = data.result[0].created_on;

                // 抵押金额
                $scope.loanInfo.mortgageValuation = data.result[0].mortgage_valuation == null ? 0 : data.result[0].mortgage_valuation;
                // 贷出金额
                $scope.loanInfo.loanMoney = data.result[0].loan_money == null ? 0 : data.result[0].loan_money;
                $("#mortgageLabel").addClass("active");
                $("#loanMoneyLabel").addClass("active");
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * Tab跳转 抵押车辆
     */
    $scope.lookMortgageCar = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookMortgageCar').addClass("active");
        $("#lookMortgageCar").addClass("active");
        $("#lookMortgageCar").show();

        // 取得 左侧 委托方拥有车辆 列表
        _basic.get(_host.api_url + "/user/" + userId + "/car?relStatus=1&entrustId=" + $scope.loanInfo.entrustId).then(function (data) {
            if (data.success) {
                $scope.entrustCarList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 取得 右侧关联列表
        var url = _host.api_url + "/financialLoanMortgageCarRel?financialLoanId=" + financialLoanId;
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                // 本次贷款抵押车辆列表
                $scope.mortgageCarRelList = data.result;
                // 抵押总金额
                $scope.totalMortgageMoney = 0;
                // 计算抵押总金额
                for (var i = 0; i < $scope.mortgageCarRelList.length; i++) {
                    if ($scope.mortgageCarRelList[i].valuation == null) {
                        $scope.mortgageCarRelList[i].valuation = 0;
                    }
                    $scope.totalMortgageMoney = $scope.mortgageCarRelList[i].valuation + $scope.totalMortgageMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /*********************************************************************************************/

    /**
     * Tab跳转 购买车辆
     */
    $scope.lookBuyingCars = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookBuyingCars').addClass("active");
        $("#lookBuyingCars").addClass("active");
        $("#lookBuyingCars").show();
    };

    /**
     * 添加贷款抵押车辆信息。
     * @param carId 汽车ID
     */
    $scope.addMortgageCarRel = function (carId) {
        // 追加画面数据
        var obj = {
            financialLoanId: financialLoanId,
            carId: carId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/financialLoanMortgageCarRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookMortgageCar();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 删除贷款抵押车辆信息。
     * @param carId 汽车ID
     */
    $scope.deleteMortgageCarRel = function (carId) {
        swal({
                title: "确定要移除当前抵押车与该次贷出订单的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/financialLoan/" + financialLoanId + '/car/' + carId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookMortgageCar();
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * Tab跳转 关联海运订单
     */
    $scope.lookPaymentHistory = function () {
        // 显示画面
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .lookPaymentHistory').addClass("active");
        $("#lookPaymentHistory").addClass("active");
        $("#lookPaymentHistory").show();

        // 取得 左侧一览 未完结
        _basic.get(_host.api_url + "/shipTransOrder?entrustId=" + $scope.storagePaymentArray.entrust_id + '&orderStatus=' + $scope.paymentStatusList[0].id).then(function (data) {
            if (data.success == true) {
                $scope.shipTransOrderList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 取得 右侧，已关联
        var url = _host.api_url + "/shipTransOrderPaymentRel?financialLoanId=" + financialLoanId;
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.shipTransOrderRelList = data.result;
                $scope.totalShipTransMoney = 0;
                for (var i = 0; i < $scope.shipTransOrderRelList.length; i++) {
                    if ($scope.shipTransOrderRelList[i].ship_trans_fee == null) {
                        $scope.shipTransOrderRelList[i].ship_trans_fee = 0;
                    }
                    $scope.totalShipTransMoney = $scope.shipTransOrderRelList[i].ship_trans_fee + $scope.totalShipTransMoney;
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * *
     * 添加海运关联
     * */
    $scope.addShipTransOderRel = function (shipTransOrderId) {
        // 追加画面数据
        var obj = {
            shipTransOrderId: shipTransOrderId,
            financialLoanId: financialLoanId
        };
        _basic.post(_host.api_url + "/user/" + userId + "/shipTransOrderPaymentRel", obj).then(function (data) {
            if (data.success) {
                // 成功后，刷新页面数据
                $scope.lookPaymentHistory();
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * *
     * 删除海运关联
     * */
    $scope.deleteShipTransOderRel = function (shipTransOrderId) {
        swal({
                title: "确定要移除当前订单与该次支付的关联吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                _basic.delete(_host.api_url + "/user/" + userId + "/shipTransOrder/" + shipTransOrderId + '/orderPayment/' + financialLoanId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            $scope.lookPaymentHistory();
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
            });
    };

    /**
     * 保存修改信息
     * */
    $scope.updatePaymentInfo = function () {
        if ($scope.storagePaymentArray.entrust_id !== ""
            && $scope.storagePaymentArray.payment_type !== ""
            && $scope.storagePaymentArray.number !== ""
            && $scope.storagePaymentArray.payment_money !== "") {
            var obj = {
                entrustId: $scope.storagePaymentArray.entrust_id,
                paymentType: $scope.storagePaymentArray.payment_type,
                number: $scope.storagePaymentArray.number,
                paymentMoney: $scope.storagePaymentArray.payment_money,
                remark: $scope.storagePaymentArray.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + "/orderPayment/" + financialLoanId, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    getBaseInfo();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 点击完结
     * */
    $scope.updatePaymentStatus = function () {
        swal({
                title: "确定支付完结吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: true
            },
            function () {
                // 修改状态为已完结【2：已完结】
                var url = _host.api_url + "/user/" + userId + "/orderPayment/" + financialLoanId + "/paymentStatus/" + $scope.paymentStatusList[1].id;
                _basic.put(url, {}).then(function (data) {
                    if (data.success == true) {
                        getBaseInfo();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            });
    };

    /**
     * 获取委托方信息
     * @param type 委托方类型
     */
    $scope.getEntrustInfo = function (type) {

        if (type == null && type == undefined) {
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
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 默认显示 贷出信息 TAB
        $scope.lookLoanInfo();
    };
    $scope.initData();
}]);
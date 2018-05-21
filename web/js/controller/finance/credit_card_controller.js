/**
 * 主菜单：财务管理 -> 信用证 控制器
 */
app.controller("credit_card_controller", ["$scope", "$rootScope", "_host", "_basic", "_config", "$state", "$stateParams","$filter", function ($scope, $rootScope, _host, _basic, _config, $state, $stateParams,$filter) {
    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;

    // 委托方性质
    $scope.entrustTypeList = _config.entrustType;

    // 状态
    $scope.statusList = _config.paymentStatus;

    /**
     * 页面跳转
     */
    $scope.baseMsg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.baseMsg ').addClass("active");
        $("#baseMsg").addClass("active");
        $("#baseMsg").show();
    };
    $scope.linkFinanceCar = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.linkFinanceCar ').addClass("active");
        $("#linkFinanceCar").addClass("active");
        $("#linkFinanceCar").show();
    };

    /**
     * 获取委托方信息
     * @param type 委托方类型
     */
    $scope.getEntrustInfo = function (type) {
        var url = '';
        if (type == undefined) {
            url = _host.api_url + "/entrust";
        } else {
            url = _host.api_url + "/entrust?entrustType=" + type;
        }
        _basic.get(url).then(function (data) {
            if (data.success == true) {
                $scope.addEntrustList = data.result;
                $('#addEntrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $("#addEntrustSelect").val(null).trigger("change");
            }
        });
    };


    /**
     * 查询页面获取委托方信息
     */
    function getEntrustInfo (){
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        })
    }


    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var entrust = {};

        if ($("#entrustSelect").val() == "") {
            entrust = {id:"",text:""};
        } else {
            entrust = $("#entrustSelect").select2("data")[0] ;
        }

        var obj = {
            financialCreditId: $scope.condCreditId,
            entrustType: $scope.condVin,
            entrustId: entrust.condLoan,
            creditStatus: $scope.condStatus,
            entrustId: entrust.id,
            planReturnDateStart: $scope.expectedDateStart,
            planReturnDateEnd: $scope.expectedDateEnd,
            actualReturnDateStart: $scope.actualDateStart,
            actualReturnDateEnd: $scope.actualDateEnd
        };
        return obj;
    }


    /**
     * 根据画面输入的查询条件，进行数据查询。
     */
    function queryCreditCardList() {
        var reqUrl = _host.api_url + "/financialCredit?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        reqUrl = conditions.length > 0 ? reqUrl + "&" + conditions : reqUrl;
        _basic.get(reqUrl).then(function (data) {
            if (data.success == true) {
                $scope.creditCardBoxArray = data.result;
                $scope.creditCardList = $scope.creditCardBoxArray.slice(0, 10);
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
    }


    /**
     * 点击：查询按钮，进行数据查询
     */
    $scope.queryCreditCardInfo = function () {
        // 默认第一页
        $scope.start = 0;
        queryCreditCardList();
    };


    /**
     * 打开【新增信用证】模态画面。
     */
    $scope.openNewCreditCardDiv = function () {
        $('.modal').modal();
        $('#newCreditCardDiv').modal('open');
        $scope.getEntrustInfo();
        //$scope.baseMsg();
        $scope.linkFinanceCar();
    };

    /**
     *提交【新增信用证】模态画面的基本信息。
     */
    $scope.addCreditCardInfo = function () {

        // 委托方 下拉选中 内容
        var entrust = $("#addEntrustSelect").select2("data")[0]; //单选

        if (entrust.id !== "" && $scope.addCreditId !== "" && $scope.addCreditMoney !== "" && $scope.addActualMoney !== "") {


            // 追加画面数据
            var obj = {
                creditNumber: $scope.addCreditMoney,
                entrustId: entrust.id,
                creditMoney: $scope.addCreditMoney,
                actualMoney: $scope.addActualMoney,
                planReturnDate: $scope.addPlanReturnDate,
                actualReturnDate: $scope.addActualReturnDate,
                receiveCardDate: $scope.addReceiveCardDate,
                documentsDate: $scope.addDocumentsDate,
                documentsSendDate:$scope.addDocumentsSendDate,
                documentsReceiveDate: $scope.addDocumentsReceiveDate,
                actualRemitDate:$scope.addActualRemitDate,
                invoiceNumber: $scope.addInvoiceNumber,
                remark: $scope.addRemarkText
            };


            _basic.post(_host.api_url + "/user/" + userId + "/financialCredit", obj).then(function (data) {
                if (data.success) {
                    $scope.linkFinanceCar();
                    /*$('#addPaymentModal').modal('close');
                    queryCreditCardList();
                    swal("新增成功", "", "success");*/

                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请输入完整信息！", "", "warning");
        }
    };


    //模糊查询
    var vinObjs ={}
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 10,
        onAutocomplete: function(val) {
        },
        minLength: 6,
    });
    $scope.shortSearch=function () {
        if($scope.demandVin!=="") {
            if ($scope.creditVin.length >= 6) {
                _basic.get(_host.api_url + "/carList?vinCode=" + $scope.creditVin, {}).then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.vinMsg = data.result;
                        vinObjs = {};
                        for (var i in $scope.vinMsg) {
                            vinObjs[$scope.vinMsg[i].vin] = null;
                        }
                        return vinObjs;
                    } else {
                        swal('没有您输入的VIN码','','error')
                        return {};
                    }
                }).then(function (vinObjs) {
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input').focus();

                })
            } else {
                $('#autocomplete-input').autocomplete({minLength: 6});
                $scope.vinMsg = {}
            }
        }
        else{
            swal('没有您输入的VIN码','','error')
        }
    };
    // 查询vin码
    $scope.addLinkCar=function () {
        _basic.get(_host.api_url + "/carList?vin=" + $scope.creditVin).then(function (data) {
            if (data.success = true) {
                if (data.result.length == 0) {
                    $scope.showStorageData = 1;
                    step1();
                }
                else {
                    $scope.baseList = data.result[0];
                    $scope.baseList.model_id = data.result[0].model_id;
                    $scope.baseList.make_id = data.result[0].make_id;
                    if ($scope.baseList.model_id == 0 || $scope.baseList.make_id == 0) {
                        $scope.baseList.model_id = '';
                        $scope.baseList.make_id = '';
                    }
                    if ($scope.baseList.pro_date !== null) {
                        $scope.baseListDate = moment($scope.baseList.pro_date).format("YYYY-MM-DD");
                    }
                    else {
                        $scope.baseListDate = '';
                    }
                    for (var i in _config.config_color) {
                        if (_config.config_color[i].colorId == $scope.baseList.colour) {
                            $scope.baseListColor = _config.config_color[i].colorName;
                        }
                    }
                    if ($scope.relCarStatus == 1) {
                        swal('本车已在库中', "", "error");
                    } else {
                        $scope.pictureCarId = $scope.baseList.id;
                    }
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };




    /**
     * 上一页
     */
    $scope.preBtn = function ()  {
        $scope.start = $scope.start - ($scope.size - 1);
        queryCreditCardList();
    };

    /**
     * 下一页
     */
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        queryCreditCardList();
    };



    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 查询数据
        queryCreditCardList();
        // 获取委托方信息
        getEntrustInfo();
    };
    $scope.initData();




}])

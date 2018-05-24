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

    //添加关联车辆是时
    $scope.creditCarRelId=0;

    /**
     * 页面跳转
     */
   function baseMsg() {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.baseMsg ').addClass("active");
        $("#baseMsg").addClass("active");
        $("#baseMsg").show();
    };
   function linkFinanceCar() {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.linkFinanceCar ').addClass("active");
        $("#linkFinanceCar").addClass("active");
        $("#linkFinanceCar").show();
        $scope.getLinkCarList =[];
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
     * 数据导出
     */
    $scope.export = function () {
        // 基本检索URL
        var url = _host.api_url + "/credit.csv";
        // 检索条件
        var conditions = _basic.objToUrl(makeConditions());
        // 检索URL
        url = conditions.length > 0 ? url + "?" + conditions : url;
        // 调用接口下载
        window.open(url);
    };


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
            creditNumber: $scope.condCreditNumber,
            vin:$scope.condVin,
            repaymentId:$scope.condLoan,
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
        var reqUrl = _host.api_url + "/credit?start=" + $scope.start + "&size=" + $scope.size;
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
        $scope.addCreditId = '';
        $scope.creditVin ='';
        $scope.addCreditMoney='';
        $scope.addEntrustType ='';
        $scope.addCreditMoney='';
        $scope.addActualMoney='';
        $scope.addPlanReturnDate='';
        $scope.addActualReturnDate='';
        $scope.addReceiveCardDate='';
        $scope.addDocumentsDate='';
        $scope.addDocumentsSendDate='';
        $scope.addDocumentsReceiveDate='';
        $scope.addActualRemitDate='';
        $scope.addInvoiceNumber='';
        $scope.addRemarkText='';
        baseMsg();
    };

    /**
     *提交【新增信用证】模态画面的基本信息。
     */
    $scope.addCreditCardInfo = function () {

        // 委托方 下拉选中 内容
        $scope.entrust = $("#addEntrustSelect").select2("data")[0]; //单选

        if ( $scope.entrust.id !== "" && $scope.addCreditId !== "" && $scope.addCreditMoney !== "" && $scope.addActualMoney !== "") {


            // 追加画面数据
            var obj = {
                creditNumber: $scope.addCreditId,
                entrustId: $scope.entrust.id,
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

            // 如果日期没有输入，就去掉此属性
            if ($scope.addPlanReturnDate ==  "") {
                delete obj.planReturnDate;
            }
            if ($scope.addActualReturnDate ==  "") {
                delete obj.actualReturnDate;
            }
            if ( $scope.addReceiveCardDate ==  "") {
                delete obj.receiveCardDate;
            }
            if ($scope.addDocumentsDate ==  "") {
                delete obj.documentsDate;
            }
            if ($scope.addDocumentsSendDate ==  "") {
                delete obj.documentsSendDate;
            }
            if ($scope.addDocumentsReceiveDate ==  "") {
                delete obj.documentsReceiveDate;
            }
            if ($scope.addActualRemitDate ==  "") {
                delete obj.actualRemitDate;
            }

            _basic.post(_host.api_url + "/user/" + userId + "/credit", obj).then(function (data) {
                if (data.success) {
                    $scope.creditCarRelId = data.id;
                    linkFinanceCar();
                    queryLinkCar($scope.creditCarRelId);

                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请输入完整信息！", "", "warning");
        }
    };


    /**
     * 获取关联车辆信息
     */
    function queryLinkCar(val){
        _basic.get(_host.api_url + "/creditCarRel?creditId="+val).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    $scope.getLinkCarList=[];
                }else{
                    $scope.getLinkCarList =data.result;
                    $scope.carId = undefined;
                }
            }

        })
    }


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
        if($scope.creditVin!==""&&$scope.creditVin!==undefined) {
            if ($scope.creditVin.length >= 6) {
                _basic.get(_host.api_url + "/shipTransCarRel?entrustId="+$scope.entrust.id+"&vinCode=" + $scope.creditVin, {}).then(function (data) {
                    if (data.success == true&& data.result.length > 0) {
                            $scope.vinMsg = data.result;
                            $scope.carId= data.result[0].car_id;
                            vinObjs = {};
                            for (var i in $scope.vinMsg) {
                                vinObjs[$scope.vinMsg[i].vin] = null;
                            }
                            return vinObjs;
                        }

                     else {
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
    };

    // 查询vin码
    $scope.addLinkCar=function () {
        _basic.post(_host.api_url + "/user/"+userId+"/creditCarRel" ,{
            creditId: $scope.creditCarRelId,
            carId: $scope.carId
        }).then(function (data) {
            if (data.success == true) {
                $scope.linkCarId =data.id;
                queryLinkCar($scope.creditCarRelId)
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    //刪除
    $scope.deleteLinkCar = function(id){
        _basic.delete(_host.api_url + "/user/" + userId + "/credit/" + $scope.creditCarRelId + '/car/' + id, {}).then(
            function (data) {
                if (data.success === true) {
                    queryLinkCar($scope.creditCarRelId);
                }
                else {
                    swal(data.msg, "", "error");
                }
            });

    }

    //关闭模态框
    $scope.addCarLinkInfo = function(){
        $('.modal').modal();
        $('#newCreditCardDiv').modal('close');
        queryCreditCardList();
        swal("新增成功", "", "success");

    }

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

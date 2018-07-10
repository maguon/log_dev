/**
 * 主菜单: 财务管理 -> 贷入日历 控制器
 */
app.controller("finance_loan_in_calendar_controller", ["$scope", "_host", "_basic","$filter", function ($scope, _host, _basic, $filter) {
    // 取得当前日期
    var date = new Date();
    var nowDate = moment(date).format('YYYYMMDD');
    var month = date.getMonth() + 1;

    // 画面显示用(年月日)
    $scope.todayMonth = date.getFullYear() + "年" + month + "月";
    $scope.todayDay = date.getDate();

    // 星期列表
    var weekday = new Array(7);
    weekday[0] = "星期日";
    weekday[1] = "星期一";
    weekday[2] = "星期二";
    weekday[3] = "星期三";
    weekday[4] = "星期四";
    weekday[5] = "星期五";
    weekday[6] = "星期六";

    // 画面显示用(今天周几)
    $scope.todayWeek = weekday[date.getDay()];

    /**
     * 创建日历详细信息。
     */
    function showCalendar() {
        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar({
            viewRender: function (view, element) {
            },
            aspectRatio: 1,
            // 日历头部信息
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },

            titleFormat: 'YYYY 年 MMMM月',
            monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            height: 'auto',
            events: function (start, end, timezone, callback) {
                start = moment(start).format('YYYYMMDD');
                end = moment(end).format('YYYYMMDD');
                var eventArray = [];
                _basic.get(_host.api_url + "/loanIntoStatDate?" + "dateStart=" + start + "&dateEnd=" + end).then(function (data) {
                    if (data.success && data.result.length > 0) {
                        $scope.data = data.result;
                        for (var i in $scope.data) {
                            var titleHtml =
                                '<div class="fz16" style="height: 25px;padding-top:5px;">' +
                                '  <div class="col s5 cyan-text text-lighten-1" style="padding-left: 0;padding-right: 0;">' +
                                '    <i class="mdi mdi-login"></i><span class="fz14" style="margin-left: 2px;">' + $filter('number')($scope.data[i].loan_into_count) + '</span>' +
                                '  </div>' +
                                '  <div class="col s7 left-align" style="color: #fea353;padding-left: 0;padding-right: 0;">' +
                                '    <i class="mdi mdi-cash-usd"></i><span class="fz14" style="margin-left: 2px;">' + $filter('number')($scope.data[i].loan_into_money) + '</span>' +
                                '  </div>' +
                                '</div>' +

                                '<div class="col s12" style="height:2px;border-bottom: 1px solid #ccc;"></div>' +

                                '<div class="fz16" style="height: 25px;padding-top:10px;">' +
                                '  <div class="col s5 cyan-text text-lighten-1" style="padding-left: 0;padding-right: 0;">' +
                                '    <i class="mdi mdi-logout"></i><span class="fz14" style="margin-left: 2px;">' + $filter('number')($scope.data[i].repayment_count) + '</span>' +
                                '  </div>' +
                                '  <div class="col s7 left-align" style="color: #fea353;padding-left: 0;padding-right: 0;">' +
                                '    <i class="mdi mdi-cash-usd"></i><span class="fz14" style="margin-left: 2px;">' + $filter('number')($scope.data[i].repayment_money) + '</span>' +
                                '  </div>' +
                                '</div>';
                            var date = {
                                title: titleHtml,
                                start: $scope.data[i].date_id + '',
                                color: 'transparent',
                                textColor: 'transparent',
                                allDay: true
                            };
                            eventArray.push(date);
                        }
                        callback(eventArray)
                    }
                })
            },
            eventRender: function (event, element) {
                element.html(event.title);
            }
        });
    }

    /**
     * 贷入订单(信息) 查询
     */
    function getFinanceLoanInInfo() {
        // 2：已贷，3：还款中
        var url = _host.api_url + "/loanIntoNotCount?loanIntoStatusArr=2,3";
        _basic.get(url).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 贷入未还总金额
                    $scope.loanIntoNotRepayment = data.result[0].not_repayment_money;
                    // 贷入未完结笔数
                    $scope.loanIntoCount = data.result[0].loan_count;
                } else {
                    // 贷入未还总金额
                    $scope.loanIntoNotRepayment = 0;
                    // 贷入未完结笔数
                    $scope.loanIntoCount = 0;
                }

                _basic.get(_host.api_url + "/loanIntoCompanyTotalMoney?companyStatus=1").then(function (data) {
                    if (data.success) {
                        if (data.result.length > 0) {
                            // 总可贷额度
                            $scope.companyBaseMoney = data.result[0].company_total_money;
                        } else {
                            // 总可贷额度
                            $scope.companyBaseMoney = 0;
                        }

                        // 可贷入金额 = 总可贷额度 - 贷入未还总金额
                        $scope.leftLoanMoney = $scope.companyBaseMoney - $scope.loanIntoNotRepayment;
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 显示日历画面
        showCalendar();
        // 贷入订单 信息 查询
        getFinanceLoanInInfo();
    }
    initData();
}]);
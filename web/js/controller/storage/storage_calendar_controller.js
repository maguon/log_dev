/**
 * 主菜单：仓储管理 -> 工作日历 控制器
 */
app.controller("storage_calendar_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
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

    // TODO test data
    // var nowDate = '20180315';

    // 画面初期时，用来取得画面数据
    _basic.get(_host.api_url + "/storageDate" + "?dateStart=" + nowDate + "&dateEnd=" + nowDate).then(function (data) {
        if (data.success == true && data.result.length > 0) {
            $scope.storeStorage = data.result;
            $scope.storageId = $scope.storeStorage[0].id;
        }
        // 日历详细信息
        showCalendar($scope.storageId);
        // 取得饼图数据
        $scope.getStorageParkList();
    });

    /**
     * 根据仓库ID取得日历信息，饼图数据。
     * @param storage_id 仓库ID
     */
    $scope.changeStorage = function (storage_id) {
        // 日历详细信息
        showCalendar(storage_id);
        // 取得饼图数据
        $scope.getStorageParkList();
    };

    /**
     * 取得仓储停车品牌数据信息列表。
     */
    $scope.getStorageParkList = function () {
        _basic.get(_host.api_url + "/storage/" + $scope.storageId + "/makeStat").then(function (data) {
            if (data.success === true) {
                // 组装画面需要的数据
                $scope.storageParkList = [];
                // 遍历
                for (var i = 0; i < data.result.length; i++) {
                    // 没有名字的显示 未知
                    if (data.result[i].make_name == null) {
                        data.result[i].make_name = "未知";
                    }
                    // 组装结果集
                    $scope.storageParkList[i] = [
                        data.result[i].make_name + ": " + data.result[i].car_count + " 辆",
                        data.result[i].car_count
                    ];
                }
                // 显示饼图
                $scope.showVehicleBrandPie();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 车辆品牌统计饼图的 Highcharts 配置设定。
     */
    $scope.showVehicleBrandPie = function () {
        $('#vehicleBrand').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '车辆品牌比例',
                data: $scope.storageParkList
            }]
        });
    };

    /**
     * 创建日历详细信息。
     *
     * @param storage_id 仓储ID
     */
    var showCalendar = function (storage_id) {
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
                _basic.get(_host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + start + "&dateEnd=" + end).then(function (data) {
                    if (data.success == true && data.result.length > 0) {
                        $scope.data = data.result;
                        for (var i in $scope.data) {
                            var titleHtml = '<div class=" p0" style="padding-top: 10px">' +
                                '<div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 14px">' +
                                '<i style="display: block" class="mdi mdi-login"></i><span>' + $scope.data[i].imports + '</span></div>' +
                                '<div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 14px">' +
                                '<i style="display: block" class="mdi mdi-arrow-down-bold-circle-outline"></i><span >' + $scope.data[i].balance + '</span></div>' +
                                '<div class="col s4 center-align red-text text-lighten-2" style="font-size: 14px">' +
                                '<i style="display: block" class=" mdi mdi-logout"></i><span >' + $scope.data[i].exports + '</span></div></div>'
                            var date = {
                                title: titleHtml,
                                start: $scope.data[i].date_id + '',
                                color: 'white',
                                textColor: 'grey',
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
        // $('#calendar').fullCalendar('option','locale','zh-CN');

        // 当天仓库信息
        _basic.get(_host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + nowDate + "&dateEnd=" + nowDate).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.today_data = data.result[0];
            } else {
                // 取得数据失败时，画面显示的默认数据
                $scope.today_data = {
                    "storage_id": 0,
                    "imports": 0,
                    "exports": 0,
                    "balance": 0,
                    "id": 0,
                    "row": 0,
                    "col": 0,
                    "storage_status": 1
                }
            }
        })
    };
}]);
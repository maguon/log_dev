/**
 * Created by star on 2018/4/23   海运管理--海运日历.
 */
app.controller("ship_trans_calendar_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {
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
     *
     */
    function showCalendar (storage_id) {
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
                                '<i style="display: block" class=" mdi mdi-logout"></i><span >' + $scope.data[i].exports + '</span></div></div>';
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

        // 当天仓库信息
        var url = _host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + nowDate + "&dateEnd=" + nowDate;
        _basic.get(url).then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.todayData = data.result[0];
            } else {
                // 取得数据失败时，画面显示的默认数据
                $scope.todayData = {
                    "storage_id": 0,
                    "total_seats":0,
                    "imports": 0,
                    "exports": 0,
                    "balance": 0,
                    "id": 0,
                    "storage_status": 1
                }
            }
        })
    };
    showCalendar($scope.storageId);
}])
/**
 * Created by ASUS on 2017/5/11.
 */
app.controller("storage_statistics_controller", ['$rootScope', '$scope', "_host", '$location', '$q', "_basic", function ($rootScope, $scope, _host, $location, $q, _basic) {
    var date = new Date();
    var monthSize = 12;
    var daySize = 30;
    var day;
    var month;
    // 入库每日统计
    var dayDateArray = [
        {
            name: "入库统计",
            data: [],
            color: "#6192d1"
        }, {
            name: "出库统计",
            data: [],
            color: "#ff5252"
        }
    ];
    // 入库每月统计
    var monthDateArray = [
        {
        name: "入库统计",
        data: [],
        color: "#6192d1"
        },
        {
        name: "出库统计",
        data: [],
        color: "#ff5252"
        }
    ];
    $scope.changeStatistics = function () {
        getAllStorgeStatistics();
    };
    var getAllStorgeStatistics = function () {
        day = [];
        month = [];
        dayDateArray[0].data = [];
        dayDateArray[1].data = [];
        monthDateArray[0].data = [];
        monthDateArray[1].data = [];
        // 月份数据读取
        _basic.get(_host.api_url + "/storageTotalMonth?storageId=" + $scope.storageId.id + "&start=0&size=" + monthSize).then(function (data) {
            if (data.success == true) {
                for (var i in data.result) {
                    month.push(data.result[data.result.length - 1 - i].y_month);
                    monthDateArray[0].data.push(data.result[data.result.length - 1 - i].total_imports);
                    monthDateArray[1].data.push(data.result[data.result.length - 1 - i].total_exports)
                }
                $("#statisticsMonth").highcharts({
                    title: {
                        text: '仓储统计(月)',
                        align: "left",
                        style: {
                            color: '#616161',
                            fontWeight: 'bold'
                        },
                        x: 0,

                    },
                    xAxis: {
                        categories: month
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    // 版权信息
                    credits: {
                        enabled: "false",
                        text: '',
                        href: ''
                    },
                    tooltip: {
                        valueSuffix: '辆车'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: monthDateArray
                });
            }
        });
        // 近几日查询
        _basic.get(_host.api_url + "/storageTotalDay?storageId=" + $scope.storageId.id + "&start=0&size=" + daySize).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                for (var i in data.result) {
                    var day_filter = data.result[data.result.length - 1 - i].date_id.toString().substr(4, 4);
                    day.push(day_filter);
                    dayDateArray[0].data.push(data.result[data.result.length - 1 - i].total_imports);
                    dayDateArray[1].data.push(data.result[data.result.length - 1 - i].total_exports)
                }
                $("#statisticsDay").highcharts({
                    title: {
                        text: '仓储统计(日)',
                        align: "left",
                        style: {
                            color: '#616161',
                            fontWeight: 'bold'
                        },
                        x: 0,
                    },
                    xAxis: {
                        categories: day
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    // 版权信息
                    credits: {
                        enabled: "false",
                        text: '',
                        href: ''
                    },
                    tooltip: {
                        valueSuffix: '辆车'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: dayDateArray
                });
            }
        });
    };
    // 车库查询
    _basic.get(_host.api_url + "/storage").then(function (data) {
        if (data.success == true&&data.result.length>0) {
            $scope.storageName = data.result;
            $scope.storageId = $scope.storageName[0];
            getAllStorgeStatistics();
        } else {
            swal(data.msg, "", "error");
        }
    });
}]);
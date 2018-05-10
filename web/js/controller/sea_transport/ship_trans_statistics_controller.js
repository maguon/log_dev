/**
 * 主菜单：海运管理 -> 海运统计 控制器
 */
app.controller("ship_trans_statistics_controller", ["$scope", "_host", "_basic", function ($scope, _host, _basic) {

    // 设定 MonthPicker 控件
    $('#monthStart,#monthEnd').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });

    // 按月统计 中的初始值
    $scope.startInitial = moment(new Date()).format('YYYY') + "01";
    $scope.endInitial = moment(new Date()).format('YYYYMM');

    // 按日统计 中的初始天数
    $scope.daySize = "30";

    // 图标中用，月份列表
    var shipTransInfoMonthList;
    // 图标中用，日期列表
    var shipTransInfoDayList;

    // 按月统计 - 发运车数
    var shipTransCarCountMonth = [
        {
            name: '发运车数',
            data: [],
            color: '#407BC7'
        }
    ];

    // 按月统计 - 发运舱数
    var shipTransCountMonth = [
        {
            name: '发运舱数',
            data: [],
            color: '#FF7E7E'
        }
    ];

    // 按日统计 - 发运车数
    var shipTransCarCountDay = [
        {
            name: '发运车数',
            data: [],
            color: '#407BC7'
        }
    ];

    // 按日统计 - 发运舱数
    var shipTransCountDay = [
        {
            name: '发运舱数',
            data: [],
            color: '#FF7E7E'
        }
    ];

    /**
     * 取得 海运信息-按月统计 图表用 数据
     */
    $scope.getShipTransMonthInfo = function () {
        // 统计开始月份
        var monthStart = $('#monthStart').val();
        // 统计结束月份
        var monthEnd = $('#monthEnd').val();

        if(monthStart === "" || monthStart === undefined){
            monthStart = $scope.startInitial;
            $('#monthStart').val($scope.startInitial);
        }
        if(monthEnd === "" || monthEnd === undefined){
            monthEnd = $scope.endInitial;
            $('#monthEnd').val($scope.endInitial);
        }

        // 检索用url
        var url = _host.api_url + "/shipTransMonthStat?monthStart=" + monthStart + "&monthEnd=" + monthEnd;

        console.log(url);

        // 取得指定月份数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 数据反转
                data.result.reverse();
                // 初始化 x轴月份
                shipTransInfoMonthList = [];
                // 初始化 车数统计 数据
                shipTransCountMonth[0].data = [];
                // 初始化 舱数统计 数据
                shipTransCarCountMonth[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    shipTransInfoMonthList.push(data.result[i].y_month);
                    // 车数统计
                    shipTransCarCountMonth[0].data.push(Math.ceil(data.result[i].ship_trans_car_count));
                    // 舱数统计
                    shipTransCountMonth[0].data.push(Math.ceil(data.result[i].ship_trans_count));
                }
                // 加载 发运车数统计 图
                showShipTransCarCountMonthChart();
                // 加载 发运舱数统计 图
                showShipTransCountMonthChart();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 取得 海运信息-按月统计 图表用 数据
     */
    $scope.getShipTransDayInfo = function () {
        _basic.get(_host.api_url + "/shipTransDayStat?start=0&size=" + $scope.daySize).then(function (data) {
            if (data.success) {
                // 数据反转
                data.result.reverse();
                // 初始化 x轴
                shipTransInfoDayList = [];
                // 初始化 车数统计 数据
                shipTransCarCountDay[0].data = [];
                // 初始化 舱数统计 数据
                shipTransCountDay[0].data = [];
                for (var i = 0; i < data.result.length; i++) {
                    // x轴月份
                    shipTransInfoDayList.push(data.result[i].id);
                    // 车数统计
                    shipTransCarCountDay[0].data.push(Math.ceil(data.result[i].ship_trans_car_count));
                    // 舱数统计
                    shipTransCountDay[0].data.push(Math.ceil(data.result[i].ship_trans_count));
                }
                // 加载 发运车数统计 图
                showShipTransCarCountDayChart();
                // 加载 发运舱数统计 图
                showShipTransCountDayChart();
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 显示 发运车数 按月统计折线图
     */
    function showShipTransCarCountMonthChart() {
        $("#shipTransCarCountMonthDiv").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '发运车数统计',
                align: "left",
                style: {
                    color: '#407BC7',
                    fontWeight: 'bold',
                    height:'50'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: shipTransInfoMonthList,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '车数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: shipTransCarCountMonth
        });
    }

    /**
     * 显示 发运舱数 按月统计折线图
     */
    function showShipTransCountMonthChart() {
        $("#shipTransCountMonthDiv").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '发运舱数统计',
                align: "left",
                style: {
                    color: '#FF7E7E',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: shipTransInfoMonthList,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '舱数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: shipTransCountMonth
        });
    }

    /**
     * 显示 发运车数 按日统计折线图
     */
    function showShipTransCarCountDayChart() {
        $("#shipTransCarCountDayDiv").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '发运车数统计',
                align: "left",
                style: {
                    color: '#407BC7',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: shipTransInfoDayList,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '车数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            series: shipTransCarCountDay
        });
    }

    /**
     * 显示 发运舱数 按日统计折线图
     */
    function showShipTransCountDayChart() {
        $("#shipTransCountDayDiv").highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '发运舱数统计',
                align: "left",
                style: {
                    color: '#FF7E7E',
                    fontWeight: 'bold'
                },
                x: 31
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: shipTransInfoDayList,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '舱数'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: false
            },
            // legend: {
            //     layout: 'vertical',
            //     align: 'right',
            //     verticalAlign: 'middle',
            //     borderWidth: 0
            // },
            series: shipTransCountDay
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    $scope.initData = function () {
        // 取得 海运信息-按月统计 图表用 数据
        $scope.getShipTransMonthInfo();
        // 取得 海运信息-按日统计 图表用 数据
        $scope.getShipTransDayInfo();
    };
    $scope.initData();
}]);
/**
 * 主菜单：数据统计 -> 车值统计 控制器
 */
app.controller("car_valuation_statistics_controller", ["$scope", "_host", "_basic", "_config", function ($scope, _host, _basic, _config) {

    // 车辆状态 1：在库 2：出库
    $scope.carRelStatus = _config.carRelStatus;

    /**
     * 取得 上部：委托方在库统计用数据，并显示饼图。
     */
    function getEntrustInfoList() {
        // relStatus=1：在库
        var url = _host.api_url + "/carEntrustStat?relStatus=" + $scope.carRelStatus[0].s_num;

        // 取得数据
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 组装画面需要的数据
                $scope.entrustInfoList = [];
                // 遍历
                for (var i = 0; i < data.result.length; i++) {
                    // 没有名字的显示 未知
                    if (data.result[i].short_name == null) {
                        data.result[i].short_name = "未知";
                    }
                    // 组装结果集
                    $scope.entrustInfoList[i] = [
                        data.result[i].short_name + ": " + data.result[i].car_count + " 辆",
                        data.result[i].car_count
                    ];
                }
                // 显示饼图
                showEntrustInfoPie();
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 委托方在库统计 饼图的 Highcharts 配置设定。
     */
    function showEntrustInfoPie() {
        $('#entrustInfoPieDiv').highcharts({
            chart: {
                // type: 'line'
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
                // text: '发运车数统计',
                // align: "left",
                // style: {
                //     color: '#407BC7',
                //     fontWeight: 'bold',
                //     height:'50'
                // },
                // x: 31
            },
            subtitle: {
                text: ''
            },
            credits: {
                enabled: "false",
                text: '',
                href: ''
            },
            tooltip: {
                // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                // '<td style="padding:0"><b>{point.y}</b></td></tr>',
                // footerFormat: '</table>',
                // shared: true,
                // useHTML: true
                headerFormat: '',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            // 图例
            // legend: {
            //     // 图例在图表中的对齐方式，有 “left”, "center", "right" 可选
            //     align: 'right',
            //     // 图例是否浮动，设置浮动后，图例将不占位置
            //     // floating: true,
            //     // 图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
            //     layout: 'vertical',
            //     //
            //     x: 0,
            //     //
            //     y: 0,
            //     //
            //     backgroundColor: '#FFFFFF',
            //     verticalAlign: 'middle',
            //     // verticalAlign: 'bottom',
            //
            //     labelFormatter: function() {
            //         console.log(this)
            //         return '<span style="color:'+this.color+'">'+this.name+'(Click but not hide)</span>'
            //     },
            // },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    // 显示饼图的图例
                    showInLegend: true
                }
            },
            series: [{
                // color: '#407BC7'
                type: 'pie',
                name: '车辆品牌比例',
                data: $scope.entrustInfoList
                // data: [
                //     ['Firefox',   45.0],
                //     ['IE',       26.8],
                //     {
                //         name: 'Chrome',
                //         y: 12.8,
                //         sliced: true,
                //         selected: true
                //     },
                //     ['Safari',    8.5],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['Opera',     6.2],
                //     ['其他',   0.7]
                // ]
            }]
        });
    }

    /**
     * 取得 下部：车辆统计/估值统计 用数据，并显示饼图。
     *
     * @param eventId 区分：下左/下右/默认
     * @param entrustId 委托方ID
     */
    $scope.getCarCategoryStat = function (eventId ,entrustId) {

        // 组装画面(下左：车辆统计)需要的数据
        $scope.carCategoryCountList = [];

        // 组装画面(下右：估值统计)需要的数据
        $scope.carCategoryValuationList = [];

        // 金融车 信息取得
        _basic.get(_host.api_url + "/carPurchaseCount?purchaseType=1&entrustId=" + entrustId).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 下左：车辆统计
                    $scope.carCategoryCountList.push(["金融车(在库): " + data.result[0].parking_car_count + " 辆", data.result[0].parking_car_count]);
                    $scope.carCategoryCountList.push(["金融车(非在库): " + (data.result[0].purchase_car_count - data.result[0].parking_car_count) + " 辆", data.result[0].purchase_car_count - data.result[0].parking_car_count]);

                    // 下右：估值统计
                    $scope.carCategoryValuationList.push(["金融车(在库)库值: " + data.result[0].parking_car_valuation + " 元", data.result[0].parking_car_valuation]);
                    $scope.carCategoryValuationList.push(["金融车(非在库)库值: " + (data.result[0].valuation - data.result[0].parking_car_valuation) + " 元", data.result[0].valuation - data.result[0].parking_car_valuation]);

                    // 抵押车/非抵押车 信息取得
                    _basic.get(_host.api_url + "/carMortgageStatusCount?purchaseType=0&relStatus=1&active=1&entrustId=" + entrustId).then(function (data) {
                        // 抵押车辆总数
                        var mortgageCarCount = 0;
                        // 抵押车辆总值
                        var mortgageCarValuation = 0;
                        // 非抵押车辆总数
                        var unMortgageCarCount = 0;
                        // 非抵押车辆总值
                        var unMortgageCarValuation = 0;
                        if (data.success) {
                            for (var i = 0; i < data.result.length; i++) {
                                if (data.result[i].mortgage_status === 1) {
                                    // 非抵押车辆总数
                                    unMortgageCarCount = data.result[i].car_count;
                                    // 非抵押车辆总值
                                    unMortgageCarValuation = data.result[i].valuation;
                                } else if (data.result[i].mortgage_status === 2) {
                                    // 抵押车辆总数
                                    mortgageCarCount = data.result[i].car_count;
                                    // 抵押车辆总值
                                    mortgageCarValuation = data.result[i].valuation;
                                }
                            }

                            // 下左：车辆统计
                            $scope.carCategoryCountList.push(["抵押车: " + mortgageCarCount + " 辆", mortgageCarCount]);
                            $scope.carCategoryCountList.push(["非抵押车: " + unMortgageCarCount + " 辆", unMortgageCarCount]);

                            // 下右：估值统计
                            $scope.carCategoryValuationList.push(["抵押车库值: " + mortgageCarValuation + " 元", mortgageCarValuation]);
                            $scope.carCategoryValuationList.push(["非抵押车库值: " + unMortgageCarValuation + " 元", unMortgageCarValuation]);

                            // 根据触发条件，选择刷新饼图
                            switch (eventId) {
                                // 车辆统计 画面
                                case 'count':
                                    // 车辆统计 画面
                                    showCarCategoryCountPie();
                                    break;

                                // 估值统计 画面
                                case 'valuation':
                                    showCarCategoryValuationPie();
                                    break;

                                // 默认初期显示
                                default:
                                    showCarCategoryCountPie();
                                    showCarCategoryValuationPie();
                            }
                        } else {
                            swal(data.msg, "", "error");
                        }
                    });
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 下左：车辆统计 饼图的 Highcharts 配置设定。
     */
    function showCarCategoryCountPie() {
        $('#carCategoryCountPieDiv').highcharts({
            chart: {
                // type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            subtitle: {
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
            // 图例
            legend: {
                // 图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                align: 'right',
                // 图例是否浮动，设置浮动后，图例将不占位置
                // floating: true,
                // 图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                layout: 'vertical',
                //
                x: -100,
                //
                y: 0,
                //
                backgroundColor: '#FFFFFF',
                verticalAlign: 'middle'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    // 显示饼图的图例
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '车辆品牌比例1',
                data: $scope.carCategoryCountList
            }]
        });
    }

    /**
     * 下右：估值统计 饼图的 Highcharts 配置设定。
     */
    function showCarCategoryValuationPie() {
        $('#carCategoryValuationPieDiv').highcharts({
            chart: {
                // type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            subtitle: {
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
            // 图例
            legend: {
                // 图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                align: 'right',
                // 图例是否浮动，设置浮动后，图例将不占位置
                // floating: true,
                // 图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                layout: 'vertical',
                //
                x: -70,
                //
                y: 0,
                //
                backgroundColor: '#FFFFFF',
                verticalAlign: 'middle'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    // 显示饼图的图例
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '车辆品牌比例1',
                data: $scope.carCategoryValuationList
            }]
        });
    }

    /**
     * 获取委托方信息
     */
    function getAllEntrustInfo() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success) {
                $scope.entrustList = data.result;
            }
        });
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 上部：委托方在库统计 数据取得
        getEntrustInfoList();

        // 下部：获取委托方列表
        getAllEntrustInfo();

        // 下部：车辆统计
        $scope.getCarCategoryStat("","");
    }

    initData();
}]);
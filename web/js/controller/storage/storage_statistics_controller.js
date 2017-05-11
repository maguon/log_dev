/**
 * Created by ASUS on 2017/5/11.
 */
var storage_statistics_controller=angular.module("storage_statistics_controller",[]);
storage_statistics_controller.controller("storage_statistics_controller", ['$rootScope','$scope',"$host",'$location','$q',"$basic",function ($rootScope,$scope,$host,$location,$q,$basic) {
    var date = new Date();
    var now_date = moment(date).format('YYYYMMDD');

    // $basic.get($host.api_url+"/storageDate?dateStart="+now_date+"&dateEnd="+now_date).then(function (data) {
    //     if (data.success == true) {
    //         $scope.storage_index_list = data.result;
    //     }
    // })

    // 车库查询
    $basic.get($host.api_url + "/storage").then(function (data) {
        if (data.success == true) {
            $scope.storageName = data.result;

            // setTimeout($('select').material_select(), 2000)
        } else {
            swal(data.msg, "", "error");
        }
    });
    var chart = new Highcharts.Chart('statistics_month', {
        title: {
            text: '仓储统计(月)',
            align:"left",
            style: {
                color: '#616161',
                fontWeight: 'bold'
            },
            x: 0,

        },
        // subtitle: {
        //     text: '数据来源: WorldClimate.com',
        //     x: -20
        // },
        xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
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
            enabled:"false",
            text: '',
            href: ''
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '入库统计',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color:"#4dd0e1"
        }, {
            name: '出库统计',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
            color:"#ff5252"
        }]
    });

    var chart1 = new Highcharts.Chart('statistics_day', {
        title: {
            text: '仓储统计(日)',
            align:"left",
            style: {
                color: '#616161',
                fontWeight: 'bold'
            },
            x: 0,

        },
        // subtitle: {
        //     text: '数据来源: WorldClimate.com',
        //     x: -20
        // },
        xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
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
            enabled:"false",
            text: '',
            href: ''
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '入库统计',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color:"#4dd0e1"
        }, {
            name: '出库统计',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
            color:"#ff5252"
        }]
    });
}]);
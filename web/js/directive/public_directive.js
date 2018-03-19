/**
 * Created by ASUS on 2017/5/15.
 */
var publicDirective = angular.module("publicDirective", []);
publicDirective.directive('percent', function () {
    return {
        link: function (scope, element, attr) {
            var val = Number.parseInt(attr.value);
            var total = Number.parseInt(attr.total);
            var percentage = Number.parseInt((val*100/total));
            $(element[0].children[0]).highcharts({
                // 表头
                title: {
                    text:percentage+"%",
                    align: 'center',
                    verticalAlign: 'middle',
                    y:8,
                    style:{
                        color:"#bdbdbd"
                    }
                },
                colors:[
                    "#4dd0e1",
                    "#cfd8dc"
                ],
                // 版权信息
                credits: {
                    enabled:"false",
                    text: '',
                    href: ''
                },
                tooltip: {
                    enabled : false
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: 0,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '',
                    innerSize: '80%',
                    data: [
                        ['',   percentage],
                        ['',   (100-percentage)]
                    ]
                }]
            });
            var chart = null;
        }
    }
});
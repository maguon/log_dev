var storage_working_calendar = angular.module("storage_working_calendar", []);
storage_working_calendar.controller("storage_working_calendar", ["$scope", "$host", "$basic", function ($scope, $host, $basic) {
    var date = new Date();
    var now_date = moment(date).format('YYYYMMDD');
    $scope.today_month = date.getFullYear() + "年" + date.getMonth() + "月";
    $scope.today_d = date.getDate();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    $scope.today_week = weekday[date.getDay()];
    $basic.get($host.api_url + "/storageDate" + "?dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
        if (data.success == true) {
            $scope.store_storage = data.result;
            $scope.storage_id = $scope.store_storage[0].id;
            search($scope.storage_id)
        }

    });
    $scope.get_fullCalendar = function (storage_id) {
        search(storage_id);
    };
    var search = function (storage_id) {
        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar({
            viewRender: function (view, element) {

            },
            aspectRatio: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            height: 'auto',

            events: function (start, end, timezone, callback) {
                console.log(start, end);
                start = moment(start).format('YYYYMMDD');
                end = moment(end).format('YYYYMMDD');
                var eventArray = [];

                $basic.get($host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + start + "&dateEnd=" + end).then(function (data) {
                    if (data.success == true) {
                        console.log(data);
                        $scope.data = data.result;
                        for (var i  in $scope.data) {
                            var titleHtml = '<div class="row">' +
                                '<div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 14px">' +
                                '<i style="display: block" class="mdi mdi-arrow-right-bold-circle-outline"></i><span>' + $scope.data[i].imports + '</span></div>' +
                                '<div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 14px">' +
                                '<i style="display: block" class="mdi mdi-arrow-down-bold-circle-outline"></i><span >' + $scope.data[i].balance + '</span></div>' +
                                '<div class="col s4 center-align red-text text-lighten-2" style="font-size: 14px">' +
                                '<i style="display: block" class=" mdi mdi-arrow-left-bold-circle-outline "></i><span >' + $scope.data[i].exports + '</span></div></div>'
                            var date = {
                                title: titleHtml,
                                start: $scope.data[i].date_id + '',
                                color: 'white',     // an option!
                                textColor: 'grey', // an option!
                                allDay: true // will make the time show
                            };
                            eventArray.push(date);
                        }
                        callback(eventArray)

                    }
                })

            },
            // eventSources:event_event,


            // events:event_event,
            // events: [
            //     // {
            //     //     title  : 'event1',
            //     //     start  : '2017-05-02'
            //     // },
            //     // {
            //     //     title  : 'event2',
            //     //     start  : '2017-05-02',
            //     //     end    : '2017-05-10'
            //     // },
            // ],
            eventRender: function (event, element) {
                element.html(event.title);
            }
        });
        // $basic.get($host.api_url+"/storageDate?storageId="+storage_id+"&dateStart="+start+"&dateEnd="+end).then(function (data) {
        //         if(data.success==true){
        //             console.log(data);
        //             $scope.data=data.result;
        //             for(var i  in $scope.data){
        //                 var date={
        //                     title  : '<div class="row"><div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 20px"><i style="display: block" class="mdi mdi-arrow-right-bold-circle-outline"></i><span >55</span></div><div class="col s4 center-align  cyan-text text-lighten-1" style="font-size: 20px"><i style="display: block" class="mdi mdi-arrow-down-bold-circle-outline"></i><span>55</span></div><div class="col s4 center-align red-text text-lighten-2" style="font-size: 20px"><i style="display: block" class=" mdi mdi-arrow-left-bold-circle-outline "></i><span>55</span></div></div>',
        //                     start  : $scope.data[i].date_id,
        //                     color: 'white',     // an option!
        //                     textColor: 'grey', // an option!
        //                     allDay : true // will make the time show
        //                 };
        //                 event_array.push(date)
        //             }
        //             //$('#calendar').fullCalendar('updateEvents',event_array)
        //
        //         }
        // })

        // 当天仓库信息
        $basic.get($host.api_url + "/storageDate?storageId=" + storage_id + "&dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true) {
                $scope.today_data = data.result[0];


            }
        })
    };


}]);
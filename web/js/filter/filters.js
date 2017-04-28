/**
 * Created by ASUS on 2017/3/7.
 */
var CommonFilter=angular.module("CommonFilter",[]);
CommonFilter.filter("ptime",function () {
    return function(input){
        var time;
        var plan_time=getTime(input);
        var new_time=(new Date()).getTime();
        time=plan_time-new_time-1000*60*60*24*5;
        return time;
    }
});
CommonFilter.filter("formdate",function () {
    return function (input) {
        var date = new Date(input);
        var new_date;
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()<10 ?'0'+(date.getDate())+' ':date.getDate()+' ');
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        new_date=Y+M+D+h+m+s;
        return new_date
    }
});
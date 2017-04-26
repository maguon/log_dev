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
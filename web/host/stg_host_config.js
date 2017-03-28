/**
 * Created by ASUS on 2017/3/14.
 */
var hostService=angular.module("hostService",[]);
hostService.factory("$host",function () {
    var _this={
        api_url:"http://stg.myxxjs.com:9001/api"

    };
    return _this;

});

/**
 * Created by ASUS on 2017/3/14.
 */
var hostService = angular.module("hostService", []);
hostService.factory("_host", function () {
    var _this = {
        api_url: "http://stg.myxxjs.com:8001/api",
        file_url: "http://stg.myxxjs.com:9002/api",
        record_url: "http://stg.myxxjs.com:9004/api"
    };
    return _this;
});
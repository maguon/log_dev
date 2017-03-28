/**
 * Created by ASUS on 2017/3/14.
 */
var hostService=angular.module("hostService",[]);
hostService.factory("$host",[],function () {
    var _this={
        api_url:"http://47.88.103.131:9001/api"
    };
    return _this;

});

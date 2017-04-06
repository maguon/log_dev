/**
 * Created by ASUS on 2017/4/6.
 */
var baseService=angular.module("baseService",[]);
baseService.factory("$baseService",function () {
       var _this={};
       _this.formDate=function (d) {
           var date = new Date(d);
           var new_date;
           var Y = date.getFullYear() + '-';
           var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
           var D = (date.getDate()<10 ?'0'+(date.getDate())+' ':date.getDate()+' ');
           var h = date.getHours() + ':';
           var m = date.getMinutes() + ':';
           var s = date.getSeconds();
           new_date=Y+M+D;
           return new_date;
       };
       return _this
});

baseService.factory("$urlMethod",function () {
    var _this={};
    _this.urlMethod=function (obj) {
        var str="?";
        for(var i in obj){
            if(obj[i]!=null){
                str=str+i+"="+obj[i]+"&&"
            }
        }
        return str.substr(0,str.length-2);
    };
    return _this
});
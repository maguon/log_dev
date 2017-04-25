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
baseService.factory("service_storage_parking",function () {
    var storageParking=function (pk) {
        var parkingArray =[];
        for(i=0;i<pk.length;i++){
            for(j=0;j<parkingArray.length;){
                if(parkingArray[j].row == pk[i].row){
                    break;
                }else{
                    j++;
                }
            }
            if(j==parkingArray.length){
                parkingArray.push({row:pk[i].row,col:[{col:pk[i].col,carId:pk[i].car_id,id:pk[i].id,status:pk[i].parking_status}]})
            }else{
                parkingArray[j].col.push({col:pk[i].col,carId:pk[i].car_id,id:pk[i].id,status:pk[i].parking_status});
            }
        }
        console.log(parkingArray);
        return parkingArray;

    };
    return{
        storage_parking:storageParking
    }
});
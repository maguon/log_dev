/**
 * Created by ASUS on 2017/4/6.
 */
var baseService = angular.module("baseService", []);
baseService.factory('_baseService',function(){
    var _this = {};
    // 仓储车辆图分布
    _this.storageParking = function (pk) {
        var parkingArray = [];
        for (i = 0; i < pk.length; i++) {
            var date = new Date(pk[i].plan_out_time);
            var plan_time = date.getTime();
            var new_time = new Date().getTime();
            // 临近出库标记：5 days
            var time = plan_time - new_time - 1000 * 60 * 60 * 24 * 5;
            // 临近出库标记
            var expiredFlag = false;
            if (time > 0) {
                expiredFlag = false;
            } else {
                expiredFlag = true;
            }
            for (j = 0; j < parkingArray.length;) {
                if (parkingArray[j].row == pk[i].row && parkingArray[j].lot == pk[i].lot) {
                    break;
                } else {
                    j++;
                }
            }
            if (j == parkingArray.length) {
                parkingArray.push({
                    row: pk[i].row,
                    lot: pk[i].lot,
                    col: [{
                        col: pk[i].col,
                        vin: pk[i].vin,
                        carId: pk[i].car_id,
                        id: pk[i].id,
                        status: pk[i].parking_statu,
                        plan_time: expiredFlag,
                        storage_name: pk[i].storage_name,
                        storage_id: pk[i].storage_id
                    }]
                })
            } else {
                parkingArray[j].col.push({
                    col: pk[i].col,
                    vin: pk[i].vin,
                    carId: pk[i].car_id,
                    id: pk[i].id,
                    status: pk[i].parking_status,
                    plan_time: expiredFlag,
                    storage_name: pk[i].storage_name,
                    storage_id: pk[i].storage_id
                });
            }
        }
        return parkingArray;
    };


    // 仓储车辆图分布2 先行后列再格
    _this.storageParking2 = function (pk) {
        var parkingArray = [];
        for (i = 0; i < pk.length; i++) {
            var date = new Date(pk[i].plan_out_time);
            var plan_time = date.getTime();
            var new_time = new Date().getTime();
            // 临近出库标记：5 days
            var time = plan_time - new_time - 1000 * 60 * 60 * 24 * 5;
            // 临近出库标记
            var expiredFlag = false;
            if (time > 0) {
                expiredFlag = false;
            } else {
                expiredFlag = true;
            }
            for (j = 0; j < parkingArray.length;) {
                if (parkingArray[j].row == pk[i].row && parkingArray[j].col == pk[i].col) {
                    break;
                } else {
                    j++;
                }
            }
            if (j == parkingArray.length) {
                parkingArray.push({
                    row: pk[i].row,
                    col: pk[i].col,
                    lot: [{
                        lot: pk[i].lot,
                        vin: pk[i].vin,
                        carId: pk[i].car_id,
                        id: pk[i].id,
                        status: pk[i].parking_statu,
                        plan_time: expiredFlag,
                        storage_name: pk[i].storage_name,
                        storage_id: pk[i].storage_id
                    }]
                })
            } else {
                parkingArray[j].lot.push({
                    lot: pk[i].lot,
                    vin: pk[i].vin,
                    carId: pk[i].car_id,
                    id: pk[i].id,
                    status: pk[i].parking_status,
                    plan_time: expiredFlag,
                    storage_name: pk[i].storage_name,
                    storage_id: pk[i].storage_id
                });
            }
        }
        return parkingArray;
    };



    // 钥匙图分布
    _this.carKeyParking = function (pk) {
        var parkingArray = [];
        for (i = 0; i < pk.length; i++) {
            for (j = 0; j < parkingArray.length;) {
                if (parkingArray[j].row == pk[i].row) {
                    break;
                } else {
                    j++;
                }
            }
            if (j == parkingArray.length) {
                parkingArray.push({
                    row: pk[i].row,
                    col: [{
                        col: pk[i].col,
                        carId: pk[i].car_id,
                        id: pk[i].id,
                        car_key_cabinet_id: pk[i].car_key_cabinet_id,
                        car_key_cabinet_area_id: pk[i].car_key_cabinet_area_id,
                        key_cabinet_name: pk[i].key_cabinet_name,
                        area_name:  pk[i].area_name
                    }]
                })
            } else {
                parkingArray[j].col.push({
                    col: pk[i].col,
                    carId: pk[i].car_id,
                    id: pk[i].id,
                    car_key_cabinet_id: pk[i].car_key_cabinet_id,
                    car_key_cabinet_area_id: pk[i].car_key_cabinet_area_id,
                    key_cabinet_name: pk[i].key_cabinet_name,
                    area_name:  pk[i].area_name
                });
            }
        }
        return parkingArray;
    };
    //数组去重
    _this.array = function (arr){
         var o={};
         var new_arr=[];
         for(var i=0;i<arr.length;i++){
                 var k=arr[i];
                 if(!o[k]){
                         o[k]=true;
                         new_arr.push(k);
                     }
             }
        return(new_arr);
    };

    /**
     * 计算2个日期相差的天数
     * @param startDateString 'YYYY-MM-DD
     * @param endDateString 'YYYY-MM-DD
     * @returns 相差的天数 不包含今天，如：2016-12-13到2016-12-15，相差3天
     */
    _this.dateDiffIncludeToday = function (startDateString, endDateString){
        //日期分隔符
        var separator = "-";
        var startDates = startDateString.split(separator);
        var endDates = endDateString.split(separator);
        var startDate = new Date(startDates[0], startDates[1]-1, startDates[2]);
        var endDate = new Date(endDates[0], endDates[1]-1, endDates[2]);
        //把相差的毫秒数转换为天数
        var days = parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24);
        if (days === 0) {
            days = 1;
        }
        return days;
    };

    /**
     * 右补位，左对齐
     * @param oriStr 原字符串
     * @param len 目标字符串长度
     * @param alexin 补位字符
     * @return 目标字符串
     */
    _this.padRight = function (oriStr, len, alexin) {
        // 原字符串长度
        var strlen = oriStr.toString().length;
        var str = "";

        // 补位
        if (strlen < len) {
            for (var i = 0; i < len - strlen; i++) {
                str = str + alexin;
            }
            str = oriStr.toString() + str;
        } else if (strlen === len) {
            str = oriStr.toString();
        } else {
            str = oriStr.toString().substr(0,len -3) + "...";
        }

        return str;
    };

    // 页面之间数据传递
    _this.pass_parameter=function () {
//定义参数对象
        var myObject = {};

        /**
         * 定义传递数据的setter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _setter = function (data) {
            myObject = data;
        };

        /**
         * 定义获取数据的getter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _getter = function () {
            return myObject;
        };

        // Public APIs
        // 在controller中通过调setter()和getter()方法可实现提交或获取参数的功能
        return {
            setter: _setter,
            getter: _getter
        };
    };
    return _this
});
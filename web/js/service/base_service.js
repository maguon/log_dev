/**
 * Created by ASUS on 2017/4/6.
 */
var baseService = angular.module("baseService", []);
baseService.factory("$baseService", function () {
    var _this = {};
    _this.formDate = function (d) {
        var date = new Date(d);
        var new_date;
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) + ' ' : date.getDate() + ' ');
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        new_date = Y + M + D;
        return new_date;
    };
    return _this
});

baseService.factory("$urlMethod", function () {
    var _this = {};
    _this.urlMethod = function (obj) {
        var str = "?";
        for (var i in obj) {
            if (obj[i] != null) {
                str = str + i + "=" + obj[i] + "&&"
            }
        }
        return str.substr(0, str.length - 2);
    };
    return _this
});

baseService.factory("service_storage_parking", function () {
    var storageParking = function (pk) {
        var parkingArray = [];
        for (i = 0; i < pk.length; i++) {
            expiredFlag = false;
            var time;
            var date = new Date(pk[i].plan_out_time);
            var plan_time = date.getTime();

            var new_time = new Date().getTime();
            time = plan_time - new_time - 1000 * 60 * 60 * 24 * 5;
            if (time > 0) {
                expiredFlag = false;
            } else {
                expiredFlag = true;
            }
            for (j = 0; j < parkingArray.length;) {
                if (parkingArray[j].row == pk[i].row) {
                    break;
                } else {
                    j++;
                }
            }
            if (j == parkingArray.length) {

                // pk[i].plan_time-
                parkingArray.push({
                    row: pk[i].row,
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
        // console.log(parkingArray);
        return parkingArray;
        // return parkingArray;

    };
    return {
        storage_parking: storageParking
    }


});
baseService.factory("$config_variable", function () {
    var _this = {};
    _this.rel_status = 1;
    _this.car_rel_status=[
        {
            s_num: 1,
            status_text: "在库"
        },
        {
            s_num: 2,
            status_text: "出库"
        },
    ];
    _this.config_color = [
        {
            colorName: "白色",
            colorId: "FFFFFF"
        },
        {
            colorName: "黑色",
            colorId: "000000"
        },
        {
            colorName: "银色",
            colorId: "ECECEC"
        },
        {
            colorName: "金色",
            colorId: "EDB756"
        },
        {
            colorName: "红色",
            colorId: "D0011B"
        },
        {
            colorName: "蓝色",
            colorId: "0B7DD5"
        },
        {
            colorName: "灰色",
            colorId: "9B9B9B"
        },
        {
            colorName: "紫色",
            colorId: "7C24AB"
        },
        {
            colorName: "桔色",
            colorId: "FF6600"
        },
        {
            colorName: "黄色",
            colorId: "FFCC00"
        },
        {
            colorName: "绿色",
            colorId: "39A23F "
        },
        {
            colorName: "棕色",
            colorId: "794A21 "
        },
        {
            colorName: "粉色",
            colorId: "FF9CC3 "
        },
        {
            colorName: "其他",
            colorId: "CCCCCC "
        }
    ];

    return _this
});
baseService.factory("$pass_parameter", function () {
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
});


baseService.factory("$http_parameter",function () {
    var parameter=function (obj) {
        var str="";
        for(var i in obj){
            str=str+i+"="+obj[i]+"&";
        }
        return str.substr(0,str.length-1);
    };
    return{
        parameter:parameter
    }
});
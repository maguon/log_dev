/**
 * Created by ASUS on 2017/4/6.
 */
var baseService = angular.module("baseService", []);
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
        return parkingArray;
    };
    return {
        storage_parking: storageParking
    }
});
// 公共数据
baseService.factory("_config", function () {
    var _this = {};
    _this.userTypes = {
        storageUser : {type:2,name:"仓储部"},
        dispatch : {type:3,name:"调度部"},
        international_trade : {type:4,name:"国贸部"}
    };
    _this.user_type={
        storage_type:"2",
        admin_type:"99"
    };
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
// 页面之间数据传递
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
    return {
        setter: _setter,
        getter: _getter
    };
});

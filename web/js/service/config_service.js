// 公共数据
//var baseService = angular.module("baseService", []);
baseService.factory("_config", function () {
    var _this = {};
    _this.userTypes = [
        {
            type: 2,
            name: "仓储部",
            subType: [],
            index: 'storage.html',
            qr: []
        },
        {
            type: 3,
            name: "调度部",
            subType: [],
            index: 'dispatch.html',
            qr: []
        },
        {
            type: 4,
            name: "国贸部",
            subType: [],
            index: 'international_trade.html',
            qr: []
        }
    ];
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
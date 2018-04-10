// 公共数据
//var baseService = angular.module("baseService", []);
baseService.factory("_config", function () {
    var _this = {};

    // 用户类型
    _this.userTypes = [
        {
            type: 21,
            name: "仓储部操作员",
            subType: [],
            index: 'storage_home.html',
            qr: []
        },
        {
            type: 29,
            name: "仓储部管理员",
            subType: [{type: 21, name: "仓储部操作员"}],
            index: 'storage_manager.html',
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

    //
    _this.user_type = {
        storage_type: "2",
        admin_type: "99"
    };
    _this.rel_status = 1;

    // 车辆状态
    _this.carRelStatus = [
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

    // A-Z
    _this.characters = [
        {
            id: 1,
            name: "A"
        },
        {
            id: 2,
            name: "B"
        },
        {
            id: 3,
            name: "C"
        },
        {
            id: 4,
            name: "D"
        },
        {
            id: 5,
            name: "E"
        },
        {
            id: 6,
            name: "F"
        },
        {
            id: 7,
            name: "G"
        },
        {
            id: 8,
            name: "H"
        },
        {
            id: 9,
            name: "I"
        },
        {
            id: 10,
            name: "J"
        }
    ];

    // app系统
    _this.appSystems = [
        {
            id: 1,
            name: "安卓"
        },
        {
            id: 2,
            name: "IOS"
        }
    ];

    // 模块
    _this.modules = [
        {
            id: 1,
            name: "仓储部"
        },
        {
            id: 2,
            name: "国贸部"
        }
    ];

    // 是否强制更新
    _this.forceUpdates = [
        {
            id: 0,
            name: "否"
        },
        {
            id: 1,
            name: "是"
        }
    ];

    // 使用状态
    _this.useFlags = [
        {
            id: 0,
            name: "停用"
        },
        {
            id: 1,
            name: "可用"
        }
    ];

    // 是否MSO车辆
    _this.msoFlags = [
        {
            id: 1,
            name: "否"
        },
        {
            id: 2,
            name: "是"
        }
    ];

    //委托方性质
    _this.entrustType = [
        {
            entrust_type: 1,
            name: "个人"
        },
        {
            entrust_type: 2,
            name: "企业"
        }
    ];

    return _this
});
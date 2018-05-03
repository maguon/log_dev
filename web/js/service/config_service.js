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
            type: 41,
            name: "国贸部操作员",
            subType: [],
            index: 'trade_home.html',
            qr: []
        },
        {
            type: 49,
            name: "国贸部管理员",
            subType: [],
            index: 'trade_manager.html',
            qr: []
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

    // TODO DELETE
    _this.user_type = {
        storage_type: "2",
        admin_type: "99"
    };
    // _this.rel_status = 1;

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
        },
        {
            id: 11,
            name: "K"
        },
        {
            id: 12,
            name: "L"
        },
        {
            id: 13,
            name: "M"
        },
        {
            id: 14,
            name: "N"
        },
        {
            id: 15,
            name: "O"
        },
        {
            id: 16,
            name: "P"
        },
        {
            id: 17,
            name: "Q"
        },
        {
            id: 18,
            name: "R"
        },
        {
            id: 19,
            name: "S"
        },
        {
            id: 20,
            name: "T"
        },
        {
            id: 21,
            name: "U"
        },
        {
            id: 22,
            name: "V"
        },
        {
            id: 23,
            name: "W"
        },
        {
            id: 24,
            name: "X"
        },
        {
            id: 25,
            name: "Y"
        },
        {
            id: 26,
            name: "Z"
        }
    ];

    // 车辆颜色
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

    // 车辆状态
    _this.carRelStatus = [
        {
            s_num: 1,
            status_text: "在库"
        },
        {
            s_num: 2,
            status_text: "出库"
        }
    ];

    // 国家
    _this.country = [
        {
            val:1,
            name:'美国'
        },
        {
            val:2,
            name:'中国'
        }

    ];

    // 支付状态
    _this.paymentStatus = [
        {
            id:1,
            name:'未完结'
        },
        {
            id:2,
            name:'已完结'
        }

    ];

    // 支付方式
    _this.paymentType = [
        {
            id:1,
            name:'支票'
        },
        {
            id:2,
            name:'电汇'
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

    // 支付状态
    _this.payStatus = [
        {
            id: 1,
            name: "未支付"
        },
        {
            id: 2,
            name: "已支付"
        }
    ];

    // 是否分单
    _this.partTypes = [
        {
            id: 1,
            name: "否"
        },
        {
            id: 2,
            name: "是"
        }
    ];

    // 运送状态
    _this.shipTransStatus = [
        {
            id: 1,
            name: "待出发"
        },
        {
            id: 2,
            name: "已出发"
        },
        {
            id: 3,
            name: "已到达"
        }
    ];

    return _this
});
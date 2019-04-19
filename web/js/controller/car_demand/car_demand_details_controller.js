/**
 * 主菜单：车辆查询 -> 车辆信息詳情 画面
 */
app.controller("car_demand_details_controller", ["$state", "$stateParams", "_config", "$scope", "_host", "_basic", function ($state, $stateParams, _config, $scope, _host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 当前时间
    var nowStr = moment(new Date()).format("YYYYMMDD_HH:mm:ss.SSS");
    // 通过url中的信息取得 车辆id
    var val = $stateParams.id;
    // 通过url中的信息取得 VIN码
    var vin = $stateParams.vin;
    // 一行一列内，多个停车位区分用 (A-Z)
    $scope.characters = _config.characters;
    // 颜色列表
    $scope.color = _config.config_color;
    // 车库状态 列表
    $scope.carStatusList = _config.carRelStatus;
    // 状态船运 列表
    $scope.shipTransStatus = _config.shipTransStatus;
    // 是否MSO车辆 列表
    $scope.msoFlags = _config.msoFlags;
    // 发票开具-公司信息
    $scope.companyInfo = _config.companyInfo;
    // PDF预览 - 车辆基本信息
    $scope.showCarInfo4PDF = true;
    // PDF预览 - 仓储信息
    $scope.showStorageInfo4PDF = true;
    // PDF预览 - 海运信息
    $scope.showTransInfo4PDF = true;

    /**
     * 返回到前画面（车辆查询）。
     */
    $scope.return = function () {
        $state.go($stateParams.from, {from:"car_demand_details"}, {reload: true})
    };

    /**
     * 仓储车辆基本信息 仓储车辆照片 仓储操作记录 跳转
     */
    $scope.showCarInfo = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg ').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
    };
    $scope.showCarImg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_img ').addClass("active");
        $("#look_car_img").addClass("active");
        $("#look_car_img").show();
    };
    $scope.showComment = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_comment ').addClass("active");
        $("#look_comment").addClass("active");
        $("#look_comment").show();
    };

    /**
     * 更新是否显示 车辆基本信息 标记
     * @param $event
     */
    $scope.changeShowCarInfoFlg = function ($event) {
        // 车辆基本信息 选中的情况
        $scope.showCarInfo4PDF = $event.target.checked;
    };

    /**
     * 更新是否显示 仓储信息 标记
     * @param $event
     */
    $scope.changeShowStorageInfoFlg = function ($event) {
        // 仓储信息 选中的情况
        $scope.showStorageInfo4PDF = $event.target.checked;
    };

    /**
     * 更新是否显示 海运信息 标记
     * @param $event
     */
    $scope.changeShowTransInfoFlg = function ($event) {
        // 海运信息 选中的情况
        $scope.showTransInfo4PDF = $event.target.checked;
    };

    /**
     * 点击 PDF预览
     */
    $scope.previewPDF = function () {
        $('.modal').modal();
        $('#carInfoDiv').modal('open');
        getPDFCarImage();
    };

    /**
     * 获取各类别车辆照片
     */
    function getPDFCarImage() {
        // 车辆照片
        $scope.pdf_car_imageBox = [];
        // 仓储照片
        $scope.pdf_storage_imageBox = [];
        // 海运照片
        $scope.pdf_trans_imageBox = [];

        //图片获取
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 选中 车辆基本信息
                    if ($scope.showCarInfo4PDF) {
                        $scope.car_image = data.result[0].car_image;
                        for (var i in $scope.car_image) {
                            $scope.pdf_car_imageBox.push({
                                src: _host.file_url + '/image/' + $scope.car_image[i].url + "?" + nowStr
                            });
                        }
                    }
                    // 选中 仓储信息
                    if ($scope.showStorageInfo4PDF) {
                        $scope.storage_image = data.result[0].storage_image;
                        for (var i in $scope.storage_image) {
                            $scope.pdf_storage_imageBox.push({
                                src: _host.file_url + '/image/' + $scope.storage_image[i].url + "?" + nowStr
                            });
                        }
                    }
                    // 选中 海运信息
                    if ($scope.showTransInfo4PDF) {
                        $scope.trans_image = data.result[0].trans_image;
                        for (var i in $scope.trans_image) {
                            $scope.pdf_trans_imageBox.push({
                                src: _host.file_url + '/image/' + $scope.trans_image[i].url + "?" + nowStr
                            });
                        }
                    }
                }
            } else {
                swal(data.msg, "", "error")
            }
        });
    }

    /**
     * 下载PDF文件。
     */
    $scope.downloadPDF = function () {
        try{
            // 去掉画面CSS (主要为了去滚动条)
            $("#context-div").removeClass("ConWrap");
            $("#carInfoDiv").removeClass("modal");
            $(".shadeDowWrap").show();
            html2canvas(document.getElementById("car_info"), {
                // allowTaint: true, //避免一些不识别的图片干扰，默认为false，遇到不识别的图片干扰则会停止处理html2canvas
                // taintTest: false,
                useCORS: true,
                // Create a canvas with double-resolution.
                scale: 2,
                // Create a canvas with 144 dpi (1.5x resolution).
                dpi: 192,
                onrendered: function(canvas) {
                    var contentWidth = canvas.width;
                    var contentHeight = canvas.height;
                    console.log('contentWidth',contentWidth);
                    console.log('contentHeight',contentHeight);

                    //一页pdf显示html页面生成的canvas高度;
                    var pageHeight = contentWidth / 595.28 * 841.89;
                    console.log('pageHeight',pageHeight);
                    //未生成pdf的html页面高度
                    var leftHeight = contentHeight;
                    console.log('leftHeight',leftHeight);
                    //pdf页面偏移
                    var position = 0;
                    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    var imgWidth = 595.28;
                    var imgHeight = 595.28/contentWidth * contentHeight;
                    console.log('imgHeight',imgHeight);
                    var pageData = canvas.toDataURL('image/jpeg', 1.0);

                    var pdf = new jsPDF('', 'pt', [595.28, contentHeight]);
                    // pdf.beginFormObject(10, 10, 100, 100, matrix);
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );


                    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                    //当内容未超过pdf一页显示的范围，无需分页
                    // if (leftHeight < pageHeight) {
                    //     pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                    // } else {
                    //     while(leftHeight > 0) {
                    //         pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                    //         leftHeight -= pageHeight;
                    //         console.log('leftHeight',leftHeight);
                    //         // 比841.89 多减去20 ，是为了留下一定的余白
                    //         position -= 861.89;
                    //         console.log('position',position);
                    //         //避免添加空白页
                    //         if(leftHeight > 0) {
                    //             pdf.addPage();
                    //         }
                    //     }
                    // }
                    // 保存PDF文件
                    pdf.save(vin + '.pdf');
                    $(".shadeDowWrap").hide();
                },
                // 背景设为白色（默认为黑色）
                background: "#fff"
            });
        } finally {
            // 追加画面CSS
            $("#carInfoDiv").addClass("modal");
            $("#context-div").addClass("ConWrap");
            // 关闭模态
            $('#carInfoDiv').modal('close');
        }
    };

    /**
     * 显示车辆照片大图。
     */
    var viewer;
    $scope.showImgByViewer = function (type) {
        if (type === 'carImage') {
            viewer = new Viewer(document.getElementById('lookCarImage'), {
                url: 'data-original'
            });
        } else if (type === 'storageImage') {
            viewer = new Viewer(document.getElementById('lookStorageImage'), {
                url: 'data-original'
            });
        } else if (type === 'transImage') {
            viewer = new Viewer(document.getElementById('lookTransImage'), {
                url: 'data-original'
            });
        }
    };

    /**
     * 获取各类别车辆照片
     */
    $scope.getCarImage = function (type) {

        // 车辆照片 预览详情
        $scope.car_imageBox = [];
        // 仓储照片 预览详情
        $scope.storage_imageBox = [];
        // 海运照片 预览详情
        $scope.trans_imageBox = [];

        //图片获取
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    if (type === 'carImage') {
                        $scope.car_image = data.result[0].car_image;
                        for (var i in $scope.car_image) {
                            $scope.car_imageBox.push({
                                src: _host.file_url + '/image/' + $scope.car_image[i].url,
                                time:$scope.car_image[i].timez,
                                user:$scope.car_image[i].name
                            });
                        }
                    } else if (type === 'storageImage') {
                        $scope.storage_image = data.result[0].storage_image;
                        for (var i in $scope.storage_image) {
                            $scope.storage_imageBox.push({
                                src: _host.file_url + '/image/' + $scope.storage_image[i].url,
                                time:$scope.storage_image[i].timez,
                                user:$scope.storage_image[i].name
                            });
                        }
                    } else if (type === 'transImage') {
                        $scope.trans_image = data.result[0].trans_image;
                        for (var i in $scope.trans_image) {
                            $scope.trans_imageBox.push({
                                src: _host.file_url + '/image/' + $scope.trans_image[i].url,
                                time:$scope.trans_image[i].timez,
                                user:$scope.trans_image[i].name
                            });
                        }
                    }
                }
            } else {
                swal(data.msg, "", "error")
            }
        });
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        $(".main_storage_car").hide();
        $("#look_StorageCar").show();
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();

        // 基本信息获取
        _basic.get(_host.api_url + "/user/" + userId + "/car?carId=" + val).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    $scope.modelId = data.result[0].model_id;
                    $scope.self_car = data.result[0];
                    $scope.carColor = '未知';
                    for (var i in _config.config_color) {
                        if (_config.config_color[i].colorId == $scope.self_car.colour) {
                            $scope.carColor = _config.config_color[i].colorName;
                        }
                    }
                    // modelID赋值
                    $scope.look_make_id = $scope.self_car.make_id;
                    $scope.look_model_id = $scope.self_car.model_id;
                    $scope.look_create_time = $scope.self_car.pro_date;
                    if($scope.self_car.lot== null){
                        $scope.selfLot='';
                    }else{
                        $scope.selfLot = $scope.characters[$scope.self_car.lot - 1].name;
                    }
                    $scope.look_storageName = $scope.self_car.storage_name + "" + $scope.self_car.area_name + "" + $scope.self_car.row + "排" + $scope.self_car.col + "列" +$scope.selfLot;
                    // 车辆id
                    $scope.look_car_id = $scope.self_car.id;
                }
            }
            else {
                swal(data.msg, "", "error")
            }
        });

        // 取得操作记录
        _basic.get(_host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    $scope.comment = data.result[0].comment;
                }
            }
        });
    }
    initData();
}]);
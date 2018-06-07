app.controller("setting_client_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    $scope.size = 11;
    $scope.start = 0;

    // 获取委托方性质列表
    $scope.entrustType = _config.entrustType;

    // 追加画面初期数据
    var initClientInfo = {
        // 性质
        entrustType:"",
        // 委托方简称
        shortName:"",
        // 委托方全称
        entrustName:"",
        // 联系人
        contactsName:"",
        // 邮件
        email : "",
        // 联系电话
        tel : "",
        // 详细地址
        address : "",
        // 备注
        remark : ""
    };

    // 追加画面数据
    $scope.clientInfo = {};

    // 点击按钮查询
    $scope.getClientList = function (){
        $scope.start = 0;
        seachClientList();
    };

    /**
     * 检索委托方列表
     */
    function seachClientList () {
        var entrust = {};

        if ($("#entrustSelect").val() === "") {
            entrust = {id:"",text:""};
        } else {
            entrust = $("#entrustSelect").select2("data")[0];
        }

        var obj = {
            entrustId: $scope.showId,
            entrustType: $scope.showEntrustType,
            shortName: entrust.text
        };

        _basic.get(_host.api_url + "/entrust?"+ _basic.objToUrl(obj)+"&start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
            if (data.success) {
                $scope.getClientBoxArray = data.result;
                $scope.getClientArray = $scope.getClientBoxArray.slice(0,10);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            }
        })
    }

    /**
     * 打开画面【增加委托方】模态框。
     */
    $scope.openAddClient = function () {
        // 画面ID
        $scope.pageId = "add";
        // 初期化数据
        angular.copy(initClientInfo, $scope.clientInfo);

        // 打开 模态窗口
        $('.modal').modal();
        $('#saveClientDiv').modal('open');

        // textarea 高度调整
        $('#remark').val('');
        $('#remark').trigger('autoresize');
    };

    /**
     * 打开画面【委托方设置】模态框。
     * @param selectedItem 选中数据
     */
    $scope.openEditClient=function (selectedItem) {
        // 根据画面选中数据的ID 检索数据
        _basic.get(_host.api_url + "/entrust?entrustId=" + selectedItem.id).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 画面ID
                    $scope.pageId = "edit";

                    $(".modal").modal();
                    $("#saveClientDiv").modal("open");

                    // ID
                    $scope.clientInfo.id = data.result[0].id;
                    // 性质
                    $scope.clientInfo.entrustType = data.result[0].entrust_type;
                    // 委托方简称
                    $scope.clientInfo.shortName = data.result[0].short_name;
                    // 委托方全称
                    $scope.clientInfo.entrustName = data.result[0].entrust_name;
                    // 联系人
                    $scope.clientInfo.contactsName = data.result[0].contacts_name;
                    // 邮件
                    $scope.clientInfo.email = data.result[0].email;
                    // 联系电话
                    $scope.clientInfo.tel = data.result[0].tel;
                    // 详细地址
                    $scope.clientInfo.address = data.result[0].address;
                    // 备注
                    $scope.clientInfo.remark = data.result[0].remark;
                    // 创建时间
                    $scope.clientInfo.createdOn = data.result[0].created_on;

                    // textarea 高度调整
                    $('#remark').val($scope.clientInfo.remark);
                    $('#remark').trigger('autoresize');

                }
            } else {
                swal(data.msg, "", "error");
            }
        })
    };

    /**
     * 保存委托方信息。
     */
    $scope.saveClientInfo = function () {
        // 必须输入项：性质，委托方简称，委托方全称，联系人，联系电话
        if ($scope.clientInfo.entrustType !== '' && $scope.clientInfo.shortName !== '' && $scope.clientInfo.entrustName !== '' &&
            $scope.clientInfo.contactsName !== '' && $scope.clientInfo.tel !== '') {

            // 画面数据
            var obj = {
                shortName: $scope.clientInfo.shortName,
                entrustName: $scope.clientInfo.entrustName,
                entrustType: $scope.clientInfo.entrustType,
                contactsName: $scope.clientInfo.contactsName,
                tel: $scope.clientInfo.tel,
                email: $scope.clientInfo.email,
                address: $scope.clientInfo.address,
                remark: $scope.clientInfo.remark
            };

            if ($scope.pageId === "add") {
                _basic.post(_host.api_url + "/user/" + userId + "/entrust", obj).then(function (data) {
                    if (data.success) {
                        swal("新增成功", "", "success");
                        $('#saveClientDiv').modal('close');
                        seachClientList();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {
                _basic.put(_host.api_url + "/user/" + userId+"/entrust/" +$scope.clientInfo.id, obj).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        $('#saveClientDiv').modal('close');
                        seachClientList();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    };

    /**
     * 分页
     * */
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size - 1) ;
        seachClientList();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachClientList();
    };

    /**
     * 委托方列表查询，用来填充查询条件：委托方
     */
    function getEntrustList() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }

    /**
     * 初期检索画面数据
     */
    function initData() {
        // 取得委托方列表
        getEntrustList();
        // 检索委托方列表
        seachClientList();
    }

    /**
     * 画面初期数据取得。
     */
    initData();
}]);

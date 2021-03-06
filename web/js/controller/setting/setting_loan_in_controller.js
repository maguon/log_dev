/**
 * 主菜单：管理员设置 -> 贷入公司设置 控制器
 */
app.controller("setting_loan_in_controller", ["$scope", "_basic", "_host", function ($scope, _basic, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 追加画面初期数据
    var initLoanInCoInfo = {
        companyName: "",
        baseMoney: "",
        contacts: "",
        tel: "",
        email: "",
        remark: ""
    };
    // 追加画面数据
    $scope.loanInCoInfo = {};

    /**
     * 初期检索画面数据
     */
    function initData() {
        _basic.get(_host.api_url + "/loanIntoCompany").then(function (data) {
            if (data.success) {
                $scope.loanInList = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    /**
     * 打开画面【增加贷入公司】模态框。
     */
    $scope.openAddLoanIn = function () {
        // 画面ID
        $scope.pageId = "add";
        // 初期化数据
        angular.copy(initLoanInCoInfo, $scope.loanInCoInfo);

        // 打开画面
        $('.modal').modal();
        $('#saveLoanInDiv').modal('open');

        // textarea 高度调整
        $('#remarkText').val('');
        $('#remarkText').trigger('autoresize');
    };

    /**
     * 打开画面【增加贷入公司】模态框。
     */
    $scope.openEditLoanIn = function (loanCompany) {
        // 根据画面选中数据的ID 检索数据
        _basic.get(_host.api_url + "/loanIntoCompany?loanIntoCompanyId=" + loanCompany.id).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 画面ID
                    $scope.pageId = "edit";
                    // 修改数据赋值
                    $scope.loanInCoInfo.id = data.result[0].id;
                    $scope.loanInCoInfo.companyName = data.result[0].company_name;
                    $scope.loanInCoInfo.baseMoney = data.result[0].base_money;
                    $scope.loanInCoInfo.contacts = data.result[0].contacts;
                    $scope.loanInCoInfo.tel = data.result[0].tel;
                    $scope.loanInCoInfo.email = data.result[0].email;
                    $scope.loanInCoInfo.remark = data.result[0].remark;

                    // 打开画面
                    $('.modal').modal();
                    $('#saveLoanInDiv').modal('open');

                    // textarea 高度调整
                    $('#remarkText').val($scope.loanInCoInfo.remark);
                    $('#remarkText').trigger('autoresize');
                }
            }
        })
    };

    /**
     * 增加贷入公司信息。
     */
    $scope.saveLoanIn = function () {
        // 必须项目：贷入公司名称，基础额度(美元)
        if ($scope.loanInCoInfo.companyName !== "" && $scope.loanInCoInfo.baseMoney !== "") {

            // 追加画面数据
            var obj = {
                companyName: $scope.loanInCoInfo.companyName,
                baseMoney: $scope.loanInCoInfo.baseMoney,
                contacts: $scope.loanInCoInfo.contacts,
                tel: $scope.loanInCoInfo.tel,
                email: $scope.loanInCoInfo.email,
                remark: $scope.loanInCoInfo.remark
            };

            if ($scope.pageId === "add") {
                _basic.post(_host.api_url + "/user/" + userId + "/loanIntoCompany", obj).then(function (data) {
                    if (data.success) {
                        $('#saveLoanInDiv').modal('close');
                        swal("新增成功", "", "success");
                        // 成功后，刷新页面数据
                        initData();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {
                // 调用更新API
                _basic.put(_host.api_url + "/user/" + userId + "/loanIntoCompany/" + $scope.loanInCoInfo.id, obj).then(function (data) {
                    if (data.success) {
                        $('#saveLoanInDiv').modal('close');
                        swal("修改成功", "", "success");
                        // 成功后，刷新页面数据
                        initData();
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
     * 修改贷入公司状态。
     *
     * @param id 贷入公司ID
     * @param companyStatus 贷入公司状态
     */
    $scope.changeLoanCoStatus = function (id, companyStatus) {
        swal({
                title: "",
                text: "确定要修改当前贷入公司状态？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    // 状态
                    var status = 0;
                    if (companyStatus === 0) {
                        // "启用"
                        status = 1
                    } else {
                        // "停用"
                        status = 0
                    }

                    // API url
                    var url = _host.api_url + "/user/" + userId + "/loanIntoCompany/" + id + "/companyStatus/" + status;

                    // 调用更新API
                    _basic.put(url, {}).then(function (data) {
                        if (data.success) {
                            swal.close();
                        } else {
                            swal(data.msg, "", "error");
                        }
                        initData();
                    })
                } else {
                    swal.close();
                    initData();
                }
            });
    };

    /**
     * 画面初期数据取得。
     */
    initData();
}]);

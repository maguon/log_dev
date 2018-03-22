/**
 * Created by ASUS on 2017/4/1.
 * TODO 没有相关的菜单入口。
 */
app.controller("company_controller", ['$rootScope', '$scope', '_basic', '$host',  '$urlMethod', function ($rootScope, $scope, _basic, $host,  $urlMethod) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 单条公司信息
    var companyMsg;
    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    var initData = function () {
        // 画面初期时，无条件查询公司信息列表
        _basic.get($host.api_url + "/user/" + userId + "/company", {}).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.Company = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 获取城市信息列表
        _basic.get($host.api_url + "/user/" + userId + "/city", {}).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.citys = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    initData();
    /**
     * 画面【搜索】按钮，根据画面检索条件输入情况，进行查询公司信息列表。
     * TODO 因为没有数据，所以没有测试。
     */
    $scope.getCompanyList = function () {
        var obj = {
            companyName: $scope.s_computer,
            operateType: $scope.s_type,
            cityId: $scope.s_city
        };
        _basic.get($host.api_url + "/user/" + userId + "/company" + $urlMethod.urlMethod(obj)).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                // console.log(data.result);
                $scope.Company = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    /**
     * 画面【增加公司】按钮，用于显示追加公司机能画面。
     * TODO 暂时无法动作。
     */
    $scope.addCompany = function () {
        $('.modal').modal({
            complete: function () {
                $scope.addCompanyName = "";
                $scope.addOperateType = "";
                $scope.addCooperationTime = "";
                $scope.addContacts = "";
                $scope.addTel = "";
                $scope.addCityId = "";
                $scope.addMark = "";
            }
        });
        $scope.submitted = false;
        $('#addCompany').modal('open');
    };
    $scope.getCompanyInfo = function (id) {
        // 显示公司详细信息画面
        $('.modal').modal();
        $('#LookCompany').modal('open');
        // 根据公司ID，取得公司详细信息
        _basic.get($host.api_url + "/user/" + userId + "/company?companyId=" + id, {}).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.company = data.result[0];
                companyMsg = $scope.company;
                console.log($scope.company, $scope.company.cooperation_time);
                $scope.look_cooperation_time = moment($scope.company.cooperation_time).format("YYYY-DD-MM")
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 头车数量
        _basic.get($host.api_url + "/user/" + userId + "/company/" + id + "/firstCount", {}).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.firstCount = data.result[0].firstCount;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 挂车数量
        _basic.get($host.api_url + "/user/" + userId + "/company/" + id + "/trailerCount", {}).then(function (data) {
            if (data.success == true) {
                $scope.trailerCount = data.result[0].firstCount;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 司机数量
        _basic.get($host.api_url + "/user/" + userId + "/company/" + id + "/driveCount", {}).then(function (data) {
            if (data.success == true) {
                $scope.driveCount = data.result[0].driveCount;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 提交新增公司信息
    $scope.addCompanyItem = function (isValid) {
        if (isValid) {
            _basic.post($host.api_url + "/user/" + userId + "/company", {
                "companyName": $scope.addCompanyName,
                "operateType": $scope.addOperateType,
                "cooperationTime": $scope.addCooperationTime,
                "contacts": $scope.addContacts,
                "tel": $scope.addTel,
                "cityId": $scope.addCityId,
                "remark": $scope.addMark
            }).then(function (data) {
                if (data.success == true) {
                    $('#addCompany').modal('close');
                    swal("新增成功", "", "success");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    // 修改公司详情
    $scope.updateCompanyItem = function (id, isValid) {
        if (isValid) {
            var subParam = {
                "companyName": companyMsg.company_name,
                "operateType": companyMsg.operate_type,
                "cooperationTime": $scope.look_cooperation_time,
                "contacts": companyMsg.contacts,
                "tel": companyMsg.tel,
                "cityId": companyMsg.city_id,
                "remark": companyMsg.remark
            }
            _basic.put($host.api_url + "/user/" + userId + "/company/" + id, subParam).then(function (data) {
                // $(".shadeDowWrap").hide();
                if (data.success == true) {
                    // console.log(data);
                    $('#LookCompany').modal('close');
                    swal("修改成功", "", "success");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }
}]);
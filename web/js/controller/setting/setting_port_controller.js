/**
 * Created by star on 2018/4/11.
 */
app.controller("setting_port_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 获取国家名称列表
    $scope.countryList = _config.country;

    // 追加画面初期数据
    var initPortInfo = {
        // 国家
        country:"",
        // 港口名称
        portName:"",
        // 描述
        remark:""
    };

    // 追加画面数据
    $scope.portInfo = {};

    /**
     * 检索港口
     */
    $scope.searchPort = function () {
        var obj = {
            portId: $scope.condPortName,
            countryId: $scope.condCountryName
        };
        _basic.get(_host.api_url + "/port?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success) {
                $scope.portArr = data.result;
            }
        })
    };

    /**
     * 打开画面【增加港口】模态框。
     */
    $scope.openAddPort = function (){
        // 画面ID
        $scope.pageId = "add";
        // 初期化数据
        angular.copy(initPortInfo, $scope.portInfo);

        // 打开 模态窗口
        $('.modal').modal();
        $('#savePortDiv').modal('open');

        // textarea 高度调整
        $('#remark').val('');
        $('#remark').trigger('autoresize');
    };

    /**
     * 打开画面【港口信息】模态框。
     * @param selectedItem 选中数据
     */
    $scope.openEditPort = function (selectedItem){
        // 根据画面选中数据的ID 检索数据
        _basic.get(_host.api_url + "/port?portId=" + selectedItem.id).then(function (data) {
            if (data.success) {
                if (data.result.length > 0) {
                    // 画面ID
                    $scope.pageId = "edit";

                    $(".modal").modal();
                    $("#savePortDiv").modal("open");

                    // 国家
                    $scope.portInfo.country = data.result[0].country_id;
                    // 港口名称
                    $scope.portInfo.portName = data.result[0].port_name;
                    // 描述
                    $scope.portInfo.remark = data.result[0].remark;

                    // textarea 高度调整
                    $('#remark').val($scope.portInfo.remark);
                    $('#remark').trigger('autoresize');
                }
            }
        })
    };

    $scope.savePortInfo = function (){
        if ($scope.portInfo.country !== "" && $scope.portInfo.portName !== "") {

            // 追加画面数据
            var obj = {
                portName:$scope.portInfo.portName,
                countryId:$scope.portInfo.country,
                address:"",
                remark: $scope.portInfo.remark
            };

            if ($scope.pageId === "add") {
                // 调用 API
                _basic.post(_host.api_url + "/user/" + userId + "/port", obj).then(function (data) {
                    if (data.success) {
                        $('#savePortDiv').modal('close');
                        swal("新增成功", "", "success");
                        // 成功后，刷新页面数据
                        $scope.searchPort();
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            } else {
                _basic.put(_host.api_url + "/user/" + userId+"/port/" + $scope.id, obj).then(function (data) {
                    if (data.success) {
                        $('#savePortDiv').modal('close');
                        swal("修改成功", "", "success");
                        // 成功后，刷新页面数据
                        $scope.searchPort();
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
     * 获取港口名称列表
     */
    function getPortList() {
        // 港口
        _basic.get(_host.api_url + "/port").then(function (data) {
            if (data.success) {
                $scope.portList = data.result;
            }
        });
    }

    /**
     * 初期检索画面数据
     */
    function initData() {
        // 获取港口名称列表
        getPortList();
        // 检索港口
        $scope.searchPort();
    }

    /**
     * 画面初期数据取得。
     */
    initData();
}]);
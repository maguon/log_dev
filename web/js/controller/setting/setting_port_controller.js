/**
 * Created by star on 2018/4/11.
 */
app.controller("setting_port_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.countryList = _config.country;//获取国家名字
    /**
     * 获取港口名字
     * */
    function getPortName() {
        // 港口
        _basic.get(_host.api_url + "/port").then(function (data) {
            if (data.success == true) {
                $scope.portList = data.result;
            }
        });
    };
    /**
     *  搜索
     *  */
    $scope.searchPort = function () {
        var obj = {
            portId: $scope.portName,
            countryId: $scope.countryName
        };
        _basic.get(_host.api_url + "/port?" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.portArr = data.result;
            }
        })
    };
    /**
    * 添加模态框
    * */
    $scope.addPort = function (){
        $(".modal").modal();
        $("#addPort").modal("open");
        $scope.addCountry="";
        $scope.addPortName="";
        $scope.addRemark="";
    }
    $scope.addPortItem = function (){
        if ($scope.addCountry !== ""&& $scope.addPortName !== "") {

            // 追加画面数据
            var obj = {
                portName:$scope.addPortName,
                countryId:$scope.addCountry,
                address:"",
                remark: $scope.addRemark
            };

            // 调用 API
            _basic.post(_host.api_url + "/user/" + userId + "/port", obj).then(function (data) {
                if (data.success) {
                    $('#addPort').modal('close');
                    swal("新增成功", "", "success");
                    // 成功后，刷新页面数据
                    $scope.searchPort();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        } else {
            swal("请填写完整信息！", "", "warning");
        }
    }
    /**
     * 修改模态框
     * */
    $scope.updatePort = function (id){
        $(".modal").modal();
        $("#updatePort").modal("open");
        $scope.id=id;
        _basic.get(_host.api_url + "/port?portId="+id).then(function (data) {
            if (data.success == true) {
                $scope.updateCountry = data.result[0].country_id;
                $scope.updatePortName = data.result[0].port_name;
                $scope.updateRemark = data.result[0].remark;
            }
        })
    };
    $scope.updatePortItem = function (){
        if($scope.updateCountry !== ""&& $scope.updatePortName !== ""){
            var obj = {
                portName: $scope.updatePortName,
                countryId:$scope.updateCountry,
                address:"",
                remark: $scope.updateRemark
            };
            _basic.put(_host.api_url + "/user/" + userId+"/port/" + $scope.id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#updatePort').modal('close');
                    $scope.searchPort();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }
    /**
     * *数据获取
     * */
    getPortName();
    $scope.searchPort();
}]);
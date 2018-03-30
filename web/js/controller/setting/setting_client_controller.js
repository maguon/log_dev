app.controller("setting_client_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {
    $scope.size =10;
    $scope.start = 0;
    var userId = _basic.getSession(_basic.USER_ID);
    // 点击按钮查询
    $scope.getClientList = function () {
        var obj = {
            entrustId: $scope.showId,
            entrustType: $scope.showEntrustType,
            shortName: $scope.showShortName
        };
        _basic.get(_host.api_url + "/entrust?"+ _basic.objToUrl(obj)+"&start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
            if (data.success == true) {
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
                $scope.getClientArray = data.result;
            }
        })
    }
    /**
     * 打开添加模态框
     * */
    $scope.addClient = function () {
        // 初始化所有信息
        $scope.addEntrustType="";
        $scope.addShortName="";
        $scope.addEntrustName="";
        $scope.addContactsName="";
        $scope.addTel="";
        $scope.addAddress="";
        $scope.addRemark="";
        $(".modal").modal();
        $("#addClient").modal("open");
    };
    /**
    * 提交添加后的信息
    * */
    $scope.addClientItem=function() {
        if ($scope.addEntrustType !== '' && $scope.addShortName !== '' && $scope.addEntrustName!== '' &&
            $scope.addContactsName!== ''&&$scope.addTel!== ''&&$scope.addAddress!== '') {
            _basic.post(_host.api_url + "/user/" + userId + "/entrust", {
                shortName: $scope.addShortName,
                entrustName: $scope.addEntrustName,
                entrustType: $scope.addEntrustType,
                contactsName:  $scope.addContactsName,
                tel:  $scope.addTel,
                address:$scope.addAddress,
                remark: $scope.addRemark
            }).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#addClient').modal('close');
                    $scope.getClientList();
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
     * 打开设置委托方模态框
     * */
    $scope.updateClient=function (id) {
        $('.modal').modal();
        $('#updateClient').modal('open');
        _basic.get(_host.api_url + "/entrust?entrustId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.clientList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    /**
     * 修改委托方信息
     * */
    $scope.updateClientItem = function (id) {
        if($scope.clientList.short_name!== "" &&$scope.clientList.entrust_name!==""
            &&$scope.clientList.entrust_type!== undefined &&$scope.clientList.contacts_name!== ""
            &&$scope.clientList.tel!== "" &&$scope.clientList.address!== ""){
            var obj = {
                shortName: $scope.clientList.short_name,
                entrustName: $scope.clientList.entrust_name,
                entrustType: $scope.clientList.entrust_type,
                contactsName:  $scope.clientList.contacts_name,
                tel:  $scope.clientList.tel,
                address:$scope.clientList.address,
                remark: $scope.clientList.remark
            };
            _basic.put(_host.api_url + "/user/" + userId+"/entrust/" +id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#updateClient').modal('close');
                    $scope.getClientList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };
    /**
     * 分页
     * */
    $scope.previousPage = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getClientList();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getClientList();
    };
    $scope.getClientList();
}])
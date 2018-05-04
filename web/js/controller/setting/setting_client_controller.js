app.controller("setting_client_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {
    $scope.size =11;
    $scope.start = 0;
    var userId = _basic.getSession(_basic.USER_ID);


    /**
     * 委托方列表查询，用来填充查询条件：委托方
     */
    function getEntrustList() {
        _basic.get(_host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.entrustList = data.result;
                $('#entrustSelect').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }


    // 点击按钮查询
    $scope.getClientList = function (){
        $scope.start = 0;
        seachClientList();
    }


    function seachClientList () {
        var entrust = {};

        if ($("#entrustSelect").val() == "") {
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
            if (data.success == true) {
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
            $scope.addContactsName!== ''&&$scope.addTel!== '') {
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
                    seachClientList();
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
            &&$scope.clientList.tel!== ""){
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
                    seachClientList();
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
        $scope.start = $scope.start - ($scope.size - 1) ;
        seachClientList();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size - 1) ;
        seachClientList();
    };
    seachClientList();
    getEntrustList();
}])

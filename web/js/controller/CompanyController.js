/**
 * Created by ASUS on 2017/4/1.
 */
var CompanyController=angular.module("CompanyController",[]);
CompanyController.controller("CompanyController",['$rootScope','$scope','$basic','$host',function ($rootScope,$scope,$basic,$host) {
    var userId=sessionStorage.getItem("userId");
    // 单条公司信息
    var companyMsg;
    var searchAll=function () {
        $basic.get($host.api_url+"/user/"+userId+"/company", {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                console.log(data);
                $scope.Company=data.result;
                // console.log($scope.Company);
            }else {
                swal(data.msg,"","error");
            }
        });
        $scope.addCompany=function () {
            $('.modal').modal();
            $('#addCompany').modal('open');
        };
    };
    searchAll();

    $scope.submit=function () {
        console.log(userId);
            $basic.post($host.api_url+"/user/"+userId+"/company", {
                "companyName":$scope.addCompanyName,
                "operateType": $scope.addOperateType,
                "cooperationTime":$scope.addCooperationTime,
                "contacts":$scope.addContacts,
                "tel": $scope.addTel,
                "cityId": $scope.addCityId,
                "remark":$scope.addMark
            }).then(function(data){
                // $(".shadeDowWrap").hide();
                if(data.success==true){
                    $('#addCompany').modal('close');
                    swal("新增成功","","success");
                    searchAll();
                }else {
                    swal(data.msg,"","error");
                }
        })
    };

    $scope.LookCompany=function (id) {
        $('.modal').modal();
        $('#LookCompany').modal('open');
        // var ComId=$(this).attr("comid");
        // console.log(id)
        $basic.get($host.api_url+"/user/"+userId+"/company?companyId="+id, {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                $scope.company=data.result[0];
                companyMsg=$scope.company;
            }else {
                swal(data.msg,"","error");
            }
        });
        $scope.addCompany=function () {
            $('.modal').modal();
            $('#addCompany').modal('open');
        };

    };
    $scope.changeCom=function (id) {
        console.log(companyMsg);
        var subParam = {
            "companyName": companyMsg.company_name,
            "operateType": companyMsg.operate_type,
            "cooperationTime":companyMsg.cooperation_time,
            "contacts": companyMsg.contacts,
            "tel": companyMsg.tel,
            "cityId": companyMsg.city_id,
            "remark": companyMsg.remark
        }
        $basic.put($host.api_url+"/user/"+userId+"/company/"+id, subParam).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                // console.log(data);
                $('#LookCompany').modal('close');
                swal("修改成功","","success");
                searchAll();
            }else {
                swal(data.msg,"","error");
            }
        });
        $scope.addCompany=function () {
            $('.modal').modal();
            $('#addCompany').modal('open');
        };
    }
}]);
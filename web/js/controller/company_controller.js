/**
 * Created by ASUS on 2017/4/1.
 */
var CompanyController=angular.module("CompanyController",[]);
CompanyController.controller("CompanyController",['$rootScope','$scope','$basic','$host','$baseService','$urlMethod',function ($rootScope,$scope,$basic,$host,$baseService,$urlMethod) {
    var userId=sessionStorage.getItem("userId");
    // 单条公司信息
    var companyMsg;



    // 搜索查询
    $scope.search=function () {

        var obj={
            companyName:$scope.s_computer,
            operateType:$scope.s_type,
            cityId:$scope.s_city
        };

        // var urlMethod=function (obj) {
        //
        // };



        $basic.get($host.api_url+"/user/"+userId+"/company"+$urlMethod.urlMethod(obj)).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                console.log(data.result);
                $scope.Company=data.result;
                // console.log($scope.Company);
            }else {
                swal(data.msg,"","error");
            }
        });
    };
    // 整体查询读取
    var searchAll=function () {
        $basic.get($host.api_url+"/user/"+userId+"/company", {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                $scope.Company=data.result;
                // console.log($scope.Company);
            }else {
                swal(data.msg,"","error");
            }
        });

        // 获取城市信息
        $basic.get($host.api_url+"/user/"+userId+"/city", {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                // console.log(data);
                $scope.citys=data.result;
            }else {
                swal(data.msg,"","error");
            }
        });
    };
    searchAll();

    // 新增公司
    $scope.addCompany=function () {
        $('.modal').modal({
            complete:function () {
                $scope.addCompanyName="";
                $scope.addOperateType="";
                $scope.addCooperationTime="";
                $scope.addContacts="";
                $scope.addTel="";
                $scope.addCityId="";
                $scope.addMark="";
            }
        });
        $scope.submitted = false;
        $('#addCompany').modal('open');

    };
    // 提交新增公司信息
    $scope.submitForm=function (isValid) {
        $scope.submitted = true;
        if (isValid){

            console.log($scope.addCooperationTime);
            // var time=$scope.addCooperationTime;
            // var t=time.pattern("yyyy-MM-dd hh:mm:ss");

            // var CooperationTime=t.getFullYear()+"-"+t.getMonth()+1+"-"+t.getDate();
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
        }

    };
    // 查看公司详情
    $scope.LookCompany=function (id) {
        $('.modal').modal();
        $('#LookCompany').modal('open');

        $basic.get($host.api_url+"/user/"+userId+"/company?companyId="+id, {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                $scope.company=data.result[0];
                // console.log($scope.company.cooperation_time)
                companyMsg=$scope.company;
                console.log($scope.company,$scope.company.cooperation_time);
                $scope.look_cooperation_time=$baseService.formDate($scope.company.cooperation_time)
            }else {
                swal(data.msg,"","error");
            }
        });
        // 头车数量
        $basic.get($host.api_url+"/user/"+userId+"/company/"+id+"/firstCount", {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
              $scope.firstCount=data.result[0].firstCount;
            }else {
                swal(data.msg,"","error");
            }
        });

        // 挂车数量
        $basic.get($host.api_url+"/user/"+userId+"/company/"+id+"/trailerCount", {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                $scope.trailerCount=data.result[0].firstCount;

            }else {
                swal(data.msg,"","error");
            }
        });

        // 司机数量
        $basic.get($host.api_url+"/user/"+userId+"/company/"+id+"/driveCount", {
        }).then(function(data){
            // $(".shadeDowWrap").hide();
            if(data.success==true){
                $scope.driveCount=data.result[0].driveCount;
            }else {
                swal(data.msg,"","error");
            }
        });


    };
    // 修改公司详情
    $scope.look_submitForm=function (id,isValid) {
        // console.log(companyMsg);
        $scope.look_submitted = true;
        if(isValid){
            var subParam = {
                "companyName": companyMsg.company_name,
                "operateType": companyMsg.operate_type,
                "cooperationTime":$scope.look_cooperation_time,
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
        }

    }
}]);
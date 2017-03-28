var loginController=angular.module("loginController",[]);
loginController.controller("loginController", ['$rootScope','$scope','$location','$q',"$basic","$host",

    function($rootScope,$scope,$location,$q,$basic,$host) {
        // if(sessionStorage.getItem("userId")){
        //     var userId=sessionStorage.getItem("userId");
        //     console.log(userId);
        //     $basic.get(DataUrl+"/admin/"+userId).then(function (data) {
        //         $scope.username=data.data.result[0].user_name;
        //     }).catch(function (error) {
        //         sweetAlert("系统异常", "", "error");
        //     });
        // }else {
        //     $scope.username='';
        // }
        // console.log(sessionStorage.getItem("userId"));
        $scope.username='';
        $scope.password='';
        $scope.login = function(){

           if($scope.username==''||$scope.username==''){

               swal("账号或密码不能为空", "", "error");
           } else {
               $(".shadeDowWrap").show();
               $basic.post($host.api_url+"/admin/do/login", {
                   "userName": $scope.username,
                   "password": $scope.password
               }).then(function(data){
                   $(".shadeDowWrap").hide();
                   if(data.success==true){
                       sessionStorage.setItem("auth-token",data.result.accessToken);
                       sessionStorage.setItem("userId",data.result.userId);
                       window.location.href="index.html";
                   }else {
                       swal(data.msg,"","error");
                   }


                   // $basic.setCookie("auth-token",data.data.result.accessToken);
                   // $basic.setCookie("userId",data.data.result.userId);

                   // sweetAlert({
                   //     title: "Are you sure?",
                   //     text: "You will not be able to recover this imaginary file!",
                   //     type: "warning",
                   //     showCancelButton: true,
                   //     confirmButtonColor: "#DD6B55",
                   //     confirmButtonText: "Yes, delete it!",
                   //     closeOnConfirm: false
                   // }, function(){
                   //     swal("Deleted!",
                   //         "Your imaginary file has been deleted.",
                   //         "success");
                   // });

               }).catch(function(error){
                   swal("登录异常", "", "error");
                    console.log(error)
               });
           }


            //swal('登录成功','欢迎您进入系统'+$scope.username,'success')

        };
        console.log('Login Controller Init !');
    }]);
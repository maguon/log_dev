/**
 * Created by ASUS on 2017/5/16.
 */
app.controller("user_info_controller",["$scope","_basic","_config","_host",function ($scope,_basic,_config,_host) {
    var userInfoItem=_config.userTypes;
    $scope.userInfoArray=[];
    function userInfo() {
        _basic.get(_host.api_url+"/user").then(function (data) {
            if(data.success==true){
                $scope.userInfoList=data.result;
                for(var i in userInfoItem){
                    $scope.userInfoArray.push({
                        user_type:userInfoItem[i].type,
                        type_name:userInfoItem[i].name,
                        userInfoListArray:[]
                    });
                }
                for(var k in $scope.userInfoArray){
                    for(var j in $scope.userInfoList){
                    if($scope.userInfoList[j].type==$scope.userInfoArray[k].user_type&&$scope.userInfoList[j].status==1){
                        $scope.userInfoArray[k].userInfoListArray.push({
                            real_name:$scope.userInfoList[j].real_name,
                            mobile:$scope.userInfoList[j].mobile,
                            gender:$scope.userInfoList[j].gender,
                        })
                    }
                }
            }
            }else {
                swal(data.msg,"","error")
            }
        });
    };
    userInfo();
}]);
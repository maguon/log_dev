/**
 * Created by ASUS on 2017/5/17.
 * 主菜单：修改VIN
 */
app.controller("setting_amend_vin_controller", ["$scope", "_basic", "_config", "_host", function ($scope, _basic, _config, _host) {
   /* var admin = _basic.getSession(_basic.USER_ID);*/
    var userId  = _basic.getSession(_basic.USER_ID);
    $scope.colorList = _config.config_color;// 颜色
    $scope.purchaseTypes = _config.purchaseTypes; //是否是金融車輛
    $scope.flag = true;

    //获取委托方信息
    _basic.get(_host.api_url + "/entrust").then(function (data) {
        if (data.success == true) {
            $scope.getEntrust = data.result;
            $('#getEntrustId').select2({
                placeholder: '委托方',
                containerCssClass: 'select2_dropdown'
            });
        }
    });

    /**
     * 根据画面输入的vin码进行查询车辆信息。
     *
     * @param $iValid 是否有效
     */

    //模糊查询
    var vinObjs ={}
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 10,
        onAutocomplete: function(val) {
        },
        minLength: 6,
    });
    $scope.shortSearch=function () {
        if($scope.demandVin!==""){
            if($scope.demandVin.length>=6){
                _basic.get(_host.api_url+"/user/"+userId+"/car?vinCode="+$scope.demandVin+'&active=1',{}).then(function (data) {
                    if(data.success==true&&data.result.length>0){
                        $scope.vinMsg=data.result;
                        vinObjs ={};
                        for(var i in $scope.vinMsg){
                            vinObjs[$scope.vinMsg[i].vin]=null;
                        }
                        return vinObjs;
                    }else{
                        return {};
                    }
                }).then(function(vinObjs){
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input').focus();

                })
            }else {
                $('#autocomplete-input').autocomplete({minLength:6});
                $scope.vinMsg={}
            }
        }
        else{
            swal('请输入VIN码','','error')
        }
    };
    // 查询vin码
    $scope.demandCar=function () {
        if($scope.demandVin!==undefined&&$scope.demandVin!=="") {
            _basic.get(_host.api_url +"/user/"+userId+"/car?vin="+ $scope.demandVin+'&active=1').then(function (data) {
                if (data.success = true) {
                    if (data.result.length == 0) {
                        $(".no_car_detail").show();
                        $(".car_detail").hide();
                    } else {
                        $(".no_car_detail").hide();
                        $(".car_detail").show();
                        $scope.car_details = data.result[0];
                        $scope.flag = false;
                        for (var i in _config.config_color) {
                            if (_config.config_color[i].colorId == $scope.car_details.colour) {
                                $scope.color = _config.config_color[i].colorName;
                            }
                        }
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
            swal('请输入VIN码','','error')
        }
    };


    // 车辆品牌查询
    function getMakeCarName(){
        _basic.get(_host.api_url + "/carMake").then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.makecarName = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }


    // 车辆型号联动查询
    $scope.changeMakeId = function (val) {
        if ( val&&val!==null) {
            _basic.get(_host.api_url + "/carMake/" + val + "/carModel").then(function (data) {
                if (data.success == true&&data.result.length>0) {
                    $scope.carModelName = data.result;
                } else {
                    swal(data.msg, "", "error")
                }
            })
        }
    };
    // 打开修改vin码
    $scope.openVinAmend = function () {
        $scope.flag = true;
        _basic.get(_host.api_url + "/user/" + userId + "/car?vin="+ $scope.demandVin + '&active=1').then(function (data) {
            if (data.success == true && data.result.length > 0) {
                $scope.self_car = data.result[0];
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id;
                $scope.changeMakeId($scope.look_make_id);
                if($scope.self_car.pro_date!==null){
                    $scope.look_create_time = moment($scope.self_car.pro_date).format('YYYY-MM-DD');
                }else {
                    $scope.look_create_time='';
                }
            }
        });
    };
    // 修改vin码
    $scope.updateAmendVin = function (id) {

        if($scope.self_car.vin==''||$scope.self_car.make_id==null||$scope.self_car.model_id==null||$scope.self_car.purchase_type==null||$scope.self_car.mso_status==null){
            $scope.flag==true;
            swal('请输入完整信息！','','error');
            return;
        }
        else{
            var obj = {
                "vin": $scope.self_car.vin,
                "makeId": $scope.self_car.make_id,
                "makeName": $("#look_makecarName").find("option:selected").text(),
                "modelId": $scope.self_car.model_id,
                "modelName": $("#look_model_name").find("option:selected").text(),
                "proDate": $scope.look_create_time,
                "colour": $scope.self_car.colour,
                "engineNum": $scope.self_car.engine_num,
                "entrustId":  $scope.self_car.entrust_id,
                "valuation":  $scope.self_car.valuation,
                "purchaseType":$scope.self_car.purchase_type,
                "msoStatus":  $scope.self_car.mso_status,
                "remark": $scope.self_car.remark
            };
            _basic.put(_host.api_url + "/user/" + userId + "/car/" + id, obj).then(function (data) {
                if (data.success == true) {
                    $scope.flag = false;
                    $scope.demandCar();
                    swal("修改成功", "", "success");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    }


    getMakeCarName();
}]);

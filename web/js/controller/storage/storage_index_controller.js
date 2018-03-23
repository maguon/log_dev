app.controller("storage_index_controller", ['$rootScope', '$scope', "_host", '$location', '$q', "_basic",
    function ($rootScope, $scope, _host, $location, $q, _basic) {
        var date = new Date();
        var nowDate = moment(date).format('YYYYMMDD');
        $scope.storageAllStorage = 0;
        _basic.get(_host.api_url + "/storageCount?dateStart=" + nowDate + "&dateEnd=" + nowDate).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageIndexCount = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get(_host.api_url + "/storageDate?dateStart=" + nowDate + "&dateEnd=" + nowDate).then(function (data) {
            if (data.success == true) {
                $scope.storageIndexList = data.result;
                for (var i in $scope.storageIndexList) {
                    $scope.storageAllStorage = $scope.storageAllStorage + $scope.storageIndexList[i].col * $scope.storageIndexList[i].row
                }
                return $scope.storageAllStorage;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }]);
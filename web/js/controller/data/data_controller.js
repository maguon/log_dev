
app.controller("data_controller", ['$rootScope', '$scope', '$location', '$q', '_basic', "_host",
    function ($rootScope, $scope, $location, $q, _basic, _host) {
        $scope.selectArray = [];
        $scope.csvFile = null;
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        $scope.upload = function (dom, val) {
        };
        // $scope.update = function () {
        //     _basic.setCookie('url', "jiangsen");
        // };
        // $scope.update();
        $scope.tableHeader = [];
        $scope.fileType = "";
        // 表头原始数据
        $scope.tableHeadeArray = [];
        // 主体原始数据
        var tableContentFilter = [];
        // 过滤条件数据
        var colObjs = [{name: 'name', type: 'number', length: 10}, {
            name: 'age',
            type: 'string',
            length: 2
        }, {name: 'age', type: 'string', length: 2}, {name: 'age', type: 'string', length: 2}, {
            name: 'age',
            type: 'string',
            length: 2
        }, {name: 'age', type: 'string', length: 2}, {name: 'age', type: 'string', length: 2}, {
            name: 'age',
            type: 'string',
            length: 2
        }, {name: 'age', type: 'string', length: 2}];
        // 头部条件判断
        $scope.titleFilter = function (headerArray) {
            if (colObjs.length != headerArray.length) {
                return false;
            } else {
                for (var i in headerArray) {
                    if (colObjs[i].name != headerArray[i]) {
                        console.log(headerArray[i]);
                        return false
                    }
                }
            }

        };
        // 主体条件判断
        $scope.contentFilter = function (contentArray) {
            for (var i = 0; i < contentArray.length; i++) {
                for (var j = 0; j < contentArray[i].length; j++) {
                    if (colObjs[j].type != typeof contentArray[i][j] || colObjs[j].length != contentArray[j].length) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        tableContentFilter.push(contentArray[i])
                        swal("错误条数" + tableContentFilter.length)
                    } else {
                        $scope.rightNumber = $scope.rightNumber + 1;
                    }
                    break;
                }
            }
        };
        // 取得仓库列表
        _basic.get(_host.api_url + "/storage").then(function (data) {
            if (data.success = true) {
                $scope.selectArray = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 选择文件变更时触发
        $scope.fileChange = function (file) {
            $(file).parse({
                config: {
                    complete: function (result) {
                        console.log(result);
                        $scope.$apply(function () {
                            if ($scope.fileType != "application/vnd.ms-excel") {
                                swal("文件类型错误");
                            } else {
                                $scope.tableHeadeArray = result.data[0];
                                // 表头校验
                                //  if($scope.titleFilter($scope.tableHeadeArray)){
                                // 主体内容校验
                                $scope.contentFilter(result.data.slice(1, result.data.length));
                                $scope.tableHeader = result.data[0];
                                $scope.tableContent = tableContentFilter;
                            }
                        });
                    }
                },
                before: function (file, inputElem) {
                    $scope.fileType = file.type;
                },
                error: function (err, file, inputElem, reason) {
                },
                complete: function (val) {
                }
            })
        }
    }])
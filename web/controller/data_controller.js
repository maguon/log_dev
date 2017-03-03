app.controller("dataController", ['$rootScope','$scope','$location','$q','$basic',

    function($rootScope,$scope,$location,$q,$basic ) {
        $scope.csvFile = null;
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        $scope.upload = function(dom,val){
            console.log($scope.csvFile);
        }
        $scope.update = function(){
            $basic.setCookie('url',"jiangsen")
        }
        $scope.update();
        $scope.tableHeader =[]

        $scope.fileChange = function(file){
            console.log(file);
            $(file).parse({
                config: {
                    complete: function(result){
                        console.log(result);
                        $scope.$apply(function () {
                            $scope.tableHeader = result.data[0];
                            $scope.tableContent = result.data.slice(1,result.data.length);
                            $scope.rightNumber = result.data.length-1;
                            $scope.errorNumber = result.errors.length;
                        });


                    }
                },
                before: function(file, inputElem)
                {
                    // executed before parsing each file begins;
                    // what you return here controls the flow
                },
                error: function(err, file, inputElem, reason)
                {
                   console.log(err)
                },
                complete: function(val)
                {
                    console.log(val)
                }
            })
        }
        console.log('Data Controller Init !')
    }])
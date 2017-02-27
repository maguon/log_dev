app.controller("settingController", ['$rootScope','$scope','$location','$q',

    function($rootScope,$scope,$location,$q ) {

        $scope.birth = '2010/12/22';
        $scope.phone  = '13322221111';
        $scope.email='info@myxxjs.com';
        $scope.gender = 1;
        $scope.updateUser = function(){
            swal('更新成功','你的生日是'+$scope.birth,'success')
        }
        $('.datepicker').pickadate({
            format:'yyyy/mm/dd',
            onSet: function () {
                $('.picker__close').click();
            },
            onStart:function(){
                this.set( 'select', Date.parse( $scope.birth));
            },
            onClose:function(){
                $scope.birth = this.get();
            },
            selectMonths: false, // Creates a dropdown to control month
            selectYears: 0 // Creates a dropdown of 15 years to control year
        });
        console.log('Setting Controller Init !')
    }])
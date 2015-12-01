'use strict';

angular.module('myApp.error')

.controller('ErrorCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
    $scope.showLeftMenu = false;
    $scope.pageName = '';
    
    var updatePage = function(){
        $http.get('/user/' + $rootScope.id).then(
            function(res) {
                $rootScope.account = res.data.account;
            },
            function(err) {
                ngNotify.set(err.data);
                $state.go('start');
            }
        );
    };
    
    updatePage();
}]);
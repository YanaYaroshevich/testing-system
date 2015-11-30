'use strict';

angular.module('myApp.header')

.controller('HeaderCtrl', ['$scope', '$rootScope','ngNotify', '$http', '$state', 'authService', function($scope, $rootScope, ngNotify, $http, $state, authService) {
    $scope.isCollapsed = true;
    
    $scope.auth = authService;
    
    $scope.collapse = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
    }
    
    $scope.getNewTestPageStyle = function () {
        if (authService.isNewTestPage()){
            return "background-color: #529085 !important; color: white";            
        }
    };
    
    $scope.logout = function(){
        $http.post('/logout', {id: $rootScope.id}).then(function(res){
            if(typeof(Storage) == "undefined") {
                ngNotify.set('localStorage is not accessible');
            }
            else {
                localStorage.removeItem('id');
                delete $rootScope.id;
            }
            $state.go('start');
        }, function(err){
            ngNotify.set(err.data);
        });
    };
}]);
'use strict';

angular.module('myApp.header')

.controller('HeaderCtrl', ['$scope', '$rootScope','ngNotify', '$http', '$state', 'authService', 'screenSize', function($scope, $rootScope, ngNotify, $http, $state, authService, screenSize) {
    $scope.isCollapsed = true;
    
    $scope.auth = authService;
    
    $scope.collapse = function() {
        if (screenSize.is('xs')) {
            $scope.isCollapsed = !$scope.isCollapsed;
        }
    }

    $scope.logout = function(){
        $http.post('/logout', {id: $rootScope.id}).then(function(res){
            if(typeof(Storage) == 'undefined') {
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
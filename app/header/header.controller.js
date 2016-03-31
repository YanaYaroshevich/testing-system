'use strict';

angular.module('myApp.header')

.controller('HeaderCtrl', ['$scope', '$rootScope','ngNotify', '$http', '$state', 'authService', function($scope, $rootScope, ngNotify, $http, $state, authService) {
    $scope.isCollapsed = true;
    $scope.auth = authService;
    
    $scope.collapse = function() {
        if (window.matchMedia('(max-width: 768px)').matches) {
            $scope.isCollapsed = !$scope.isCollapsed;
        }
    };
    
    $scope.showLeftMenu = function(){
        return !(authService.isStartPage() || authService.isTestPassPage() || authService.isErrorPage());
    };

    $scope.logout = function(){
        $http.post('/rest/logout', {id: $rootScope.id}).then(function(res){
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
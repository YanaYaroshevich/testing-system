'use strict';

angular.module('myApp.header')

.controller('HeaderCtrl', ['$scope', '$rootScope','ngNotify', '$http', '$state', 'authService', 'logoutService', function($scope, $rootScope, ngNotify, $http, $state, authService, logoutService) {
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
        logoutService.logout().then(function(res){
            if (res.wrongLogout){
                ngNotify.set(res.msg);
            }
        });
    };
}]);
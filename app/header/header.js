'use strict';

angular.module('myApp.header', [])
.controller('HeaderCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
    $scope.isCollapsed = true;
    
    function isStartPage(){
        return ($location.path() === '/start');
    }
    
    function isMainPage(){
        return ($location.path() === '/main');
    }
    
    function isNewTestPage(){
        return ($location.path() === '/test/new');
    }
    
    $scope.getUserName = function(){
       return !isStartPage() ? $rootScope.account.firstName + ' ' + $rootScope.account.lastName : '';
    }
    
    $scope.getRole = function(){
        return !isStartPage() ? $rootScope.account.role : -1;
    }
}]);
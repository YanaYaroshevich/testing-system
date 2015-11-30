'use strict';

angular.module('myApp.header')

.controller('HeaderCtrl', ['$scope', '$rootScope','ngNotify', '$http', '$state', 'authService', function($scope, $rootScope, ngNotify, $http, $state, authService) {
    $scope.isCollapsed = true;
    
    /*function isStartPage(){
        return ($state.is('start'));
    }
    
    function isMainPage(){
        return ($state.is('main'));
    }
    
    function isNewTestPage(){
        return ($state.is('newTest'));
    }*/
    
    /*$scope.getUserName = function(){
       return !isStartPage() ? $rootScope.account.firstName + ' ' + $rootScope.account.lastName : '';
    }
    
    $scope.getRole = function(){
        return !isStartPage() ? $rootScope.account.role : -1;
    }*/
    
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
'use strict';

angular.module('myApp.header', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main-page/main-page.html',
    controller: 'MainPageCtrl'
    
  }).
  when('/start', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}])
.controller('HeaderCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
    $scope.isCollapsed = true;
    
    function isStartPage(){
        return ($location.path() === '/start');
    }
    
    $scope.getUserName = function(){
       return !isStartPage() ? $rootScope.account.firstName + ' ' + $rootScope.account.lastName : '';
    }
    
    $scope.getRole = function(){
        return !isStartPage() ? $rootScope.account.role : -1;
    } 
}]);
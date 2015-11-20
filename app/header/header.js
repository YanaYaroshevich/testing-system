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
    
    $scope.getUserName = function(){
       return ($location.path() !== '/start') ? $rootScope.account.firstName + ' ' + $rootScope.account.lastName : '';
    }
    
}]);


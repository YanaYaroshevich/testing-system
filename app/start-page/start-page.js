'use strict';

angular.module('myApp.startPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/start', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}])

.controller('StartPageCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.path = '#/start';
    $rootScope.showLeftMenu = false;
    $rootScope.pageName = "";
}]);
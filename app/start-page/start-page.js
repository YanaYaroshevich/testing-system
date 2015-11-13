'use strict';

angular.module('myApp.startPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/start-page', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}])

.controller('StartPageCtrl', ['$scope', function($scope) {
  
}]);
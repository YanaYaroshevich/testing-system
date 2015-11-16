'use strict';

angular.module('myApp.startPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/start', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}])

.controller('StartPageCtrl', ['$scope', function($scope) {
}]);
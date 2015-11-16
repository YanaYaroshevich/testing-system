'use strict';

angular.module('myApp.mainPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main-page/main-page.html',
    controller: 'MainPageCtrl'
  });
}])

.controller('MainPageCtrl', ['$scope', function($scope) {
}]);
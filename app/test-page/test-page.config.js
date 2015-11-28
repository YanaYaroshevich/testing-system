'use strict';

angular.module('myApp.testPage')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test/:testId', {
    templateUrl: 'test-page/test-page.html',
    controller: 'TestPageCtrl'
  });
}]);
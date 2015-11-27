'use strict';

angular.module('myApp.newTest')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test/new', {
    templateUrl: 'new-test/new-test.html',
    controller: 'NewTestCtrl'
  });
}]);
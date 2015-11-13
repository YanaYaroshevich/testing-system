'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.startPage'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/start-page'});
}]);
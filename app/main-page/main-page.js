'use strict';

angular.module('myApp.mainPage', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main-page/main-page.html',
    controller: 'MainPageCtrl'
  });
}])

.controller('MainPageCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.path = '/main';
    $rootScope.showLeftMenu = true;
    $rootScope.pageName = "Main page";
}]);
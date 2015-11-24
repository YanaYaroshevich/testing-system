'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.startPage',
    'myApp.mainPage',
    'myApp.header',
    'myApp.newTest',
    'ui.bootstrap',
    'ngNotify',
    'ngCookies',
    'news',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns'
]).
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
   $routeProvider.otherwise({redirectTo: '/start'});
   $locationProvider.html5Mode(true);
}]).
run(function ($rootScope, $location, $cookies, $http) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      if (!$cookies.getObject('user') && !$rootScope.account) {
        if (next.templateUrl !== "start-page/start-page.html") {
          $location.path("/start");
        }
      }
      else if (!$rootScope.account){
          $rootScope.account = $cookies.get('user'); 
      }
    });
}).
controller('MainCtrl', ['$scope', 'ngNotify', function ($scope, ngNotify) {
     ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    try {
    }
    catch (e) {
        ngNotify.set(e);
    }
}]);
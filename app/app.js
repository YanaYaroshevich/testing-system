'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.startPage',
  'myApp.mainPage',
  'myApp.header',    
  'ui.bootstrap',
  'ngNotify'   
]).
config(['$routeProvider', function($routeProvider) { 
  $routeProvider.otherwise({redirectTo: '/start'});
}]).
controller('MainCtrl', ['$scope', '$location', 'ngNotify', function($scope, $location, ngNotify) {
     ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    //window.scope = $scope;
    try{
       
    }
    
   catch(e){
       ngNotify.set(e);
   }
}]);
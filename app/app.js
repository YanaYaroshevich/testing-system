'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.startPage',
  'myApp.mainPage',
  'myApp.header',    
  'ui.bootstrap',
  'ngNotify'   
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) { 
  $routeProvider.otherwise({redirectTo: '/start'});
  $locationProvider.html5Mode(true);    
}]).
run( function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( $rootScope.account == null ) {
        if ( next.templateUrl == "start-page/start-page.html" ) {
        } else {
          $location.path( "/start" );
        }
      }         
    });
}).
controller('MainCtrl', ['$scope', 'ngNotify', function($scope, ngNotify) {
     ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    try{
       
    }
    
   catch(e){
       ngNotify.set(e);
   }
}]);
'use strict';

angular.module('myApp', [
    'myApp.startPage',
    'myApp.mainPage',
    'myApp.header',
    'myApp.newTest',
    'myApp.testPage',
    'ui.bootstrap',
    'ngNotify',
    'ngCookies',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ui.router'
])

.run(['$state', '$rootScope', '$cookies', '$http', function ($state, $rootScope, $cookies, $http) {
    $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
        if(typeof(Storage) == "undefined") {
            ngNotify.set('localStorage is not accessible');
        }
                    
        else {
            if (!localStorage.getItem('id') && !$rootScope.id) {
                if (toState.name !== "start") {
                    e.preventDefault();
                    $state.go("start");
                }
            }
            else if (!$rootScope.id){
                $rootScope.id = localStorage.getItem('id');
            }
        }
    });
}])

.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) { 
    $urlRouterProvider.otherwise("/start");
    $stateProvider
        .state('start', {
            url: "/start",
            templateUrl: "start-page/start-page.html",
            controller: "StartPageCtrl"
        })
        .state('main', {
            url: "/main",
            templateUrl: "main-page/main-page.html",
            controller: "MainPageCtrl"
        })
        .state('newTest', {
            url: "/new/test",
            templateUrl: 'new-test/new-test.html',
            controller: 'NewTestCtrl'
        })
        .state('test', {
            url: '/test/:testId',
            templateUrl: 'test-page/test-page.html',
            controller: 'TestPageCtrl'
            /* resolve : {
            	test: ['$stateParams', 'test', function($stateParams, test) {
            		console.log(test);
                    console.log($stateParams);
            	}]
            }*/
        });
    
    $locationProvider.html5Mode(true);
}])
    
.controller('MainCtrl', ['$scope', 'ngNotify', '$rootScope', function ($scope, ngNotify, $rootScope) {
     ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    try {  
        $rootScope.account = {};
    }
    catch (e) {
        ngNotify.set(e);
    }
}]);
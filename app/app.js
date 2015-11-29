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
    'ui.router',
    'auth'
])

.run(['$state', '$rootScope', '$cookies', '$http', 'authService', '$q', function ($state, $rootScope, $cookies, $http, authService, $q) {
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
            
            $q.when(authService.setAccount($rootScope.id)).then(function(){
                if (!authService.isAuthorised(toState.name)){
                    $state.go('start');
                    localStorage.removeItem('id');
                }
            });
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
            controller: 'TestPageCtrl',
            resolve : {
                testToShow: ['$http', '$stateParams', function($http, $stateParams){
                    return $http.get('/test/page/' + $stateParams.testId).then(function(res){
                        return res.data.test;
                    }, function(err){
                        ngNotify.set(err.data);
                    });
                }]
            }
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
'use strict';

angular.module('myApp')

.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider){ 
    $stateProvider
    .state('start', {
        url: '/start',
        templateUrl: 'start-page/start-page.html',
        controller: 'StartPageCtrl'
    })
    .state('main', {
        url: '/main',
        templateUrl: 'main-page/main-page.html',
        controller: 'MainPageCtrl'
    })
    .state('newTest', {
        url: '/test/new',
        templateUrl: 'new-test/new-test.html',
        controller: 'NewTestCtrl'
    })
    .state('statistics', {
        url: '/statistics',
        templateUrl: 'statistics/statistics.html',
        controller: 'StatisticsPageCtrl' 
    })
    .state('test', {
        url: '/test/:testId',
        templateUrl: 'test-page/test-page.html',
        controller: 'TestPageCtrl',
        resolve : {
            testToShow: ['$http', '$stateParams', function($http, $stateParams){
                return $http.get('/rest/test/' + $stateParams.testId).then(function(res){
                    return res.data.test;
                }, function(err){
                    ngNotify.set(err.data);
                    return '';
                });
            }]
        }
    })
    .state('testEdit', {
        url: '/test/:testId/edit',
        templateUrl: 'new-test/new-test.html',
        controller: 'TestEditPageCtrl',
        resolve : {
            testToShow: ['$http', '$stateParams', function($http, $stateParams){
                return $http.get('/rest/test/' + $stateParams.testId).then(function(res){
                    return res.data.test;
                }, function(err){
                    ngNotify.set(err.data);
                    return '';
                });
            }]
        }
    })
    .state('myTests', {
        url: '/tests',
        templateUrl: 'my-tests/my-tests.html',
        controller: 'MyTestsPageCtrl',
        resolve: {
            myTests: ['$http', '$stateParams', 'authService', function($http, $stateParams, authService) {
                return $http.get('/rest/tests/' + authService.getId()).then(function(res){
                    return res.data.tests;
                }, function(err) {
                    ngNotify.set(err.data);
                    return '';
                });
            }]    
        }
    })
    .state('testPass', {
        url: '/test/:testId/pass',
        templateUrl: 'test-pass/test-pass.html',
        controller: 'TestPassPageCtrl',
        resolve: {
            test: ['$http', '$stateParams', 'authService', function($http, $stateParams, authService){
                return $http.get('/rest/test/' + $stateParams.testId + '/stud/' + authService.getId()).then(function(res){
                    return res.data.test;
                }, function(err){
                    ngNotify.set(err.data);
                    return '';
                });
            }]
        }
    })
    .state('error', {
        url: '/error',
        templateUrl: 'errors/error.html',
        controller: 'ErrorCtrl',
    });

    $urlRouterProvider.when('/start/', '/start');
    $urlRouterProvider.when('/main/', '/main');
    $urlRouterProvider.when('/test/new/', '/test/new');
    $urlRouterProvider.when('/statistics/', '/statistics');
    $urlRouterProvider.when('/test/:testId/', '/test/:testId');
    $urlRouterProvider.when('/test/edit/:testId/', '/test/edit/:testId');
    $urlRouterProvider.when('/tests/:userId/', '/tests/:userId');
    $urlRouterProvider.when('/test/pass/:testId/stud/:studId/', '/test/pass/:testId/stud/:studId');
    $urlRouterProvider.when('/', '/start');
    
    $urlRouterProvider.otherwise('/error');
    $locationProvider.html5Mode(true);
}]);
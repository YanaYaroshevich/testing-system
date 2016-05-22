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
    .state('newUser', {
        url: '/user/new',
        templateUrl: 'new-user/new-user.html',
        controller: 'NewUserCtrl'
    })
    .state('newProblem', {
        url: '/problem/new',
        templateUrl: 'new-problem/new-problem.html',
        controller: 'NewProblemCtrl'
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
            testToShow: ['$http', '$stateParams', '$rootScope', 'authService', function($http, $stateParams, $rootScope, authService){
                return $http.get('/rest/test/' + $stateParams.testId + '/user/' + $rootScope.id).then(function(res){
                    if (res && (new Date(res.data.test.start) <= new Date() && new Date(res.data.test.finish) >= new Date() || authService.isTeacher())) {
                        return res.data.test; 
                    }
                    else 
                    {
                        return false;
                    }
                }, function(err){
                    ngNotify.set(err.data);
                    return '';
                });
            }]
        }
    })
    .state('problem', {
        url: '/problem/:problemId',
        templateUrl: 'problem-page/problem-page.html',
        controller: 'ProblemPageCtrl',
        resolve: {
            problemToShow: ['$http', '$stateParams', '$rootScope', 'authService', function($http, $stateParams, $rootScope, authService){
                return $http.get('/rest/problem/' + $stateParams.problemId + '/user/' + $rootScope.id).then(function(res){
                    if (res && (new Date(res.data.problem.start) <= new Date() && new Date(res.data.problem.finish) >= new Date() || authService.isTeacher())) {
                        return res.data.problem;
                    }
                    else
                    {
                        return false;
                    }
                }, function(err){
                    ngNotify.set(err.data);
                    return '';
                });
            }]
        }
    })
    .state('userPage', {
        url: '/user/:userId',
        templateUrl: 'user-page/user-page.html',
        controller: 'UserPageCtrl',
        resolve: {
            userToShow: ['$http', '$stateParams', function($http, $stateParams){
                return $http.get('/rest/user/' + $stateParams.userId).then(
                    function(res){
                        if (res) {
                            return res.data.account;    
                        }
                        else {
                            return false;
                        }
                    },
                    function(err){
                        ngNotify.set(err.data);
                        return '';
                    }
                );
            }],
            testsToShow: ['$http', '$stateParams', function($http, $stateParams) {
                return $http.get('/rest/tests/' + $stateParams.userId).then(function(res){
                    if (res) {
                        return res.data.tests;    
                    }
                    else {
                        return false;
                    }
                }, function(err) {
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
            testToShow: ['$http', '$stateParams', '$rootScope', function($http, $stateParams, $rootScope){
                return $http.get('/rest/test/' + $stateParams.testId + '/user/' + $rootScope.id).then(function(res){
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
            myTests: ['$http', '$rootScope', function($http, $rootScope) {
                return $http.get('/rest/tests/' + $rootScope.id).then(function(res){
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
            test: ['$http', '$stateParams', '$rootScope', function($http, $stateParams, $rootScope){
                return $http.get('/rest/test/' + $stateParams.testId + '/stud/' + $rootScope.id).then(function(res){
                    if (res && new Date(res.data.test.start) <= new Date() && new Date(res.data.test.finish) >= new Date()) {
                        return res.data.test;    
                    }
                    else {
                        return false;
                    }
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
    $urlRouterProvider.when('/user/:userId/', '/user/:userId');
    $urlRouterProvider.when('/', '/start');
    
    $urlRouterProvider.otherwise('/error');
    $locationProvider.html5Mode(true);
}]);
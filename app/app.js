'use strict';

angular.module('myApp', [
    'myApp.startPage',
    'myApp.mainPage',
    'myApp.header',
    'myApp.newTest',
    'myApp.testPage',
    'myApp.testEditPage',
    'myApp.myTestsPage',
    'myApp.statistics',
    'myApp.testPassPage',
    'myApp.userPage',
    'myApp.error',
    'myApp.newUser',
    'myApp.newProblem',
    'ui.bootstrap',
    'ngAnimate',
    'ngNotify',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ui.router',
    'auth',
    'login',
    'students',
    'test',
    'columns',
    'pretty-checkable',
    'angularFileUpload',
    'ezplus'
])

.run(['$state', '$rootScope', '$http', 'authService', '$q', function ($state, $rootScope, $http, authService, $q) {
    $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {  
        if(typeof(Storage) == "undefined") {
            ngNotify.set('localStorage is not accessible');
        }         
        else {
            if (!localStorage.getItem('id') && !$rootScope.id) {
                if (toState.name !== "start" && toState.name !== 'error') {
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
}]);
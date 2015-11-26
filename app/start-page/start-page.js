'use strict';

angular.module('myApp.startPage', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/start', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}]) 

.controller('StartPageCtrl', ['$scope', '$rootScope', '$http', '$location', '$cookies', 'ngNotify', function($scope, $rootScope, $http, $location, $cookies, ngNotify) {
    $rootScope.path = '/start';
    $rootScope.showLeftMenu = false;
    $scope.pageName = "";
    
    $scope.rememberMe = false;
    $scope.wrongInput = false;
    
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    $scope.login = function(){
        var form = {};
        form.password = $scope.curPassword;
        form.email = $scope.curEmail;
        $http.post('/start', form).then(function(res){
            if(res.data.noErrors){
                $scope.wrongInput = false;
                $rootScope.account = res.data.account;
                if ($scope.rememberMe){
                    $cookies.putObject('user', res.data.account);
                }    
                else {
                    $cookies.remove('user');
                }
                $location.path( "/main" );
            }
            else {
                $scope.wrongInput = true;
            }
        }, function(err){
            $scope.wrongInput = true;
            ngNotify.set(err.data);
        });
    };
}]);
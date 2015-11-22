'use strict';

angular.module('myApp.startPage', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/start', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}]) 

.controller('StartPageCtrl', ['$scope', '$rootScope', '$http', '$location', '$cookies', function($scope, $rootScope, $http, $location, $cookies) {
    $rootScope.path = '/start';
    $rootScope.showLeftMenu = false;
    $rootScope.pageName = "";
    
    $scope.rememberMe = false;
    $scope.wrongInput = false;
    
    $scope.login = function(){
        var form = {};
        form.password = $scope.curPassword;
        form.email = $scope.curEmail;
        $http.post('/start', form).then(function(res){
            if(res.data.noErrors){
                $scope.wrongInput = false;
                $rootScope.account = res.data.account;
                if ($scope.rememberMe)
                    $cookies.putObject('user', res.data.account);
                    
                else 
                    $cookies.remove('user');
                $location.path( "/main" );
            }
            else {
                $scope.wrongInput = true;
            }
        }, function(err){
            console.log(err);
        });
    };
}]);
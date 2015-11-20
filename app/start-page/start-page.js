'use strict';

angular.module('myApp.startPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/start', {
    templateUrl: 'start-page/start-page.html',
    controller: 'StartPageCtrl'
  });
}]) 

.controller('StartPageCtrl', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
    $rootScope.path = '/start';
    $rootScope.showLeftMenu = false;
    $rootScope.pageName = "";
    
    $scope.wrongInput = false;
    
    $scope.login = function(){
        var form = {};
        form.password = $scope.curPassword;
        form.email = $scope.curEmail;
        $http.post('/start', form).then(function(res){
            if(res.data.noErrors){
                $scope.wrongInput = false;
                $rootScope.account = res.data.account;
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
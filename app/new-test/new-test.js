'use strict';

angular.module('myApp.newTest', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test/new', {
    templateUrl: 'new-test/new-test.html',
    controller: 'NewTestCtrl'
  });
}])

.controller('NewTestCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', function($scope, $rootScope, $http, ngNotify) {
    $rootScope.path = '/main';
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Test creation";
    
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];
    $scope.typeInd = 0;
    
    $scope.chooseType = function(ind){
        $scope.typeInd = ind;
    }
}]);
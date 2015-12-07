'use strict';

angular.module('myApp.testPage')

.controller('TestPassPageCtrl', ['$scope', '$rootScope', 'test', function($scope, $rootScope, test){
    console.log(test);
    $rootScope.showLeftMenu = false;
    $scope.testName = test.name;
    
    $scope.questions = test.questions;
    
    
    
    $scope.currentPage = 1;
    $scope.totalItems = $scope.questions.length;
    $scope.itemsPerPage = 1;
    $scope.maxSize = 3;
    
    $scope.pageChanged = function() {
        
    };
}]);
'use strict';

angular.module('myApp.myTestsPage')

.controller('MyTestsPageCtrl', ['$scope', 'myTests', '$rootScope', 'colService', function($scope, myTests, $rootScope, colService){
    $scope.pageName = 'My tests';
    $rootScope.showLeftMenu = true;
    
    $scope.gridTests = {
        enableFiltering: true,
    };
    
    $scope.gridTests.data = myTests.map(function(test){
        return {
            num: myTests.indexOf(test) + 1,
            testName: test.name,
            description: test.description,
            testId: test._id
        };
    });
    
    $scope.gridTests.columnDefs = colService.myTests();
}]);
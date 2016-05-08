'use strict';

angular.module('myApp.myTestsPage')

.controller('MyTestsPageCtrl', ['$scope', 'myTests', '$rootScope', 'colService', 'authService', function($scope, myTests, $rootScope, colService, authService){
    $scope.pageName = 'My tests';
    
    console.log(myTests);
    
    $scope.gridTests = {
        enableFiltering: true,
    };
    
    var testsToShow = [];
    
    
    if (authService.isTeacher()) {
        testsToShow = testsToShow.concat(myTests);
    }
    
    else {
        for (var i = 0; i < myTests.length; i++) {
            if (new Date(myTests[i].start) <= new Date() && new Date(myTests[i].finish) >= new Date()) {
                testsToShow.push(myTests[i]);
            }
        }
    }
    
    $scope.gridTests.data = testsToShow.map(function(test){
        return {
            num: testsToShow.indexOf(test) + 1,
            testName: test.name,
            description: test.description,
            testId: test._id
        };
    });
    
    $scope.gridTests.columnDefs = colService.myTests();
}]);
'use strict';

angular.module('myApp.userPage')

.controller('UserPageCtrl', ['userToShow', 'testsToShow', '$scope', '$rootScope', 'ngNotify', 'colService', function(userToShow, testsToShow, $scope, $rootScope, ngNotify, colService){
    $scope.pageName = userToShow.firstName + ' ' + userToShow.lastName;
    
    $scope.gridTests = {
        enableFiltering: true,
    };
    
    switch (userToShow.role) {
        case 0:
            $scope.role = 'Administrator';
            break;
        case 1:
            $scope.role = 'Student';
            break;
        case 2:
            $scope.role = 'Teacher';
            break;
    }
    
    $scope.userIsStudent = (userToShow.role === 1);
    $scope.email = userToShow.email;
    $scope.courseAndGroup = 'Course ' + userToShow.course + ', group ' + userToShow.group;
    
    if (userToShow.role === 1) {
        $scope.gridTests.data = testsToShow.map(function(cur) {
            return {
                testName: cur.name,
                id: cur.gradeInfo.testId,
                assigned: cur.gradeInfo.assigned,
                passed: cur.gradeInfo.passed,
                dateOfPass: (new Date(cur.gradeInfo.dateOfPass)).toLocaleDateString(),
                grade: cur.gradeInfo.grade
            };
        });
     
        $scope.gridTests.columnDefs = colService.studUserTests();
    } 
    else if (userToShow.role === 2) {
        $scope.gridTests.data = testsToShow.map(function(cur) {
            return {
                testName: cur.name,
                id: cur._id,
                startDate: cur.start,
                endDate: cur.finish
            };
        });
        
        $scope.gridTests.columnDefs = colService.teachUserTests();
    }
    
}]);
'use strict';

angular.module('myApp.testPage')
    
.controller('TestPageCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', 'uiGridConstants', 'testToShow', function($scope, $rootScope, $http, ngNotify, uiGridConstants, testToShow) {
    
    $scope.test = testToShow;
    $scope.test.from = (new Date($scope.test.start)).toLocaleTimeString() + ' ' + (new Date($scope.test.start)).toLocaleDateString();
    $scope.test.to = (new Date($scope.test.finish)).toLocaleTimeString() + ' ' + (new Date($scope.test.finish)).toLocaleDateString();;
    
    $scope.gridStudents = {
        enableFiltering: true
    };
    
    $scope.gridStudents.data = testToShow.students.map(function(stud){
        return {
            firstName: stud.firstName,
            lastName: stud.lastName,
            email: stud.email,
            course: stud.course,
            group: stud.group,
            assigned: stud.assigned,
            passed: stud.passed
        };
    });
    
    $scope.gridStudents.columnDefs = [
        { name: 'firstName', headerCellClass: 'header-filtered', width: '120' },
        { name: 'lastName', headerCellClass: 'header-filtered', width: '120' },
        { name: 'email', headerCellClass: 'header-filtered', width: '150' },
        { name: 'course', headerCellClass: 'header-filtered', width: '80' },
        { name: 'group', headerCellClass: 'header-filtered', width: '80' },
        { name: 'assigned', cellTemplate: '<div class="ngCellText" style="color: green; text-align: center" ng-if="row.entity.assigned"><i class="fa fa-check"></i></div><div class="ngCellText" style="color: red; text-align: center" ng-if="!row.entity.assigned"><i class="fa fa-times"></i></div>', width: '100', enableFiltering: false},
        { name: 'passed', cellTemplate: '<div class="ngCellText" style="color: green; text-align: center" ng-if="row.entity.passed"><i class="fa fa-check"></i></div><div class="ngCellText" style="color: red; text-align: center" ng-if="!row.entity.passed"><i class="fa fa-times"></i></div>', width: '100', enableFiltering: false}
    ];
    
    $scope.gridQuestions = {
        enableFiltering: true
    };
    
    $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];
    
    $scope.gridQuestions.data = testToShow.questions.map(function(quest){
        var toReturn = {};
        toReturn.rightAnswers = '';
        if (quest.type === 0) {
            for (var i = 0; i < quest.answers.length; i++) {
                if (quest.answers[i].right){
                    toReturn.rightAnswers += quest.answers[i].text + '; ';
                }
            }
            toReturn.text = quest.text;
        }
        else if (quest.type === 2) {
            toReturn.rightAnswers = quest.text.substring(quest.text.indexOf('###'), quest.text.lastIndexOf('###'));
            toReturn.text = quest.text.replace(toReturn.rightAnswers, '???').replace('###', '');
        }
        toReturn.type = $scope.toShowTypes[quest.type];
        toReturn.cost = quest.cost;
        return toReturn;
    });
    
    $scope.gridQuestions.columnDefs = [
        { name: 'text', headerCellClass: 'header-filtered', width: '150' },
        { name: 'cost', headerCellClass: 'header-filtered', width: '80' },
        { name: 'type', headerCellClass: 'header-filtered', width: '150' },
        { name: 'rightAnswers', enableFiltering: false,  width: '150' }
    ];
    
    console.log($scope.test);
    
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Test " + testToShow.name;
    
    var updatePage = function(){
        $http.get('/user/' + $rootScope.id).then(
            function(res) {
                $rootScope.account = res.data.account;
            },
            function(err) {
                ngNotify.set(err.data);
                $state.go('start');
            }
        );
    };
    
    updatePage();
}]);
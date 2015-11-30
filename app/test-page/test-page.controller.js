'use strict';

angular.module('myApp.testPage')
    
.controller('TestPageCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', 'uiGridConstants', 'testToShow', 'authService', '$state', function($scope, $rootScope, $http, ngNotify, uiGridConstants, testToShow, authService, $state) {
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Test " + testToShow.name;
    
    console.log(testToShow);
    
    $scope.test = testToShow;
    $scope.auth = authService;
    
    /*------------------------- Dates --------------------------------------*/
    
    function getPrettyDate(date) {
        return  (new Date(date)).toLocaleTimeString() + ' ' + (new Date(date)).toLocaleDateString();
    }
    
    $scope.test.from = getPrettyDate($scope.test.start);
    $scope.test.to = getPrettyDate($scope.test.finish);
    
    /*------------------------- Students table ------------------------------*/
    
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
        { name: 'firstName', headerCellClass: 'header-filtered', minWidth: '150' },
        { name: 'lastName', headerCellClass: 'header-filtered', minWidth: '150' },
        { name: 'email', headerCellClass: 'header-filtered', minWidth: '150' },
        { name: 'course', headerCellClass: 'header-filtered', minWidth: '80' },
        { name: 'group', headerCellClass: 'header-filtered', minWidth: '80' },
        { name: 'assigned', cellTemplate: '<div class="ngCellText" style="color: green; text-align: center" ng-if="row.entity.assigned"><i class="fa fa-check"></i></div><div class="ngCellText" style="color: red; text-align: center" ng-if="!row.entity.assigned"><i class="fa fa-times"></i></div>', minWidth: '100', enableFiltering: false},
        { name: 'passed', cellTemplate: '<div class="ngCellText" style="color: green; text-align: center" ng-if="row.entity.passed"><i class="fa fa-check"></i></div><div class="ngCellText" style="color: red; text-align: center" ng-if="!row.entity.passed"><i class="fa fa-times"></i></div>', minWidth: '80', enableFiltering: false}
    ];
    
    
    /*------------------------------ Questions table -------------------------*/
    
    $scope.gridQuestions = {
        enableFiltering: true
    };
    
    $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];
    
    $scope.gridQuestions.data = testToShow.questions.map(function(quest){
        var toReturn = {};
        toReturn.rightAnswers = '';
        if (quest.typeInd === 0) {
            for (var i = 0; i < quest.answers.length; i++) {
                if (quest.answers[i].right){
                    toReturn.rightAnswers += quest.answers[i].text + '; ';
                }
            }
            toReturn.text = quest.text;
        }
        else if (quest.typeInd === 2) {
            toReturn.rightAnswers = quest.text.substring(quest.text.indexOf('###') + 3, quest.text.lastIndexOf('###'));
            toReturn.text = quest.text.replace(toReturn.rightAnswers, '???').split('###').join('');
        }
        toReturn.type = $scope.toShowTypes[quest.typeInd];
        toReturn.typeInd = quest.typeInd;
        toReturn.cost = quest.cost;
        return toReturn;
    });
    
    $scope.gridQuestions.columnDefs = [
        { name: 'text', headerCellClass: 'header-filtered', minWidth: '150' },
        { name: 'cost', headerCellClass: 'header-filtered', minWidth: '80' },
        { name: 'type', headerCellClass: 'header-filtered', minWidth: '200' },
        { name: 'rightAnswers', enableFiltering: false,  minWidth: '150' }
    ];
    
    /*--------------------------  Account info on refresh --------------------------------------------*/

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
    
    /*------------------------------- Edit ------------------------------------------------------*/
    
    $scope.moveOnEditPage = function(){
        $state.go('testEdit', {testId: testToShow.id});
    };
}]);
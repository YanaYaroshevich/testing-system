'use strict';

angular.module('myApp.testPage')
    
.controller('TestPageCtrl', ['$scope', '$rootScope', 'uiGridConstants', 'testToShow', 'authService', '$state', 'colService', function($scope, $rootScope, uiGridConstants, testToShow, authService, $state, colService) {
    
    $scope.gridStudents = {
        enableFiltering: true,
    };
    
    $scope.gridQuestions = {
        enableFiltering: true
    };

    if (!testToShow)
    {
        $state.go('error');
    }
    
    else
    {
        $scope.pageName = 'Test ' + testToShow.name;
        $scope.toShowPassBtn = false;

        $scope.test = testToShow;
        $scope.auth = authService;

        /*------------------------- Dates --------------------------------------*/

        function getPrettyDate(date) {
            return  (new Date(date)).toLocaleTimeString() + ' ' + (new Date(date)).toLocaleDateString();
        }

        $scope.test.from = getPrettyDate($scope.test.start);
        $scope.test.to = getPrettyDate($scope.test.finish);

        /*------------------------- Students table ------------------------------*/

        $scope.gridStudents.data = testToShow.students.map(function(stud){
            if (stud.id === $rootScope.id && stud.assigned && !stud.passed) {
                $scope.toShowPassBtn = true;
            }
            return {
                firstName: stud.firstName,
                lastName: stud.lastName,
                email: stud.email,
                course: stud.course,
                group: stud.group,
                assigned: stud.assigned,
                passed: stud.passed,
                id: stud.id
            };
        });

        $scope.gridStudents.columnDefs = colService.testStudents();

        /*------------------------------ Questions table -------------------------*/

        if (authService.isTeacher()){
            $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];

            $scope.gridQuestions.data = testToShow.questions.map(function(quest){
                var toReturn = {};
                toReturn.rightAnswers = '';
                if (quest.typeInd === 0 || quest.typeInd === 3) {
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

            $scope.gridQuestions.columnDefs = colService.testQuestions();
        }
        
        /*------------------------------- Edit ------------------------------------------------------*/

        $scope.moveOnEditPage = function(){
            $state.go('testEdit', {testId: testToShow.id});
        };

        /*-------------------------------- Start ----------------------------------------------------*/
        $scope.startTest = function(){
             $state.go('testPass', {testId: testToShow.id, studId: $rootScope.id});
        }
    }
}]);
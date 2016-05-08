'use strict';

angular.module('myApp.testPassPage')

.controller('TestPassPageCtrl', ['$scope', '$rootScope', 'test', 'ngNotify', 'testService', '$state', function($scope, $rootScope, test, ngNotify, testService, $state){
    if(!test){
        $state.go('error');
    }
    
    else {
        $scope.testName = test.name;
    
        $scope.passed = test.passed;
        $scope.grade = test.grade;

        $scope.questions = test.questions.map(function(cur){
            return {
                answers: cur.answers,
                text: cur.text,
                typeInd: cur.typeInd,
                id: cur.id, 
                multipleRight: cur.multipleRight,
                radioChecked: 0,
                firstPart: cur.firstPart,
                secondPart: cur.secondPart
            };
        });

        for (var i = 0; i < $scope.questions.length; i++){
            if ($scope.questions[i].typeInd === 0 ||  $scope.questions[i].typeInd === 3){
                $scope.questions[i].answers = $scope.questions[i].answers.map(function(cur){
                    return {
                        text: cur.text,
                        num: cur.num,
                        checked: false
                    };
                });
                $scope.questions[i].answers[0].checked = true;
            }
        }

        $scope.currentPage = 1;
        $scope.totalItems = $scope.questions.length;
        $scope.itemsPerPage = 1;
        $scope.maxSize = 2;

        $scope.submitTest = function(){
            var answersToSend = [];
            var tempObj;
            for (var i = 0; i < $scope.questions.length; i++) {
                tempObj = {answers: []}; 
                tempObj.id = $scope.questions[i].id;
                switch($scope.questions[i].typeInd){
                    case 0: 
                    case 3:
                        if (!$scope.questions[i].multipleRight) {
                            tempObj.answers.push($scope.questions[i].radioChecked);
                        }
                        else {
                            for (var j = 0; j < $scope.questions[i].answers.length; j++) {
                                if ($scope.questions[i].answers[j].checked){
                                    tempObj.answers.push($scope.questions[i].answers[j].num);
                                }
                            }
                        }
                        break;
                    case 2:
                        tempObj.answers.push($scope.questions[i].studAns);
                        break;
                };
                answersToSend.push(tempObj);
            }
            var toSend = { questions: answersToSend };
            toSend.testId = test.id;
            toSend.studId = $rootScope.id;
            testService.passTest(toSend, test.id).then(function(err){
                if (err){
                    ngNotify.set(err.message);
                }
            });
        };    
    }
}]);
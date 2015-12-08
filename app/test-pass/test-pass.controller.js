'use strict';

angular.module('myApp.testPage')

.controller('TestPassPageCtrl', ['$scope', '$rootScope', 'test', '$state', '$http', 'ngNotify', function($scope, $rootScope, test, $state, $http, ngNotify){
    $rootScope.showLeftMenu = false;
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
        if ($scope.questions[i].typeInd === 0){
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
            if ($scope.questions[i].typeInd === 0){
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
            }
            else if ($scope.questions[i].typeInd === 2) {
                tempObj.answers.push($scope.questions[i].studAns);
            }
            answersToSend.push(tempObj);
        }
        var toSend = { questions: answersToSend };
        console.log(toSend);
        toSend.testId = test.id;
        toSend.studId = $rootScope.id;
        $http.post('/test/pass/submit', toSend).then(function(res){
            $state.go($state.current, {testId: test.id}, {reload: true});
        }, function(err){
            ngNotify.set(err.data);
        });
    };
}]);
'use strict';

angular.module('myApp.testPage')

.controller('TestPassPageCtrl', ['$scope', '$rootScope', 'test', function($scope, $rootScope, test){
    console.log(test);
    $rootScope.showLeftMenu = false;
    $scope.testName = test.name;
    
    $scope.questions = test.questions.map(function(cur){
        var rightAnsQ = 0;
        if (cur.typeInd === 0){
            for (var i = 0; i < cur.answers.length; i++){
                if (cur.answers[i].right)
                    rightAnsQ++;
            }
        }
        return {
            answers: cur.answers,
            text: cur.text,
            typeInd: cur.typeInd,
            id: cur.id, 
            multipleRight: (rightAnsQ > 1),
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
        }
      
    }
    
    console.log($scope.questions);
    
    
    $scope.currentPage = 1;
    $scope.totalItems = $scope.questions.length;
    $scope.itemsPerPage = 1;
    $scope.maxSize = 3;
    
    $scope.pageChanged = function() {
        
    };
}]);
'use strict';

angular.module('myApp.testPage')

.controller('TestPassPageCtrl', ['$scope', '$rootScope', 'test', function($scope, $rootScope, test){
    console.log(test);
    $rootScope.showLeftMenu = false;
    $scope.testName = test.name;
    
    $scope.questions = test.questions.map(function(cur){
        var rightAnsQ = 0;
        for (var i = 0; i < cur.answers.length; i++){
            if (cur.answers[i].right)
                rightAnsQ++;
        }
        return {
            answers: cur.answers,
            cost: cur.cost,
            text: cur.text,
            typeInd: cur.typeInd,
            id: cur.id, 
            multipleRight: (rightAnsQ > 1),
            radioChecked: 0
        };
    });
    
    for (var i = 0; i < $scope.questions.length; i++){
        $scope.questions[i].answers = $scope.questions[i].answers.map(function(cur){
            return {
                text: cur.text,
                num: $scope.questions[i].answers.indexOf(cur),
                right: cur.right,
                checked: false
            };
        });
    }
    
    console.log($scope.questions);
    
    
    $scope.currentPage = 1;
    $scope.totalItems = $scope.questions.length;
    $scope.itemsPerPage = 1;
    $scope.maxSize = 3;
    
    $scope.pageChanged = function() {
        
    };
}]);
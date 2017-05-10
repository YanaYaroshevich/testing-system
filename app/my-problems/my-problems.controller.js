'use strict';

angular.module('myApp.myProblemsPage')

    .controller('MyProblemsPageCtrl', ['$scope', 'myProblems', '$rootScope', 'colService', 'authService', function($scope, myProblems, $rootScope, colService, authService){
        $scope.pageName = 'My problems';

        console.log(myProblems);

        $scope.gridProblems = {
            enableFiltering: true
        };

        var problemsToShow = [];


        if (authService.isTeacher()) {
            problemsToShow = problemsToShow.concat(myProblems);
        }

        else {
            for (var i = 0; i < myProblems.length; i++) {
                if (new Date(myProblems[i].start) <= new Date() && new Date(myProblems[i].finish) >= new Date()) {
                    problemsToShow.push(myProblems[i]);
                }
            }
        }

        $scope.gridProblems.data = problemsToShow.map(function(problem){
            return {
                num: problemsToShow.indexOf(problem) + 1,
                problemName: problem.name,
                description: problem.description,
                problemId: problem._id
            };
        });

        $scope.gridProblems.columnDefs = colService.myProblems();
    }]);
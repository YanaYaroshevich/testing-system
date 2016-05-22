angular.module('myApp.newProblem')

    .controller('solutionModalCtrl', ['$scope', '$uibModalInstance', 'solution', function($scope, $uibModalInstance, solution){
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.solution = solution;
        $scope.header = solution.solutionName;

        $scope.gridSolution = {
            enableFiltering: true
        };

        $scope.gridSolution.data = [];
        for (var i = 0; i < solution.errorsToShow.length; i++) {
            if ($scope.gridSolution.data[solution.errorsToShow[i].testNum] === undefined) {
                $scope.gridSolution.data[solution.errorsToShow[i].testNum] = {};
            }
            $scope.gridSolution.data[solution.errorsToShow[i].testNum][solution.errorsToShow[i].outputFileName.replace('.', '')] = solution.errorsToShow[i].errorText;
            $scope.gridSolution.data[solution.errorsToShow[i].testNum]['test'] = 'Test #' + (solution.errorsToShow[i].testNum + 1);
        }

        $scope.gridSolution.columnDefs = [{ displayName: "Test num", field: 'test', headerCellClass: 'header-filtered', minWidth: '120' }];
        for (var j = 0; j < solution.errorsToShow.length; j++) {
            if (solution.errorsToShow[j].testNum === 0) {
                $scope.gridSolution.columnDefs.push({displayName: solution.errorsToShow[j].outputFileName, field: solution.errorsToShow[j].outputFileName.replace('.', ''), headerCellClass: 'header-filtered', minWidth: '120' });
            }
        }

    }]);
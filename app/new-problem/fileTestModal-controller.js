angular.module('myApp.newProblem')

    .controller('fileTestModalCtrl', ['$scope', '$uibModalInstance', 'fileTest', function($scope, $uibModalInstance, fileTest){
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.header = 'Test #' + fileTest.num;

        $scope.fileTest = fileTest;

    }]);
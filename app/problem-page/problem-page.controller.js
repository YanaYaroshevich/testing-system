'use strict';

angular.module('myApp.problemPage')

    .controller('ProblemPageCtrl', ['$scope', '$rootScope', 'uiGridConstants', 'authService', '$state', 'colService', 'problemToShow', 'FileUploader', '$uibModal', 'usSpinnerService', function($scope, $rootScope, uiGridConstants, authService, $state, colService, problemToShow, FileUploader, $uibModal, usSpinnerService) {
        $scope.gridStudents = {
            enableFiltering: true
        };

        $scope.gridTests = {
            enableFiltering: true
        };

        $scope.gridSolutions = {
            enableFiltering: true
        };

        if (!problemToShow) {
            $state.go('error');
        }

        else {
            $scope.auth = authService;
            $scope.pageName = problemToShow.name;
            $scope.problem = problemToShow;

            /*------------------------- Dates --------------------------------------*/

            var getPrettyDate = function(date) {
                return  (new Date(date)).toLocaleTimeString() + ' ' + (new Date(date)).toLocaleDateString();
            };

            $scope.problem.from = getPrettyDate($scope.problem.start);
            $scope.problem.to = getPrettyDate($scope.problem.finish);

            $scope.gridStudents.data = problemToShow.students.map(function(stud){
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

            $scope.gridTests.data = [];

            for (var i = 0; i < problemToShow.tests.length; i++) {
                $scope.gridTests.data[i] = { testName:  'Test #' + problemToShow.tests[i].num };
                for (var j = 0; j < problemToShow.tests[i].inputFiles.length; j++) {
                    $scope.gridTests.data[i][problemToShow.tests[i].inputFiles[j].nameForTest.replace('.', '')] = problemToShow.tests[i].inputFiles[j].originalName;
                }
                for (var k = 0; k < problemToShow.tests[i].outputFiles.length; k++) {
                    $scope.gridTests.data[i][problemToShow.tests[i].outputFiles[k].nameForTest.replace('.', '')] = problemToShow.tests[i].outputFiles[k].originalName;
                }
            }

            $scope.gridTests.columnDefs = [ { name: 'Test num', field: 'testName', headerCellClass: 'header-filtered', minWidth: '120' } ];

            for (var m = 0; m < problemToShow.tests[0].inputFiles.length; m++) {
                $scope.gridTests.columnDefs.push({ displayName: problemToShow.tests[0].inputFiles[m].nameForTest, field: problemToShow.tests[0].inputFiles[m].nameForTest.replace('.', ''), headerCellClass: 'header-filtered', minWidth: '120'});
            }

            for (var l = 0; l < problemToShow.tests[0].outputFiles.length; l++) {
                $scope.gridTests.columnDefs.push({ displayName: problemToShow.tests[0].outputFiles[l].nameForTest, field: problemToShow.tests[0].outputFiles[l].nameForTest.replace('.', ''), headerCellClass: 'header-filtered', minWidth: '120'});
            }

            if (authService.isStudent()) {
                $scope.myRecord = {};
                for (var s = 0; s < problemToShow.students.length; s++) {
                    if ($rootScope.id === problemToShow.students[s].id) {
                        $scope.myRecord = problemToShow.students[s];
                    }
                }

                $scope.gridSolutions.data = $scope.myRecord.solutions.map(function(cur){
                    return {
                        dateOfPass: cur.dateOfPass,
                        errorsToShow: cur.errorsToShow,
                        qOfPassedTests: cur.qOfPassedTests,
                        solutionName: 'Solution #' + ($scope.myRecord.solutions.indexOf(cur) + 1)
                    };
                });

                $scope.gridSolutions.columnDefs = [
                    { displayName: 'Solution name', field: 'solutionName', headerCellClass: 'header-filtered', minWidth: '120', cellTemplate: '<div class="add-cell-test"><a href="" ng-click="grid.appScope.showSolution(row.entity)" class="ngCellText">{{row.entity.solutionName}}</a></div>' },
                    { displayName: 'Quantity of files without errors', field: 'qOfPassedTests',  headerCellClass: 'header-filtered', minWidth: '150' },
                    { displayName: 'Date of pass', field: 'dateOfPass', type: 'date', cellFilter: 'date:\'dd/MM/yyyy\'', enableFiltering: false, minWidth: '150' }
                ];
            }

            $scope.uploader = new FileUploader(
                {
                    url: '/rest/problem/' + problemToShow.id + '/solution/' + $rootScope.id,
                    removeAfterUpload: true
                }
            );

            $scope.showSolution = function(solution){
                var modalInstance = $uibModal.open({
                    templateUrl: '/problem-page/solutionModal.html',
                    controller: 'solutionModalCtrl',
                    size: 'lg',
                    resolve: {
                        solution: function () {
                            return solution;
                        }
                    }
                });

                modalInstance.result.then(function (res) {

                }, function () {

                });
            };

            $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                ngNotify.set('An error occured while file uploading');
            };

            $scope.uploader.onAfterAddingFile = function(fileItem) {
                fileItem.formData.push({index: $scope.myRecord.solutions.length});
                $scope.uploader.uploadAll();
            };

            $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                usSpinnerService.spin('spinner-1');
                setTimeout(function(){
                    $scope.myRecord.solutions.push(response.solution);
                    $scope.gridSolutions.data = $scope.myRecord.solutions.map(function(cur){
                        return {
                            dateOfPass: cur.dateOfPass,
                            errorsToShow: cur.errorsToShow,
                            qOfPassedTests: cur.qOfPassedTests,
                            solutionName: 'Solution #' + ($scope.myRecord.solutions.indexOf(cur) + 1)
                        };
                    });
                    usSpinnerService.stop('spinner-1');
                }, 5000);
                console.log(response);
            };

            $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
                ngNotify.set('An error occured while file uploading');
            };
        }
    }]);


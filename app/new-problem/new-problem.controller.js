'use strict';

angular.module('myApp.newUser')

    .controller('NewProblemCtrl', ['$scope', '$rootScope', 'ngNotify', 'studService', 'colService', 'FileUploader', function($scope, $rootScope, ngNotify, studService, colService, FileUploader) {
        ngNotify.config({
            theme: 'pastel',
            position: 'bottom',
            duration: 3000,
            type: 'error',
            sticky: true,
            html: false
        });

        $scope.ioUploader = new FileUploader(
            {
                url: '/problem/new/io',
                removeAfterUpload: true
            }
        );

        $scope.status = {open: false};

        $scope.ioUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            ngNotify.set('An error occured while file uploading');
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        $scope.ioUploader.onAfterAddingFile = function(fileItem) {
            fileItem.formData.push({nameForTest: fileItem.nameForTest});
            fileItem.formData.push({isInput: fileItem.isInput});
            console.info('onAfterAddingFile', fileItem);
        };

        $scope.ioUploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            if (response.isInput) {
                $scope.filesPair.inputFiles.push(response.origFileName);
            }
            else {
                $scope.filesPair.outputFiles.push(response.origFileName);
            }
            $scope.filesPair.num = $scope.problem.filePairs.length + 1;

            if ($scope.filesPair.inputFiles.length + $scope.filesPair.outputFiles.length === $scope.filesPair.inputFilesNames.length + $scope.filesPair.outputFilesNames.length) {
                $scope.problem.filePairs.push($scope.filesPair);
                filesToDefault();
            }
        };

        $scope.ioUploader.onErrorItem = function(fileItem, response, status, headers) {
            ngNotify.set('An error occured while file uploading');
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        $scope.pageName = 'Problem creation';

        var problemToDefault = function(){
            $scope.problem = {};
            $scope.problem.name = '';
            $scope.problem.description = '';
            $scope.problem.students = [];
            $scope.problem.filePairs = [];
        };

        problemToDefault();

        var filesToDefault = function(){
            $scope.filesPair = {};
            $scope.filesPair.inputFilesNames = [ { nameForTest: '' } ];
            $scope.filesPair.outputFilesNames = [ { nameForTest: '' } ];

            $scope.filesPair.inputFiles = [];
            $scope.filesPair.outputFiles = [];
        };

        filesToDefault();

        $scope.addInputFile = function(){
            $scope.filesPair.inputFilesNames.push({ nameForTest: '' });
        };

        $scope.removeInputFile = function(){
            $scope.filesPair.inputFilesNames.pop();
        };

        $scope.addOutputFile = function(){
            $scope.filesPair.outputFilesNames.push({ nameForTest: '' });
        };

        $scope.removeOutputFile = function(){
            $scope.filesPair.outputFilesNames.pop();
        };

        $scope.showAccord = function(){
            for (var k = 0; k < $scope.filesPair.inputFilesNames.length; k++){
                if (!$scope.filesPair.inputFilesNames[k].nameForTest || $scope.filesPair.inputFilesNames[k].nameForTest.length === 0)
                    return false;
            }

            for (var j = 0; j < $scope.filesPair.outputFilesNames.length; j++){
                if (!$scope.filesPair.outputFilesNames[j].nameForTest || $scope.filesPair.outputFilesNames[j].nameForTest.length === 0)
                    return false;
            }

            return true;
        };

        var datesToDefault = function(){
            $scope.minDate = new Date();
            $scope.problem.from = new Date();
            $scope.problem.to = new Date();

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
        };

        datesToDefault();

        $scope.addFilesPair = function() {
            $scope.ioUploader.uploadAll();
        };

        $scope.gridStudents = {
            enableRowSelection: true,
            enableSelectAll: true,
            multiSelect: true,
            enableFiltering: true
        };

        $scope.gridStudents.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                if(row.isSelected) {
                    $scope.problem.students.push(row.entity.studId);
                }
            });
        };

        var getStudents = function(){
            studService.getStuds().then(function(students){
                if (students) {
                    $scope.gridStudents.data = students;
                }
            }, function(err){
                ngNotify.set(err.message);
            });

            $scope.gridStudents.columnDefs = colService.newTestStudents();
        };

        getStudents();

        var problemFill = function(){
            if (!$scope.problem.name) {
                ngNotify.set('Fill the test name, please');
                return false;
            }
            if (!$scope.problem.description) {
                ngNotify.set('Fill the test description, please');
                return false;
            }
            if ($scope.problem.students.length === 0) {
                ngNotify.set('You should add at least one student');
                return false;
            }
            return true;
        };

        $scope.addTest = function(){
            if (problemFill()){
                $scope.problem.teacherId = $rootScope.id;
                /*testService.createTest($scope.test).then(function(err){
                    if (err) {
                        ngNotify.set(err.message);
                    }
                });*/
            }
        };

    }]);
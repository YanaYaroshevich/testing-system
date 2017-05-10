'use strict';

angular.module('myApp.testEditPage')
    
.controller('TestEditPageCtrl', ['$scope', '$rootScope', 'ngNotify', 'uiGridConstants', 'testToShow', '$timeout', 'colService', 'testService', 'FileUploader', function($scope, $rootScope, ngNotify, uiGridConstants, testToShow, $timeout, colService, testService, FileUploader) {
    $scope.pageName = 'Test edit';
    
    var testToDefault = function(){
        $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];
        $scope.test = {};
        $scope.test.name = testToShow.name;
        $scope.test.description = testToShow.description;
        $scope.test.students = [];
    };
    
    testToDefault();
    
    var questionToDefault = function(){
        $scope.question = {};
        $scope.question.text = '';
        $scope.question.cost = 1;
        $scope.question.typeInd = 0;
        $scope.question.type = $scope.toShowTypes[$scope.question.typeInd];
        $scope.question.answers = [{text: '', right: true}, {text: '', right: false}];
    };

    questionToDefault();

    $scope.uploader = new FileUploader({url: '/test/new/mainpicture/upload'});

    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        ngNotify.set('An error occured while file uploading');
        console.info('onWhenAddingFileFailed', item, filter, options);
    };

    $scope.uploader.onAfterAddingFile = function(fileItem) {
        $scope.question.mainPicture = fileItem.file;
        console.info('onAfterAddingFile', fileItem);
    };

    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.question.mainPicture = response.fileName;
        $scope.question.num = $scope.test.questions.length + 1;
        $scope.test.questions.push(angular.copy($scope.question));
        $scope.gridQuestions.data = $scope.test.questions;
        questionToDefault();
    };

    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
        ngNotify.set('An error occured while file uploading');
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    
    /* ---------------------------- Dates ----------------------------------- */
    
    var datesToDefault = function(){
        $scope.minDate = new Date();
        $scope.test.from = new Date(testToShow.start);
        $scope.test.to = new Date(testToShow.finish);

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    };
    
    datesToDefault();

    /* ------------------------ Question -----------------------------------*/
    
    $scope.chooseType = function(ind){
        $scope.question.typeInd = ind;
        $scope.question.type = $scope.toShowTypes[$scope.question.typeInd];
        if (ind === 0){
            $scope.question.answers = [{text: '', right: true}, {text: '', right: false}];
        }
    };
    
    $scope.addAnswer = function () {
        $scope.question.answers.push({text: '', right: false});
    };
    
    $scope.removeAnswer = function () {
        $scope.question.answers.pop();
    };
    
    /* --------------------- Questions table ---------------------------- */
    
    
    $scope.test.questions = testToShow.questions.map(function(quest){
                var toReturn = {};
                toReturn.cost = quest.cost;
                toReturn.text = quest.text;
                toReturn.num = testToShow.questions.indexOf(quest) + 1;
                toReturn.type = $scope.toShowTypes[quest.typeInd];
                toReturn.typeInd = quest.typeInd;
                toReturn.answers = quest.answers;
                toReturn.mainPicture = quest.additionPicture;
                return toReturn;
            });
    
    $scope.gridQuestions = {
            enableFiltering: true,
            columnDefs : colService.newTestQuestions(),
            data: $scope.test.questions
    };
    
    var questionFill = function(){
        if (!$scope.question.text){
            ngNotify.set('Fill the question text, please');
            return false;
        }
        if ($scope.question.typeInd === 0 || $scope.question.typeInd === 1 || $scope.question.typeInd === 3) {
            var hasRightAnswer = false;
            for (var i = 0; i < $scope.question.answers.length; i++){
                if ($scope.question.answers[i].text === '') {
                    ngNotify.set('Fill the answers, please');
                    return false;
                }
                if ($scope.question.answers[i].right) {
                    hasRightAnswer = true;
                }
            }
            if (!hasRightAnswer) {
                ngNotify.set('You should choose at list one right answer');
                return false;
            }
        }
        return true;
    };
        
    $scope.addQuestion = function(){
        if (!questionFill()){
            return false;
        }
        $scope.question.num = $scope.test.questions.length + 1;
        $scope.test.questions.push(angular.copy($scope.question));
        $scope.gridQuestions.data = $scope.test.questions;
        questionToDefault();
        return true;
    };
    
    $scope.questionToRemove = {num: 1};
    
    $scope.removeQuestion = function() {
        if ($scope.questionToRemove.num > $scope.gridQuestions.data.length){
            ngNotify.set('No such question');
        }
        else{
            if($scope.gridQuestions.data.length > 0){
                $scope.gridQuestions.data.splice($scope.questionToRemove - 1, 1);
                for (var i = 0; i < $scope.gridQuestions.data.length; i++){
                    $scope.gridQuestions.data[i].num = i + 1;
                }
            }
        }
    };
    
    /*--------------------------- Students table -----------------------*/
     
    $scope.gridStudents = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        enableFiltering: true
    };
    
    $scope.gridStudents.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
            if(row.isSelected){
                $scope.test.students.push(row.entity.id);
            }
            else {
                $scope.test.students.splice($scope.test.students.indexOf(row.entity.studId), 1);
            }
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
            var msg = 'rows changed ' + rows.length;
        });
    };
    
    var getStudents = function(){        
        $scope.gridStudents.data = testToShow.students;
        $timeout(function() {
            for (var i = 0; i < $scope.gridStudents.data.length; i++) {
                if ($scope.gridStudents.data[i].assigned){
                    if($scope.gridApi.selection.selectRow){
                        $scope.gridApi.selection.selectRow($scope.gridStudents.data[i]);
                    }
                }
            }
        });
        $scope.gridStudents.columnDefs = colService.newTestStudents();
    };
    
    getStudents();
    
    /* ------------------------ Test complete --------------------*/
    
    var testFill = function(){
        if (!$scope.test.name) {
            ngNotify.set('Fill the test name, please');
            return false;
        }
        if (!$scope.test.description) {
            ngNotify.set('Fill the test description, please');
            return false;
        }
        if ($scope.test.questions.length === 0) {
            ngNotify.set('You should add at least one question');
            return false;
        }
        if ($scope.test.students.length === 0) {
            ngNotify.set('You should add at least one student');
            return false;
        }
        return true;
    };
    
    $scope.addTest = function(){
        if (testFill()){
            $scope.test.teacherId = $rootScope.id;
            testService.editTest($scope.test, testToShow.id).then(function(err){
                if (err) {
                    ngNotify.set(err.message);
                }
            });
        }
    };    
}]);
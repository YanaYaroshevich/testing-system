'use strict';

angular.module('myApp.testEditPage')
    
.controller('TestEditPageCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', 'uiGridConstants', 'testToShow', 'authService', '$timeout', '$state', function($scope, $rootScope, $http, ngNotify, uiGridConstants, testToShow, authService, $timeout, $state) {
    console.log(testToShow);
    
    $scope.pageName = 'Test edit';
    $rootScope.showLeftMenu = true;
    
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
    
    /* ---------------------------- Dates ----------------------------------- */
    
    var datesToDefault = function(){
        $scope.minDate = new Date();
        $scope.test.from = new Date(testToShow.start);
        $scope.test.to = new Date(testToShow.finish);

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    }
    
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
                var toReturn = quest;
                toReturn.num = testToShow.questions.indexOf(quest) + 1;
                toReturn.type = $scope.toShowTypes[quest.typeInd];
                toReturn.typeInd = quest.typeInd;
                return toReturn;
            });
    
    $scope.gridQuestions = {
            enableFiltering: true,
            columnDefs : [
                    { name: 'num', headerCellClass: 'header-filtered', enableCellEdit: false, minWidth: '80' },
                    { name: 'type', headerCellClass: 'header-filtered', enableCellEdit: false, minWidth: '200'  },
                    { name: 'text', headerCellClass: 'header-filtered', minWidth: '200' },
                    { name: 'cost', headerCellClass: 'header-filtered', minWidth: '90' }
            ],
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
        $scope.gridStudents.columnDefs = [
            { name: 'firstName', headerCellClass: 'header-filtered', minWidth: '150' },
            { name: 'lastName', headerCellClass: 'header-filtered', minWidth: '150' },
            { name: 'email', headerCellClass: 'header-filtered', minWidth: '200' },
            { name: 'course', headerCellClass: 'header-filtered', minWidth: '80' },
            { name: 'group', headerCellClass: 'header-filtered', minWidth: '90' }
        ];
    };
    
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
            $scope.test.teacherId = $rootScope.account._id;
            $http.put('/test/edit/complete/' + testToShow.id, $scope.test).then(function (res) {
                $state.go('test', {testId: testToShow.id});
            }, function (err) {
                ngNotify.set(err.data);
            });
        }
    };
    
     var updatePage = function(){
        $http.get('/user/' + $rootScope.id).then(
            function(res) {
                $rootScope.account = res.data.account;
                getStudents();
            },
            function(err) {
                ngNotify.set(err.data);
                $state.go('start');
            }
        );
    };
    
    updatePage();
}]);
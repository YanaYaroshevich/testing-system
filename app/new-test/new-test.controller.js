'use strict';

angular.module('myApp.newTest')
    
.controller('NewTestCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', 'uiGridConstants', '$location', '$state', function($scope, $rootScope, $http, ngNotify, uiGridConstants, $location, $state) {
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Test creation";
    
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
    
    var testToDefault = function(){
        $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];
        $scope.test = {};
        $scope.test.questions = [];
        $scope.test.name = '';
        $scope.test.description = '';
        $scope.test.students = [];
        $scope.question = {};
    };
    
    testToDefault();
    
     var questionToDefault = function(){
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
        $scope.test.from = new Date();
        $scope.test.to = new Date();

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
    }
    
    datesToDefault();

    /* -------------------------------------------------------------------------*/
    
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
    
    $scope.gridQuestions = {
            enableFiltering: true,
            columnDefs : [
                    { name: 'num', headerCellClass: 'header-filtered', enableCellEdit: false },
                    { name: 'type', headerCellClass: 'header-filtered', enableCellEdit: false  },
                    { name: 'text', headerCellClass: 'header-filtered' },
                    { name: 'cost', headerCellClass: 'header-filtered' }
            ]
    };
    
     var questionFill = function(){
        if (!$scope.question.text){
            ngNotify.set('Fill question text, please');
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
    
    $scope.removeQuestion = function() {
        if ($scope.questionToRemove > $scope.gridQuestions.data.length){
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
     
    /* --------------------- Students table ----------------------------- */
    
    $scope.gridStudents = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        enableFiltering: true
    };
    
    $scope.gridStudents.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
            if(row.isSelected)
                $scope.test.students.push(row.entity.studId);
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
            var msg = 'rows changed ' + rows.length;
        });
    };
    
    var getStudents = function(){
        $http.get('/new/test/students/' + $rootScope.account._id).then(function (res) {
            console.log(res.data);
            var students = res.data.map(function(stud){
                return {
                    firstName: stud.firstName,
                    lastName: stud.lastName,
                    email: stud.email,
                    course: stud.course,
                    group: stud.group,
                    studId: stud._id
                };
            });

            $scope.gridStudents.columnDefs = [
                { name: 'firstName', headerCellClass: 'header-filtered' },
                { name: 'lastName', headerCellClass: 'header-filtered' },
                { name: 'email', headerCellClass: 'header-filtered' },
                { name: 'course', headerCellClass: 'header-filtered' },
                { name: 'group', headerCellClass: 'header-filtered' }
            ];

            $scope.gridStudents.data = students;


        }, function (err) {   
            ngNotify.set(err.data);
        }); 
    }
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
            $http.post('/new/test/add', $scope.test).then(function (res) {
                console.log(res);
                $state.go('test', {testId: res.data.testId});
                
            }, function (err) {
                ngNotify.set(err.data);
            });
        }
    }
    
    updatePage();
}]);
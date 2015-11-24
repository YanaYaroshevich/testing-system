'use strict';

angular.module('myApp.newTest', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/test/new', {
    templateUrl: 'new-test/new-test.html',
    controller: 'NewTestCtrl'
  });
}])

.controller('NewTestCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', 'uiGridConstants', function($scope, $rootScope, $http, ngNotify, uiGridConstants) {
    $rootScope.path = '/main';
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Test creation";
    
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    $scope.toShowTypes = ['Text question and text answers', 'Text question and picture answers', 'Fill-the-word question', 'Text question with picture and text answers'];
    
    $scope.test = {};
    $scope.test.questions = [];
    $scope.test.name = '';
    $scope.test.description = '';
    $scope.typeInd = 0;
    $scope.questionText = '';
    $scope.questionCost = 1;
    $scope.answers = [{text: '', right: true}, {text: '', right: false}];
    
    /* ---------------------------- Dates ----------------------------------- */
    
    $scope.minDate = new Date();
    $scope.test.from = new Date();
    $scope.test.to = new Date();
    
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    /* -------------------------------------------------------------------------*/
    
    $scope.chooseType = function(ind){
        $scope.typeInd = ind;
        if (ind === 0){
            $scope.answers = [{text: '', right: true}, {text: '', right: false}];
        }
    }
    
    $scope.addAnswer = function () {
        $scope.answers.push({text: '', right: false});
    }
    
    $scope.removeAnswer = function () {
        $scope.answers.pop();
    }
    
    var questions = [];
    
    var questionCreation = function (quest) {
        var obj = {};
        obj.type = $scope.toShowTypes[quest.type];
        obj.text = quest.text;
        obj.cost = quest.cost;
        return obj;
    };
    
    $scope.addQuestion = function(){
        var question = {};
        question.type = $scope.typeInd;
        // I'm sorry for this :)
        question.text = $scope.accordion.groups[0].$$childHead.questionText;
        question.cost = $scope.accordion.groups[0].$$childHead.questionCost;
        console.log(question);
        if (question.type === 0)
            question.answers = $scope.answers;
        $scope.test.questions.push(question);
        questions.push(questionCreation(question));
    }

    
    /* --------------------- Questions table ---------------------------- */
    
    $scope.gridQuestions = {
        enableFiltering: true,
        data: questions,
        columnDefs : [
            { name: 'type', headerCellClass: 'header-filtered' },
            { name: 'text', headerCellClass: 'header-filtered' },
            { name: 'cost', headerCellClass: 'header-filtered' }
        ]
    };
    /* --------------------- Students table ----------------------------- */
    
    
    
    $scope.gridStudents = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: true,
        enableFiltering: true
    };
    
    $http.get('test/new/students/' + $rootScope.account._id).then(function (res) {
        console.log(res.data);
        var students = res.data.map(function(stud){
            return {
                firstName: stud.firstName,
                lastName: stud.lastName,
                email: stud.email,
                course: stud.course,
                group: stud.group
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
        ngNotify.set(err);
    }); 
}]);
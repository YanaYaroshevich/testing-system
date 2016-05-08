'use strict';

angular.module('columns')

.service('colService', [function(){
    return {
        myTests : function() {
            return [
                { name: 'num', headerCellClass: 'header-filtered', minWidth: '80', maxWidth: '80' },
                { name: 'testName', headerCellClass: 'header-filtered', minWidth: '150', cellTemplate: '<div class="add-cell-test"><a class="ngCellText" ng-class="col.colIndex()" href="/test/{{row.entity.testId}}">{{row.entity.testName}}</a></div>' },
                { name: 'description', headerCellClass: 'header-filtered', minWidth: '200' },
                { name: 'testId', visible: false }
            ];
        },
        newTestStudents : function() {
            return [
                { name: 'firstName', headerCellClass: 'header-filtered', minWidth: '150' },
                { name: 'lastName', headerCellClass: 'header-filtered', minWidth: '150' },
                { name: 'email', headerCellClass: 'header-filtered', minWidth: '200' },
                { name: 'course', headerCellClass: 'header-filtered', minWidth: '80' },
                { name: 'group', headerCellClass: 'header-filtered', minWidth: '90' }
            ];
        },
        newTestQuestions : function() {
            return [
                { name: 'num', headerCellClass: 'header-filtered', enableCellEdit: false, minWidth: '80' },
                { name: 'type', headerCellClass: 'header-filtered', enableCellEdit: false, minWidth: '200'  },
                { name: 'text', headerCellClass: 'header-filtered', minWidth: '200' },
                { name: 'cost', headerCellClass: 'header-filtered', minWidth: '90' }
            ];
        },
        testStudents : function() {
            return [
                { name: 'firstName', headerCellClass: 'header-filtered', minWidth: '120', cellTemplate: '<div class="add-cell-test"><a class="ngCellText" ng-class="col.colIndex()" href="/user/{{row.entity.id}}">{{row.entity.firstName}}</a></div>' },
                { name: 'lastName', headerCellClass: 'header-filtered', minWidth: '150', cellTemplate: '<div class="add-cell-test"><a class="ngCellText" ng-class="col.colIndex()" href="/user/{{row.entity.id}}">{{row.entity.lastName}}</a></div>' },
                { name: 'email', headerCellClass: 'header-filtered', minWidth: '150' },
                { name: 'course', headerCellClass: 'header-filtered', minWidth: '80', maxWidth: '80' },
                { name: 'group', headerCellClass: 'header-filtered', minWidth: '80', maxWidth: '80' },
                { name: 'assigned', cellTemplate: '<div class="ngCellText add-cell" ng-class="col.colIndex()" style="color: green;" ng-if="row.entity.assigned"><i class="fa fa-check"></i></div><div class="ngCellText add-cell" style="color: red;" ng-if="!row.entity.assigned"><i class="fa fa-times"></i></div>', minWidth: '100', maxWidth: '100', enableFiltering: false },
                { name: 'passed', cellTemplate: '<div class="ngCellText add-cell" ng-class="col.colIndex()" style="color: green;" ng-if="row.entity.passed"><i class="fa fa-check"></i></div><div class="ngCellText add-cell" style="color: red;" ng-if="!row.entity.passed"><i class="fa fa-times"></i></div>', minWidth: '100', maxWidth: '100', enableFiltering: false }
            ];
        },
        testQuestions : function() {
            return [
                { name: 'text', headerCellClass: 'header-filtered', minWidth: '200' },
                { name: 'cost', headerCellClass: 'header-filtered', minWidth: '80', maxWidth: '80' },
                { name: 'type', headerCellClass: 'header-filtered', minWidth: '200' },
                { name: 'rightAnswers', enableFiltering: false,  minWidth: '150' }
            ];
        },
        
        studUserTests: function() {
            return [
                { name: 'Test name', field: 'testName', headerCellClass: 'header-filtered', minWidth: '120', cellTemplate: '<div class="add-cell-test"><a class="ngCellText" ng-class="col.colIndex()" href="/test/{{row.entity.id}}">{{row.entity.testName}}</a></div>'},
                { name: 'assigned', cellTemplate: '<div class="ngCellText add-cell" ng-class="col.colIndex()" style="color: green;" ng-if="row.entity.assigned"><i class="fa fa-check"></i></div><div class="ngCellText add-cell" style="color: red;" ng-if="!row.entity.assigned"><i class="fa fa-times"></i></div>', minWidth: '100', maxWidth: '100', enableFiltering: false },
                { name: 'passed', cellTemplate: '<div class="ngCellText add-cell" ng-class="col.colIndex()" style="color: green;" ng-if="row.entity.passed"><i class="fa fa-check"></i></div><div class="ngCellText add-cell" style="color: red;" ng-if="!row.entity.passed"><i class="fa fa-times"></i></div>', minWidth: '100', maxWidth: '100', enableFiltering: false },
                { name: 'Date of pass', field: 'dateOfPass', minWidth: '120', cellTemplate: '<div class="add-cell" ng-show="row.entity.passed">{{row.entity.dateOfPass}}</div><div class="add-cell" ng-show="!row.entity.passed">-</div>'},
                { name: 'grade', headerCellClass: 'header-filtered', minWidth: '120'}
            ];
        },
        
        teachUserTests: function() {
            return [
                { name: 'Test name', field: 'testName', headerCellClass: 'header-filtered', minWidth: '120', cellTemplate: '<div class="add-cell-test"><a class="ngCellText" ng-class="col.colIndex()" href="/test/{{row.entity.id}}">{{row.entity.testName}}</a></div>'},
                { name: 'Start date', field: 'startDate', minWidth: '120', type: 'date', cellFilter: 'date:\'dd/MM/yyyy\'', enableFiltering: false},
                { name: 'End date', field: 'endDate', minWidth: '120', type: 'date', cellFilter: 'date:\'dd/MM/yyyy\'', enableFiltering: false}
            ];
        }
    };
}]);
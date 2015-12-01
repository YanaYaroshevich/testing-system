'use strict';

angular.module('myApp.myTestsPage')

.controller('MyTestsPageCtrl', ['$scope', 'myTests', '$http', '$rootScope', 'ngNotify', function($scope, myTests, $http, $rootScope, ngNotify){
    $scope.pageName = "My tests";
    $rootScope.showLeftMenu = true;
    
    var updatePage = function(){
        $http.get('/user/' + $rootScope.id).then(
            function(res) {
                $rootScope.account = res.data.account;
            },
            function(err) {
                ngNotify.set(err.data);
                $state.go('start');
            }
        );
    };
    
    updatePage();
    
    $scope.gridTests = {
        enableFiltering: true,
    };
    
    $scope.gridTests.data = myTests.map(function(test){
        return {
            num: myTests.indexOf(test) + 1,
            testName: test.name,
            description: test.description,
            testId: test._id
        };
    });
    
    $scope.gridTests.columnDefs = [
        { name: 'num', headerCellClass: 'header-filtered', minWidth: '80', maxWidth: '80' },
        { name: 'testName', headerCellClass: 'header-filtered', minWidth: '150', cellTemplate: '<div class="add-cell-test"><a class="ngCellText" ng-class="col.colIndex()" href="/test/{{row.entity.testId}}">{{row.entity.testName}}</a></div>' },
        { name: 'description', headerCellClass: 'header-filtered', minWidth: '200' },
        { name: 'testId', visible: false }
       
    ];
    
    console.log(myTests);
}]);
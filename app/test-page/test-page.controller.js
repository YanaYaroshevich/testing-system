'use strict';

angular.module('myApp.testPage')
    
.controller('TestPageCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', 'uiGridConstants', function($scope, $rootScope, $http, ngNotify, uiGridConstants) {
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Test";
    
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
}]);
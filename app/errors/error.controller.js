'use strict';

angular.module('myApp.error')

.controller('ErrorCtrl', ['$scope', '$rootScope', function($scope, $rootScope){
    $rootScope.showLeftMenu = false;
    $scope.pageName = '';
}]);
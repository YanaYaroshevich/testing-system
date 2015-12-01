'use strict';

angular.module('myApp.error')

.controller('ErrorCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
    $scope.showLeftMenu = false;
    $scope.pageName = '';
    
}]);
'use strict';

angular.module('myApp.newUser')
    
.controller('NewUserCtrl', ['$scope', '$rootScope', 'ngNotify', function($scope, $rootScope, ngNotify) {
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    $scope.pageName = 'User creation';  
    
}]);
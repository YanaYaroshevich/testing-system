angular.module('myApp')

.controller('MainCtrl', ['$scope', 'ngNotify', '$rootScope', 'authService', function ($scope, ngNotify, $rootScope, authService) {
     ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    try {  
        $rootScope.account = {};
        $scope.auth = authService;
    }
    catch (e) {
        ngNotify.set(e);
    }
}]);
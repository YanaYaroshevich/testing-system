'use strict';

angular.module('myApp.startPage')

.controller('StartPageCtrl', ['$scope', '$rootScope', 'ngNotify', 'loginService', function($scope, $rootScope, ngNotify, loginService) {
    $scope.rememberMe = false;
    var wrongInput = false;
    
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    $scope.login = function(){
        var form = {};
        form.password = $scope.curPassword;
        form.email = $scope.curEmail;
        loginService.login(form, $scope.rememberMe).then(function(ans) {
            wrongInput = ans.wrongInput;
            if (ans.errData){
                ngNotify.set(ans.errData);
            }
        });
    };
    
    $scope.getWrongInput = function(){
        return wrongInput;
    };
}]);
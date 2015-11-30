'use strict';

angular.module('myApp.startPage')

.controller('StartPageCtrl', ['$scope', '$rootScope', '$http', '$state', '$cookies', 'ngNotify', function($scope, $rootScope, $http, $state, $cookies, ngNotify) {
    $rootScope.showLeftMenu = false;
    $scope.rememberMe = false;
    $scope.wrongInput = false;
    
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
        $http.post('/login', form).then(function(res){
            if(res.data.noErrors){
                $scope.wrongInput = false;
                $rootScope.account = res.data.account;
                $rootScope.id = res.data.account._id;
                if ($scope.rememberMe){
                    if(typeof(Storage) == "undefined") {
                        ngNotify.set('localStorage is not accessible');
                    }
                    else {
                        localStorage.setItem('id', res.data.account._id);
                    }
                }    
                else {
                    if(typeof(Storage) == "undefined") {
                        ngNotify.set('localStorage is not accessible');
                    }
                    else {
                        localStorage.removeItem('id');
                    }
                }
                $state.go('main');
            }
            else {
                $scope.wrongInput = true;
            }
        }, function(err){
            $scope.wrongInput = true;
            ngNotify.set(err.data);
        });
    };
}]);
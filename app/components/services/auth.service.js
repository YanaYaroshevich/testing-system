'use strict';

angular.module('auth')

.service('authService', ['$http', '$state', function($http, $state){
    var account;
    
    return {
        setAccount: function(id){
            if (id){
                return $http.get('/user/' + id).then(function(res){
                    account = res.data.account;
                }, function(err) {
                    console.log(err.data);
                });
            }
        },
        isTeacher: function(){
            return account && account.role === 2; 
        },
        isStudent: function(){
            return account && account.role === 1;
        },
        isAdmin: function(){
            return account && account.role === 0;
        },
        isAuthorised: function(state){
            if (account){
                switch(state){
                    case 'newTest': {
                        if (!this.isTeacher()){
                            return false;
                        }
                        break;
                    }
                    default: {}
                }
            }
            return true;
        },
        isStartPage: function(){
            return ($state.is('start'));
        },
        isMainPage: function(){
            return ($state.is('main'));
        },
        isNewTestPage: function(){
            return ($state.is('newTest'));
        },
        getUserName: function(){
            return account && !this.isStartPage() ? account.firstName + ' ' + account.lastName : '';
        },
        getRole: function(){
            return account && !this.isStartPage() ? account.role : -1;
        }
    };
}]);
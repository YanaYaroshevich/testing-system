'use strict';

angular.module('auth')

.service('authService', ['$http', function($http){
    var account;
    
    return {
        setAccount: function(id){
            if (id){
                return $http.get('/user/' + id).then(function(res){
                    account = res.data;
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
        }
            
    };
}]);
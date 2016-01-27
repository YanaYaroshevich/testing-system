'use strict';

angular.module('logout').service('logoutService', ['$http', '$rootScope', '$state', function($http, $rootScope, $state){
    return {
        logout: function(){
            return $http.post('/rest/logout', {id: $rootScope.id}).then(function(res){
                if(typeof(Storage) != 'undefined') {
                    localStorage.removeItem('id');
                    delete $rootScope.id;
                }
                $state.go('start');
                return {
                    wrongLogout: false    
                };
            }, function(err){
                return {
                    wrongLogout: true,
                    msg: err.data
                };
            });
        }
    };
}]);
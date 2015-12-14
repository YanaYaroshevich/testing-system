'use strict';

angular.module('test')

.service('testService', ['$http', '$state', function($http, $state){
    return {
        createTest: function(test){
            return $http.post('/new/test/add', test).then(function (res) {
                $state.go('test', {testId: res.data.testId});
            }, function (err) {
                return err;
            });
        }    
    };
}]);
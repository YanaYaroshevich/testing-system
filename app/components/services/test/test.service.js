'use strict';

angular.module('test')

.service('testService', ['$http', '$state', function($http, $state){
    return {
        createTest: function(test){
            return $http.post('/new/test/add', test).then(function(res) {
                $state.go('test', {testId: res.data.testId});
            }, function (err) {
                return err;
            });
        },
        editTest: function(test, id){
            return $http.put('/test/edit/complete/' + id, test).then(function(res) {
                $state.go('test', {testId: id});
            }, function (err) {
                return err;
            });
        },
        passTest: function(toSend, id){
            return $http.post('/test/pass/submit', toSend).then(function(res){
                $state.go($state.current, {testId: id}, {reload: true});
            }, function(err){
                return err;
            });
        }
    };
}]);
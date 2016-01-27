'use strict';

angular.module('test')

.service('testService', ['$http', '$state', function($http, $state){
    return {
        createTest: function(test){
            return $http.post('/rest/test/new', test).then(function(res) {
                $state.go('test', {testId: res.data.testId});
            }, function (err) {
                return err;
            });
        },
        editTest: function(test, id){
            return $http.put('/rest/test/' + id + '/edit' , test).then(function(res) {
                $state.go('test', {testId: id});
            }, function (err) {
                return err;
            });
        },
        passTest: function(toSend, id){
            return $http.post('/rest/test/pass', toSend).then(function(res){
                $state.go($state.current, {testId: id}, {reload: true});
            }, function(err){
                return err;
            });
        }, 
        getStatistics: function(id){
            return $http.get('/rest/tests/' + id).then(function(res){
                var testRequests = [];
                for (var i = 0; i < res.data.tests.length; i++){
                    testRequests.push($http.get('/rest/test/' + res.data.tests[i]._id));
                }
                return testRequests;
            }, function(err){
                return err;
            });
        }
    };
}]);
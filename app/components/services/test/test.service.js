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
        }, 
        getStatistics: function(id){
            return $http.get('/tests/page/' + id).then(function(res){
                var testRequests = [];
                for (var i = 0; i < res.data.tests.length; i++){
                    testRequests.push($http.get('/test/page/' + res.data.tests[i]._id));
                }
                return testRequests;
            }, function(err){
                return err;
            });
        }
    };
}]);
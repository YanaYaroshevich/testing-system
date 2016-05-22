'use strict';

angular.module('problem')

    .service('problemService', ['$http', '$state', '$rootScope', function($http, $state, $rootScope) {
        return {
            createProblem: function(problem){
                return $http.post('/rest/problem/new', problem).then(function(res) {
                    $state.go('problem', {problemId: res.data.problemId});
                }, function (err) {
                    return err;
                });
            }
        };
    }]);
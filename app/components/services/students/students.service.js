'use strict';

angular.module('students')

.service('studService', ['$http', 'ngNotify', '$rootScope', function($http, ngNotify, $rootScope){
    return { 
        getStuds: function(){
            return $http.get('/new/test/students/' + $rootScope.id).then(function (res) {
                if (res.data){
                   return res.data.map(function(stud){
                        return {
                            firstName: stud.firstName,
                            lastName: stud.lastName,
                            email: stud.email,
                            course: stud.course,
                            group: stud.group,
                            studId: stud._id
                        };
                    });
                }
                else {
                    return {};
                }
            }, function (err) {   
                ngNotify.set(err.data);
                return err;
            })
        }
    };
}]);
'use strict';

angular.module('students')

.service('studService', ['$http', '$rootScope', function($http, $rootScope){
    return { 
        getStuds: function(){
            return $http.get('/rest/test/new/students/' + $rootScope.id).then(function (res) {
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
                    return new Error("No students to show");
                }
            }, function (err) {   
                return err;
            })
        }
    };
}]);
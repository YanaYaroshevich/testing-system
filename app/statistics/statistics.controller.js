'use strict';

angular.module('myApp.statistics')

.controller('StatisticsPageCtrl', ['$scope', '$rootScope', 'ngNotify', '$http', '$q', function($scope, $rootScope, ngNotify, $http, $q) {
    $scope.pageName = 'Statistics';
    $rootScope.showLeftMenu = true;
    
    /*--------------------------------- Pie charts ------------------------------------------------------*/
    
    $scope.testsStatistics = [];
    var testRequests = [];
    $scope.pieChartsData = [];
    var studentsPassed = 0;
    var studentsNotPassed = 0;
    
    $http.get('/tests/page/' + $rootScope.id).then(function(res){
        for (var i = 0; i < res.data.tests.length; i++){
            testRequests.push($http.get('/test/page/' + res.data.tests[i]._id));
        }
        $q.all(testRequests).then(function (results) {
            getPieChartsData(results);
            getLineChartsData(results);
        }, function (err) {
            ngNotify.set(err.statusText);
        });
    }, function(err){
        ngNotify.set(err.data);
    });
    
    var getPieChartsData = function(results) {
        for (var i = 0; i < results.length; i++) {
            studentsPassed = 0;
            studentsNotPassed = 0;
            for (var j = 0; j < results[i].data.test.students.length; j++){
                if (results[i].data.test.students[j].passed){
                    studentsPassed++;
                }
                else {
                    studentsNotPassed++;
                }
            }
            $scope.testsStatistics.push({passed: studentsPassed, notPassed: studentsNotPassed, name: results[i].data.test.name});

        }
        for (var i = 0; i < $scope.testsStatistics.length; i++){
           $scope.pieChartsData.push([{key: "Passed", y: $scope.testsStatistics[i].passed}, {key: "Not passed", y: $scope.testsStatistics[i].notPassed}]);
        }
    };
    
    $scope.optionsPie = {
        chart: {
            type: 'pieChart',
            height: 200,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: false,
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };
    
    /*-------------------  Cumulative line chart -------------------------*/
    
    var date = null;
    var grade = 0;
    $scope.lineChartsData = [];
    
    $scope.optionsLine = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 65
            },
            x: function(d){ return d[0]; },
            y: function(d){ return d[1] / 100; },

            color: d3.scale.category10().range(),
            duration: 300,
            useInteractiveGuideline: true,
            clipVoronoi: false,

            xAxis: {
                axisLabel: 'Date',
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
                },
                showMaxMin: false,
                staggerLabels: true
            },

            yAxis: {
                axisLabel: 'Percent',
                tickFormat: function(d){
                    return d3.format("%")(d);
                }
            }
        }
    };

    
    var getLineChartsData = function(results){
        for (var i = 0; i < results.length; i++) {
            date = null;
            grade = 0;
            for (var j = 0; j < results[i].data.test.students.length; j++){
                if (results[i].data.test.students[j].passed){
                    $scope.lineChartsData[i] = {key: results[i].data.test.name, values: [] };
                    date = results[i].data.test.students[j].dateOfPass;
                    grade = results[i].data.test.students[j].grade;
                    $scope.lineChartsData[i].values.push([date, grade]);
                }
            }   
        }
    };
    
    
}]);
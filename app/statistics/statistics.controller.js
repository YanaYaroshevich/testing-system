'use strict';

angular.module('myApp.statistics')

.controller('StatisticsPageCtrl', ['$scope', '$rootScope', 'ngNotify', '$q', 'testService', function($scope, $rootScope, ngNotify, $q, testService) {
    $scope.pageName = 'Statistics';
    $rootScope.showLeftMenu = true;
    
    /*--------------------------------- Pie charts ------------------------------------------------------*/
    
    $scope.testsStatistics = [];
    $scope.pieChartsData = [];
    var studentsPassed = 0;
    var studentsNotPassed = 0;
    
    testService.getStatistics($rootScope.id).then(function(testRequests){
        $q.all(testRequests).then(function (results) {
            getPieChartsData(results);
            getLineChartsData(results);
            
        }, function (err) {
            ngNotify.set(err.message);
        });    
    }, function(err){
        ngNotify.set(err.message);
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
           $scope.pieChartsData.push([{key: 'Passed', y: $scope.testsStatistics[i].passed}, {key: 'Not passed', y: $scope.testsStatistics[i].notPassed}]);
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
    
    var getLineChartsData = function(results){
        for (var i = 0; i < results.length; i++) {
            date = null;
            grade = 0;
            $scope.lineChartsData[i] = {key: results[i].data.test.name, values: [] };
            for (var j = 0; j < results[i].data.test.students.length; j++){
                if (results[i].data.test.students[j].passed){
                    date = new Date(results[i].data.test.students[j].dateOfPass).getTime();
                    grade = results[i].data.test.students[j].grade;
                    $scope.lineChartsData[i].values.push([date, grade]);
                }
            }   
        }
    };
    
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
            useInteractiveGuideline: true,

            xAxis: {
                ticks: 8,
                axisLabel: 'Date',
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
                },
                showMaxMin: false,
            },

            yAxis: {
                ticks: 20,
                axisLabel: 'Percent',
                tickFormat: function(d){
                    return d3.format(',.1%')(d);
                },
                axisLabelDistance: 0
            }
        }
    };
    
    
}]);
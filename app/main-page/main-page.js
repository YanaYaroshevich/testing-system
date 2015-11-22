'use strict';

angular.module('myApp.mainPage', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main-page/main-page.html',
    controller: 'MainPageCtrl'
  });
}])

.controller('MainPageCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
    $rootScope.path = '/main';
    $rootScope.showLeftMenu = true;
    $rootScope.pageName = "Main page";
    
    var getNews = function() {
        console.log($rootScope.account);
        $http.get('/main/' + $rootScope.account._id + '/news').then(function (res) {
            $scope.news = res.data.news.map(function(elem){
                elem.onClose = (function(newsId){
                    return function() { onClose(newsId); };
                })(elem._id);
                return elem;
            });
            console.log($scope.news);
        }, function (err) {
            console.log(err);
        });
    }

    var onClose = function(newsId){
        $http.delete('/main/' + $rootScope.account._id + '/news/' + newsId).then(function(res){
            getNews();
        }, function (err) {
            console.log(err);
        });
    }
    
    getNews();
}]);
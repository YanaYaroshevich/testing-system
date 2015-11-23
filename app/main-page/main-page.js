'use strict';

angular.module('myApp.mainPage', [])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main-page/main-page.html',
    controller: 'MainPageCtrl'
  });
}])

.controller('MainPageCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', function($scope, $rootScope, $http, ngNotify) {
    $rootScope.path = '/main';
    $rootScope.showLeftMenu = true;
    $scope.pageName = "Main page";
    
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    var getNews = function() {
        $http.get('/main/' + $rootScope.account._id + '/news').then(function (res) {
            $scope.news = res.data.news.map(function(elem){
                elem.onClose = (function(newsId){
                    return function() { onClose(newsId); };
                })(elem._id);
                return elem;
            });
        }, function (err) {
            ngNotify.set(err);
        });
    }

    var onClose = function(newsId){
        $http.delete('/main/' + $rootScope.account._id + '/news/' + newsId).then(function(res){
            getNews();
        }, function (err) {
            ngNotify.set(err);
        });
    }
    
    getNews();
}]);
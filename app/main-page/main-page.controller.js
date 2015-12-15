'use strict';

angular.module('myApp.mainPage')

.controller('MainPageCtrl', ['$scope', '$rootScope', '$http', 'ngNotify', '$state', function($scope, $rootScope, $http, ngNotify, $state) {
    $scope.pageName = 'Main page';
    
    ngNotify.config({
        theme: 'pastel',
		position: 'bottom',
		duration: 3000,
		type: 'error',
		sticky: true,
		html: false
    });
    
    var updatePage = function(){
        $http.get('/user/' + $rootScope.id).then(
            function(res) {
                $rootScope.account = res.data.account;
                getNews();
            },
            function(err) {
                ngNotify.set(err.data);
                $state.go('start');
            }
        );
    };
    
    var getNews = function() {
        $http.get('/main/' + $rootScope.account._id + '/news').then(function (res) {
            $scope.news = res.data.news.map(function(elem){
                elem.onClose = (function(newsId){
                    return function() { onClose(newsId); };
                })(elem._id);
                return elem;
            });
            $scope.news.reverse();
        }, function (err) {
            ngNotify.set(err.data);
        });
    };

    var onClose = function(newsId){
        $http.delete('/main/' + $rootScope.account._id + '/news/' + newsId).then(function(res){
            getNews();
        }, function (err) {
            ngNotify.set(err.data);
        });
    };
    
    updatePage();
}]);
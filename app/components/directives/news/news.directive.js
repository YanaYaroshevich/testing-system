'use strict';

angular.module('news')

.directive('newsDir', [
    function(){
        function link(scope, elem, attrs){
            scope.date = new Date(scope.model.date).toLocaleString();
            scope.text = scope.model.text;
            scope.newsLink = scope.model.link;
            scope.linkText = scope.model.linkText;
            scope.newsId = scope.model._id;
            scope.onClose = scope.model.onClose;
        }

        return {
            restrict: 'E',
            templateUrl: '../components/directives/news/news.html',
            link: link,
            scope: {
                model: '='
            }
        };
    }
]);
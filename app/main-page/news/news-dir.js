angular.module('news', []).directive('newsDir', [
    function(){
        function link(scope, elem, attrs){
            scope.date = scope.model.date;
            scope.text = scope.model.text;
            scope.newsLink = scope.model.link;
            scope.linkText = scope.model.linkText;
            scope.newsId = scope.model._id;
            scope.onClose = scope.model.onClose;
        }

        return {
            restrict: 'E',
            templateUrl: 'main-page/news/news-tmpl.html',
            link: link,
            scope: {
                model: '='
            }
        };
    }
]);
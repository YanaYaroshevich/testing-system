'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.startPage',
  'myApp.mainPage',
  'ui.bootstrap',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/start'});
}]).
controller('CollapseCtrl', ['$scope', '$location', function($scope, $location) {
    window.scope = $scope;
    
    $scope.isCollapsed = true;
    
    $scope.$watch(function(){ 
                    return $location.path();
                  },
                  function(){
                    if($location.path() === '/main'){
                        $scope.showLeftMenu = true;
                        $scope.pageName = "Main page";
                    }
                    else if ($location.path() === '/start'){
                        $scope.showLeftMenu = false;
                        $scope.pageName = "";
                    }
                  }
    );
}]);
var app = angular.module('PlayAllAudio', ['ngRoute', 'ngCookies']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'View/Search.html',
        controller: 'SearchController'
    })
    .when('/search', {
        templateUrl: 'View/Search.html',
        controller: 'SearchController'
    })
    .when('/about', {
        templateUrl: 'View/About.html'
    })
    .otherwise({
        redirectTo: '/'
    });

}]);


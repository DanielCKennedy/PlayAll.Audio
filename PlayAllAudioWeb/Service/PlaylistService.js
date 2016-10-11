app.service('Playlist', ['$rootScope', function ($rootScope) {

    this.add = function (song) {
        console.log('playlist:add');
        $rootScope.$broadcast('playlist:add', song);
    };

    this.next = function () {
        console.log('playlist:next');
        $rootScope.$broadcast('playlist:next');
    };

}]);
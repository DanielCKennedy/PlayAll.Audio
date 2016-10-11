app.controller('PlaylistController', ['$scope', '$cookieStore', 'SoundCloud', 'YouTube', function ($scope, $cookieStore, SoundCloud, YouTube) {

    var defaultSong = {
        Title: '',
        User: '',
        Player: '',
        Source: 0
    }
    $scope.collection = [];
    $scope.selectedIndex = -1;
    
    $scope.selected = {
        index: -1,
        song: defaultSong
    };

    $scope.start = function () {
        if ($scope.selected.song.Source == 1) {
            console.log('Selected SoundCloud...');
            YouTube.stop();
            SoundCloud.setupPlayer($scope.selected.song.Player);
        }
        else if ($scope.selected.song.Source == 2) {
            console.log('Selected YouTube...');
            SoundCloud.stop();
            YouTube.setupPlayer($scope.selected.song.Player);
        }
    };

    $scope.toggle = function () {
        if ($scope.collection.length > 0) {
            if ($scope.selected.song.Source == 1) {
                SoundCloud.toggle();
            }
            else if ($scope.selected.song.Source == 2) {
                YouTube.toggle();
            }
        }
    };

    $scope.next = function () {
        if ($scope.collection.length > 0) {
            $scope.selectThis(($scope.selected.index + 1) % $scope.collection.length);
        }
    };

    $scope.previous = function () {
        if ($scope.collection.length > 0) {
            $scope.selectThis((($scope.selected.index - 1) % $scope.collection.length + $scope.collection.length) % $scope.collection.length);
        }
    };
    
    $scope.selectThis = function (index) {
        $scope.selected.index = index;
        $scope.selected.song = this.collection[index];
        $scope.start();
    };

    $scope.removeThis = function (index) {
        if (this.collection.length > 1 && this.selected.index == index) {
            $scope.next();
        }

        if (index < this.selected.index) {
            $scope.selected.index = this.selected.index - 1;
        }
        
        for (i = index; i < this.collection.length; i++) {
            this.collection[i] = this.collection[i + 1];
        }
        this.collection.pop();

        if (this.collection.length == 0) {
            YouTube.stop();
            SoundCloud.stop();
            $scope.selected.index = -1;
            $scope.selected.song = defaultSong;
        }
        $cookieStore.put('playlist', $scope.collection);
        console.log('here.');
    };

    $scope.collapse = function () {
        var item = document.getElementById('collapsable');
        var page = document.getElementById('pageArea');
        var playlist = document.getElementById('playlistBar');
        if (page.style.width != '70%') {
            page.style.width = '70%';
            playlist.style.minWidth = '20px';
            playlist.style.width = '20px';
        }
        else {
            page.style.width = '55%';
            playlist.style.minWidth = '300px';
            playlist.style.width = '30%';
        }
    };

    $scope.$on('playlist:add', function (event, data) {
        $scope.collection.push({
            Title: data.Title,
            User: data.User,
            Player: data.Player,
            Source: data.Source
        });
        if ($scope.collection.length == 1) {
            $scope.selected.index = 0;
            $scope.selected.song = $scope.collection[0];
            $scope.start();
        }
        $cookieStore.put('playlist', $scope.collection);
    });

    $scope.$on('playlist:next', function () {
        $scope.$apply(function () {
            $scope.next();
        });
    });

    var init = function () {
        console.log('Page Loaded.');
        console.log($cookieStore.get('playlist'));
        var playlist = $cookieStore.get('playlist');
        if (playlist) {
            $scope.collection = playlist;
        }
    }

    init();
}]);
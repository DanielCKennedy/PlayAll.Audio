app.controller('SearchController', ['$scope', 'Playlist', 'SoundCloud', 'YouTube', function ($scope, Playlist, SoundCloud, YouTube) {

    $scope.results = [];
    $scope.query = '';
    $scope.isLoading = false;

    $scope.searchSoundCloud = function () {
        if (this.query != '') {
            $scope.isLoading = true;
            SoundCloud.search(this.query).then(function (resultList) {
                $scope.results = resultList;
                $scope.isLoading = false;
            });
        }
    };

    $scope.searchYouTube = function () {
        if (this.query != '') {
            $scope.isLoading = true;
            YouTube.search(this.query).then(function (resultList) {
                $scope.results = resultList;
                $scope.isLoading = false;
            });
        }
    };

    $scope.searchAll = function () {
        if (this.query != '') {
            var q = this.query;
            $scope.isLoading = true;
            SoundCloud.search(q).then(function (soundcloudResults) {
                YouTube.search(q).then(function (youtubeResults) {
                    var length = soundcloudResults.length > youtubeResults.length ? soundcloudResults.length : youtubeResults.length;
                    $scope.results = [];
                    for (i = 0; i < length; i++) {
                        if (i < soundcloudResults.length) {
                            $scope.results.push(soundcloudResults[i]);
                        }
                        if (i < youtubeResults.length) {
                            $scope.results.push(youtubeResults[i]);
                        }
                    }
                    $scope.isLoading = false;
                });
            });
        }
    };

    $scope.addThis = function (index) {
        Playlist.add(this.results[index]);
    };

}]);
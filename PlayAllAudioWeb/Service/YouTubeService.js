app.service('YouTube', ['$http', 'Playlist', function ($http, Playlist) {

    var clientId = 'AIzaSyDQhAC2dE4rnis3wdWTtZ1Huc5678bf-xI';
    var searchUrl = 'https://www.googleapis.com/youtube/v3/search';

    var player = null;
    var first = true;
    var isPlaying = false;
    var videoId;


    this.setupPlayer = function (id) {
        console.log('Setting up YouTube...');
        if (player) {
            player.loadVideoById(id);
        }
        else {
            player = new YT.Player('YT-player', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
            videoId = id;
        }
    };

    function onPlayerReady(event) {
        if (first) {
            event.target.loadVideoById(videoId);
            first = false;
        }
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        isPlaying = false;
        if (event.data == YT.PlayerState.ENDED) {
            Playlist.next();
        }
        else if (event.data == YT.PlayerState.PLAYING) {
            isPlaying = true;
        }
    }

    this.toggle = function () {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            }
            else {
                player.playVideo();
            }
        }
    };

    this.stop = function () {
        if (player) {
            player.stopVideo();
        }
    };

    this.search = function (query) {
        return $http.get(searchUrl, {
            params: {
                q: query,
                key: clientId,
                type: 'video',
                maxResults: '10',
                part: 'snippet,id'
            },
            cache: true
        }).then(function (response) {
            if (response.status == 200) {
                var data = response.data;
                var resultList = [];
                for (i = 0; i < 10 && i < data.items.length; i++) {
                    var resultItem = {
                        Title: data.items[i].snippet.title,
                        User: data.items[i].snippet.channelTitle,
                        Player: data.items[i].id.videoId,
                        Source: 2,
                        Artwork: data.items[i].snippet.thumbnails.default.url
                    };
                    resultList.push(resultItem);
                }
                return resultList;
            }
        }, function (response) {
            return [];
        });
    };

}]);
app.service('SoundCloud', ['$http', 'Playlist', function ($http, Playlist) {
    
    var clientId = 'e38841b15b2059a39f261df195dfb430';
    var searchUrl = 'https://api.soundcloud.com/search/sounds';

    var player = null;

    this.setupPlayer = function (id) {
        console.log('Setting up SoundCloud...');
        try {
            if (player) {
                player.load(id, { auto_play: true });
            }
            else {
                player = SC.Widget(document.getElementById('SC-player'));
                player.bind(SC.Widget.Events.FINISH, function () {
                    Playlist.next();
                });
                player.load(id, { auto_play: true });
            }

        }
        catch (e) {
            player = null;
            console.log(e.message);
        }
    };

    this.toggle = function () {
        if (player) {
            player.toggle();
        }
    };

    this.stop = function () {
        if (player) {
            player.pause();
        }
        else {
            try {
                player = SC.Widget(document.getElementById('SC-player'));
                player.bind(SC.Widget.Events.READY, function () {
                    player.pause();
                });
            }
            catch (e) {
                console.log(e.message);
            }
            
        }
    };

    this.search = function (query) {
        return $http.get(searchUrl, {
            params: {
                q: query,
                client_id: clientId
            },
            cache: true
        }).then(function (response) {
            if (response.status == 200) {
                var data = response.data;
                var resultList = [];
                for (i = 0; i < 10 && i < data.collection.length; i++) {
                    var resultItem = {
                        Title: data.collection[i].title,
                        User: data.collection[i].user.username,
                        Player: data.collection[i].uri + '&visual=true&hide_related=true',
                        Source: 1,
                        Artwork: data.collection[i].artwork_url
                    };
                    resultList.push(resultItem);
                }
                return resultList;
            }
            return [];
        }, function (response) {
            return [];
        });
    };

}]);
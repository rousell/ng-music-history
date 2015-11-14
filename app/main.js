var app = angular.module('MusicStudy', ['ngRoute']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
      .when('/songs/list', {
        templateUrl: 'partials/song-list.html',
        controller: "SongDivCntl"
      })
      .when('/songs/new', {
        templateUrl: 'partials/song-form.html',
        controller: "addSong"
      });
  }]);

app.factory("song-service", function($http, $q){
  var getSongs = function(){
    return $q(function(resolve, reject){
    $http
      .get('./app/origSongs.json')
      .success(
        function(objectFromJSON){
          resolve(objectFromJSON.songs);
        },function(error){
          reject(error);
        }
      );
    }); // end of promise
  }; // end of getSongs

  var addSong = function(song){
    songObj.push(song);
    return songObj;
  };

  return {
    getSongs: getSongs,
    addSong: addSong
  };
}); // end of factory


app.controller("SongDivCntl",
  // Notice the new syntax. Since I'm including one of my own dependencies
  // then I need to include each one in array of strings (just like RequireJS)
  // and have a matching argument in the callback function.
  [
    "$scope",
    "song-service",
    function($scope, song_service) {
      $scope.songObj = [];
      song_service.getSongs().then(function(data){
        $scope.songObj = data;
      });  // Returns all songs
    }
  ]
);
// first
app.controller("addSong", ["$scope", "song_service",
  function($scope, song_service) {

    $scope.newSong = { artist: "", album: "", title: ""};
    $scope.songObj = [];

    $scope.addSong = function() {
      $scope.songObj.$add({
        artist: $scope.newSong.artist,
        title: $scope.newSong.title,
        album: $scope.newSong.album
      });
    };
  }
]);
// fixed?
app.controller("addSong",
  [
    "$scope",
    "song-service",
    function($scope, song_service) {
      $scope.newSong = { artist: "", album: "", name: ""};

      $scope.addSong = function() {
        song_service.addSong({
          artist: $scope.newSong.artist,
          name: $scope.newSong.name,
          album: $scope.newSong.album
        });
      };
    }
  ]
);

// app.controller("SongDivCntl",
//   [
//     "$scope", "song-service,"
//     function($scope, song-service) {

//       $scope.songObj = simple_songs.getSongs();
//       console.log(songObj);

//   // $scope.songObj = [];

//   // $.ajax({
//   //   url:"app/origSongs.json"
//   // }).done(function(songCallback){
//   //   $scope.songObj = songCallback.songs;
//   //   $scope.$apply();
//   // });

//   // $("#add_songs").click(function() {
//   //   $.ajax({
//   //     url:"app/moreSongs.json"
//   //   }).done(function(songCallback){
//   //     $scope.songObj = songCallback.songs;
//   //     $scope.$apply();
//   //   });
//   // });

//   // $scope.deleteSong=function(song){
//   //   console.log(song);
//   //   $(document).on("click", ".button_delete", function() {
//   //     $(this).closest("div").remove();
//   //   });
//   // };
//   };
//   ]
// }); // end app.controller for song div




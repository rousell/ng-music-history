var app = angular.module('MusicStudy', ['firebase', 'ngRoute']);

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
      })
      .when('/songs/:songID', {
        templateUrl: 'partials/one-song.html',
        controller: 'SongDetailCntl'
      })
      .otherwise({redirectTo: '/songs/list'});
  }]);

app.controller("SongDivCntl",
  // Notice the new syntax. Since I'm including one of my own dependencies
  // then I need to include each one in array of strings (just like RequireJS)
  // and have a matching argument in the callback function.
  [
    "$scope",
    "$firebaseArray",
    function($scope, $firebaseArray) {

      var ref = new Firebase("https://music-hist.firebaseio.com/songs");

      $scope.songObj = $firebaseArray(ref);


    } // end of function
]); // end of SongDivCntl


app.controller("addSong",
  [
  "$scope",
  "$firebaseArray",
  function($scope, $firebaseArray) {

    var ref = new Firebase("https://music-hist.firebaseio.com/songs");
    $scope.songObj = $firebaseArray(ref);
    $scope.newSong = {};

    $scope.addSong = function(){
      $scope.songObj.$add({
        artist: $scope.newSong.artist,
        title: $scope.newSong.title,
        album: $scope.newSong.album,
      });
    };


  }] // end of function
); // end of addSong


app.controller("SongDetailCntl",
  [
  "$scope",
  "$routeParams",
  "$firebaseArray",
  function($scope, $routeParams, $firebaseArray) {
    $scope.selectedSong = {};
    $scope.songID = $routeParams.songID;
    console.log($routeParams.songID);

    var ref = new Firebase("https://music-hist.firebaseio.com/songs");
    $scope.songObj = $firebaseArray(ref);

    $scope.songObj.$loaded()
      .then(function(){
        $scope.selectedSong = $scope.songObj.$getRecord($scope.songID);
      })
      .catch(function(error){
        console.log("error: ", error);
      });

  }] // end of function
); // end of SongDetailCntl


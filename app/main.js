var app = angular.module('MusicStudy', ['firebase', 'ngRoute']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'AuthCntl as authCntl'
      })
      // .when('/register', {
      //   templateUrl: 'partials/register.html',
      //   controller: 'AuthCntl'
      // })
      .when('/songs/list', {
        templateUrl: 'partials/song-list.html',
        controller: 'SongDivCntl as songdiv'
      })
      .when('/songs/new', {
        templateUrl: 'partials/song-form.html',
        controller: 'addSong as addsong'
      })
      .when('/songs/:songID', {
        templateUrl: 'partials/one-song.html',
        controller: 'SongDetailCntl as songdetailcntl'
      })
      .otherwise({redirectTo: '/'});
  }]);

app.controller("AuthCntl",
  [
    "$rootScope",
    "$firebaseAuth",
    function($rootScope, $firebaseAuth) {

      this.AuthData = null;
      var ref = new Firebase("https://music-hist.firebaseio.com/");
      this.authObj = $firebaseAuth(ref);

      this.AuthLogin = function(){
        console.log("calling login");

        this.authObj.$authWithPassword({
          email: this.email,
          password: this.password
        }).then(function(authData){
          console.log(authData);
          this.AuthData = authData;
        }.bind(this)).catch(function(error){
          console.log("Authentication Failed: ", error);
        });
      };

      this.AuthRegister = function(){
        console.log("registration called");

        this.auth.$createUser({
          password: this.password_rg,
          email: this.email_rg
        }.bind(this)).then(function(authData){
          console.log("registration = successful! ", authData);
        }).catch(function(error){
          console.log("error in creating account: ", error);
        });
      };

      this.AuthLogout = function(){
        console.log("logout done!");
        ref.unauth();
      };

    }
  ]);



app.controller("SongDivCntl",
  [
    "$rootScope",
    "$firebaseArray",
    function($rootScope, $firebaseArray) {

      // console.log($rootScope.uid);
      var ref = new Firebase("https://music-hist.firebaseio.com/Users/"+$rootScope.uid+"/Songs/");
      this.songObj = $firebaseArray(ref);
    } // end of function
]); // end of SongDivCntl


app.controller("addSong",
  [
  "$rootScope",
  "$firebaseArray",
  function($rootScope, $firebaseArray) {

    var ref = new Firebase("https://music-hist.firebaseio.com/Users/"+$rootScope.uid+"/Songs/");
    this.songObj = $firebaseArray(ref);
    console.log(authData);

    var authData = $rootScope.uid;
    console.log("just in $rootScope authentication data ", authData);
    this.newSong = {};

    this.addSong = function(){
      this.songObj.$add({
        artist: this.newSong.artist,
        title: this.newSong.title,
        album: this.newSong.album,
      }.bind(this));
    };
  }] // end of function
); // end of addSong

app.controller("SongDetailCntl",
  [
  "$routeParams",
  "$firebaseArray",
  function($routeParams, $firebaseArray) {
    this.selectedSong = {};
    this.songID = $routeParams.songID;
    console.log($routeParams.songID);

    var ref = new Firebase("https://music-hist.firebaseio.com/Users/"+$rootScope.uid+"/Songs/");
    this.songObj = $firebaseArray(ref);

    this.songObj.$loaded()
      .then(function(){
        this.selectedSong = this.songObj.$getRecord(this.songID);
      }.bind(this))
      .catch(function(error){
        console.log("error: ", error);
      });
  }] // end of function
); // end of SongDetailCntl


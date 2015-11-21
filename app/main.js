var app = angular.module('MusicStudy', ['firebase', 'ngRoute']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'partials/login.html',
        controller: 'AuthCntl as authCntl'
      })
      .when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'AuthCntl as authCntl'
      })
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


app.directive("songBrief",function(){
  return {
    restrict: 'E',
    scope:{
      selectedSong: "=song",
      maxRating: "="
    },
    templateUrl: 'partials/brief.html',
    link: function(scope, element, attributes){
      function setStars(){
        scope.stars = [];
        var rating = parseInt(scope.selectedSong.rating);
        for (var i = 0; i < scope.maxRating; i++) {
          var starClass = (rating <= i) ? "star--empty" : "star--filled";
          scope.stars.push({class: starClass});
        }
      }

      scope.$watch('selectedSong', function(value){
        console.log('value changed');
        scope.selectedSong = value;
        setStars();
      });
    // this.element.$loaded()
    //   .then(function(){setStars();});
    // }
  }
  };
});

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
          $rootScope.uid = authData.uid;
        }.bind(this)).catch(function(error){
          console.log("Authentication Failed: ", error);
        });
      };

      this.AuthRegister = function(){
        console.log("registration called");

        console.log(this.emailrg);
        this.authObj.$createUser({
          email: this.emailrg,
          password: this.passwordrg
        }).then(function(authData){
          console.log("registration = successful! ", authData);
        }).catch(function(error){
          console.log("error in creating account: ", error);
        });
      };

      this.AuthLogout = function(){
        console.log("logout clicked!");
        this.authObj.$unauth();
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

      this.deleteSong = function(){

      };




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
      var numRating = prompt("Enter Rating for Added Song");
      this.songObj.$add({
        artist: this.newSong.artist,
        title: this.newSong.title,
        album: this.newSong.album,
        rating: numRating,
      });
    };
  }] // end of function
); // end of addSong

app.controller("SongDetailCntl",
  [
  "$routeParams",
  "$firebaseArray",
  "$rootScope",
  function($routeParams, $firebaseArray, $rootScope) {
    this.selectedSong = {};
    this.songID = $routeParams.songID;
    console.log($routeParams.songID);
    console.log(this);
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


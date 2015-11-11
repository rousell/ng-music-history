var app = angular.module('MusicStudy', []);

app.controller("SongDivCntl", function($scope){

  $scope.songObj = {};

  $.ajax({
    url:"app/origSongs.json"
  }).done(function(songCallback){
    $scope.songObj = songCallback.songs;
    $scope.$apply();
  });

  $("#add_songs").click(function() {
    $.ajax({
      url:"app/moreSongs.json"
    }).done(function(songCallback){
      $scope.songObj = songCallback.songs;
      $scope.$apply();
    });
  });

  $scope.deleteSong=function(song){
    console.log(song);
    $(document).on("click", ".button_delete", function() {
      $(this).closest("div").remove();
    })
  }

}); // end app.controller for song div




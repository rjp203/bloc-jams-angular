(function() {
  function SongPlayer(Fixtures) {
    var SongPlayer = {};

    /**
    *@desc Retrieves album information from Fixtures service
    *@type {Method}
    */
    var currentAlbum = Fixtures.getAlbum();

    /**
    *@desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      SongPlayer.currentSong = song;
    }

    /**
    *@function playSong
    *@desc Plays audio file currentBuzzObject
    *@param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }

    /**
    *@function getSongIndex
    *@desc Retrieves songs index from list of songs
    *@param {Object} song
    *@returns {Number}
    */
    var getSongIndex = function(song) {
      return currentAlbum.song.indexOf(song);
    }

    /**
    *@desc Active song object from list of songs
    *@param {Object}
    */
    SongPlayer.currentSong = null;

    /**
    *@function SongPlayer.play
    *@desc If current song is not the song user clicks on, the clicked song becomes current song and plays.
    *If the current song is the song user clicked on and song is paused, the song will play
    *@param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    /**
    *@function SongPlayer.pause
    *@desc Pauses audio file currentBuzzObject
    *@param {Object} song
    *@returns {Object} SongPlayer
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    }

    /**
    *@function SongPlayer.previous
    *@desc Gets the index of the currently playing song and increases the index by one.  If index < 0 the currently
    *playing song will stop and the value will be sent to the first song in the list of songs.  Otherwise the previous
    *song will begin to play
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      } else {
        var song = currentAlbum.song[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();


(function() {
  function SongPlayer() {
    var SongPlayer = {};
    /**
    *@desc Currently selected song
    *@param {Object}
    */
    var currentSong = null;
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
        currentSong.playing = null;
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentSong = song;
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
    *@function SongPlayer.play
    *@desc If current song is not the song user clicks on, the clicked song becomes current song and plays.
    *If the current song is the song user clicked on and song is paused, the song will play
    *@param {Object} song
    */
    SongPlayer.play = function(song) {
      if (currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };
    /**
    *@function SongPlayer.pause
    *@desc Pauuses audio file currentBuzzObject
    *@param {Object} song
    *@returns {Object} SongPlayer
    */
    SongPlayer.pause = function(song) {
      currentBuzzObject.pause();
      song.playing = false;
    }

    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', SongPlayer);
})();


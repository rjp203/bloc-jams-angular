(function() {
  function SongPlayer($rootScope, Fixtures) {
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

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    };


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
    *@function stopSong
    *@desc Stops playing audio file currentBuzzObject
    *@param {Object} song
    */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      SongPlayer.currentSong.playing = null;
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
    * @desc Current playback time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;

    /**
    * @desc Sets starting percentage of volume of currently playing song at 80%
    * @type {Number}
    */
    SongPlayer.volume = 80;

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
    *@desc Gets the index of the currently playing song and decreases the index by one.  If index < 0 the currently
    *playing song will stop and the value will be sent to the first song in the list of songs.  Otherwise the previous
    *song will begin to play
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(song);
      } else {
        var song = currentAlbum.song[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    *@function SongPlayer.next
    *@desc Gets the index of the currently playing song and increases the index by one.  If index > the list of songs, the currently
    *playing song will stop and the value will be sent to the last song in the list of songs.  Otherwise the next song will begin to play
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      if (currentSongIndex > currentAlbum.song.length - 1) {
        stopSong(song);
      } else {
        var song = currentAlbum.song[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

    /**
    * @function setCurrentTime
    * @desc Sets current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

    /**
    * @function setVolume
    * @desc Sets percentage of volume of currently playing song
    * @param {Number} volume
    */
    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }
    };

    return SongPlayer;
  };

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();


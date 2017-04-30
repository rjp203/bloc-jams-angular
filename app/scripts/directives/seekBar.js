(function() {
  function seekBar($document) {

    /**
    *@function calculatePercent
    *@desc Calculates the percent along the seek bar where the event occured
    *@param {Object, Event} seekBar, event
    *@returns {Number}
    */
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    return {
      templateUrl: '/templates/directives/seek_bar.html',
      replace: true,
      restrict: 'E',
      scope: {
        onChange: '&'
      },
      link: function(scope, element, attributes) {
        scope.value = 0;
        scope.max = 100;

        /**
        *@desc Holds the element that matches the directive <seek-bar> as a jQuery object
        * @type {Object}
        */
        var seekBar = $(element);

        attributes.$observe('value', function(newValue) {
          scope.value = newValue;
        });

        attributes.$observe('max', function(newValue) {
          scope.max = newValue;
        });

        /**
        *@function percentString
        *@desc Calculates a percentage based on the value and max value of seek bar
        *@returns {Number}
        */
        var percentString = function() {
          var value = scope.value;
          var max = scope.max;
          var percent = value / max * 100;
          return percent + "%";
        };

        /**
        *@function scope.fillStyle
        *@desc Returns width of seek bar fill element based on percentage
        *@returns {Number}
        */
        scope.fillStyle = function() {
          return {width: percentString()};
        };

        /**
        *@function scope.thumbStyle
        *@desc Updates seek bar thumb based on location of user's click or drag on seek bar
        *@returns {Number}
        */
        scope.thumbStyle = function() {
          return {left: percentString()};
        };

        /**
        *@function scope.onClickSeekBar
        *@desc Updates seek bar value based on seek bar width and location of user's click on seek bar
        *@param {Event} event
        */
        scope.onClickSeekBar = function(event) {
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
          notifyOnChange(scope.value);
        };

        /**
        *@function scope.trackThumb
        *@desc Applies the change in value of 'scope.value' as user drags seek bar thumb
        */
        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event) {
            var percent = calculatePercent(seekBar, event);
            scope.$apply(function() {
              scope.value = percent * scope.max;
              notifyOnChange(scope.value);
            });
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        };

        /**
          *@function notifyOnChange
          *@desc Inserts 'newValue' to 'value' that is passed into 'SongPlayer.setCurrentTime()' function
          */
        var notifyOnChange = function(newValue) {
          if (typeof scope.onChange === 'function') {
            scope.onChange({value: newValue});
          }
        };
      }
    };
  }

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();

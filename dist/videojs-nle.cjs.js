/*! @name videojs-nle @version 0.1.0 @license MIT */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var videojs = _interopDefault(require('video.js'));

// Video JS

var defaults = {};
/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} options
 */

var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-nle-controls');
  var framerate = options.framerate ? options.framerate : 24.0;
  var duration = options.duration ? function () {
    return options.duration;
  } : function () {
    return player.duration();
  };

  if (options.frameControls) {
    initControls(player, framerate, duration);
  }

  if (options.smpteTimecode) {
    initSMPTE(player, framerate, duration);
  }
};
/**
 * Function to handle non-linear editor style keyboard events
 *
 *
 *@function initControls
 *@param     {Player} player
 *@param     {number} framerate
 */


var initControls = function initControls(player, framerate, duration) {
  var frame = parseFloat((1 / framerate).toFixed(2));

  var keyDown = function keyDown(event) {
    var keyName = event.keyCode;

    switch (keyName) {
      case 37:
        frameReverse(player, frame);
        break;

      case 39:
        frameForward(player, frame, duration);
        break;
    }
  };

  player.on('keydown', keyDown);
};
/**
 * Function to scrub frame by frame in reverse
 *
 *@function frameReverse
 *@param {Player} player
 *@param {number} frame
 */


var frameReverse = function frameReverse(player, frame) {
  var currentTime = player.currentTime();

  if (currentTime > 0) {
    var decrement = currentTime - frame;
    player.currentTime(decrement);
  }
};
/**
* Function to scrub frame by frame in reverse
*
*@function frameForward
*@param {Player} player
*@param {number} frame
*/


var frameForward = function frameForward(player, frame, duration) {
  var currentTime = player.currentTime();

  if (currentTime < duration()) {
    var increment = Math.min(duration(), currentTime + frame);
    player.currentTime(increment);
  }
};
/**
* Function to convert milliseconds to SMPTE (HH:MM:SS:FF) timecode
*
*@function toSMPTE
*@param {number} time
*@param {number} framerate
*/


var toSMPTE = function toSMPTE(currentTime, framerate) {
  var currentFrame = parseInt(currentTime * framerate);
  var hours = Math.floor(currentTime / 3600);
  var minutes = Math.floor(currentTime / 60);
  var seconds = parseInt(currentTime - hours * 3600 - minutes * 60);
  var frames = parseInt(currentFrame % framerate);
  var timecodeArray = [hours, minutes, seconds, frames];
  var processedTimecodeArray = [];
  timecodeArray.forEach(function (time) {
    if (time < 10) {
      var timeString = "0" + time;
      processedTimecodeArray.push(timeString);
    } else {
      var _timeString = time.toString();

      processedTimecodeArray.push(_timeString);
    }
  });
  return processedTimecodeArray.join(':');
};
/**
* Function to display current time as SMPTE (HH:MM:SS:FF) timecode
*
*@function initSMPTE
*@param {Player} player
*/


var initSMPTE = function initSMPTE(player, framerate, duration) {
  var setCurrentTimeDisplay = function setCurrentTimeDisplay() {
    var currentTimeDisplay = player.controlBar.progressControl.seekBar.playProgressBar.el();
    var currentTime = player.currentTime();
    currentTimeDisplay.dataset.currentTime = toSMPTE(currentTime, framerate);
  };

  var setRemainingTimeDisplay = function setRemainingTimeDisplay() {
    var currentTime = player.currentTime();
    var remainingTimeDisplay = player.controlBar.remainingTimeDisplay.el();
    remainingTimeDisplay.innerHTML = '<div class="vjs-remaining-time-display" aria-live="off"><span class="vjs-control-text">Remaining Time</span>' + toSMPTE(currentTime, framerate) + ' / ' + toSMPTE(duration(), framerate) + '</div>';
  };

  player.on('timeupdate', setCurrentTimeDisplay);
  player.on('timeupdate', setRemainingTimeDisplay);
};
/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function nleControls
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */


var nleControls = function nleControls(options) {
  var _this = this;

  this.ready(function () {
    onPlayerReady(_this, videojs.mergeOptions(defaults, options));
  });
}; // Register the plugin with video.js.


videojs.registerPlugin('nle', nleControls); // Include the version number.

nleControls.VERSION = '__VERSION__';

module.exports = nleControls;

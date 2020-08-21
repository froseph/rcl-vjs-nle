
// Video JS
import videojs from 'video.js';

// Default options for the plugin.
const defaults = {};

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
const onPlayerReady = function(player, options) {
  console.log('here');
  player.addClass('vjs-nle-controls');
  let framerate = options.framerate ? options.framerate : 24.0;
  let duration = options.duration ? () => {return options.duration} : () => {return player.duration()};
  if(options.frameControls) {
    initControls(player, framerate, duration);
  }
  if(options.smpteTimecode) {
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
const initControls = function(player, framerate, duration) {
    const frame = parseFloat((1 / framerate).toFixed(2));
    let keyDown = function keyDown(event){
      const keyName = event.keyCode;
      switch(keyName){
        case 40: // down
          frameReverse(player, frame);
          break;
        case 38: // up
          frameForward(player, frame, duration);
          break;
      }
    }
    player.on('keydown', keyDown);
}

/**
 * Function to scrub frame by frame in reverse
 *
 *@function frameReverse
 *@param {Player} player
 *@param {number} frame
 */
 const frameReverse = function(player, frame) {
   let currentTime = player.currentTime();
   if(currentTime > 0) {
     let decrement = currentTime - frame;
     player.currentTime(decrement);
   }
 }

/**
* Function to scrub frame by frame in reverse
*
*@function frameForward
*@param {Player} player
*@param {number} frame
*/
const frameForward = function(player, frame, duration) {
  let currentTime = player.currentTime();
  if(currentTime < duration()) {
    let increment = Math.min(duration(), currentTime + frame);
    player.currentTime(increment);
  }
}

/**
* Function to convert milliseconds to SMPTE (HH:MM:SS:FF) timecode
*
*@function toSMPTE
*@param {number} time
*@param {number} framerate
*/
const toSMPTE = function(currentTime, framerate) {
  let currentFrame = parseInt(currentTime * framerate);
  let hours = Math.floor(currentTime / 3600);
  let minutes = Math.floor(currentTime / 60);
  let seconds = parseInt(currentTime - (hours * 3600) - (minutes * 60));
  let frames = parseInt(currentFrame % framerate);

  let timecodeArray = [hours, minutes, seconds, frames];
  let processedTimecodeArray = [];

  timecodeArray.forEach((time) => {
    if(time < 10){
      let timeString = "0" + time;
      processedTimecodeArray.push(timeString);
    } else {
      let timeString = time.toString();
      processedTimecodeArray.push(timeString);
    }
  });
  return(processedTimecodeArray.join(':'));
}

/**
* Function to display current time (seconds) to milliseconds
*
*@function toMS
*@param {number} currentTimeInSeconds
*/
const toMS = function(currentTimeInSeconds) {
    return Math.ceil(currentTimeInSeconds * 1000)
}

/**
* Function to display current time as SMPTE (HH:MM:SS:FF) timecode
*
*@function initSMPTE
*@param {Player} player
*/

const initSMPTE = function(player, framerate, duration) {
    const setCurrentTimeDisplay = () => {
      let currentTimeDisplay = player.controlBar.progressControl.seekBar.playProgressBar.el();
      let currentTime = player.currentTime();
      currentTimeDisplay.dataset.currentTime = toSMPTE(currentTime, framerate);
    };
    const setRemainingTimeDisplay = () => {
      let currentTime = player.currentTime();
      let remainingTimeDisplay = player.controlBar.remainingTimeDisplay.el();
      remainingTimeDisplay.innerHTML = '<div class="vjs-remaining-time-display" aria-live="off"><span class="vjs-control-text">Remaining Time</span>'
                                           + toSMPTE(currentTime, framerate) + ' / ' + toSMPTE(duration(), framerate) + '</div>'
    }
    player.on('timeupdate', setCurrentTimeDisplay);
    player.on('timeupdate', setRemainingTimeDisplay);
}

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
const nleControls = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.registerPlugin('nle', nleControls);

// Include the version number.
nleControls.VERSION = '__VERSION__';

export default nleControls;

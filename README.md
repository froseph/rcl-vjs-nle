# videojs-nle

Adds non-linear editor style keyboard controls and smpte timecode to videojs

## Installation
Clone this repo, then:
```sh
npm install && npm run build
```

## Usage

To include videojs-nle on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-nle.min.js"></script>
<script>
  var player = videojs('my-video');

  player.nle({
          frameControls: true, // enables frame-by frame controls
          smpteTimecode: true, // enables SMPTE formatted timecode
          framerate: 29.97 // framerate should be set here
        });
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-nle via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-nle');

var player = videojs('my-video');

player.nle();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-nle'], function(videojs) {
  var player = videojs('my-video');

  player.nle();
});
```

## License

MIT. Copyright (c) Digital Scholarship Lab


[videojs]: http://videojs.com/

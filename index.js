'use strict';
var through = require('through2');    // npm install --save through2

module.exports = function() {
  return through.obj(function(file, encoding, callback) {

    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new gutil.PluginError('gulp-autoprefixer', 'Streaming not supported'));
      return;
    }

    var cfile = file.contents.toString();

    if (this && this.cacheable) {
      this.cacheable();
    }
    let isProp;
    while (isProp = /(is=(?:"|')(.+?)(?:"|'))/.exec(cfile)) {
      // The is block that should be replaced. Looks like: `is="message"`
      let prop = isProp[1];

      // The name of the value that we want to be returning from the style function.
      let elementName = isProp[2];

      // if it is capitalized, set spread
      if (elementName[0] === elementName[0].toUpperCase()) {
        cfile = cfile.replace(prop, `{...this.styles().${ elementName }}`);
      }

      // otherwise just give it an inline style
      else {
        cfile = cfile.replace(prop, `style={ this.styles().${ elementName } }`);
      }
    }
    if (cfile) {
      file.contents = new Buffer(cfile);
    }
    callback(null, file);
  });
};

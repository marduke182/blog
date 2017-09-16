var cheerio = require('cheerio');
var _ = require('lodash');
var extname = require('path').extname;
var readingTime = require('reading-time');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to compute wordcount / average reading time of all paragraphs in a html file
 * based on assemble-middleware-wordcount by Jon Schlinkert https://github.com/assemble/assemble-middleware-wordcount
 * @return {Function}
 */

function plugin(options) {
  return function(files, metalsmith, done) {
    var opts = options || {};

    // setup defaults

    opts.speed = opts.speed || 300; // See http://onforb.es/1crk3KF
    opts.seconds = opts.seconds || false; // if output should include seconds (formatted "x minutes, x seconds")
    opts.raw = opts.raw || false; // if output should be raw integers (without min or sec)
    opts.metaKeyCount = opts.metaKeyCount || "wordCount";
    opts.metaKeyReadingTime = opts.metaKeyReadingTime || "readingTime";

    setImmediate(done);
    Object.keys(files).forEach(function(file) {

      var stats;

      if (isHTML(file) === false) { // only parse HTML-files
        return;
      }
      console.log(files[file].contents.toString());
      stats = readingTime(files[file].contents.toString());

      files[file][opts.metaKeyCount] = stats.words;
      files[file][opts.metaKeyReadingTime] = stats.text;

    });
  };
}


function isHTML(file) {
  return /\.md/.test(extname(file));
}

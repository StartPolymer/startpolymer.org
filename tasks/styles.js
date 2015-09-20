'use strict';

// Transform styles with PostCSS
module.exports = function ($, config, gulp, merge) { return function () {
  var postcssAutoprefixer = require('autoprefixer');
  var postcssCssMqpacker = require('css-mqpacker');
  var postcssCustomMedia = require('postcss-custom-media');
  var postcssDiscardEmpty = require('postcss-discard-empty');
  var postcssImport = require('postcss-import');
  var postcssNesting = require('postcss-nesting');
  var postcssReporter = require('postcss-reporter');
  var postcssPlugins = [
    // Transform @import rules by inlining content
    postcssImport(),
    // Transform W3C CSS Custom Media Queries
    postcssCustomMedia(),
    // Unwrap nested rules, following CSS Nesting Module Level 3 specification
    postcssNesting(),
    // Pack same CSS media query rules into one media query rule
    postcssCssMqpacker(),
    // Add vendor prefixes to CSS rules using values from "Can I Use"
    postcssAutoprefixer(config.autoprefixer),
    // Remove empty rules, selectors & media queries
    postcssDiscardEmpty(),
    postcssReporter({
      clearMessages: true
    })
  ];

  var themes = gulp.src([
      'app/themes/**/*.html'
    ])
    .pipe($.plumber({
      handleError: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe($.changed('dist/themes'))
    .pipe($.sourcemaps.init())
    .pipe($.htmlPostcss(postcssPlugins))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/themes'))
    .pipe(gulp.dest('dist/themes'))
    .pipe($.size({title: 'dist/themes'}));

  var elements = gulp.src([
      'app/elements/**/*.html',
      '!app/elements/elements.html',
      '!app/elements/routing.html'
    ])
    .pipe($.plumber({
      handleError: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe($.changed('dist/elements'))
    .pipe($.sourcemaps.init())
    .pipe($.htmlPostcss(postcssPlugins))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/elements'))
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'dist/elements'}));

  return merge(themes, elements);
};};
#!/usr/bin/env node

'use strict';

var lingon     = require('lingon');
var babel      = require('gulp-babel');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

lingon.config.buildPath = 'dist';

// transpile ES6 to ES5
lingon.preProcessors.push('js', function() {
  return babel({
    nonStandard: false,
    ignore: ['bower_components/**/*', 'node_modules/**/*'],
    compact: false,
    blacklist: ['strict'],
  });
});

// add post-processors
lingon.postProcessors.push('js', /\.min\./, function(params) {
  return [
    ngAnnotate(),
    uglify({
      preserveComments: 'some',
    }),
  ];
});

// redirect user to the example page if not requesting a specific file
lingon.one('serverConfigure', function() {
  lingon.server.get('/', function(req, res) {
    res.redirect('/example/index.html');
  });
});

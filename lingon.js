#!/usr/bin/env node

'use strict';

var lingon     = require('lingon');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

lingon.config.buildPath = 'dist';

// add post-processors
lingon.postProcessors.push('js', /\.min\./, function(params) {
  return [
    ngAnnotate(),
    uglify({
      preserveComments : 'some'
    })
  ];
});

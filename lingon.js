#!/usr/bin/env node

'use strict';

var lingon     = require('lingon');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

// add post-processors
lingon.postProcessors.push('js', /^((?!spec\.).)*$/, function(params) {
  var processors = [];

  // only run minification for build task and filter out filenames with "spec." in it
  if (lingon.task == 'build') {
    processors.push(
      ngAnnotate()
    );

    processors.push(
       uglify({
        preserveComments : 'some'
      })
    );

  }

  return processors;
});

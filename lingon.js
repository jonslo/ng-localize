#!/usr/bin/env node

var lingon = require('lingon');
var uglify = require('gulp-uglify');



// add post-processors
lingon.postProcessors.push('js', /^((?!spec\.).)*$/, function(params) {
  // only run minification for build task and filter out filenames with "spec." in it
  if(lingon.task == 'build') {
    return uglify({
      preserveComments: 'some'
    });
  }
});

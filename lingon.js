#!/usr/bin/env node

'use strict';

let lingon        = require('lingon');
let uglify        = require('gulp-uglify');
let ngAnnotate    = require('gulp-ng-annotate');
let webpack       = require('webpack');
let webpackStream = require('webpack-stream');
let webpackConfig = require('./webpack.config.js');

lingon.config.buildPath = 'dist';

// transpile ES6 to ES5
lingon.postProcessors.push('js', () => {
  let processors = [
    webpackStream(webpackConfig, webpack),
  ];

  // only run ngAnnotate for build task
  if (lingon.task === 'build') {
    processors.push(ngAnnotate());
  }

  return processors;
});

// add post-processors
lingon.postProcessors.push('js', /\.min\./, (params) => {
  return uglify({
    preserveComments: 'some',
  });
});

// redirect user to the example page if not requesting a specific file
lingon.one('serverConfigure', () => {
  lingon.server.get('/', (req, res) => {
    res.redirect('/example/index.html');
  });
});

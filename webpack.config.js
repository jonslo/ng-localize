'use strict';

let path    = require('path');
let webpack = require('webpack');

module.exports = {
  quiet: true,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
  noParse: [
    path.join(__dirname, 'bower_components'),
  ],
  resolve: {
    root: [path.join(__dirname, 'bower_components')],
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    ),
  ],
};

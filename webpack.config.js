const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    test: './test.js',
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: path.resolve(__dirname, './loader/console.js'),
          options: {},
        }, {
          loader: path.resolve(__dirname, './loader/catch.js'),
          options: {},
        }],
      }
    ]
  }
}
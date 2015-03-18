var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  // webpack options
  entry: {
    // the main angular module
    'background': './src/background/run.js',
    'inject': './src/inject/inject.js',
    'dashboard': './src/dashboard/run.js',
  },

  resolve: {
    alias: {
      // localforage: 'localforage!imports?require=>false',
    },
  },

  node: {
    fs: 'empty',
    net: 'empty',
  },

  output: {
    path: "./build",
    // TODO(jared): think about using hashes to make caching a thing
    filename: "[name].js",
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime&experimental=true' },
      { test: /\.json$/, loader: 'json' },

      // { test: /^localforage$/, loader: 'imports?require=>false


      {
          test: require.resolve("localforage"),
          loader: "imports?require=>false",
      },

      {
          test: /[\/](localforage|indexeddb|localstorage|websql)\.js$/,
          loaders: ['imports?this=>window']
      },

      {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }
    ],
  },

  plugins: [commonsPlugin],
  devtool: 'inline-source-map',
  colors: true,

  plugins: [
      new ExtractTextPlugin("[name].css")
  ],
}


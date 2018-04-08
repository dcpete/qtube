const path = require('path');
const webpack = require('webpack');
const html = require('html-webpack-plugin');
const clean = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './src/client/index.js',
    vendor: [
      'axios',
      'es6-promise',
      'lodash',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'redux',
      'redux-form',
      'redux-thunk',
    ]
  },
  plugins: [
    new clean(['dist']),
    new html({
      title: 'qtube',
      template: 'src/client/static/assets/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].[chunkhash].js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env', 'stage-1']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|svg|jpg|gif|xml|ico|webmanifest)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    port: 8080
  }
};

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
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
  },  
  plugins: [
    new clean(['dist']),
    new html({
      title: 'qtube',
      template: 'src/client/static/assets/index.html'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,

        use: [{
          loader: 'babel-loader',

          options: {
            presets: ['react', 'env', 'stage-1']
          }
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      },
      {
        test: /\.(png|svg|jpg|gif|xml|ico|webmanifest)$/,
        use: [{
          loader: 'file-loader',

          options: {
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader'
        }]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    port: 8080
  }
};

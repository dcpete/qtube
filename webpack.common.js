const path = require('path');
const webpack = require('webpack');
const html = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/client/index.js'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        static: {
          test: /[\\/]src[\\/]static[\\/]/,
          name: 'static',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!**.json'],
      cleanStaleWebpackAssets: false
    }),
    new html({
      title: `qtube`,
      template: './src/client/static/assets/index.html'
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
        type: 'javascript/auto',
        test: /\.json$/,
        use: [
          'cache-loader',
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
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
    ],
  }
};

const webpack = require('webpack');
const merge = require('webpack-merge');
const uglify = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })],

  optimization: {
    minimize: true,

    minimizer: [new uglify({
      sourceMap: true
    })]
  }
});

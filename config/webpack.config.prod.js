const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webpack.config.base')

const prodConfig = merge(baseConfig, {
  devtool: '#source-map',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.[hash:5].js'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  }
})

module.exports = prodConfig

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const devConfig = merge(baseConfig, {
  mode: 'development',
  performance: {
    hints: false
  },
  devServer: {
    historyApiFallback: true,
    open: true
  }
})

module.exports = devConfig

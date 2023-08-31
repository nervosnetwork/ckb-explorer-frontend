/* config-overrides.js */
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')

module.exports = function override(config) {
  if (config.ignoreWarnings == null) {
    // eslint-disable-next-line no-param-reassign
    config.ignoreWarnings = []
  }
  // The sourcemap configuration of some of the dependency packages in the project is
  // not standard, but it can't be resolved. For now, filter out these warnings directly.
  config.ignoreWarnings.push(/Failed to parse source map/)

  if (config.plugins == null) {
    // eslint-disable-next-line no-param-reassign
    config.plugins = []
  }
  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction && process.env.SENTRY_AUTH_TOKEN) {
    const isMainnet = process.env.REACT_APP_CHAIN_TYPE === 'mainnet'
    config.plugins.push(
      new SentryWebpackPlugin({
        include: './build',
        // The token must need `project:releases` and `org:read` scopes
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG || 'nervosnet',
        project:
          process.env.SENTRY_PROJECT || (isMainnet ? 'ckb-explorer-frontend-mainnet' : 'ckb-explorer-frontend-testnet'),
      }),
      new AntdDayjsWebpackPlugin(),
    )
  }

  return config
}

/* config-overrides.js */
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

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

  // https://dhanrajsp.me/snippets/customize-css-loader-options-in-nextjs
  const oneOf = config.module.rules.find(rule => typeof rule.oneOf === 'object')
  if (oneOf) {
    const moduleSassRule = oneOf.oneOf.find(rule => regexEqual(rule.test, /\.module\.(scss|sass)$/))
    if (moduleSassRule) {
      // Get the config object for css-loader plugin
      const cssLoader = moduleSassRule.use.find(({ loader }) => loader?.includes('css-loader'))
      if (cssLoader) {
        cssLoader.options = {
          ...cssLoader.options,
          modules: {
            ...cssLoader.options.modules,
            // By default, `CRA` uses `node_modules\react-dev-utils\getCSSModuleLocalIdent` as `getLocalIdent` passed to `css-loader`,
            // which generates class names with base64 suffixes.
            // However, the `@value` syntax of CSS modules does not execute `escapeLocalIdent` when replacing corresponding class names in actual files.
            // Therefore, if a class name's base64 hash contains `+` and is also imported into another file using `@value`,
            // the selector after applying the `@value` syntax will be incorrect.
            // For example, `.CompA_main__KW\+Cg` will become `.CompA_main__KW+Cg` when imported into another file.
            // This may not be a bug but a feature, because `@value` is probably not designed specifically for importing selectors from other files.
            // So here, we add a `+` handling based on the logic of escapeLocalIdent.
            getLocalIdent: (...args) => getCSSModuleLocalIdent(...args).replaceAll('+', '-'),
          },
        }
      }
    }
  }

  return config
}

/**
 * Stolen from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 */
function regexEqual(x, y) {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  )
}

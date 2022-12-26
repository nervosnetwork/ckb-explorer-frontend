/* config-overrides.js */

module.exports = function override(config) {
  if (config.ignoreWarnings == null) {
    // eslint-disable-next-line no-param-reassign
    config.ignoreWarnings = []
  }
  // The sourcemap configuration of some of the dependency packages in the project is
  // not standard, but it can't be resolved. For now, filter out these warnings directly.
  config.ignoreWarnings.push(/Failed to parse source map/)
  return config
}

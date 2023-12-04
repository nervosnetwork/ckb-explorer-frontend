const package = require('./package.json')

module.exports = {
  customSyntax: 'postcss-scss',
  extends: ['stylelint-config-standard'],
  rules: {
    'no-empty-source': null,
    // Based on the discussion in https://github.com/Magickbase/ckb-explorer-public-issues/issues/442, we have decided to use lower camel case.
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
    'selector-id-pattern': null,
    'custom-property-pattern': null,
    // This rule provides little benefit relative to the cost of implementing it, so it has been disabled.
    'no-descending-specificity': null,

    'selector-pseudo-class-no-unknown': [
      true,
      {
        // to support `:global`
        ignorePseudoClasses: ['global'],
      },
    ],
  },

  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
      rules: {
        'scss/dollar-variable-pattern': null,
        'scss/at-rule-no-unknown': [
          true,
          {
            // This syntax is specified by the CSS module specification and implemented by the css-loader.
            // Refs: https://github.com/css-modules/css-modules/blob/master/docs/values-variables.md
            ignoreAtRules: ['value'],
          },
        ],
      },
    },
    {
      files: ['*.tsx', '**/*.tsx'],
      customSyntax: 'postcss-styled-syntax',
      // Currently, it is difficult to integrate postcss into styled-components to achieve CSS compatibility, unless a complex but not robust implementation is done manually.
      // However, considering the implementation cost and the possibility that we may gradually abandon styled-components in the future, we do not adopt this solution.
      // Therefore, without postcss to automatically handle compatibility, we need to handle it manually and avoid introducing syntax that is too high for stylelint.
      // So here we introduce stylelint-no-unsupported-browser-features to help identify unsupported features and manually disable some stylelint rules that involve high-version features.
      plugins: ['stylelint-no-unsupported-browser-features'],
      rules: {
        'media-feature-range-notation': null,
        'plugin/no-unsupported-browser-features': [
          true,
          {
            browsers: package.browserslist,
            // TODO: Perhaps the browserslist should be adjusted to a more reasonable range, at least to a level that is compatible with CSS variables.
            ignore: [
              'css-nesting',
              'css-sticky',
              'css-variables',
              'mdn-text-decoration-shorthand',
              'css-unset-value',
              'flexbox-gap',
              'css-font-stretch',
              'css-overscroll-behavior',
            ],
            ignorePartialSupport: true,
          },
        ],
      },
    },
  ],
}

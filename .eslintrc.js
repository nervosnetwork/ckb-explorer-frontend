module.exports = {
  root: true,
  extends: ['airbnb', 'plugin:prettier/recommended', 'plugin:storybook/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'unused-imports'],
  globals: {
    State: 'true',
    CustomRouter: 'true',
    echarts: 'true',
  },
  rules: {
    'prettier/prettier': [
      2,
      {
        printWidth: 120,
      },
    ],
    semi: [2, 'never'],
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: true,
      },
    ],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
    'no-undef': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': [0, 'none'],
    'arrow-parens': [2, 'as-needed'],
    'max-len': [
      2,
      {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-plusplus': [0],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.ts', '.tsx'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'ignore',
        custom: 'ignore',
        exceptions: [''],
      },
    ],
    'react/require-default-props': [0],
    'no-shadow': 'off',
    'react/prop-types': [0],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-wrap-multilines': [
      'error',
      {
        prop: 'ignore',
      },
    ],
    'react/jsx-pascal-case': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    'consistent-return': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    camelcase: [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
        allow: ['^.*_'],
      },
    ],
    // The service layer uses the singleton pattern, so there will be many methods that do not use this.
    'class-methods-use-this': 'off',
    // TODO: Perhaps @typescript-eslint/recommended should be used.
    '@typescript-eslint/array-type': 'error',
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': 'error',
    'lines-between-class-members': 'off',
    // It looks like this rule has a bug, and it seems that typescript-eslint missed this rule when supporting eslint v8.
    '@typescript-eslint/lines-between-class-members': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'error',
  },
  env: {
    jest: true,
    browser: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
}

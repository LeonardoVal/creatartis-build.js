module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: ['airbnb'],
  globals: {
    document: 'readonly',
    window: 'readonly',
  },
  ignorePatterns: ['dist/', 'docs/jsdoc/', 'node_modules/'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
  },
  plugins: ['jest'],
  rules: {
    'class-methods-use-this': 'off',
    'no-await-in-loop': 'off',
    'no-mixed-operators': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': ['error', 'WithStatement', 'BinaryExpression[operator=\'in\']'],
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { vars: 'local', args: 'none' }],
  },
};

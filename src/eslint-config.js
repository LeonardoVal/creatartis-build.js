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
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['react', 'jest'],
  rules: {
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
  },
};

const path = require('path');

module.exports = {
  extends: path.join(__dirname, 'src/eslint-config.js'),
  rules: {
    'import/no-dynamic-require': 'off',
    'no-console': 'off',
  },
};

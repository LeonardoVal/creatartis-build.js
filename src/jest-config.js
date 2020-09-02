const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const { jest } = require(`${process.cwd()}/package.json`);

module.exports = {
  rootDir: process.cwd(),
  setupFilesAfterEnv: [
    path.join(__dirname, 'jest-setup.js'),
  ],
  testPathIgnorePatterns: [
    'node_modules/',
    'src/',
    'dist/',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  verbose: true,
  ...jest,
};

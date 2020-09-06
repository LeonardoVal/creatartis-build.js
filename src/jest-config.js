const path = require('path');

const { jest } = require(`${process.cwd()}/package.json`);

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/'],
  coverageDirectory: 'test/specs/coverage',
  coverageReporters: ['json', 'text-summary'],
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

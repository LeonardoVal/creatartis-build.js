const path = require('path');
const { run } = require('./common');

async function taskTest() {
  return run(`
    npx jest ./test/specs --config ${path.join(__dirname, 'jest-config.js')}
  `);
}

module.exports = {
  taskTest,
};

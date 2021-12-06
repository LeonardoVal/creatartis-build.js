const path = require('path');
const { run } = require('./common');

async function taskTest() {
  const configPath = path.join(__dirname, '../jest-config.js');
  return run(`
    npx jest ./test/specs --config ${configPath}
  `);
}

module.exports = {
  taskTest,
};

const { promises: fs } = require('fs');
const path = require('path');
const { run } = require('./common');

async function taskDoc() {
  await fs.rmdir('./docs/jsdoc', { recursive: true });
  return run(`
    npx jsdoc README.md src/ -c ${path.join(__dirname, 'jsdoc-config.js')}
  `);
}

module.exports = {
  taskDoc,
};

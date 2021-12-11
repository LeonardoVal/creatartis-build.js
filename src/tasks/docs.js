const { promises: fs } = require('fs');
const path = require('path');
const { run } = require('./common');

async function taskDoc() {
  await fs.rm('./docs/jsdoc', { force: true, recursive: true });
  const configPath = path.join(__dirname, '../jsdoc-config.js');
  return run(`
    npx jsdoc README.md src/ -c ${configPath}
  `);
}

module.exports = {
  taskDoc,
};

const { promises: fs } = require('fs');
const path = require('path');
const { run } = require('./common');

async function taskBuild(type) {
  await fs.rm('./dist', { force: true, recursive: true });
  await fs.mkdir('./dist');
  let result = 0;
  if (!type || type === 'umd') {
    result = await run(`
      webpack ./src/index.js --config ${path.join(__dirname, '../webpack-config.js')}
    `);
    if (result !== 0) {
      return result;
    }
  }
  if (!type || type === 'esm') {
    result = await run('npx babel src/ --out-dir dist/ --source-maps=true');
  }
  return result;
}

module.exports = {
  taskBuild,
};

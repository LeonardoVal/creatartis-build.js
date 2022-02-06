const { promises: fs } = require('fs');
const path = require('path');
const { run } = require('./common');

async function taskBuild(type) {
  await fs.rm('./dist', { force: true, recursive: true });
  await fs.mkdir('./dist');
  if (!type || type === 'umd') {
    const configPath = path.join(__dirname, '../webpack-config.js');
    return run(`npx webpack ./src/index.js --config ${configPath}`);
  }
  if (type === 'esm') {
    return run('npx babel src/ --out-dir dist/ --source-maps=true');
  }
  throw new Error(`Unknown command build:${type}!`);
}

module.exports = {
  taskBuild,
};

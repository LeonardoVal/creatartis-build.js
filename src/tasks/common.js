const { spawn } = require('child_process');
const path = require('path');

const packageJSON = require(`${process.cwd()}/package.json`);

async function run(script) {
  const commands = script.trim().split(/\s*&&\s*|[\r\n]+/)
    .map((line) => line.trim().split(/[ \t]+/));
  let result = 0;
  for (const [command, ...args] of commands) {
    // eslint-disable-next-line no-loop-func
    result = await new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, {
        shell: process.platform === 'win32',
        stdio: 'inherit',
      });
      childProcess.on('exit', (code) => resolve(code || childProcess.exitCode));
      childProcess.on('error', (error) => reject(error));
    });
    if (result !== 0) break;
  }
  return result;
}

function distPackageJSON() {
  const {
    script, devDependencies, files, ...other
  } = packageJSON;
  return JSON.stringify(other, null, '  ');
}

const log = Object.freeze({
  error(msg, ...args) {
    console.error(`🔴 \x1B[1;31m${msg}!\x1B[0m`, ...args);
  },
  info(msg, ...args) {
    console.log(`🚧 ${msg}`, ...args);
  },
  warn(msg, ...args) {
    console.warn(`🟡 \x1B[1;33m${msg}!\x1B[0m`, ...args);
  },
}); // log

module.exports = {
  distPackageJSON,
  log,
  run,
};

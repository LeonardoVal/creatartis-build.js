const { spawn } = require('child_process');
const fs = require('fs/promises');

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

async function fileExists(path) {
  return fs.stat(path).then(
    (stat) => stat.isFile(),
    () => false,
  );
}

async function folderExists(path) {
  return fs.stat(path).then(
    (stat) => stat.isDirectory(),
    () => false,
  );
}

function packageJSON() {
  // eslint-disable-next-line global-require
  return require(`${process.cwd()}/package.json`);
}

const log = Object.freeze({
  error(msg, ...args) {
    console.error(`🔴 \x1B[1;91m${msg}\x1B[0m`, ...args);
    return 1;
  },
  errorIf(cond, msg, ...args) {
    return cond ? this.error(msg, ...args) : 0;
  },
  info(msg, ...args) {
    console.log(`🚧 ${msg}`, ...args);
    return 0;
  },
  infoIf(cond, msg, ...args) {
    return cond ? this.info(msg, ...args) : 0;
  },
  warn(msg, ...args) {
    console.warn(`🟡 \x1B[1;33m${msg}\x1B[0m`, ...args);
    return 0;
  },
  warnIf(cond, msg, ...args) {
    return cond ? this.warn(msg, ...args) : 0;
  },
}); // log

module.exports = {
  fileExists,
  folderExists,
  log,
  packageJSON,
  run,
};

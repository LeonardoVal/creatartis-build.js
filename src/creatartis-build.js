/* eslint-disable no-console */
/* eslint-disable no-await-in-loop, no-restricted-syntax, no-unused-vars */
const { spawn } = require('child_process');
const { promises: fs } = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(`${process.cwd()}/package.json`);

// Utilities ///////////////////////////////////////////////////////////////////

async function run(script) {
  const commands = script.trim().split(/\s*&&\s*|[\r\n]+/)
    .map((line) => line.trim().split(/[ \t]+/));
  for (const [command, ...args] of commands) {
    await new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, { stdio: 'inherit' });
      childProcess.on('close', (code) => resolve(code));
      childProcess.on('error', (error) => reject(error));
    });
  }
}

// Tasks ///////////////////////////////////////////////////////////////////////

function taskPwd() {
  console.log(`creatartis-build is running at ${process.cwd()}.`);
}

async function taskLint() {
  const ignored = ['/dist', '/node_modules', '/docs']
    .map((pattern) => `--ignore-pattern ${pattern}`).join(' ');
  return run(`
    npx eslint . --ext js,jsx --quiet ${ignored}
  `);
}

async function taskTest() {
  return run(`
    npx jest ./test/specs --config ${path.join(__dirname, 'jest-config.js')}
  `);
}

async function taskBuildUMD() {
  await fs.rmdir('./dist', { recursive: true });
  await run(`
    npx webpack src/index.js --config ${path.join(__dirname, 'webpack-config.js')}
  `);
}

async function taskBuildESM() {
  await fs.rmdir('./dist', { recursive: true });
  await run(`
    npx babel src/ --out-dir dist/ --source-maps true --minified 
  `);
}

async function taskDoc() {
  await fs.rmdir('./docs/jsdoc', { recursive: true });
  await run(`
    npx jsdoc README.md src/ -c ${path.join(__dirname, 'jsdoc-config.js')}
  `);
}

const TASKS = [
  [/pwd/, taskPwd],
  [/lint/, taskLint],
  [/test:specs/, taskTest],
  [/test/, taskTest],
  [/build:umd/, taskBuildUMD],
  [/build:esm/, taskBuildESM],
  [/build/, taskBuildUMD, taskBuildESM],
  [/doc/, taskDoc],
];

async function execTask(id) {
  for (const [selector, ...taskFunctions] of TASKS) {
    const match = (new RegExp(`^${selector.source}$`)).exec(id);
    if (match) {
      console.log(`🚧 Executing ${id}...`);
      for (const taskFunction of taskFunctions) {
        await taskFunction(...match.slice(1));
      }
      return;
    }
  }
  console.error(`💥 \x1B[1;31mUnrecognized task ${id}!\x1B[0m`);
}

// Main ////////////////////////////////////////////////////////////////////////

async function main() {
  for (const arg of process.argv.slice(2)) {
    await execTask(arg);
  }
}

if (require !== undefined && require.main === module) {
  main();
} else {
  module.exports = { execTask, run, TASKS };
}

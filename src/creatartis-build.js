#!/usr/bin/env node
const { spawn } = require('child_process');
const { promises: fs } = require('fs');
const path = require('path');

const packageJSON = require(`${process.cwd()}/package.json`);

// Utilities ///////////////////////////////////////////////////////////////////

async function run(script) {
  const commands = script.trim().split(/\s*&&\s*|[\r\n]+/)
    .map((line) => line.trim().split(/[ \t]+/));
  let result = 0;
  for (const [command, ...args] of commands) {
    result = await new Promise((resolve, reject) => {
      const childProcess = spawn(command, args, { stdio: 'inherit' });
      childProcess.on('exit', (code) => resolve(code || childProcess.exitCode));
      childProcess.on('error', (error) => reject(error));
    });
    if (result !== 0) break;
  }
  return result;
}

// Tasks ///////////////////////////////////////////////////////////////////////

function taskPwd() {
  console.log(`creatartis-build is running at ${process.cwd()}.`);
}

async function taskLint() {
  const ignored = ['/dist', '/node_modules', '/docs']
    .map((pattern) => `--ignore-pattern ${pattern}`)
    .join(' ');
  return run(`npx eslint . --ext js,jsx --quiet ${ignored}`);
}

async function taskTest() {
  return run(`
    npx jest ./test/specs --config ${path.join(__dirname, 'jest-config.js')}
  `);
}

async function taskBuild(type) {
  await fs.rmdir('./dist', { recursive: true });
  let result = 0;
  if (!type || type === 'umd') {
    result = await run(`
      webpack src/index.js --config ${path.join(__dirname, 'webpack-config.js')}
    `);
    if (result !== 0) return result;
  }
  if (!type || type === 'esm') {
    result = await run('npx babel src/ --out-dir dist/ --source-maps=true');
  }
  return result;
}

async function taskDoc() {
  await fs.rmdir('./docs/jsdoc', { recursive: true });
  return run(`
    npx jsdoc README.md src/ -c ${path.join(__dirname, 'jsdoc-config.js')}
  `);
}

function getNPMRegistry(id) {
  if (!id) return null;
  if (/^(verdaccio|local)$/.test(id)) return 'http://localhost:4873';
  if (/^(npm)$/.test(id)) return 'https://registry.npmjs.org/';
  if (/^\d+/.test(id)) return `http://localhost:${id}`;
  throw new Error(`Unrecognized NPM registry ${id}!`);
}

async function taskPublish(id) {
  const registryURL = getNPMRegistry(id);
  const registry = registryURL ? `--registry ${registryURL}` : '';
  return run(`npm publish ${registry}`);
}

async function taskUnpublish(id) {
  const registryURL = getNPMRegistry(id);
  const registry = registryURL ? `--registry ${registryURL}` : '';
  return run(`npm unpublish ${registry} --force`);
}

const TASKS = [
  [/pwd/, taskPwd],
  [/lint/, taskLint],
  [/test:specs/, taskTest],
  [/test/, taskTest],
  [/build(?::(\w+))?/, taskBuild],
  [/doc/, taskDoc],
  [/default/, taskLint, taskBuild, taskTest, taskDoc],
  [/publish(?::(\w+))/, taskPublish],
  [/unpublish(?::(\w+))/, taskUnpublish],
  [/republish(?::(\w+))/, taskUnpublish, taskPublish],
];

async function execTask(id) {
  let result = 0;
  for (const [selector, ...taskFunctions] of TASKS) {
    const match = (new RegExp(`^${selector.source}$`)).exec(id);
    if (match) {
      console.log(`🚧 Executing ${id}...`);
      for (const taskFunction of taskFunctions) {
        result = await taskFunction(...match.slice(1));
        if (result !== 0) break;
      }
      return result;
    }
  }
  console.error(`💥 \x1B[1;31mUnrecognized task ${id}!\x1B[0m`);
  return 1;
}

// Main ////////////////////////////////////////////////////////////////////////

async function main() {
  let result = 0;
  for (const arg of process.argv.slice(2)) {
    result = await execTask(arg);
    if (result !== 0) {
      console.error(`💥 \x1B[1;31mTask ${arg} failed! Aborting.\x1B[0m`);
      break;
    }
  }
  process.exit(result);
}

if (require !== undefined && require.main === module) {
  main();
} else {
  module.exports = { execTask, run, TASKS };
}

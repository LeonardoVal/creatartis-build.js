#!/usr/bin/env node
const { spawn } = require('child_process');
const { promises: fs } = require('fs');
const path = require('path');

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
  if (!type || type === 'umd') {
    await run(`
      webpack src/index.js --config ${path.join(__dirname, 'webpack-config.js')}
    `);
  }
  if (!type || type === 'esm') {
    await run('npx babel src/ --out-dir dist/');
  }
}

async function taskDoc() {
  await fs.rmdir('./docs/jsdoc', { recursive: true });
  await run(`
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
  await run(`npm publish ${registry}`);
}

async function taskUnpublish(id) {
  const registryURL = getNPMRegistry(id);
  const registry = registryURL ? `--registry ${registryURL}` : '';
  await run(`npm unpublish ${registry} --force`);
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

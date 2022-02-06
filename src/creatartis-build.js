#!/usr/bin/env node
const packageJSON = require('../package.json');
const { run, log } = require('./tasks/common');
const { taskBuild } = require('./tasks/builds');
const { taskCheck, taskLint } = require('./tasks/checks');
const { taskDoc } = require('./tasks/docs');
const { taskPwd } = require('./tasks/other');
const { taskRelease, taskUnrelease } = require('./tasks/releases');
const { taskTest } = require('./tasks/tests');

const TASKS = [
  [/build(?::(\w+))?/, taskBuild],
  [/check(?::(\w+))?/, taskCheck],
  [/default/, taskLint, taskBuild, taskTest, taskDoc],
  [/doc/, taskDoc],
  [/lint/, taskLint],
  [/pwd/, taskPwd],
  [/release(?::(\w+))?/, taskRelease],
  [/rerelease(?::(\w+))/, taskUnrelease, taskRelease],
  [/test(?::(specs))?/, taskTest],
  [/unrelease(?::(\w+))?/, taskUnrelease],
];

async function execTask(id) {
  let result = 0;
  for (const [selector, ...taskFunctions] of TASKS) {
    const match = (new RegExp(`^${selector.source}$`)).exec(id);
    if (match) {
      log.info(`Executing ${id}...`);
      for (const taskFunction of taskFunctions) {
        result = await taskFunction(...match.slice(1));
        if (result !== 0) break;
      }
      return result;
    }
  }
  log.error(`Unrecognized task ${id}!`);
  return 1;
}

// Main ////////////////////////////////////////////////////////////////////////

async function main() {
  console.log(`${packageJSON.name}@${packageJSON.version}`);
  let result = 0;
  for (const arg of process.argv.slice(2)) {
    result = await execTask(arg);
    if (result !== 0) {
      log.error(`Task ${arg} failed! Aborting.`);
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

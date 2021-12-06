const { run } = require('./common');

async function taskLint() {
  const ignored = ['/dist', '/node_modules', '/docs']
    .map((pattern) => `--ignore-pattern ${pattern}`)
    .join(' ');
  return run(`npx eslint . --ext js,jsx --quiet ${ignored}`);
}

module.exports = {
  taskLint,
};

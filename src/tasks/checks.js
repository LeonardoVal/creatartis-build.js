const {
  distPackageJSON, log, run,
} = require('./common');

async function taskLint() {
  const ignored = ['/dist', '/node_modules', '/docs']
    .map((pattern) => `--ignore-pattern ${pattern}`)
    .join(' ');
  return run(`npx eslint . --ext js,jsx --quiet ${ignored}`);
}

const checkPackageJSON = () => {
  const pkg = distPackageJSON();
  const requiredFields = [
    'author', 'babel', 'description', 'eslintConfig', 'eslintIgnore', 'jest',
    'keywords', 'license', 'main', 'module', 'scripts', 'version',
  ];
  requiredFields.forEach((fieldName) => {
    if (!pkg[fieldName]) {
      log.warn(`Missing field ${fieldName} from package.json!`);
    }
  });
  return 0;
};

async function taskCheck(type) {
  let result = 0;
  if (!type || type === 'lint') {
    result = await taskLint();
    if (result !== 0) {
      return result;
    }
  }
  if (!type || type === 'pkg') {
    result = checkPackageJSON();
  }
  return result;
}

module.exports = {
  taskCheck,
  taskLint,
};

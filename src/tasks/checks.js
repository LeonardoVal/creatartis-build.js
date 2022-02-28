const { log, packageJSON, run } = require('./common');

async function taskLint() {
  return run('npx eslint . --ext js,jsx --quiet');
}

const packageChecks = {
  author: (value) => typeof value === 'string' && value.length > 0,
  description: (value) => typeof value === 'string' && value.length > 0,
  dependencies: (value) => typeof value === 'object' && !!value,
  files: (value) => Array.isArray(value) && value.length > 0,
  keywords: (value) => Array.isArray(value) && value.length > 0,
  license: (value) => typeof value === 'string' && value.length > 0,
  main: (value) => typeof value === 'string' && value.length > 0,
  name: (value) => typeof value === 'string' && value.length > 0,
  scripts: (value) => typeof value === 'object' && !!value,
  version: (value) => typeof value === 'string' && value.length > 0,
};

const checkPackageJSON = () => {
  const pkg = packageJSON();
  Object.entries(packageChecks).forEach(([fieldName, checkFun]) => {
    if (!checkFun(pkg[fieldName])) {
      log.warn(`Missing field ${fieldName} from package.json!`);
    }
  });
  return 0;
};

async function taskCheck(type) {
  let result = 0;
  if (result === 0 && (!type || type === 'lint' || type === 'code')) {
    result = result || await taskLint();
  }
  if (result === 0 && (!type || type === 'pkg')) {
    result = result || checkPackageJSON();
  }
  return result;
}

module.exports = {
  taskCheck,
  taskLint,
};

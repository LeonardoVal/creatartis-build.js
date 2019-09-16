const build = require('./src/index');
const packageJSON = require('./package.json');

Object.assign(exports, build.tasks({
  packageJSON,
}));

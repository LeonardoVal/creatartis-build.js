const build = require('./src/index');
const packageJSON = require('./package.json');

Object.assign(exports, build.tasks({
  packageJSON,
  esmFiles: false,
  umdIndex: false,
  copyFiles: [
    { src: 'src/index.js', dest: 'dist/creatartis-build.js' },
    { src: 'src/jest-setup.js', dest: 'dist/' },
  ],
  specFiles: false,
  jsdocFiles: false,
}));

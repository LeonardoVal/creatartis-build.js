const fs = require('fs').promises;
const build = require('./src/index');
const packageJSON = require('./package.json');

exports.configFiles = async function configFiles() {
  const files = ['babel', 'eslintConfig', 'jest'];
  await Promise.all(files.map((key) => (
    fs.writeFile(`dist/${key}.json`,
      JSON.stringify(packageJSON[key], null, '  '))
  )));
};

Object.assign(exports, build.tasks({
  packageJSON,
  esmFiles: false,
  umdIndex: false,
  copyFiles: [
    { src: 'src/index.js', dest: 'dist/creatartis-build.js' },
    { src: 'src/jest-setup.js', dest: 'dist/' },
  ],
  afterBuild: [exports.configFiles],
  jsdocFiles: false,
}));

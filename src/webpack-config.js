const packageJSON = require(`${process.cwd()}/package.json`);

const parsePackageName = (name) => {
  const nameRegExp = /^(?:@([^/]+)\/)?(([^.]+)(?:\.(.*))?)$/;
  const returnObject = {
    scope: null,
    fullName: '',
    projectName: '',
    moduleName: '',
  };
  const match = (typeof name === 'object' ? (name.name || '') : name || '')
    .match(nameRegExp);
  if (match) {
    returnObject.scope = match[1] || null;
    returnObject.fullName = match[2] || match[0];
    returnObject.projectName = match[3] === match[2] ? null : match[3];
    returnObject.moduleName = match[4] || match[2] || null;
  }
  return returnObject;
};

const PACKAGE_NAME = parsePackageName(packageJSON.name).fullName;

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
    }],
  },
  output: {
    filename: `${PACKAGE_NAME}.js`,
    libraryTarget: 'umd',
    // Workaround of a webpack bug: <https://github.com/webpack/webpack/issues/6784>.
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  ...packageJSON.webpack,
};

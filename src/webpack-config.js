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

const {
  fullName: PACKAGE_NAME,
} = parsePackageName(packageJSON.name);

const PACKAGE_DEPS = [
  ...Object.keys(packageJSON.dependencies),
  ...Object.keys(packageJSON.devDependencies),
];

module.exports = {
  devtool: 'source-map',
  externals: [
    ({ context, request }, callback) => {
      const requestPackage = PACKAGE_DEPS.find((dep) => request.startsWith(dep));
      if (requestPackage) {
        if (requestPackage !== request) {
          console.warn(`Warning: importing '${request}' at ${
            context} may fail if the package ${requestPackage} is bundled.`);
        }
        return callback(null, request);
      }
      return callback();
    },
  ],
  mode: 'production',
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: `${PACKAGE_NAME}.js`,
    library: PACKAGE_NAME,
    libraryTarget: 'umd',
    // Workaround of a webpack bug: <https://github.com/webpack/webpack/issues/6784>.
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  ...packageJSON.webpack,
};

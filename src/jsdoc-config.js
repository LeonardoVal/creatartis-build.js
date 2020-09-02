// eslint-disable-next-line import/no-dynamic-require
const { jsdoc } = require(`${process.cwd()}/package.json`);

module.exports = {
  opts: {
    template: 'templates/default',
    encoding: 'utf8',
    recurse: true,
    destination: './docs/jsdoc',
  },
  plugins: [
    'plugins/markdown',
  ],
  recurseDepth: 10,
  source: {
    exclude: [
      'src/__prologue__.js',
      'src/__epilogue__.js',
      'node_modules/',
      'dist/',
    ],
    includePattern: /.+\.js(doc|x)?$/,
    excludePattern: /(^|\/|\\)_/,
  },
  sourceType: 'script',
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure'],
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
  },
  ...jsdoc,
};

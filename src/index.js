/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
const parsePackageName = require('parse-packagejson-name');
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const gulp_sourcemaps = require('gulp-sourcemaps');
const gulp_rename = require('gulp-rename');
const gulp_babel = require('gulp-babel');
const gulp_terser = require('gulp-terser');
const gulp_eslint = require('gulp-eslint');
const webpack = require('webpack-stream');
const named = require('vinyl-named');
const gulp_jsdoc = require('gulp-jsdoc3');
const gulp_jest = require('gulp-jest').default;

const defined = (...args) => args.filter((x) => typeof x !== 'undefined');

exports.tasks = (args) => {
  const {
    packageJSON,
    cleanFiles = ['dist/*', 'docs/jsdoc/*'],
    lintFiles = ['src/**/*.js', 'test/specs/*.test.js'],
    esmFiles = ['src/**/*.js'],
    umdIndex = 'src/index.js',
    copyFiles = [],
    specFiles = ['test/specs'],
    jsdocFiles = ['README.md', 'src/**/*.js'],
  } = args;
  const tasks = {};
  const PACKAGE_NAME = parsePackageName(packageJSON.name).fullName;

  if (cleanFiles && cleanFiles.length) {
    tasks.clean = function clean() {
      return del(cleanFiles);
    };
  }

  // Linting ///////////////////////////////////////////////////////////////////

  if (lintFiles && lintFiles.length) {
    tasks.lint = function lint() {
      return gulp.src(lintFiles)
        .pipe(gulp_eslint({
          ...packageJSON.eslintConfig,
          globals: [], // ESLint of gulp-eslint fails if `globals` is not an array.
        }))
        .pipe(gulp_eslint.formatEach('compact', process.stderr));
    };
  }

  if (copyFiles && copyFiles.length) {
    tasks.copy = gulp.series(...copyFiles.map(({ src, dest }) => function copy() {
      if (dest.endsWith(path.sep)) {
        return gulp.src(src).pipe(gulp.dest(dest));
      }
      const { dir, base } = path.parse(dest);
      return gulp.src(src)
        .pipe(gulp_rename(base))
        .pipe(gulp.dest(dir));
    }));
  }

  // Transpilation /////////////////////////////////////////////////////////////

  if (esmFiles && esmFiles.length) {
    tasks.esm = function esm() {
      return gulp.src(esmFiles)
        .pipe(gulp_sourcemaps.init())
        .pipe(gulp_babel(packageJSON.babel || {
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        }))
        .pipe(gulp_terser({
          ecma: 8,
          module: true,
        }))
        .pipe(gulp_sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));
    };
  }

  if (umdIndex) {
    tasks.umd = function umd() {
      return gulp.src(umdIndex)
        .pipe(named())
        .pipe(webpack({
          mode: 'production',
          output: {
            filename: `${PACKAGE_NAME}.js`,
            libraryTarget: 'umd',
            // Workaround of a webpack bug: <https://github.com/webpack/webpack/issues/6784>.
            globalObject: 'typeof self !== \'undefined\' ? self : this',
          },
          module: {
            rules: [{
              test: /\.jsx?$/,
              use: ['babel-loader'],
              exclude: /node_modules/,
            }],
          },
          devtool: 'source-map',
        }))
        .pipe(gulp.dest('dist/'));
    };
  }

  tasks.build = gulp.series(...defined(tasks.lint, tasks.clean, tasks.umd,
    tasks.esm, tasks.copy));

  // Testing ///////////////////////////////////////////////////////////////////

  if (specFiles && specFiles.length) {
    tasks.jest = function jest() {
      return gulp.src(specFiles)
        .pipe(gulp_jest({
          ...packageJSON.jest,
        }));
    };

    tasks.test = gulp.series(tasks.jest);
  }

  // Documentation /////////////////////////////////////////////////////////////

  if (jsdocFiles && jsdocFiles.length) {
    tasks.jsdoc = function jsdoc() {
      const config = {
        source: {
          exclude: ['src/__prologue__.js', 'src/__epilogue__.js'],
        },
        sourceType: 'script',
        opts: {
          template: 'templates/default',
          encoding: 'utf8',
          recurse: true,
          destination: './docs/jsdoc',
        },
        plugins: [
          'plugins/markdown',
        ],
      };
      return gulp.src(jsdocFiles, { read: false })
        .pipe(gulp_jsdoc(config));
    };
  }

  // Default ///////////////////////////////////////////////////////////////////

  tasks.default = gulp.series(...defined(tasks.build, tasks.test, tasks.jsdoc));

  return tasks;
};

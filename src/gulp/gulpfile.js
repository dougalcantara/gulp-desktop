const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const _if = require('gulp-if'); // eslint-disable-line no-underscore-dangle
const yargs = require('yargs')
  .boolean('CSSautoprefix')
  .boolean('CSSminify')
  .boolean('CSSsmaps')
  .array('jobs');
const argv = yargs.argv;
// const bsync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const gsass = require('gulp-sass');
const clean = require('gulp-clean-css');
const prefixer = require('gulp-autoprefixer');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const babelLoader = require('babel-loader');
const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
const smaps = require('gulp-sourcemaps');

console.log(path.resolve(__dirname, '../../node_modules/babel-loader/'));
console.log(argv);
const paths = {
  sources: {
    js: argv.js_src,
    scss: argv.scss_src,
  },
  destinations: {
    js: argv.js_dest,
    css: argv.css_dest,
  },
};

const webpackConfig = {
  entry: paths.sources.js,
  output: {
    filename: 'app.bundle.js',
    path: paths.destinations.js,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: require.resolve('../../node_modules/babel-loader'),
        options: {
          presets: [
            [
              require.resolve('../../node_modules/babel-preset-env'),
              {
                targets: {
                  browsers: ['> 0.5%', 'last 5 versions'],
                },
                debug: false,
              },
            ],
          ],
        },
      },
    }],
  },
  plugins: [
    // new UglifyJSPlugin(),
  ],
  devtool: 'cheap-source-map',
};


gulp.task('scss', () => gulp.src(`${paths.sources.scss}`)
  .pipe(plumber())
  .pipe(_if(argv.CSSsmaps, smaps.init()))
  .pipe(gsass.sync().on('error', gsass.logError))
  .pipe(_if(argv.CSSautoprefix, prefixer({
    browsers: ['last 2 versions'],
  })))
  .pipe(_if(argv.CSSminify, clean({ compatibility: 'ie8' })))
  .pipe(_if(argv.CSSsmaps, smaps.write()))
  .pipe(gulp.dest(`${paths.destinations.css}`)),
);


gulp.task('js', () => {
  const webpackCompiler = webpack(webpackConfig);

  webpackCompiler.watch({}, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({ chunks: false }));
    // if (isstyleguide) {
    //   browsersync.reload();
    // }
  });
});


gulp.task('default', argv.jobs);

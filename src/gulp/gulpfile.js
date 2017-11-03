const gulp = require('gulp');

// ===== SASS/SCSS plugins ===== //
const plumber = require('gulp-plumber');
const gsass = require('gulp-sass');
const clean = require('gulp-clean-css');
const prefixer = require('gulp-autoprefixer');

// ===== JS plugins ===== //
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const babel = require('babel-loader');
// const uglify = require('gulp-uglify');

// ===== Universal plugins ===== //
const smaps = require('gulp-sourcemaps');

// ===== Utility plugins ===== //
// const path = require('path');
const gutil = require('gulp-util');
const _if = require('gulp-if'); // eslint-disable-line no-underscore-dangle
// const bsync = require('browser-sync').create();
const runSequence = require('run-sequence');
const yargs = require('yargs')
  .boolean('CSSAutoprefix')
  .boolean('CSSMinify')
  .boolean('CSSSmaps')
  .boolean('JSUglify')
  .boolean('JSSmaps')
  .string('JSCompileTarget')
  .array('jobs');
const argv = yargs.argv;


// ===== Cache src/dist targets for compilation ===== //
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

// ===== Cache cmd flags that determine Gulp behavior ===== //
const runtimeOptions = {
  CSS: {
    CSSAutoprefix: argv.CSSAutoprefix,
    CSSMinify: argv.CSSMinify,
    CSSSmaps: argv.CSSSmaps,
  },
  JS: {
    JSUglify: argv.JSUglify,
    JSSMaps: argv.JSSMaps,
    JSCompileTarget: argv.JSCompileTarget,
  },
};

console.log(
  `
  paths: 
    sources: 
      js: ${paths.sources.js}
      scss: ${paths.sources.scss}
    destinations: 
      js: ${paths.destinations.js}
      css: ${paths.destinations.css}

  runtimeOptions: 
    CSS:
      ${runtimeOptions.CSS.CSSAutoprefix}
      ${runtimeOptions.CSS.CSSMinify}
      ${runtimeOptions.CSS.CSSSmaps}
    JS:
      ${runtimeOptions.JS.JSCompileTarget}
      ${runtimeOptions.JS.JSSMaps}
      ${runtimeOptions.JS.JSUglify}
  `,
);


// ===== Dynamically populate Webpack plugins based on runtimeOptions ===== //
const webpackPlugins = () => {
  const plugins = [];

  if (runtimeOptions.JS.JSUglify) {
    plugins.push(new UglifyJSPlugin());
  }

  return plugins;
};


// ===== Configure Webpack using dynamic paths and compile options ===== //
const webpackConfig = {
  entry: paths.sources.js,
  output: {
    filename: 'app.bundle.js',
    path: paths.destinations.js,
  },
  module: {
    rules: [
      {
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
      },
    ],
  },
  plugins: webpackPlugins(),
  devtool: 'cheap-source-map',
};


gulp.task('scss', () => gulp.src(`${paths.sources.scss}`)
  .pipe(plumber())
  .pipe(_if(runtimeOptions.CSS.CSSSmaps, smaps.init()))
  .pipe(gsass.sync().on('error', gsass.logError))
  .pipe(_if(runtimeOptions.CSS.CSSAutoprefix, prefixer({
    browsers: ['last 2 versions'],
  })))
  .pipe(_if(runtimeOptions.CSS.CSSMinify, clean({
    compatibility: 'ie8',
  }, (details) => {
    console.log(`${details.name} original size: ${details.stats.originalSize} bytes`);
    console.log(`${details.name} file size (minified): ${details.stats.minifiedSize} bytes`);
  })))
  .pipe(_if(runtimeOptions.CSS.CSSSmaps, smaps.write()))
  .pipe(gulp.dest(`${paths.destinations.css}`)),
);


gulp.task('js', () => {
  const webpackCompiler = webpack(webpackConfig);

  webpackCompiler.watch({}, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);

    gutil.log('[webpack]', stats.toString({ chunks: false }));
  });
});


gulp.task('default', runSequence('scss', 'js'));

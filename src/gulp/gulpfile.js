const gulp = require('gulp');
// const path = require('path');
// const gutil = require('gulp-util');
const _if = require('gulp-if'); // eslint-disable-line
const yargs = require('yargs').boolean('autoprefix').boolean('minify').boolean('smaps');
const argv = yargs.argv;
// const bsync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const gsass = require('gulp-sass');
const clean = require('gulp-clean-css');
const prefixer = require('gulp-autoprefixer');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
const smaps = require('gulp-sourcemaps');


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

gulp.task('scss', () => { // eslint-disable-line
  return gulp.src(`${paths.sources.scss}`)
    .pipe(plumber())
    .pipe(_if(argv.smaps, smaps.init()))
    .pipe(gsass.sync().on('error', gsass.logError))
    .pipe(_if(argv.autoprefix, prefixer({
      browsers: ['last 2 versions'],
    })))
    .pipe(_if(argv.minify, clean({ compatibility: 'ie8' })))
    .pipe(_if(argv.smaps, smaps.write()))
    .pipe(gulp.dest(`${paths.destinations.css}`));
});

gulp.task('default', ['scss']);

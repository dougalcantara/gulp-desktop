const gulp = require('gulp');
const path = require('path');
const gutil = require('gulp-util');
const yargs = require('yargs');
const argv = yargs.argv;
const bsync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const gsass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const smaps = require('gulp-sourcemaps');

console.log(argv.scss_src);
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

gulp.task('scss', () => {
  return gulp.src(`${paths.sources.scss}`)
    .pipe(plumber())
    .pipe(smaps.init())
    .pipe(gsass.sync().on('error', gsass.logError))
    .pipe(prefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(smaps.write())
    .pipe(gulp.dest(`${paths.destinations.css}`));
});


// gulp.task('scss', () => {
//   return gulp.src(paths.sources.scss)
//     .pipe(_if(!isprod, sourcemaps.init()))
//     .pipe(sass({
//       outputStyle: isprod ? 'compressed' : 'nested',
//       includePaths: PATHS.scssincludes
//     }).on('error', sass.logError))
//     .pipe(autoprefixer({
//       browsers: ['> 0.5%', 'last 5 versions']
//     }))
//     .pipe(_if(!isprod, sourcemaps.write('./')))
//     .pipe(gulp.dest(PATHS.shopifyassets))
//     .pipe(_if(isstyleguide, gulp.dest(PATHS.styleguide.css)));
// });


// gulp.task('js', () => gulp.src(paths.sources.js)
//   .pipe(plumber())
//   .pipe(smaps.init())
//   .pipe(gsass().on('error', gsass.logError()))
//   .pipe(prefixer({
//     browsers: ['last 2 versions'],
//     cascade: false,
//   }))
//   .pipe(smaps.write(paths.destinations.css)),
// );

gulp.task('default', ['scss']);

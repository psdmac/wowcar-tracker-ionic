var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
  sass: ['./scss/ionic.app.scss']
};

gulp.task('default', ['sass','browser-sync','watch']);

gulp.task('sass', function() {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(reload({stream:true}))
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./www"
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch("./www/*.html", function() {
    reload();  
  });
  gulp.watch("./www/js/*.js", function() {
    reload();  
  });
  gulp.watch("./www/templates/*.html", function() {
    reload();  
  });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

var gulp = require('gulp'),
  ngAnnotate = require('gulp-ng-annotate'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload');

gulp.task('scripts', function() {
  return gulp.src('public/javascripts/ng.js')
    .pipe(ngAnnotate())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('ng.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({
      message: 'Scripts task complete!'
    }));
});

gulp.task('sass', function () {
  return sass('public/sass/*.scss')
    .on('error',sass.logError)
    .pipe(gulp.dest('assets/css'));
});

gulp.task('watch', function() {
  gulp.watch('public/javascripts/ng.js', ['scripts']);
  livereload.listen();
  gulp.watch(['assets/js/*']).on('change', livereload.changed);
});

gulp.task('default',function () {
  gulp.start('scripts','sass');
});

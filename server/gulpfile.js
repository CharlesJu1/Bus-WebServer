var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;

// cju added preprocess tasks
// run 'gulp dev' before 'ionic run' to set the dev environment
var preprocess = require('gulp-preprocess');
gulp.task('dev', function() {
  gulp.src('server-setting.js')
    .pipe(preprocess({context: { APP_ENV: 'DEVELOPMENT', DEBUG: true}}))
    .pipe(gulp.dest('..'));
});

gulp.task('test_env', function() {
  gulp.src('app/templates/app-setting.ts')
    .pipe(preprocess({context: { APP_ENV: 'TEST', DEBUG: true}}))
    .pipe(gulp.dest('app/'));
});

gulp.task('prod', function() {
  gulp.src('app/templates/app-setting.ts')
    .pipe(preprocess({context: { APP_ENV: 'PRODUCTION'}}))
    .pipe(gulp.dest('app/'));
});

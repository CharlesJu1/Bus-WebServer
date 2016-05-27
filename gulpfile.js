var gulp = require('gulp');

// cju added preprocess tasks
// run 'gulp dev' before 'ionic run' to set the dev environment
var preprocess = require('gulp-preprocess');
gulp.task('dev', function() {
  gulp.src('server/templates/serverSetting.js')
    .pipe(preprocess({context: { SERVER_ENV: 'DEVELOPMENT', DEBUG: true}}))
    .pipe(gulp.dest('.'));
});

gulp.task('test', function() {
  gulp.src('server/templates/serverSetting.js')
    .pipe(preprocess({context: { SERVER_ENV: 'TEST', DEBUG: true}}))
    .pipe(gulp.dest('.'));
});

gulp.task('prod', function() {
  gulp.src('server/templates/serverSetting.js')
    .pipe(preprocess({context: { SERVER_ENV: 'PRODUCTION'}}))
    .pipe(gulp.dest('.'));
});

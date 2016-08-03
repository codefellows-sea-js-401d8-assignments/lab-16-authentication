const gulp   = require('gulp');
const eslint = require('gulp-eslint');
const mocha  = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

var appFiles = ['lib/*.js', 'model/*.js', 'route/*.js', 'gulpfile.js'];
var testFiles = ['test/**/*.js'];
gulp.task('lint:app', () => {
  gulp.src(appFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:test', () => {
  gulp.src(testFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('mocha:test', () => {
  gulp.src(testFiles)
    .pipe(mocha());
});

gulp.task('nodemon', () => {
  nodemon({
    script: './server.js',
    ext: 'js'
  });
});

gulp.task('watch', () => {
  gulp.watch('**/**/*.js', ['lint:app', 'lint:test', 'mocha:test']);
});

gulp.task('default', ['lint:app', 'lint:test', 'mocha:test', 'watch']);

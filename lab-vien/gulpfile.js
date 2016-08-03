const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('nodemon');

var scripts = ['./server.js', './model/*.js', './route/*.js', './lib/*.js', './test/*.js'];
var binFiles = ['./bin/*'];
var testFiles = ['./test/*.js'];

gulp.task('lint', () => {
  return gulp.src(scripts, binFiles)
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html'
  });
});

gulp.task('test', () => {
  return gulp.src(testFiles)
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['lint', 'test']);

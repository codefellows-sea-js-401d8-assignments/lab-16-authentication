const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');

var appFiles = ['./server.js', './lib/*.js', './model/*.js'];
var testFiles = ['./test/*.js'];

gulp.task('lint:all', () => {
  gulp.src(appFiles)
    .pipe(eslint())
    .pipe(eslint.format());
  gulp.src(testFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('nodemon', () => {
  nodemon({ script: 'server.js',
            ext: 'js',
            tasks: ['lint:all', 'mocha'] })
            .on('restart', () => {
              console.log('restarted');
            });
});
gulp.task('mocha', () => {
  gulp.src(testFiles)
    .pipe(mocha());
});

gulp.task('default', ['lint:all', 'mocha']);

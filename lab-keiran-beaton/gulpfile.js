'use strict';
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

let scripts = ['./server.js', './lib/*.js', './test/*.js', './models/*.js', './routes/*.js'];
let testFiles = ['./test/*.js'];
gulp.task('lint', () => {
  gulp.src(scripts)
    .pipe(eslint({
      rules: {
        'indent': [2,2]
      },
      envs: [
        'node',
        'es6'
      ]
    }))
    .pipe(eslint.format());
});
gulp.task('test', () => {
  return gulp.src(testFiles)
    .pipe(mocha({reporter: 'spec'}));
});
gulp.task('start', () => {
  nodemon({
    script: scripts,
    ext: 'js',
    env: {'NODE_ENV': 'development'}
  });
});
gulp.task('watch', () => {
  gulp.watch(scripts, ['start']);
});

gulp.task('default', ['start', 'watch', 'lint', 'test']);

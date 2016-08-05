const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');


var testFiles = ['test/**/*.js'];
var allFiles = ['index.js', 'server.js', 'test/**/*.js', 'lib/**/*.js', 'gulpfile.js'];

gulp.task('lint:all', () => {
  gulp.src(allFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('mocha:test', () => {
  gulp.src(testFiles)
    .pipe(mocha());
});

gulp.task('nodemon', () =>{
  nodemon({script: 'server.js'})
    .on('restart', () =>{
      console.log('Restarted the Server');
    });
});

gulp.task('watch:files', () => {
  gulp.watch(testFiles, ['mocha:test']);
  gulp.watch(allFiles, ['lint:all']);
});

gulp.task('default', ['lint:all', 'mocha:test', 'watch:files']);

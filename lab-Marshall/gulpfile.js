const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');

var testFiles = ['./test/authenticationTest.js'];
var appFiles = ['./**/*.js'];

gulp.task('default', ['lint:app', 'lint:test', 'mocha:test', 'watch'], () => {
  console.log('Watch is running');
});

gulp.task('nodemon', () => {
  nodemon({script: 'server.js'})
    .on('restart', () => {
      console.log('\n The server has restarted! \n');
    });
});

gulp.task('mocha:test', () => {
  return gulp.src(testFiles, {read: true})
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint:app', () => {
  return gulp.src(appFiles)
    .pipe(eslint({
      rules : {
        'indent' : [2,2]
      },
      envs: [
        'node',
        'es6',
        'mocha'
      ]
    }))
    .pipe(eslint.format());
});

gulp.task('lint:test', () => {
  return gulp.src(testFiles)
    .pipe(eslint({
      rules : {
        'indent' : [2,2]
      },
      envs: [
        'node',
        'es6',
        'mocha'
      ]
    }))
    .pipe(eslint.format());
});

gulp.task('watch', () => {
  console.log('Gulp is running');
  gulp.watch(testFiles, appFiles, ['lint:app', 'lint:test', 'mocha:test']);
});

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const testFiles = ['./test/*.js'];
const appFiles = ['./lib/*.js', './*.js', './route/*.js', './model/*.js', './controller/*.js'];

gulp.task('eslint', () => {
  gulp.src(appFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('mocha', () =>
    gulp.src(testFiles)
        .pipe(mocha())
        .once('error', () => {
          process.exit(1);
        })
        .once('end', () => {
          process.exit();
        })
);

gulp.task('nodemon', () => {
  nodemon({ script: './server'})
    .on('restart', () => {
      console.log('restarted!');
    });
});

gulp.task('default', ['eslint', 'mocha'], () => {
  console.log('default for eslint and mocha');
});

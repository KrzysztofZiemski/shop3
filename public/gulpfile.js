'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sassSrc = './sass/**/*.scss'; //wyciaga wszystkie pliki w folderze sass z rozszerzeniem scss
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src(sassSrc)
    .pipe(sass.sync().on('error', sass.logError)) //kompilacja plików
    .pipe(gulp.dest('./css')); //kompilacja do folderu css
});

//jak chcemy wywołać taska to wplisujemy gulp nazwa taska(u nas sass)


gulp.task("sass:watch", () => {
  gulp.watch([
    sassSrc,
    "!./public/libs/**/*"
  ], gulp.parallel('sass'));
});
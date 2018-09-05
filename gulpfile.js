const gulp = require('gulp')
const del = require('del')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const minaVue = require('gulp-mina-vue');
const runSequence = require('run-sequence')
 
gulp.task('clean', _ => del('./dist/**/*.*'))
 
gulp.task('compile:MINA.wxml', _ => {
  return gulp.src('./src/**/*.vue')
  .pipe(minaVue.template())
  .pipe(pug())
  .pipe(rename({ extname: '.wxml' }))
  .pipe(gulp.dest('./dist'))
})
 
gulp.task('compile:MINA.wxss', _ => {
  return gulp.src('./src/**/*.vue')
  .pipe(minaVue.style())
  .pipe(sass())
  .pipe(rename({ extname: '.wxss' }))
  .pipe(gulp.dest('./dist'))
})
 
gulp.task('compile:MINA.js', _ => {
  return gulp.src('./src/**/*.vue')
  .pipe(minaVue.script())
  .pipe(gulp.dest('./dist'))
})
 
gulp.task('compile:MINA.json', _ => {
  return gulp.src('./src/**/*.vue')
  .pipe(minaVue.config())
  .pipe(gulp.dest('./dist'))
})
 
gulp.task('copy', [], _ => {
  return gulp.src([
    'src/**/*.*',
    '!src/**/*.vue'
  ])
  .pipe(gulp.dest('./dist'))
})

gulp.task('watch', _ => {
  gulp.watch(['src/**/*.vue'], ['compile:MINA.wxml', 'compile:MINA.wxss', 'compile:MINA.js', 'compile:MINA.json'])
})

gulp.task('build', ['clean'], next => {
  runSequence('copy', [
    'compile:MINA.wxml',
    'compile:MINA.wxss',
    'compile:MINA.js',
    'compile:MINA.json'
  ], next)
})

gulp.task('dev', ['build', 'watch'])
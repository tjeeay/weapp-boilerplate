const gulp = require('gulp')
const del = require('del')
const runSequence = require('run-sequence')
const plugins = require('gulp-load-plugins')()
plugins.uglify = require('gulp-uglify-es').default
const isProduction = () => process.env.NODE_ENV === 'production'

const distDir = './dist'
gulp.task('clean', _ => del(`${distDir}/*`))

// template (vue, jade, pug)
const compileTemplete = (src) => {
  return src
    .pipe(plugins.pug({ pretty: !isProduction() }))
    .pipe(plugins.rename({ extname: '.wxml' }))
    .pipe(gulp.dest(distDir))
}

gulp.task('compile:MINA.wxml', _ => {
  const src = gulp.src('./src/**/*.vue')
    .pipe(plugins.minaVue.template())
  return compileTemplete(src)
})
gulp.task('compile:jade', _ => {
  const src = gulp.src('./src/**/*.jade')
  return compileTemplete(src)
})
gulp.task('compile:pug', _ => {
  const src = gulp.src('./src/**/*.pug')
  return compileTemplete(src)
})

// style (vue, scss)
const compileStyle = (src) => {
  return src
    .pipe(plugins.sass())
    .pipe(plugins.rename({ extname: '.wxss' }))
    .pipe(plugins.if(isProduction(), plugins.cssnano()))
    .pipe(plugins.if(file => file.contents, plugins.base64({
      extensions: ['svg', 'png', /\.jpg#datauri$/i],
      exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
      maxImageSize: 8 * 1024,
      deleteAfterEncoding: false,
      debug: !isProduction()
    })))
    .pipe(gulp.dest(distDir))
}

gulp.task('compile:MINA.wxss', _ => {
  const src = gulp.src('./src/**/*.vue')
    .pipe(plugins.minaVue.style())
  return compileStyle(src)
})
gulp.task('compile:scss', _ => {
  const src = gulp.src('./src/**/*.scss')
  return compileStyle(src)
})

// script (vue, js)
const compileScript = (src) => {
  return src
    .pipe(plugins.babel({
      presets: ['@babel/env']
    }))
    .pipe(plugins.if(isProduction(), plugins.uglify()))
    .pipe(gulp.dest(distDir))
}

gulp.task('compile:MINA.js', _ => {
  const src = gulp.src('./src/**/*.vue')
    .pipe(plugins.minaVue.script())
  return compileScript(src)
})
gulp.task('compile:js', _ => {
  const src = gulp.src('./src/**/*.js')
  return compileScript(src)
})

// config (vue, json)
const compileConfig = (src) => {
  return src
    .pipe(plugins.if(isProduction(), plugins.jsonminify()))
    .pipe(gulp.dest(distDir))
}

gulp.task('compile:MINA.json', _ => {
  const src = gulp.src('./src/**/*.vue')
    .pipe(plugins.minaVue.config())
  return compileConfig(src)
})
gulp.task('compile:json', _ => {
  const src = gulp.src('./src/**/*.json')
  return compileConfig(src)
})

gulp.task('compress:img', () => {
  return gulp.src(['src/**/*.{jpg,jpeg,png,gif,svg}'])
    .pipe(plugins.plumber())
    .pipe(plugins.imagemin({
      verbose: true,
      //类型：Number  默认：3  取值范围：0-7（优化等级）
      optimizationLevel: 5,
      //类型：Boolean 默认：false 无损压缩jpg图片
      progressive: true,
      //类型：Boolean 默认：false 隔行扫描gif进行渲染
      interlaced: true,
      //类型：Boolean 默认：false 多次优化svg直到完全优化
      multipass: true
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('copy', [], _ => {
  return gulp.src([
      'src/**/*.*',
      '!src/**/*.vue',
      '!src/**/*.{jade,pug}',
      '!src/**/*.scss',
      '!src/**/*.js',
      '!src/**/*.json',
      '!src/**/*.{jpg,jpeg,png,gif,svg}'
    ])
    .pipe(gulp.dest(distDir))
})

gulp.task('build', ['clean'], next => {
  runSequence('copy', [
      'compile:MINA.wxml',
      'compile:MINA.wxss',
      'compile:MINA.js',
      'compile:MINA.json',
      'compile:jade',
      'compile:pug',
      'compile:scss',
      'compile:js',
      'compile:json',
      'compress:img'
    ], next)
})

gulp.task('watch', _ => {
  gulp.watch([
    'src/**/*.vue'
  ], [
    'compile:MINA.wxml',
    'compile:MINA.wxss',
    'compile:MINA.js',
    'compile:MINA.json'
  ])

  gulp.watch(['src/**/*.jade'], ['compile:jade'])
  gulp.watch(['src/**/*.pug'], ['compile:pug'])
  gulp.watch(['src/**/*.scss'], ['compile:scss'])
  gulp.watch(['src/**/*.js'], ['compile:js'])
  gulp.watch(['src/**/*.json'], ['compile:json'])
  gulp.watch(['src/**/*.{jpg,jpeg,png,gif,svg}'], ['compress:img'])
})

gulp.task('dev', _ => {
  runSequence(['build'], ['watch'])
})

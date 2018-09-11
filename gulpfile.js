const path = require('path')
const gulp = require('gulp')
const del = require('del')
const runSequence = require('run-sequence')
const plugins = require('gulp-load-plugins')()
plugins.uglify = require('gulp-uglify-es').default
const isProduction = () => process.env.NODE_ENV === 'production'

const distDir = './dist'

const babelOptions = {
  presets: ['@babel/env'],
  plugins: ['@babel/transform-runtime']
}

const isVue = (file) => path.extname(file.path) === '.vue'

gulp.task('clean', _ => del(`${distDir}/**/*.*`))

gulp.task('compile:MINA.wxml', _ => {
  return gulp.src('./src/**/*.{vue,jade,pug}')
    .pipe(plugins.if(isVue, plugins.minaVue.template()))
    .pipe(plugins.pug({ pretty: !isProduction() }))
    .pipe(plugins.rename({ extname: '.wxml' }))
    .pipe(gulp.dest(distDir))
})

gulp.task('compile:MINA.wxss', _ => {
  return gulp.src('./src/**/*.{vue,scss}')
    .pipe(plugins.if(isVue, plugins.minaVue.style()))
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
})

gulp.task('compile:MINA.js', _ => {
  return gulp.src('./src/**/*.{vue,js}')
    .pipe(plugins.if(isVue, plugins.minaVue.script()))
    .pipe(plugins.babel(babelOptions))
    .pipe(plugins.if(isProduction(), plugins.uglify()))
    .pipe(gulp.dest(distDir))
})

gulp.task('compile:MINA.json', _ => {
  return gulp.src('./src/**/*.{vue,json}')
    .pipe(plugins.if(isVue, plugins.minaVue.config()))
    .pipe(plugins.if(isProduction(), plugins.jsonminify()))
    .pipe(gulp.dest(distDir))
})

// gulp.task('compile:*.scss', _ => {
//   return gulp.src('./src/**/*.scss')
//     .pipe(plugins.sass())
//     .pipe(plugins.rename({ extname: '.wxss' }))
//     .pipe(plugins.if(isProduction(), plugins.cssnano()))
//     .pipe(plugins.base64({
//       extensions: ['svg', 'png', /\.jpg#datauri$/i],
//       exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
//       maxImageSize: 8 * 1024,
//       deleteAfterEncoding: false,
//       debug: !isProduction()
//     }))
//     .pipe(gulp.dest(distDir))
// })

// gulp.task('compile:*.js', _ => {
//   return gulp.src('./src/**/*.js')
//     .pipe(plugins.babel(babelOptions))
//     .pipe(plugins.if(isProduction(), plugins.uglify()))
//     .pipe(gulp.dest(distDir))
// })

// gulp.task('compress:*.json', _ => {
//   return gulp.src('./src/**/*.json')
//     .pipe(plugins.if(isProduction(), plugins.jsonminify()))
//     .pipe(gulp.dest(distDir))
// })

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
      // 'compile:*.scss',
      // 'compile:*.js',
      // 'compress:*.json',
      'compress:img'
    ], next)
})

gulp.task('watch', _ => {
  gulp.watch([
      'src/**/*.vue'
    ], [
      'compile:MINA.wxml',
      'compile:MINA.wxss',
      'compile:MINA.scss',
      'compile:MINA.js',
      'compile:MINA.json'
    ])

  gulp.watch(['src/**/*.scss'], ['compile:MINA.wxss'])
  gulp.watch(['src/**/*.js'], ['compile:MINA.js'])
  gulp.watch(['src/**/*.json'], ['compile:MINA.json'])
  gulp.watch(['src/**/*.{jpg,jpeg,png,gif,svg}'], ['compress:img'])
})

gulp.task('dev', _ => {
  runSequence(['build'], ['watch'])
})

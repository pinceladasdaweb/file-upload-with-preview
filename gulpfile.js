const babel = require('rollup-plugin-babel')
const cssnano = require('gulp-cssnano')
const del = require('del')
const gulp = require('gulp')
const rename = require('gulp-rename')
const Rollup = require('rollup')
const rollup = require('gulp-rollup')
const run = require('run-sequence')
const sass = require('gulp-sass')
const size = require('gulp-size')
const uglify = require('rollup-plugin-uglify')

gulp.task('clean', () => del(['./dist']))

const rollupConfig = minimize => ({
  rollup: Rollup,
  input: './src/file-upload-with-preview.js',
  name: 'FileUploadWithPreview',
  format: 'umd',
  plugins: [babel({ exclude: 'node_modules/**' })].concat(
    minimize
      ? [
        uglify({
          compress: { warnings: false },
          mangle: true,
          sourceMap: false
        })
      ]
      : []
  )
})

gulp.task('script', () => {
  gulp.src('./src/*.js')
    .pipe(rollup(rollupConfig(false)))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest('./dist'))

  gulp.src('./src/*.js')
    .pipe(rollup(rollupConfig(true)))
    .pipe(rename('file-upload-with-preview.min.js'))
    .pipe(size({ showFiles: true }))
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('style', () => {
  gulp.src(['./src/file-upload-with-preview.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'))
    .pipe(cssnano())
    .pipe(rename('file-upload-with-preview.min.css'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['clean'], () => {
  run('script', 'style')
  gulp.watch('./src/file-upload-with-preview.scss', ['style'])
  gulp.watch('./src/file-upload-with-preview.js', ['script'])
})

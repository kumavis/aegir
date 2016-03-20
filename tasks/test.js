'use strict'

const gulp = require('gulp')
const Server = require('karma').Server
const $ = require('gulp-load-plugins')()
const runSequence = require('run-sequence')
const path = require('path')

const config = require('../config/webpack')

// Workaround gulp not exiting if there are some
// resources not freed
const exitOnFail = (err) => {
  if (err) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

gulp.task('test', (done) => {
  runSequence(
    'test:node',
    'test:browser',
    exitOnFail
  )
})

gulp.task('test:node', (done) => {
  runSequence(
    'mocha',
    exitOnFail
  )
})

gulp.task('test:browser', (done) => {
  runSequence(
    'karma',
    exitOnFail
  )
})

gulp.task('mocha', () => {
  return gulp.src([
    'test/setup.js',
    'test/**/*.spec.js'
  ])
    .pipe($.mocha({
      timeout: config.dev.timeout
    }))
})

gulp.task('karma', (done) => {
  new Server({
    configFile: path.join(__dirname, '/../config/karma.conf.js'),
    singleRun: true
  }, (code) => {
    done(code > 0 ? 'Some tests are failing' : undefined)
  }).start()
})

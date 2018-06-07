/* eslint-env node */
const pkg = require('../package')
const browsers = require('./browsers')

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'dist/bundle/scroll-monitor.umd.js',
      'test/unit/*.js'
    ],
    reporters: ['dots', 'BrowserStack'],
    hostname: 'bs-local.com',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY,
      project: pkg.name
    },
    customLaunchers: browsers,
    browsers: Object.keys(browsers)
  })
}

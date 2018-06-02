/* eslint-env node */
const pkg = require('../package')

module.exports = function (config) {
  const browsers = {
    'bs-windows7-ie11': {
      'base': 'BrowserStack',
      'os': 'Windows',
      'os_version': '7',
      'browser': 'ie',
      'device': null,
      'browser_version': '11.0',
      'real_mobile': null
    }
  }

  config.set({
    basePath: '..',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'assert/shim.min.js',
      'dist/bundle/scroll-monitor.umd.js',
      'test/unit/*.js'
    ],
    reporters: ['dots', 'BrowserStack'],
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

/* eslint-env node */
const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon', 'detectBrowsers'],
    files: [
      'coverage/dist/*.js',
      'test/unit/*.js'
    ],
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless']
      }
    },
    singleRun: true,
    concurrency: Infinity,
    detectBrowsers: {
      usePhantomJS: false,
      preferHeadless: true,
      postDetection: function (availableBrowsers) {
        if (typeof process.env.TRAVIS_JOB_ID !== 'undefined' || availableBrowsers.includes('Chrome')) {
          return ['ChromeHeadless']
        }
        if (availableBrowsers.includes('Firefox')) {
          return ['FirefoxHeadless']
        }
        throw new Error('Please install Firefox or Chrome')
      }
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      thresholds: {
        emitWarning: false,
        global: {
          statements: 89,
          lines: 89,
          branches: 83,
          functions: 84
        }
      }
    }
  })
}

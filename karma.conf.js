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
    reporters: [process.env.TRAVIS ? 'dots' : 'progress', 'coverage-istanbul'],
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
        if (process.env.TRAVIS || availableBrowsers.includes('Chrome')
          || availableBrowsers.includes('ChromeHeadless')) {
          return ['ChromeHeadless']
        }
        if (availableBrowsers.includes('Firefox')) {
          return ['FirefoxHeadless']
        }
        throw new Error('Please install Firefox or Chrome')
      }
    },
    coverageIstanbulReporter: {
      reports: ['lcov', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      thresholds: {
        emitWarning: false,
        global: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80
        }
      }
    }
  })
}

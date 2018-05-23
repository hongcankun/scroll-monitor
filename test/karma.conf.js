/* eslint-env node */

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['mocha', 'chai', 'sinon', 'detectBrowsers'],
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
      dir: 'coverage',
      thresholds: {
        emitWarning: false,
        global: {
          statements: 95,
          lines: 95,
          branches: 95,
          functions: 95
        }
      }
    }
  })
}

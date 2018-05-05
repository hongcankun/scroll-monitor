// Karma configuration
// Generated on Sat May 05 2018 14:36:14 GMT+0800 (中国标准时间)

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['mocha', 'detectBrowsers'],
    files: [
      'dist/*.js',
      'test/*.js'
    ],
    reporters: ['progress'],
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
    }
  })
}

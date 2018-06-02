/* eslint-env node */
const pkg = require('../package')

module.exports = function (config) {
  const browsers = {
    'bs-windows10-chrome': {
      'base': 'BrowserStack',
      'os': 'Windows',
      'os_version': '10',
      'browser': 'chrome',
      'device': null,
      'browser_version': 'latest',
      'real_mobile': null
    },
    'bs-windows10-firefox': {
      'base': 'BrowserStack',
      'os': 'Windows',
      'os_version': '10',
      'browser': 'firefox',
      'device': null,
      'browser_version': 'latest',
      'real_mobile': null
    },
    'bs-windows10-edge': {
      'base': 'BrowserStack',
      'os': 'Windows',
      'os_version': '10',
      'browser': 'edge',
      'device': null,
      'browser_version': 'latest',
      'real_mobile': null
    },
    'bs-osx11-chrome': {
      'base': 'BrowserStack',
      'os': 'OS X',
      'os_version': 'High Sierra',
      'browser': 'chrome',
      'device': null,
      'browser_version': 'latest',
      'real_mobile': null
    },
    'bs-osx11-firefox': {
      'base': 'BrowserStack',
      'os': 'OS X',
      'os_version': 'High Sierra',
      'browser': 'firefox',
      'device': null,
      'browser_version': 'latest',
      'real_mobile': null
    },
    'bs-osx11-safari': {
      'base': 'BrowserStack',
      'os': 'OS X',
      'os_version': 'High Sierra',
      'browser': 'safari',
      'device': null,
      'browser_version': '11.1',
      'real_mobile': null
    },
    'bs-android-8': {
      'base': 'BrowserStack',
      'os': 'android',
      'os_version': '8.0',
      'browser': 'android',
      'device': 'Google Pixel',
      'browser_version': null,
      'real_mobile': true
    }
  }

  config.set({
    basePath: '..',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
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

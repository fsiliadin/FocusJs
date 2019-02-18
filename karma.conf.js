module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['test/tests.js'],
    reporters: ['progress'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless','Chrome', 'Firefox'],
    autoWatch: false,
    singleRun: true, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity // Infinity is the default value
  })
}
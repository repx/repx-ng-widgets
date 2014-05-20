 /**
 * @ngdoc object
 * @name buildConfig.karma
 * @module buildConfig
 *
 * @description
 * The configuration for the karma test runner
 */
module.exports = {
  singleRun: true,
  frameworks: ['jasmine'],
  browsers: ['PhantomJS'],
  plugins: [
    'karma-jasmine',
    'karma-phantomjs-launcher'
  ]
};

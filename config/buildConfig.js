/**
 * @ngdoc module
 * @name buildConfig
 * @module buildConfig
 *
 * @description
 * Configuration for the build process of the app application.
 */
module.exports = {
  app: require( './app' ),
  dev: require( './dev' ),
  dist: require( './dist' ),
  karma: require( './karma' )
};

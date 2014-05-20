/**
 * @ngdoc object
 * @name buildConfig.dist
 * @module buildConfig
 *
 * @description
 * This exports configuration values that are specific to the distribution of the
 * project source.
 *
 * All paths should be relative to the project root.
 *
 *
 * @property {String} buildConfig.dist.dir
 * The directory that compiled project sources should be stored in.
 */
var config = {
  dir: 'dist'
};

module.exports = config;

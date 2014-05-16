/**
 * @ngdoc object
 * @name buildConfig.dist
 * @object
 *
 * @description
 * This exports configuration values that are specific to the distribution of the
 * project source.
 *
 * All paths should be relative to the project root.
 *
 * @type {{dir: string}}
 */
var config = {
  /**
   * @ngdoc property
   * @name buildConfig.dist.dir
   * @type {string}
   *
   * @description
   * The directory that compiled project sources should be stored in.
   */
  dir: 'dist'
};

module.exports = config;

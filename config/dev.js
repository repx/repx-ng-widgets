/**
 * @ngdoc object
 * @name buildConfig.dev
 * @object
 *
 * @description
 * This file exports configuration values that are
 * specific to the development environment.
 *
 * All file paths should be relative to the project root.
 */
var config = {
  /**
   * @ngdoc property
   * @name buildConfig.dev.dir
   * @type {string}
   *
   * @description
   * This is the directory that will be served by express during development. All
   * sources will be compiled into both this and the dist directory simultaneously
   * as changes are made when you have the default gulp task running.
   *
   * In most cases this directory should be in the .gitignore.
   */
  dir: '.tmp',

  /**
   * @ngdoc property
   * @name buildConfig.dev.express
   * @object
   *
   * @description
   * Configuration values for the ExpressJS server run that serves the project sources while under
   * development
   */
  express: {
    /**
     * @ngdoc property
     * @name buildConfig.dev.express.port
     * @type {number}
     *
     * @description
     * The port that the express server runs on. The value configured here will determine
     * what address you access the project on during development. if the default 4000 is
     * kept you will be able to access the project at http://localhost:4000
     */
    port: 4000
  },

  /**
   * @ngdoc property
   * @name buildConfig.dev.livereload
   * @object
   *
   * @description
   * Configuration for the livereload server used to provide automatic updating of the
   * project while it's being worked on.
   */
  liveReload: {
    /**
     * @ngdoc property
     * @name buildConfig.dev.livereload.port
     * @type {number}
     *
     * @description
     * The port that the livereload server is set to run on. This should be fine as the
     * default unless you are running multiple dev servers in tandem in which case make
     * sure that they are configured using different values.
     */
    port: 35729
  }
};

module.exports = config;

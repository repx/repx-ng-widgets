/**
 * @ngdoc object
 * @name buildConfig.app
 * @object
 *
 * @description
 * This file contains configuration for the main sources of the app.
 *
 * All paths should be relative to the project root unless otherwise noted.
 */
var config = {
  /**
   * @ngdoc property
   * @name buildConfig.app.index
   * @type {string}
   *
   * @description
   * The index file used to serve the project. This will be parsed and have the process js and
   * css files injected into it before being copied to the
   * {@link buildConfig.dev.dir} and {@link buildConfig.dist.dir} directories.
   *
   * This file path should be relative to {@link buildConfig.app.dir}.
   */
  index: 'index.html',
  /**
   * @ngdoc property
   * @name buildConfig.app.dir
   * @type {string}
   *
   * @description
   * The source root for the project files. Most other paths relating to source files
   * will have this prepended.
   */
  dir: 'src',
  /**
   * @ngdoc property
   * @name buildConfig.app.styles
   * @type {string}
   *
   * @description
   * The main sass file for the project. This file should handle any
   * imports that are needed and be relative to the source value
   * above.
   */
  styles: 'styles/app.scss',
  /**
   * @ngdoc property
   * @name buildConfig.app.sass
   * @object
   *
   * @description
   * Configuration for the sass css pre-processor
   */
  sass: {
    /**
     * @ngdoc property
     * @name buildConfig.app.sass.includePath
     * @type {Array}
     *
     * @description
     * The paths defined here will be added to the include path used when importing files from scss
     */
    includePath: [
      'bower_components',
      'node_modules/bootstrap-sass/vendor/assets/stylesheets'
    ]
  }
};

module.exports = config;

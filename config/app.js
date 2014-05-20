/**
 * @ngdoc object
 * @name buildConfig.app
 * @module buildConfig
 *
 * @description
 * This file contains configuration for the main sources of the app.
 *
 * All paths should be relative to the project root unless otherwise noted.
 *
 *
 * @property {String} buildConfig.app.index
 * The index file used to serve the project. This will be parsed and have the process js and
 * css files injected into it before being copied to the {link buildConfig.dev.dir} and {link buildConfig.dist.dir}
 * directories.
 *
 * **Note**: This file path should be relative to {link buildConfig.app.dir}.
 *
 *
 * @property {String} buildConfig.app.dir
 * The source root for the project files. Most other paths relating to source files
 * will have this prepended.
 *
 *
 * @property {Object} buildConfig.app.sass
 * Configuration for the sass css pre-processor
 *
 *
 * @property {Array<String>} buildConfig.app.sass.includePath
 * The paths defined here will be added to the include path used when importing files from scss
 *
 *
 * @property {String} buildConfig.app.scriptsDir
 * The directory that compiled scripts should be output to. Relative to either {@link buildConfig.dev.dir}
 * or {@link buildConfig.dist.dir} depending on the environment being built for.
 *
 *
 * @property {String} buildConfig.app.styles
 * The main sass file for the project. This file should handle any
 * imports that are needed and be relative to the source value
 * above.
 *
 *
 * @property {Array<String>} buildConfig.app.vendorJs
 * An array of vendor scripts that should be loaded into the page before the main app source. These paths
 * should be relative to the project root.
 */
var config = {
  dir: 'src',
  index: 'index.html',
  sass: {
    includePath: [
      'bower_components',
      'node_modules/bootstrap-sass/vendor/assets/stylesheets'
    ]
  },
  scriptsDir: 'scripts',
  styles: 'styles/app.scss',
  vendorJs: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-resource/angular-resource.js'

  ]
};

module.exports = config;

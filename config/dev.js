/**
 * @ngdoc object
 * @name buildConfig.dev
 * @module buildConfig
 *
 * @description
 * This file exports configuration values that are
 * specific to the development environment.
 *
 * All file paths should be relative to the project root.
 *
 *
 * @property {String} buildConfig.dev.dir
 * This is the directory that will be served by express during development. All
 * sources will be compiled into both this and the dist directory simultaneously
 * as changes are made when you have the default gulp task running.
 *
 * In most cases this directory should be in the .gitignore.
 *
 *
 * @property {String} buildConfig.dev.express
 * Configuration values for the ExpressJS server run that serves the project sources while under
 * development
 *
 *
 * @property {Number} buildConfig.dev.express.port
 * The port that the express server runs on. The value configured here will determine
 * what address you access the project on during development. if the default 4000 is
 * kept you will be able to access the project at http://localhost:4000
 *
 *
 * @property {Object} buildConfig.dev.livereload
 * Configuration for the livereload server used to provide automatic updating of the
 * project while it's being worked on.
 *
 *
 * @property {number} buildConfig.dev.livereload.port
 * The port that the livereload server is set to run on. This should be fine as the
 * default unless you are running multiple dev servers in tandem in which case make
 * sure that they are configured using different values.
 */
var config = {
  dir: '.tmp',
  express: { port: 4000 },
  liveReload: { port: 35729 }
};

module.exports = config;

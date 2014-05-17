/**
 * @ngdoc overview
 * @name Build Process
 * @description
 *
 * Huge thanks goes out to NetEngine Initial for the inspiration and doing all the hard work.
 * {@link http://netengine.com.au/blog/gulp-and-angularjs-a-love-story-or-the-old-wheel-was-terrible-check-out-my-new-wheel/}
 *
 * This builds the dev (into ./.tmp/) and dist (into ./dist) versions
 * of the app using watchify, scss, express, and livereload as you code.
 *
 */
/**
 * @ngdoc object
 * @name buildConfig
 * @object
 *
 * @description
 * The configuration values used to build the project source
 * @property {buildConfig.app} config.app
 * @property {buildConfig.dev} config.dev
 * @property {buildConfig.dist} config.dist
 */
var config = {
  app: require( './config/app.js' ),
  dev: require( './config/dev.js' ),
  dist: require( './config/dist.js' )
};

var connectLr = require( 'connect-livereload' );
var dgeni = require( 'dgeni' );
var express = require( 'express' );
var gulp = require( 'gulp' );
var gClosureCompiler = require( 'gulp-closure-compiler' );
var gInject = require( 'gulp-inject' );
var gJscs = require( 'gulp-jscs');
var gJsHint = require( 'gulp-jshint');
var gMinifyCss = require( 'gulp-minify-css' );
var gPlumber = require( 'gulp-plumber' );
var gRev = require( 'gulp-rev' );
var gRimraf = require( 'gulp-rimraf' );
var gSass = require( 'gulp-sass' );
var gSize = require( 'gulp-size' );
var gStreamify = require( 'gulp-streamify' );
var gUtil = require( 'gulp-util' );
var lrServer = require( 'tiny-lr' )();
var Q = require( 'q' );
var source = require( 'vinyl-source-stream' );
var watchify = require( 'watchify' );
var expressServer = express();

/**
 * Reasoning for this flag:
 *
 * notifyLivereload passes a filename to the livereload server, which will cause any connected browsers to reload the
 * file specified. You'll note that in most cases this is index.html -- we can't ask the browser to reload the
 * individual javascript files, because they have a new name. When the file that must be reloaded is css, the browser
 * can typically do this without a full page refresh. Combined with the speed of the c implementation of SASS, this can
 * be impressively fast (aka instant). permitIndexReload is a work-around for a long-standing bug in one of Watchify's
 * dependencies. The bug {@link https://github.com/mikeal/watch/issues/14} means that Watchify will typically rebundle
 * twice on OSX for any change, separated by a couple of seconds. The second (unnecessary) full page refresh was driving
 * me crazy, so I permitIndexReload rate-limits refreshes to once every 5 seconds - you can always refresh the browser
 * manually, if you need to do so more often.
 * See:
 * {@link http://netengine.com.au/blog/gulp-and-angularjs-a-love-story-or-the-old-wheel-was-terrible-check-out-my-new-wheel/#comment-1346270115}
 *
 * @type {boolean}
 */
var permitIndexReload = true;

function clean( relativePath ) {
  var deferred = Q.defer();

  gUtil.log( 'Cleaning: ' + gUtil.colors.blue( relativePath ) );

  gulp.src( [(config.dist.dir + '/' + relativePath), (config.dev.dir + '/' + relativePath)], {read: false} )
    .pipe( gRimraf( {force: true} ) )
    .on( 'end', deferred.resolve );

  return deferred.promise;
}
/**
 * @description
 * Start the express server with liveReload to serve the compiled
 * assets from the directory specified in {@link buildConfig.dev.dir}.
 */
function startExpress() {
  expressServer.use( connectLr() );
  expressServer.use( express.static( config.dev.dir ) );
  expressServer.listen( config.dev.express.port );
}

/**
 * Start live reload listening on the configured port so we can update
 * modified scripts in near real time as changes are made.
 */
function startLiveReload() {
  lrServer.listen( config.dev.liveReload.port, function ( err ) {
    if ( err ) {
      return console.log( err );
    }
  } );
}

function styles() {
  var deferred = Q.defer();

  clean( '/styles/app*.css' )
    .then( function () {
      gUtil.log( 'Rebuilding application styles' );
      gulp.src( config.app.dir + '/' + config.app.styles )
        .pipe( gPlumber() )
        .pipe( gSass( {
          includePaths: config.app.sass.includePath,
          sourceComments: 'map'
        } ) )
        .pipe( gulp.dest( config.dev.dir + '/styles' ) )
        .pipe( gMinifyCss() )
        .pipe( gStreamify( gRev() ) )
        .pipe( gSize( { showFiles: true } ) )
        .pipe( gulp.dest( config.dist.dir + '/styles' ) )
        .on( 'end', deferred.resolve )
        .on( 'error', deferred.reject );

    } )
    .done();

  return deferred.promise;
}

/**
 * Rebuilds the index file returning a promise that will be fulfilled
 * after compilation.
 *
 */
function indexHtml() {

  function inject( glob, path, tag ) {
    gUtil.log(
      'Injecting ' + gUtil.colors.blue( glob ) +
      ' in ' + gUtil.colors.blue( path  ) +
      ' into tag ' + gUtil.colors.blue( tag )
    );
    return gInject(
      gulp.src( path + '/' + glob ),
      { starttag: '<!-- inject:' + tag + ':{{ext}} -->' }
    );
  }

  function buildIndex( path ) {
    var deferred = Q.defer();

    gUtil.log( 'Rebuilding index.html for ' + gUtil.colors.blue( path ) );

    gulp.src( config.app.dir + '/' + config.app.index )
      .pipe( inject( 'styles/app*.css', path, 'app-style' ) )
      .pipe( inject( 'scripts/shim*.js', path, 'shim' ) )
      .pipe( inject( 'scripts/vendor*.js', path, 'vendor' ) )
      .pipe( inject( 'scripts/app*.js', path, 'app' ) )
      .pipe( inject( 'scripts/templates*.js', path, 'templates' ) )
      .pipe( gulp.dest( path ) )
      .on( 'end', deferred.resolve )
      .on( 'error', deferred.reject );

    return deferred.promise;
  }

  return Q.all( [
    buildIndex( config.dev.dir ),
    buildIndex( config.dist.dir )
  ] );
}

function app() {
  'use strict';

  var deferred = Q.defer();

  gulp.src( config.app.dir + '/**/*.js' )
    .pipe( gPlumber() )
    .pipe( gJscs() )
    .pipe( gJsHint('.jshintrc') )
    .pipe( gJsHint.reporter('jshint-stylish') )
    .pipe( gClosureCompiler( {
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'app.js'
    } ) )
    .pipe( gulp.dest( config.dev.dir ) )
    .on( 'end', deferred.resolve );

  return deferred.promise;
}

function rebuildDocs() {
  'use strict';

  dgeni.generator( 'dgeni.conf.js' )();
}

gulp.task( 'default', function () {
  'use strict';
  startExpress();
  startLiveReload();
  styles()
    .then( app )
    .then( indexHtml )
    .fail( gUtil.log )
    .done();
} );

gulp.task( 'docs', function () {
  'use strict';

  rebuildDocs();
});

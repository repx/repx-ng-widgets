(function () {
  'use strict';
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

  var chalk = require( 'chalk' );
  var connectLr = require( 'connect-livereload' );
  var dgeni = require( 'dgeni' );
  var express = require( 'express' );
  var gulp = require( 'gulp' );
  var gClosureCompiler = require( 'gulp-closure-compiler' );
  var gConcat = require( 'gulp-concat' );
  var gExpectFile = require( 'gulp-expect-file' );
  var gInject = require( 'gulp-inject' );
  var gJscs = require( 'gulp-jscs' );
  var gJsHint = require( 'gulp-jshint' );
  var gMinerrStrip = require( 'gulp-minerr-strip' );
  var gMinifyCss = require( 'gulp-minify-css' );
  var gPlumber = require( 'gulp-plumber' );
  var gRev = require( 'gulp-rev' );
  var gRimraf = require( 'gulp-rimraf' );
  var gSass = require( 'gulp-sass' );
  var gSize = require( 'gulp-size' );
  var gStreamify = require( 'gulp-streamify' );
  var gUtil = require( 'gulp-util' );
  var gUglify = require( 'gulp-uglify' );
  var lrServer = require( 'tiny-lr' )();
  var MinErrStrip = require( 'minerr-strip' );
  var path = require( 'path' );
  var Q = require( 'q' );
  var source = require( 'vinyl-source-stream' );
  var through = require( 'through' );
  var watchify = require( 'watchify' );
  var expressServer = express();
  var log = gUtil.log;
  log.event = function ( msg ) { this( chalk.yellow( msg ) )};
  log.detail = function ( key, val ) {
    this(
      chalk.yellow( ' ↪ ' ) +
      chalk.green( key + ': ' ) +
      val
    );
  };

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
    var fileGlob = path.basename( relativePath );
    var dirname = path.dirname( relativePath );
    var devGlob = path.resolve( config.dev.dir + '/' + dirname ) + '/' + fileGlob;
    var distGlob = path.resolve( config.dist.dir + '/' + dirname ) + '/' + fileGlob;

    log.event( chalk.yellow( 'Cleaning previous build sources: ' ) );
    log.detail( 'dev', devGlob );
    log.detail( 'dist', distGlob );

    gulp.src( [devGlob, distGlob], {read: false} )
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
    var docRoot = path.resolve( config.dev.dir );
    log.event( 'Starting express server ' );
    log.detail( 'hostname', 'http://localhost:' + config.dev.express.port );
    log.detail( 'docRoot', docRoot );

    expressServer.use( connectLr() );
    expressServer.use( express.static( docRoot ) );
    expressServer.listen( config.dev.express.port );
  }

  /**
   * Start live reload listening on the configured port so we can update
   * modified scripts in near real time as changes are made.
   */
  function startLiveReload() {
    var _this;
    log.event( 'Starting LiveReload' );
    log.detail( 'port', config.dev.liveReload.port );

    lrServer.listen( config.dev.liveReload.port, function ( err ) {
      if ( err ) {
        _this.emit( 'error', err );
      }
    } );
  }

  function styles() {
    var deferred = Q.defer();

    clean( '/styles/app*.css' )
      .then( function () {
        var stylesPath = config.app.dir + '/' + config.app.styles;
        var includePath = config.app.sass.includePath.join( ', ' );

        log.event( 'Rebuilding application styles' );
        log.detail( 'source', stylesPath );
        log.detail( 'includePath', includePath );

        gulp.src( stylesPath )
          .pipe( gPlumber() )
          .pipe( gExpectFile( stylesPath ) )
          .pipe( gSass( {includePaths: includePath, sourceComments: 'map'} ) )
          .pipe( gStreamify( gRev() ) )
          .pipe( gulp.dest( config.dev.dir + '/styles' ) )
          .pipe( gMinifyCss() )
          .pipe( gStreamify( gRev() ) )
          .pipe( gSize( {showFiles: true} ) )
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
      return gInject(
        gulp.src( glob, {cwd: path} ),
        {starttag: '<!-- inject:' + tag + ':{{ext}} -->'}
      );
    }

    function buildIndex( dest ) {
      var deferred = Q.defer();
      var indexSource = path.join( config.app.dir, config.app.index );

      log.event( 'Rebuilding index.html' );
      log.detail( 'dest', dest);
      log.detail( 'indexSource', indexSource );

      gulp.src( indexSource )
        .pipe( inject( './styles/app*.css', dest, 'app-style' ) )
        .pipe( inject( './scripts/shim*.js', dest, 'shim' ) )
        .pipe( inject( './scripts/vendor*.js', dest, 'vendor' ) )
        .pipe( inject( './scripts/app*.js', dest, 'app' ) )
        .pipe( inject( './scripts/templates*.js', dest, 'templates' ) )
        .pipe( gulp.dest( dest ) )
        .on( 'end', deferred.resolve )
        .on( 'error', deferred.reject );

      return deferred.promise;
    }

    return Q.all( [
      buildIndex( path.resolve( config.dev.dir ) ),
      buildIndex( path.resolve( config.dist.dir ) )
    ] );
  }

  function app() {

    var minErrStrip = new MinErrStrip( {docsUrl: 'localhost', configDest: '.tmp/errors.json'} );
    var bundler = watchify( './' + config.app.dir + '/app.js' );
    var deferred = Q.defer();

    function rebundle() {
      var deferred = Q.defer();

      clean( path.join( config.app.scriptsDir, 'app*.js' ) )
        .then( function () {
          var devDest = path.join( config.dev.dir, config.app.scriptsDir );

          log.event( 'Rebundling app.js' );
          log.detail( 'devDest', devDest );
          log.detail( 'distDest', 'TODO' );

          bundler.bundle( {debug: true} )
            .pipe( source( 'app.js' ) )
            .pipe( gStreamify( gUglify( {mangle: false} ) ) )
            .pipe( gStreamify( gRev() ) )
            .pipe( gulp.dest( devDest ) )
            .on( 'end', function () {
              try {
                minErrStrip.flushErrorConfig();
                indexHtml().then( deferred.resolve ).fail( deferred.reject );
              } catch ( error ) {
                deferred.reject( error );
              }
            } )
            .on( 'error', deferred.reject );
        } );

      return deferred.promise;
    }

    bundler.transform( function () {
      var fileContents = '';

      return through(
        function transform( buf ) {
          fileContents = fileContents + buf;
        },
        function end() {
          this.queue( minErrStrip.processModule( fileContents ) );
          this.queue( null );
        }
      );
    } );

    bundler.on( 'update', rebundle );
    rebundle().then( deferred.resolve ).fail( deferred.reject );

    return deferred.promise;
  }

  /**
   *
   * @returns {Promise.promise}
   */
  function vendors() {
    var deferred = Q.defer();
    var devDir = path.join( config.dev.dir, config.app.scriptsDir );
    var distDir = path.join( config.dist.dir, config.app.scriptsDir );

    log.event( 'Rebuilding vendors.js' );
    log.detail( 'vendors', config.app.vendorJs.join( ', ' ) );
    log.detail( 'devDir', devDir );
    log.detail( 'distDir', distDir );

    gulp.src( config.app.vendorJs )
      .pipe( gPlumber() )
      .pipe( gExpectFile( config.app.vendorJs ) )
      .pipe( gConcat( 'vendors.js' ) )
      .pipe( gStreamify( gUglify( {mangle: false} ) ) )
      .pipe( gStreamify( gRev() ) )
      .pipe( gSize( {showFiles: true} ) )
      .pipe( gulp.dest( devDir ) )
      .pipe( gulp.dest( devDir ) )
      .on( 'end', deferred.resolve )
      .on( 'error', deferred.reject );

    return deferred.promise;
  }

  function rebuildDocs() {

    dgeni.generator( 'dgeni.conf.js' )();
  }

  gulp.task( 'default', function () {
    startExpress();
    startLiveReload();

    styles()
      .then( vendors )
      .then( app ) // The index is rebuild at the end of compiling the app so make sure app is the last in the chain
      .fail( log )
      .done();
  } );

  gulp.task( 'test', function () {
    //      .pipe( gPlumber() )
    //  .pipe( gJscs() )
    //      .pipe( gJsHint( '.jshintrc' ) )
    //      .pipe( gJsHint.reporter( 'jshint-stylish' ) )
    //      .pipe(  )

  } );

  gulp.task( 'docs', function () {
    rebuildDocs();
  } );

})();

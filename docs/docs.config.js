var path = require( 'canonical-path' );
var versionInfo = require( '../lib/versions/version-info' );
var basePath = __dirname;

var basePackage = require( './config' );

module.exports = function ( config ) {


  var angularVersion = '1.2.16';
  var angularCdnUrl = "//ajax.googleapis.com/ajax/libs/angularjs/" + angularVersion;
  var angularDependencies = [
    'angular',
    'angular-resource',
    'angular-route',
    'angular-cookies',
    'angular-sanitize',
    'angular-touch',
    'angular-animate'
  ];

  /**
   * Builds the paths for angular resources using the angular*
   * variables defined at the top of the script
   *
   * @param {{minified: boolean}} [options] If true paths will be .min.js instead of .js
   *
   * @return {Array.<string>}
   */
  function ngDependencyURIs(options) {
    'use strict';
    var suffix = (options && options.minified) ? '.min.js' : '.js';
    return angularDependencies.map(function (script) {
      return angularCdnUrl + '/' + script + suffix;
    });
  }

  var getVersion = function ( component, sourceFolder, packageFile ) {
    sourceFolder = sourceFolder || '../bower_components';
    packageFile = packageFile || 'bower.json';
    return require( path.join( sourceFolder, component, packageFile ) ).version;
  };

  config = basePackage( config );

  config.set( 'source.projectPath', path.resolve( basePath, '..' ) );

  config.set( 'source.files', [
    {pattern: 'config/*.js', basePath: path.resolve( basePath, '..' )},
    {pattern: 'src/**/*.js', basePath: path.resolve( basePath, '..' )},
    {pattern: '**/*.ngdoc', basePath: path.resolve( basePath, 'content' )}
  ] );

  config.set( 'processing.stopOnError', true );

  config.set( 'processing.errors.minerrInfoPath', path.resolve( basePath, '../.tmp/errors.json' ) );

  config.set( 'rendering.outputFolder', '../build/docs' );
  config.set( 'rendering.contentsFolder', 'partials' );

  config.set( 'logging.level', 'info' );

  config.merge( 'deployment', {
    environments: [
      {
        name: 'debug',
        examples: {
          commonFiles: {
            scripts: ['../../../angular.js']
          },
          dependencyPath: '../../../'
        },
        scripts: ngDependencyURIs().concat([
          'components/marked-' + getVersion( 'marked', '../node_modules', 'package.json' ) + '/lib/marked.js',
          'js/angular-bootstrap/bootstrap.js',
          'js/angular-bootstrap/bootstrap-prettify.js',
          'js/angular-bootstrap/dropdown-toggle.js',
          'components/lunr.js-' + getVersion( 'lunr.js' ) + '/lunr.js',
          'components/google-code-prettify-' + getVersion( 'google-code-prettify' ) + '/src/prettify.js',
          'components/google-code-prettify-' + getVersion( 'google-code-prettify' ) + '/src/lang-css.js',
          'js/versions-data.js',
          'js/pages-data.js',
          'js/docs.js'
        ]),
        stylesheets: [
          'components/bootstrap-' + getVersion( 'bootstrap' ) + '/css/bootstrap.css',
          'components/open-sans-fontface-' + getVersion( 'open-sans-fontface' ) + '/open-sans.css',
          'css/prettify-theme.css',
          'css/docs.css',
          'css/animations.css'
        ]
      },
      {
        name: 'production',
        examples: {
          commonFiles: {
            scripts: [angularCdnUrl + '/angular.min.js']
          },
          dependencyPath: angularCdnUrl + '/'
        },
        scripts: ngDependencyURIs({minified: true}).concat(
          [
            'components/marked-' + getVersion( 'marked', '../node_modules', 'package.json' ) + '/lib/marked.js',
            'js/angular-bootstrap/bootstrap.js',
            'js/angular-bootstrap/bootstrap-prettify.js',
            'js/angular-bootstrap/dropdown-toggle.js',
            'components/lunr.js-' + getVersion( 'lunr.js' ) + '/lunr.min.js',
            'components/google-code-prettify-' + getVersion( 'google-code-prettify' ) + '/src/prettify.js',
            'components/google-code-prettify-' + getVersion( 'google-code-prettify' ) + '/src/lang-css.js',
            'js/versions-data.js',
            'js/pages-data.js',
            'js/docs.js'
        ]
        ),
        stylesheets: [
          'components/bootstrap-' + getVersion( 'bootstrap' ) + '/css/bootstrap.min.css',
          'components/open-sans-fontface-' + getVersion( 'open-sans-fontface' ) + '/open-sans.css',
          'css/prettify-theme.css',
          'css/docs.css',
          'css/animations.css'
        ]
      }
    ]
  } );

  return config;
};

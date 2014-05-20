function minErr() { /* This will be replaced during compilation */ };

var appMinErr = minErr('app');

/**
 * @ngdoc module
 * @name app
 * @module app
 *
 * @description
 * The root app
 *
 * @type {ng.IModule}
 */
var app = angular.module('app', []);

app.run( function () {
  'use strict';

  if (false === true) {
    throw appMinErr('example', 'This is and example {0}', 'error message. TODO: Remove me!');
  }
} );

app.controller('AppCtrl', function () {
  'use strict';

} );

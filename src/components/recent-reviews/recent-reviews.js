/**
 * @ngdoc module
 * @name repx.widget.recentReviews
 * @module repx.widget.recentReviews
 *
 * @description
 * The RepX Recent Reviews Widget.
 */
var recentReviewsWidget = angular.module( 'repx.widget.recentReviews', [] );

/**
 * @ngdoc object
 * @name repxRecentReviewsWidgetConfig
 * @module repx.widget.recentReviews
 *
 * @description
 * TODO
 */
recentReviewsWidget.value( 'repxRecentReviewsWidgetConfig', {
  reviewsToLoad: 10,
  changeDelay: 8000,
  transitionDuration: 1000,
  widgetTitle: false, //'Recent Reviews',
  loadingIndicator: 'Loading...'
} );

/**
 * @ngdoc function
 * @name RepxRecentReviewsWidgetCtrl
 * @module repx.widget.recentReviews
 *
 * @description
 * TODO: clean up animation logic. Maybe use ui.bootstrap.carousel/ui.bootstrap.transition
 *
 *
 *
 * @param {$timeout} $timeout
 * @param {repxRecentReviewsWidgetConfig} repxRecentReviewsWidgetConfig
 * @param {Review} Review
 */
function RepxRecentReviewsWidgetCtrl( $timeout, repxRecentReviewsWidgetConfig, Review ) {

  var ctrl = this;
  var reviewResource = new Review();
  var nextIndex = 0;
  var reviewCount;

  ctrl.showIndex = -1;
  ctrl.loading = true;
  ctrl.config = repxRecentReviewsWidgetConfig;
  ctrl.reviews = [];

  reviewResource.query().$promise.then( function ( reviews ) {
    ctrl.reviews = reviews;
    ctrl.loading = false;
    reviewCount = ctrl.reviews.length;
    fadeIn();
  } );

  function fadeIn() {

    ctrl.showIndex = nextIndex % reviewCount;
    nextIndex = nextIndex + 1;

    $timeout( fadeOut, ctrl.config.changeDelay );
  }

  function fadeOut() {
    var fadeOutDuration = ctrl.config.transitionDuration;
    ctrl.showIndex = -1;
    $timeout( fadeIn, fadeOutDuration );
  }
}
recentReviewsWidget.controller( 'RepxRecentReviewsWidgetCtrl', RepxRecentReviewsWidgetCtrl );

/**
 * @ngdoc directive
 * @name repxRecentReviewsWidget
 * @module repx.widget.recentReviews
 * @restrict E
 *
 */
recentReviewsWidget.directive( 'repxRecentReviewsWidget', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {some: '=config'},
      templateUrl: 'repx/widget/recentReviews/directives/recentReviews.tpl.html',
      controller: 'RepxRecentReviewsWidgetCtrl as widgetCtrl'
    };
  }
);

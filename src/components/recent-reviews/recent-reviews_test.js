describe( 'repx.widget.recentReviews', function () {
  'use strict';

  beforeEach( module( 'repx.widget.recentReviews' ) );

  var companyId = 'foo-bar',
      $httpBackend,
      $rootScope,
      $timeout,
      repxState,
      routing,
      mockApiResponse = [
        {id: 32, review: 'yep-0'},
        {id: 593, review: 'yep-1'},
        {id: 801349, review: 'yep-2'},
        {id: 2, review: 'yep-3'},
        {id: 3039, review: 'yep-4'},
        {id: 19, review: 'yep-5'},
        {id: 800, review: 'yep-6'},
        {id: 931, review: 'yep-7'},
        {id: 92349, review: 'yep-8'},
        {id: 1192, review: 'yep-9'}
      ];

  beforeEach( function () {

    module( function ( $provide ) {
      $provide.service( 'routing', function () {
        return {
          getResourceRoute: function () {
            return 'stub';
          }
        };
      } );
      $provide.service( 'Review', function () {
        return function () {
          this.query = function () {} ;
        };
      } );
      $provide.value( 'repxState', { company: { } } );
    } );

    inject( function ( $injector ) {
      var endpoint;
      $httpBackend = $injector.get( '$httpBackend' );
      $rootScope = $injector.get( '$rootScope' );
      $timeout = $injector.get( '$timeout' );
      routing = $injector.get( 'routing' );
      repxState = $injector.get( 'repxState' );
      repxState.company.id = companyId;

      endpoint = routing.getResourceRoute(
        'repx_api_company_review_get',
        {companyId: companyId}
      );
      $httpBackend.expect( 'GET', endpoint ).respond( mockApiResponse );
    } )
  } );

  describe( 'repxRecentReviewsWidgetConfig', function () {
    var config;

    beforeEach( inject( function ( repxRecentReviewsWidgetConfig ) {
      config = repxRecentReviewsWidgetConfig;
    } ) );

    it( 'should have the correct defaults set', function () {
      expect( config.reviewsToLoad ).toEqual( 10 );
      expect( config.changeDelay ).toEqual( 8000 );
      expect( config.widgetTitle ).toEqual( false );
      expect( config.loadingIndicator ).toEqual( 'Loading...' );
    } );
  } );

  describe( 'RepxRecentReviewsWidgetCtrl', function () {
    var ctrl, widgetConfig, Review, ReviewResource, MockReview;

    beforeEach( inject( function ( $injector ) {
      var $controller = $injector.get( '$controller' );
      widgetConfig = $injector.get( 'repxRecentReviewsWidgetConfig' );
      Review = $injector.get( 'Review' );

      MockReview = function () {
        ReviewResource = new Review();
        spyOn( ReviewResource, 'query' ).andCallThrough();
        return ReviewResource;
      };

      ctrl = $controller( 'RepxRecentReviewsWidgetCtrl', {
        Review: MockReview,
        $timeout: $timeout
      } );
      $rootScope.$digest();
    } ) );

    describe( 'initial state', function () {
      it( 'scope.ctrl.config should contain the widget config', function () {
        expect( ctrl.config ).toBe( widgetConfig );
      } );

      it( 'scope.ctrl.reviews should contain an empty array ', function () {
        expect( ctrl.reviews ).toEqual( [] );
      } );

      it( 'scope.ctrl.loading should be true', function () {
        expect( ctrl.loading ).toBe( true );
      } );

      it( 'should have called Review.query()', function () {
        expect( ReviewResource.query ).toHaveBeenCalled();
      } );

      it( 'scope.ctrl.showIndex should be -1', function () {
        expect( ctrl.showIndex ).toEqual( -1 );
      } );
    } );

    describe( 'loading complete', function () {

      beforeEach( function () {
        $httpBackend.flush();
        $rootScope.$digest();
      } );

      it( 'scope.ctrl.reviews should contain the resource reviews', function () {
        var expectedLength = mockApiResponse.length;
        expect( ctrl.reviews.length ).toEqual( expectedLength );
        for ( var i = 0; i < expectedLength; i = i + 1 ) {
          expect( ctrl.reviews[i].review ).toEqual( mockApiResponse[i].review );
        }
      } );

      it( 'scope.ctrl.loading should be false', function () {
        expect( ctrl.loading ).toBe( false );
      } );

      it( 'scope.ctrl.visibleReview should index 0', function () {
        expect( ctrl.showIndex ).toEqual( 0 );
      } );

      it( 'scope.ctrl.visibleReview should increment on timeout', function () {
        $timeout.flush();
        $timeout.flush();
        expect( ctrl.showIndex ).toEqual( 1 );
      } );

      it( 'scope.ctrl.visibleReview should reset index to 0 after last review', function () {
        var i, reviewCount = mockApiResponse.length;

        for ( i = 0; i < reviewCount; i = i + 1 ) {
          $timeout.flush();
          $timeout.flush();
        }
        expect( ctrl.showIndex ).toEqual( 0 );
      } );
    } );
  } );

  describe( 'recentReviews.tpl.html', function () {
    var $scope, ctrl, element, elementScope, widgetConfig;

    beforeEach( inject( function ( $injector ) {
      var elm = angular.element( '<repx-recent-reviews-widget></repx-recent-reviews-widget>' ),
          $compile = $injector.get( '$compile' );

      $scope = $injector.get( '$rootScope' );
      element = $compile( elm )( $scope );
      $scope.$digest();

      ctrl = element.controller( 'repxRecentReviewsWidget' );

      widgetConfig = $injector.get( 'repxRecentReviewsWidgetConfig' );
      elementScope = element.isolateScope();
    } ) );

    describe( 'in initial state', function () {
      it( 'should show the loading indicator', function () {
        var loadingElem = element.find( '.repx-loading-indicator' );

        expect( loadingElem.hasClass( 'ng-hide' ) ).toBe( false );
        expect( loadingElem.text().trim() ).toBe( widgetConfig.loadingIndicator );
      } );
    } );

    describe( 'when finished loading', function () {
      var reviewElement,
          loadingIndicator,
          reviewCount = mockApiResponse.length;

      beforeEach( function () {
        $httpBackend.flush();
        $scope.$digest();
        reviewElement = element.find( '.reviewer-review-container' );
        loadingIndicator = element.find( '.repx-loading-indicator' );
      } );

      it( 'should hide the loading indicator', function () {
        expect( loadingIndicator.hasClass( 'ng-hide' ) ).toBe( true );
      } );

      describe( 'the reviews', function () {
        it( 'should be added to dom', function () {
          expect( reviewElement.length ).toBe( mockApiResponse.length );
        } );

        it( 'should contain the review text', function () {
          var displayedReview, i;
          for ( i = 0; i < reviewCount; i = i + 1 ) {
            $scope.$digest();
            $scope.$digest();
            displayedReview = reviewElement
              .find( 'p' )
              .eq( i )
              .text()
              .trim();
            expect( displayedReview ).toEqual( mockApiResponse[i].review );
          }
        } );

      } );
    } );
  } );
} );

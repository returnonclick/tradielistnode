(function () {
  'use strict';

  describe('Tradies Controller Tests', function () {
    // Initialize global variables
    var TradiesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TradiesService,
      mockTradie;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TradiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TradiesService = _TradiesService_;

      // create mock Tradie
      mockTradie = new TradiesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Tradie Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Tradies controller.
      TradiesController = $controller('TradiesController as vm', {
        $scope: $scope,
        tradieResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTradiePostData;

      beforeEach(function () {
        // Create a sample Tradie object
        sampleTradiePostData = new TradiesService({
          name: 'Tradie Name'
        });

        $scope.vm.tradie = sampleTradiePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TradiesService) {
        // Set POST response
        $httpBackend.expectPOST('api/tradies', sampleTradiePostData).respond(mockTradie);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Tradie was created
        expect($state.go).toHaveBeenCalledWith('tradies.view', {
          tradieId: mockTradie._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/tradies', sampleTradiePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Tradie in $scope
        $scope.vm.tradie = mockTradie;
      });

      it('should update a valid Tradie', inject(function (TradiesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/tradies\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('tradies.view', {
          tradieId: mockTradie._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TradiesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/tradies\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Tradies
        $scope.vm.tradie = mockTradie;
      });

      it('should delete the Tradie and redirect to Tradies', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/tradies\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('tradies.list');
      });

      it('should should not delete the Tradie and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();

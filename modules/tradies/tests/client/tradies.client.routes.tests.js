(function () {
  'use strict';

  describe('Tradies Route Tests', function () {
    // Initialize global variables
    var $scope,
      TradiesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TradiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TradiesService = _TradiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tradies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tradies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TradiesController,
          mockTradie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tradies.view');
          $templateCache.put('modules/tradies/client/views/view-tradie.client.view.html', '');

          // create mock Tradie
          mockTradie = new TradiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tradie Name'
          });

          //Initialize Controller
          TradiesController = $controller('TradiesController as vm', {
            $scope: $scope,
            tradieResolve: mockTradie
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tradieId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tradieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tradieId: 1
          })).toEqual('/tradies/1');
        }));

        it('should attach an Tradie to the controller scope', function () {
          expect($scope.vm.tradie._id).toBe(mockTradie._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tradies/client/views/view-tradie.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TradiesController,
          mockTradie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tradies.create');
          $templateCache.put('modules/tradies/client/views/form-tradie.client.view.html', '');

          // create mock Tradie
          mockTradie = new TradiesService();

          //Initialize Controller
          TradiesController = $controller('TradiesController as vm', {
            $scope: $scope,
            tradieResolve: mockTradie
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tradieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tradies/create');
        }));

        it('should attach an Tradie to the controller scope', function () {
          expect($scope.vm.tradie._id).toBe(mockTradie._id);
          expect($scope.vm.tradie._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tradies/client/views/form-tradie.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TradiesController,
          mockTradie;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tradies.edit');
          $templateCache.put('modules/tradies/client/views/form-tradie.client.view.html', '');

          // create mock Tradie
          mockTradie = new TradiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Tradie Name'
          });

          //Initialize Controller
          TradiesController = $controller('TradiesController as vm', {
            $scope: $scope,
            tradieResolve: mockTradie
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tradieId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tradieResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tradieId: 1
          })).toEqual('/tradies/1/edit');
        }));

        it('should attach an Tradie to the controller scope', function () {
          expect($scope.vm.tradie._id).toBe(mockTradie._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tradies/client/views/form-tradie.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();

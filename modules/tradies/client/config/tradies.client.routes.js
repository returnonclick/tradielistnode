(function () {
  'use strict';

  angular
    .module('tradies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tradies', {
        abstract: true,
        url: '/tradies',
        template: '<ui-view/>'
      })
      .state('tradies.list', {
        url: '',
        templateUrl: 'modules/tradies/client/views/list-tradies.client.view.html',
        controller: 'TradiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tradies List'
        }
      })
      .state('tradies.create', {
        url: '/create',
        templateUrl: 'modules/tradies/client/views/form-tradie.client.view.html',
        controller: 'TradiesController',
        controllerAs: 'vm',
        resolve: {
          tradieResolve: newTradie
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Tradies Create'
        }
      })
      .state('tradies.edit', {
        url: '/:tradieId/edit',
        templateUrl: 'modules/tradies/client/views/form-tradie.client.view.html',
        controller: 'TradiesController',
        controllerAs: 'vm',
        resolve: {
          tradieResolve: getTradie
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tradie {{ tradieResolve.name }}'
        }
      })
      .state('tradies.view', {
        url: '/:tradieId',
        templateUrl: 'modules/tradies/client/views/view-tradie.client.view.html',
        controller: 'TradiesController',
        controllerAs: 'vm',
        resolve: {
          tradieResolve: getTradie
        },
        data:{
          pageTitle: 'Tradie {{ articleResolve.name }}'
        }
      });
  }

  getTradie.$inject = ['$stateParams', 'TradiesService'];

  function getTradie($stateParams, TradiesService) {
    return TradiesService.get({
      tradieId: $stateParams.tradieId
    }).$promise;
  }

  newTradie.$inject = ['TradiesService'];

  function newTradie(TradiesService) {
    return new TradiesService();
  }
})();

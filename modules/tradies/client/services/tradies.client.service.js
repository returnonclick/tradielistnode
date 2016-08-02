//Tradies service used to communicate Tradies REST endpoints
(function () {
  'use strict';

  angular
    .module('tradies')
    .factory('TradiesService', TradiesService);

  TradiesService.$inject = ['$resource'];

  function TradiesService($resource) {
    return $resource('api/tradies/:tradieId', {
      tradieId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('tradies')
    .controller('TradiesListController', TradiesListController);

  TradiesListController.$inject = ['TradiesService'];

  function TradiesListController(TradiesService) {
    var vm = this;

    vm.tradies = TradiesService.query();
  }
})();

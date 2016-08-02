(function () {
  'use strict';

  // Tradies controller
  angular
    .module('tradies')
    .controller('TradiesController', TradiesController);

  TradiesController.$inject = ['$scope', '$state', 'Authentication', 'tradieResolve'];

  function TradiesController ($scope, $state, Authentication, tradie) {
    var vm = this;

    vm.authentication = Authentication;
    vm.tradie = tradie;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tradie
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.tradie.$remove($state.go('tradies.list'));
      }
    }

    // Save Tradie
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tradieForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tradie._id) {
        vm.tradie.$update(successCallback, errorCallback);
      } else {
        vm.tradie.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tradies.view', {
          tradieId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();

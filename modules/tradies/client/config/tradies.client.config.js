(function () {
  'use strict';

  angular
    .module('tradies')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Tradies',
      state: 'tradies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tradies', {
      title: 'List Tradies',
      state: 'tradies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tradies', {
      title: 'Create Tradie',
      state: 'tradies.create',
      roles: ['user']
    });
  }
})();

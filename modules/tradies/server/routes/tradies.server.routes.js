'use strict';

/**
 * Module dependencies
 */
var tradiesPolicy = require('../policies/tradies.server.policy'),
  tradies = require('../controllers/tradies.server.controller');

module.exports = function(app) {
  // Tradies Routes
  app.route('/api/tradies').all(tradiesPolicy.isAllowed)
    .get(tradies.list)
    .post(tradies.create);

  app.route('/api/tradies/:tradieId').all(tradiesPolicy.isAllowed)
    .get(tradies.read)
    .put(tradies.update)
    .delete(tradies.delete);

  // Finish by binding the Tradie middleware
  app.param('tradieId', tradies.tradieByID);
};

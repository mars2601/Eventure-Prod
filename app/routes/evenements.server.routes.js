'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var evenements = require('../../app/controllers/evenements.server.controller');

	// Evenements Routes
	app.route('/evenements')
		.get(evenements.list)
		.post(users.requiresLogin, evenements.create);

	app.route('/evenements/:evenementId')
		.get(evenements.read)
		.put(users.requiresLogin, evenements.hasAuthorization, evenements.update)
		.delete(users.requiresLogin, evenements.hasAuthorization, evenements.delete);

	// Finish by binding the Evenement middleware
	app.param('evenementId', evenements.evenementByID);
};

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var evenements = require('../../app/controllers/evenements.server.controller');


	// Evenements Routes
	app.route('/evenements')
		.get(evenements.list)
		.post(users.requiresLogin, evenements.create);

    app.route('/all-evenements')
        .post(users.requiresLogin);

    app.route('/users/me').get(users.me);
    app.route('/users.update').put(users.update);
    app.route('/users').get(users.list);
    app.route('/users/accounts').delete(users.removeOAuthProvider);


    app.route('/evenements/:evenementId')
		.get(evenements.read)
		.put(users.requiresLogin, evenements.hasAuthorization, evenements.update)
		.delete(users.requiresLogin, evenements.hasAuthorization, evenements.delete)
        .put(users.update)
        .post(users.sendEmail);



    // Finish by binding the Evenement middleware
	app.param('evenementId', evenements.evenementByID);
};

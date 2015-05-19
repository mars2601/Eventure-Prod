'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Evenement = mongoose.model('Evenement'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, evenement;

/**
 * Evenement routes tests
 */
describe('Evenement CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Evenement
		user.save(function() {
			evenement = {
				name: 'Evenement Name'
			};

			done();
		});
	});

	it('should be able to save Evenement instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evenement
				agent.post('/evenements')
					.send(evenement)
					.expect(200)
					.end(function(evenementSaveErr, evenementSaveRes) {
						// Handle Evenement save error
						if (evenementSaveErr) done(evenementSaveErr);

						// Get a list of Evenements
						agent.get('/evenements')
							.end(function(evenementsGetErr, evenementsGetRes) {
								// Handle Evenement save error
								if (evenementsGetErr) done(evenementsGetErr);

								// Get Evenements list
								var evenements = evenementsGetRes.body;

								// Set assertions
								(evenements[0].user._id).should.equal(userId);
								(evenements[0].name).should.match('Evenement Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Evenement instance if not logged in', function(done) {
		agent.post('/evenements')
			.send(evenement)
			.expect(401)
			.end(function(evenementSaveErr, evenementSaveRes) {
				// Call the assertion callback
				done(evenementSaveErr);
			});
	});

	it('should not be able to save Evenement instance if no name is provided', function(done) {
		// Invalidate name field
		evenement.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evenement
				agent.post('/evenements')
					.send(evenement)
					.expect(400)
					.end(function(evenementSaveErr, evenementSaveRes) {
						// Set message assertion
						(evenementSaveRes.body.message).should.match('Please fill Evenement name');
						
						// Handle Evenement save error
						done(evenementSaveErr);
					});
			});
	});

	it('should be able to update Evenement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evenement
				agent.post('/evenements')
					.send(evenement)
					.expect(200)
					.end(function(evenementSaveErr, evenementSaveRes) {
						// Handle Evenement save error
						if (evenementSaveErr) done(evenementSaveErr);

						// Update Evenement name
						evenement.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Evenement
						agent.put('/evenements/' + evenementSaveRes.body._id)
							.send(evenement)
							.expect(200)
							.end(function(evenementUpdateErr, evenementUpdateRes) {
								// Handle Evenement update error
								if (evenementUpdateErr) done(evenementUpdateErr);

								// Set assertions
								(evenementUpdateRes.body._id).should.equal(evenementSaveRes.body._id);
								(evenementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Evenements if not signed in', function(done) {
		// Create new Evenement model instance
		var evenementObj = new Evenement(evenement);

		// Save the Evenement
		evenementObj.save(function() {
			// Request Evenements
			request(app).get('/evenements')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Evenement if not signed in', function(done) {
		// Create new Evenement model instance
		var evenementObj = new Evenement(evenement);

		// Save the Evenement
		evenementObj.save(function() {
			request(app).get('/evenements/' + evenementObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', evenement.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Evenement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Evenement
				agent.post('/evenements')
					.send(evenement)
					.expect(200)
					.end(function(evenementSaveErr, evenementSaveRes) {
						// Handle Evenement save error
						if (evenementSaveErr) done(evenementSaveErr);

						// Delete existing Evenement
						agent.delete('/evenements/' + evenementSaveRes.body._id)
							.send(evenement)
							.expect(200)
							.end(function(evenementDeleteErr, evenementDeleteRes) {
								// Handle Evenement error error
								if (evenementDeleteErr) done(evenementDeleteErr);

								// Set assertions
								(evenementDeleteRes.body._id).should.equal(evenementSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Evenement instance if not signed in', function(done) {
		// Set Evenement user 
		evenement.user = user;

		// Create new Evenement model instance
		var evenementObj = new Evenement(evenement);

		// Save the Evenement
		evenementObj.save(function() {
			// Try deleting Evenement
			request(app).delete('/evenements/' + evenementObj._id)
			.expect(401)
			.end(function(evenementDeleteErr, evenementDeleteRes) {
				// Set message assertion
				(evenementDeleteRes.body.message).should.match('User is not logged in');

				// Handle Evenement error error
				done(evenementDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Evenement.remove().exec();
		done();
	});
});
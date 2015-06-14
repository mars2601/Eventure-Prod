'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
    config = require('../../../config/config'),
    async = require('async'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer');

/**
 * Update user details
 */
exports.update = function(req, res) {

	// Init Variables
	var user = req.user;
    var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
                        res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send a mail
 */
exports.sendEmail = function(req, res, next) {
    console.error("begin");
    console.error(req.user._id);

    var user = req.user;
    var evenement = req.evenement;
    var userEmail = user.email;
    var userDisplayName = user.displayName;
    console.error(evenement);
    console.error(user);

    async.waterfall([
        // Generate random token
        function(done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, token);
            });
        },
        // If valid email, send reset email using service
        function( user, done) {
            console.error(userEmail);

            var smtpTransport = nodemailer.createTransport(config.mailer.options);
            console.error(userDisplayName);
            var mailOptions = {
                to: userEmail,
                from: config.mailer.from,
                subject: 'Demande d\'invitation - Eventure',
                ContentType: 'text/html; charset=UTF-8',
                html: '<h1>Bonjour <b>'+ evenement.user.displayName+ '</b></h1>' +
                '<p>L\'utilisateur <b>'+ userDisplayName +'</b> à demandé à rejoindre l\'évenement « <b>'+ evenement.name +'</b> »</p>' +
                '<p>Répondez à sa demande <a href="http://192.168.1.3:3000/#!/evenements/'+ evenement._id +'">sur la page de l\'évenement</a></p>'
            };
            console.error('2');
            smtpTransport.sendMail(mailOptions, function(err) {
                if (!err) {
                    res.send({
                        message: 'An email has been sent to ' + user.email + ' with further instructions.'
                    });
                }

                done(err);
            });
        }
    ], function(err) {
        if (err) return next(err);
    });

    // Init Variables
   /* var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;

        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }*/
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.json(req.user || null);
};
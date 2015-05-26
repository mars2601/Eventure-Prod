'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    fs = require('fs'),
    uploadPath = './public/uploaded/',
    eventCoverPath = 'events/cover/',
	Evenement = mongoose.model('Evenement'),
	_ = require('lodash');


/**
 * Create a Evenement
 */
exports.create = function(req, res) {
	var evenement = new Evenement(req.body);
	evenement.user = req.user;
    var imageBuffer = new Buffer(evenement.coverImage[0].dataUrl, 'base64');
    var imagePath = uploadPath+eventCoverPath+evenement._id+'.'+evenement.coverImage[0].contentType;

    fs.writeFile( imagePath, imageBuffer, function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.error('image well created');
        }
    });
    evenement.coverImage[0].dataUrl = '';

	evenement.save(function(err) {
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
            res.jsonp(evenement);
		}
	});
};

/**
 * Show the current Evenement
 */
exports.read = function(req, res) {
	res.jsonp(req.evenement);
};

/**
 * Update a Evenement
 */
exports.update = function(req, res) {
	var evenement = req.evenement ;
    console.error(evenement);
	evenement = _.extend(evenement , req.body);

	evenement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evenement);
		}
	});
};

/**
 * Delete an Evenement
 */
exports.delete = function(req, res) {
	var evenement = req.evenement ;

	evenement.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(evenement);
		}
	});
};

/**
 * List of Evenements of the user
 */
exports.list = function(req, res) {
    if(req.query.all === 'true'){
        Evenement.find().sort('-created').populate('user', 'displayName').exec(function(err, evenements) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                console.error(evenements);
                res.jsonp(evenements);
            }
        });
    }else{
        Evenement.find({ $or: [{user: req.user._id}, {guests: { $elemMatch: { _id: req.user._id  }}}] }).sort('-created').populate('user', 'displayName').exec(function(err, evenements) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(evenements);

            }
        });
    }

};


/**
 * Evenement middleware
 */
exports.evenementByID = function(req, res, next, id) { 
	Evenement.findById(id).populate('user', 'displayName').exec(function(err, evenement) {
		if (err) return next(err);
		if (! evenement) return next(new Error('Failed to load Evenement ' + id));
		req.evenement = evenement ;
		next();
	});
};

/**
 * Evenement authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.evenement.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

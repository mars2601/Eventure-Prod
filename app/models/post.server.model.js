'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
	textContent: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    localisation: [
        {
            name: {
                type: String
            },
            lat: {
                type: String
            },
            long: {
                type: String
            }
        }
    ],
	user_id: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    event_id: {
        type: Schema.ObjectId,
        ref: 'Event'
    },
    coverImage: [
        {
            contentType: {
                type: String
            },
            width: {
                type: Number
            },
            height: {
                type: Number
            },
            dataUrl: {
                type: String
            }
        }
    ],
    type: {
        type: [{
            type: String,
            enum: ['normal', 'flash', 'text']
        }],
        default: ['normal']
    },
    guests: [
        {
            _id: {
                type: Schema.ObjectId
            },
            state: {
                type: [{
                    type: Boolean
                }],
                default: false
            }
        }
    ]
});

mongoose.model('Post', PostSchema);
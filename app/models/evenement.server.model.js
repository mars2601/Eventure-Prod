'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Evenement Schema
 */
var EvenementSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Veuillez renseigner le nom de l\'évenement',
		trim: true
	},
    description: {
        type: String,
        default: ''
    },
    beginTimestamp: {
        type: Date,
        default: Date.now,
        required: 'Veuillez renseigner la date de début de l\'évenement'
    },
    endTimestamp: {
        type: Date,
        default: Date.now,
        required: 'Veuillez renseigner la date de fin de l\'évenement'
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
    image: {
        type: String,
        default: ''
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
	created: {
		type: Date,
		default: Date.now
	},
    guests: [
        {
            _id: {
                type: Schema.ObjectId
            },
            state: {
                type: [{
                    type: String,
                    enum: ['waiting', 'willcome', 'income', 'present', 'return']
                }],
                default: ['waiting']
            }
        }
    ],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
mongoose.model('Evenement', EvenementSchema);
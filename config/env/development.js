'use strict';

module.exports = {
	db: 'mongodb://localhost/eventure-dev',
	app: {
		title: 'Eventure - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '884615724928206',
		clientSecret: process.env.FACEBOOK_SECRET || 'a40353835e26cf370aa1fcebd493221a',
		callbackURL: 'http://192.168.1.3:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'HVuAiZ2JFGxp38Wfjp9kQCQBr',
		clientSecret: process.env.TWITTER_SECRET || 'P48jmn0lBvsQXbg89tLa2wsUjCZAvFJuJieePVsjNZAirVB8Em',
		callbackURL: 'http://192.168.1.3:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};

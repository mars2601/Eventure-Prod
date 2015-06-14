'use strict';

module.exports = {
	db: 'mongodb://localhost/eventure-dev',
	app: {
		title: 'Eventure - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1382193778748790',
		clientSecret: process.env.FACEBOOK_SECRET || 'b449a91f961f5cea3f541f5c13f241d4',
		callbackURL: 'http://app.eventure-app.be:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'QEgtRtXbDsmHthB9BWOEi9esw',
		clientSecret: process.env.TWITTER_SECRET || 'tWDvq5UkfTnO7jv7ff66GxQF4JVIRkYlRH7l6eDAr3YVYdvgRC',
		callbackURL: 'http://app.eventure-app.be:3000/auth/twitter/callback'
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
		from: process.env.MAILER_FROM || 'hello.eventure@gmail.com',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'hello.eventure@gmail.com',
				pass: process.env.MAILER_PASSWORD || 'eventure3000'
			}
		}
	}
};

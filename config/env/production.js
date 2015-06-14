'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/eventure',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/ngDialog/css/ngDialog.css',
			],
			js: [
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-touch/angular-touch.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/ngDialog/js/ngDialog.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/custom/init.js',
                'public/lib/ng-file-upload/FileAPI.min.js',
                'public/lib/ng-file-upload/angular-file-upload-shim.min.js',
                'public/lib/angular/angular.js',
                'public/lib/ng-file-upload/angular-file-upload.min.js'
			]
		},
		css: 'public/modules/core/css/*.css',
		js: 'public/dist/application.min.js'
	},
    facebook: {
        clientID: process.env.FACEBOOK_ID || '1382193778748790',
        clientSecret: process.env.FACEBOOK_SECRET || 'b449a91f961f5cea3f541f5c13f241d4',
        callbackURL: 'eventure-app.marcel-pirnay.be/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'QEgtRtXbDsmHthB9BWOEi9esw',
        clientSecret: process.env.TWITTER_SECRET || 'tWDvq5UkfTnO7jv7ff66GxQF4JVIRkYlRH7l6eDAr3YVYdvgRC',
        callbackURL: 'eventure-app.marcel-pirnay.be/auth/twitter/callback'
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

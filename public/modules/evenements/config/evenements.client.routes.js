'use strict';

//Setting up route
angular.module('evenements').config(['$stateProvider',
	function($stateProvider) {
		// Evenements state routing
		$stateProvider.
		state('listEvenements', {
			url: '/evenements',
			templateUrl: 'modules/evenements/views/list-evenements.client.view.html'
		}).
		state('createEvenement', {
			url: '/evenements/create',
			templateUrl: 'modules/evenements/views/create-evenement.client.view.html'
		}).
		state('viewEvenement', {
			url: '/evenements/:evenementId',
			templateUrl: 'modules/evenements/views/view-evenement.client.view.html'
		}).
		state('editEvenement', {
			url: '/evenements/:evenementId/edit',
			templateUrl: 'modules/evenements/views/edit-evenement.client.view.html'
		});
	}
]);
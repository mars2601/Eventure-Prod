'use strict';

// Configuring the Articles module
angular.module('evenements').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Evenements', 'evenements', 'dropdown', '/evenements(/create)?');
		Menus.addSubMenuItem('topbar', 'evenements', 'List Evenements', 'evenements');
		Menus.addSubMenuItem('topbar', 'evenements', 'New Evenement', 'evenements/create');
	}
]);
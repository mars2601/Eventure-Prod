'use strict';

// Configuring the Articles module
angular.module('posts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('bottombar', 'Posts', 'posts', 'dropdown', '/posts(/create)?');
		Menus.addSubMenuItem('bottombar', 'posts', 'List Posts', 'posts');
		Menus.addSubMenuItem('bottombar', 'posts', 'New Post', 'posts/create');
	}
]);
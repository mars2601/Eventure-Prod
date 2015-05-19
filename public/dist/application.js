'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'eventure';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('evenements');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('timeline', {
			url: '/timeline',
			templateUrl: 'modules/core/views/timeline.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', 'Authentication', 'Menus',
	function($scope, $location, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
        $scope.viewMenuLeft = false;
        $scope.viewMenuRight = false;
        $scope.menuClassRight = 'close'; /*close the menus*/
        $scope.menuClassLeft = 'close'; /*close the menus*/


        switch(Authentication.user.provider) {
            case 'twitter':
                $scope.profilePicture = Authentication.user.providerData.profile_image_url_https;
                break;
            case 'facebook':
                $scope.profilePicture = 'http://graph.facebook.com/'+Authentication.user.providerData.id+'/picture?type=square';
                break;
            default:
                $scope.profilePicture = '';
        }

        $scope.toggleMenu = function(side, path) {
            if( side === 'left'){
                $scope.viewMenuLeft = ($scope.viewMenuLeft === false) ? true : false;
                if($scope.viewMenuLeft === false){
                    $scope.menuClassLeft = 'close';
                }else if($scope.viewMenuLeft === true){
                    $scope.menuClassLeft = 'open';
                    $scope.menuClassRight = 'close';
                }
            }else if( side === 'right'){
                $scope.viewMenuRight = ($scope.viewMenuRight === false) ? true : false;
                if($scope.viewMenuRight === false){
                    $scope.menuClassRight = 'close';
                }else if($scope.viewMenuRight === true){
                    $scope.menuClassRight = 'open';
                    $scope.menuClassLeft = 'close';
                }
            }

            /*Redirect to the link path*/
            if( path ){
                $location.path( path );
            }
        };

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

angular.module('core').controller('TimelineController', ['$scope',
	function($scope) {
		// Timeline controller logic
		// ...
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Evenements', 'Users', 'fileReader',
	function($scope, $stateParams, $location, Authentication, Evenements, Users, fileReader) {
		$scope.authentication = Authentication;
        $scope.guests = Users.query();
        /*global Google */

        /* users Filtered by guest, see if he's guest or not*/
        $scope.UserFilterGuest = function(eve) {
            return function( user ) {
                for(var i = 0; i < eve.guests.length; i++){
                    if(user._id === eve.guests[i]._id){
                        return true;
                    }
                }
            };
        };

        /* users Filtered by mine, see if I am invited or if I created the event*/
        $scope.EventsFilterMine = function() {
            return function( eve ) {
                for(var i = 0; i < eve.guests.length; i++){
                    if(Authentication.user._id === eve.guests[i] || Authentication.user._id === eve.user._id){
                        return true;
                    }
                }
            };
        };

        $scope.googleMapPointer = function(){
            // This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
            var map;
            var input;

            function initialize() {
                var markers = [];

                var mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng(-34.397, 150.644)
                };

                map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);

                var defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(-33.8902, 151.1759),
                    new google.maps.LatLng(-33.8474, 151.2631));
                    map.fitBounds(defaultBounds);

                // Create the search box and link it to the UI element.
                input = (document.getElementById('pac-input'));
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                var searchBox = new google.maps.places.SearchBox((input));

                // Listen for the event fired when the user selects an item from the
                // pick list. Retrieve the matching places for that item.
                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();

                    if (places.length === 0) {
                        return;
                    }
                    var i;
                    for (i = 0, marker; marker = markers[i]; i++) {
                        marker.setMap(null);
                    }

                    // For each place, get the icon, place name, and location.
                    markers = [];
                    var bounds = new google.maps.LatLngBounds();
                    var i;
                    for (i = 0, place; place = places[i]; i++) {
                        var image = {
                            url: place.icon,
                            size: new google.maps.Size(71, 71),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(17, 34),
                            scaledSize: new google.maps.Size(25, 25)
                        };

                        // Create a marker for each place.
                        var marker = new google.maps.Marker({
                            map: map,
                            icon: image,
                            title: place.name,
                            position: place.geometry.location
                        });

                        markers.push(marker);

                        bounds.extend(place.geometry.location);

                        $scope.placeName = place.name;
                        $scope.lat = place.geometry.location.A;
                        $scope.long = place.geometry.location.F;
                        alert($scope.long);
                        alert($scope.placeName);
                    }

                    map.fitBounds(bounds);
                });

                // Bias the SearchBox results towards places that are within the bounds of the
                // current map's viewport.
                google.maps.event.addListener(map, 'bounds_changed', function() {
                    var bounds = map.getBounds();
                    searchBox.setBounds(bounds);
                });
            }
            google.maps.event.addDomListener(window, 'load', initialize);
        };

        // Get cover image for the event
        $scope.getFile = function () {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                    $scope.imageSrc = result;
                    var imageSrcSplit = result.split(';base64'); // return data:image/*
                    var imageTypeSplit = imageSrcSplit[0].split('image/'); // return * the type of the image
                    $scope.imageContentType = imageTypeSplit[1];
                    var i = new Image();
                    i.src = result;
                    $scope.originalWidth = i.width;
                    $scope.originalHeight = i.height;
                });
        };

        $scope.$on('fileProgress', function(e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });

        // Display the create page
        $scope.createDisplay = function() {
            $scope.selection = [];

            // helper method to get the selected
            $scope.selectedGuests = function selectedGuests() {
                return filterFilter($scope.guests, { selected: true });
            };

            // watch for changes
            $scope.$watch('guests|filter:{selected:true}', function (nv) {
                $scope.selection = nv.map(function (guest) {
                    return guest._id;
                });
            }, true);
        };

            // Create new Evenementz
		$scope.create = function() {
			// Create new Evenement object

            var beginDate  = $scope.evenement.beginDate;
            var beginTime  = $scope.evenement.beginTime;
            beginDate = beginDate.split('-');
            var beginDate1 = beginDate[2]+'-'+beginDate[1]+'-'+beginDate[0]+' '+beginTime+':00';
            var begin1 = new Date();
            var begin2 = begin1.getTimezoneOffset();
            var beginCurrentUTCTimeStamp = (new Date(beginDate1).getTime());
            var beginUTC0TS = beginCurrentUTCTimeStamp + (begin2*60000);

            var endDate  = $scope.evenement.endDate;
            var endTime  = $scope.evenement.endTime;
            endDate = endDate.split('-');
            var endDate1 = endDate[2]+'-'+endDate[1]+'-'+endDate[0]+' '+endTime+':00';
            var end1 = new Date();
            var end2 = end1.getTimezoneOffset();
            var endCurrentUTCTimeStamp = (new Date(endDate1).getTime());
            var endUTC0TS = endCurrentUTCTimeStamp + (end2*60000);


            var evenement = new Evenements ({
				name: this.evenement.name,
				description: this.evenement.description,
                guests:[],
                beginTimestamp: beginUTC0TS,
                endTimestamp: endUTC0TS,
                localisation: [{
                    name: $scope.placeName,
                    lat: $scope.lat,
                    long: $scope.long
                }],
                coverImage: [{
                    contentType: $scope.imageContentType,
                    width: $scope.originalWidth,
                    height: $scope.originalHeight,
                    dataUrl: $scope.imageSrc
                }]
			});

            for (var j = 0; j < $scope.selection.length; j++){
                evenement.guests.push({_id: $scope.selection[j]});
            }


            console.log(evenement);

			// Redirect after save
			evenement.$save(function(response) {
				$location.path('evenements/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
                alert('aie');
                $scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Evenement
		$scope.remove = function(evenement) {
			if ( evenement ) {
				evenement.$remove();

				for (var i in $scope.evenements) {
					if ($scope.evenements [i] === evenement) {
						$scope.evenements.splice(i, 1);
					}
				}
			} else {
				$scope.evenement.$remove(function() {
					$location.path('evenements');
				});
			}
		};

        $scope.addGuest = function() {
            var evenement = $scope.evenement;

            evenement.$update(function() {
                $location.path('evenements/' + evenement._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

		// Update existing Evenement
		$scope.update = function() {
			var evenement = $scope.evenement;

			evenement.$update(function() {
				$location.path('evenements/' + evenement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Evenements
		$scope.find = function() {
			$scope.evenements = Evenements.query();
            $scope.users = Users.query();
        };

		// Find existing Evenement
		$scope.findOne = function() {
			$scope.evenement = Evenements.get({
				evenementId: $stateParams.evenementId
			});
            $scope.users = Users.query();

        };
	}
]);

angular.module('evenements').directive('ngFileSelect',function(){
    return {
        link: function($scope,el){
            el.bind('change', function(e){
                $scope.file = (e.srcElement || e.target).files[0];
                $scope.getFile();
            });
        }
    };
});
'use strict';

//Evenements service used to communicate Evenements REST endpoints
angular.module('evenements').factory('Evenements', ['$resource',
	function($resource) {
		return $resource('evenements/:evenementId', { evenementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('fileReader', ['$q', '$log',
    function($q, $log) {
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast('fileProgress',
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            console.log(reader);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('list', {
			url: '/users',
			templateUrl: 'modules/users/views/list.client.view.html'
		}).
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/timeline');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/signin');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/timeline');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to  the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', [ '$scope', '$http', '$location', 'Users',  'Authentication',
	function($scope, $http, $location, Users,  Authentication) {

		$scope.user = Authentication.user;


        var pP;
        var ispP;
        switch(Authentication.user.provider) {
            case 'twitter':
                pP = Authentication.user.providerData.profile_image_url_https;
                break;
            case 'facebook':
                pP = 'http://graph.facebook.com/'+Authentication.user.providerData.id+'/picture?type=square';
                break;
            default:
                pP = '';
        }
        $scope.ispP = (pP === '') ? true : false;
        $scope.profilePicture = pP;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

        $scope.findAll = function (){
            $scope.allUsers = Users.query();
            console.log($scope.allUsers);
        };

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
				user.$update(function(response) {
                    $scope.success = true;
					Authentication.user = response;

                }, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
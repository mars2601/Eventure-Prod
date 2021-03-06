'use strict';

angular.module('users').controller('SettingsController', [ '$scope', '$http', '$location', 'Users',  'Authentication',
	function($scope, $http, $location, Users,  Authentication) {

		$scope.user = Authentication.user;
        $('.header__link__focus').removeClass('header__link__focus');

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

        $(".signin").parent("section").css("height", "100%");

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

        $scope.findAll = function (){
            $scope.allUsers = Users.query({all:true});
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
                console.log($scope.user);
                var user = new Users($scope.user);
                console.log(user);



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
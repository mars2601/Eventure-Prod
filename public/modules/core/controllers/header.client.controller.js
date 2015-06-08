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

            $("#right-menu").click(function(){
                $(this).toggleClass('header__link__focus');
                $("#left-menu").removeClass('header__link__focus');
            });
            $("#left-menu").click(function(){
                $(this).toggleClass('header__link__focus');
                $("#right-menu").removeClass('header__link__focus');
            });


        if($scope.authentication.user == ''){
            $scope.showMenu = false;
        }else{

            $scope.showMenu = true;

        }

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
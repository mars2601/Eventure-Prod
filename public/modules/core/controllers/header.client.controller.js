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


        $scope.toggleMenu = function(side, path) {
            console.log('phase1R:'+$scope.viewMenuRight);
            console.log('phase1L:'+$scope.viewMenuLeft);

            if( side === 'left'){
                $("#left-menu").toggleClass('header__link__focus');
                $("#right-menu").removeClass('header__link__focus');
                $scope.viewMenuLeft = ($scope.viewMenuLeft === false);
                if($scope.viewMenuLeft === false){
                    $scope.menuClassLeft = 'close';
                }else if($scope.viewMenuLeft === true){
                    $scope.menuClassLeft = 'open';
                    $scope.menuClassRight = 'close';
                    $scope.viewMenuRight = false;

                }
            }else if( side === 'right'){
                $("#right-menu").toggleClass('header__link__focus');
                $("#left-menu").removeClass('header__link__focus');
                $scope.viewMenuRight = ($scope.viewMenuRight === false);
                if($scope.viewMenuRight === false){
                    $scope.menuClassRight = 'close';
                }else if($scope.viewMenuRight === true){
                    $scope.menuClassRight = 'open';
                    $scope.menuClassLeft = 'close';
                    $scope.viewMenuLeft = false;
                }
            }else{
                $("#right-menu").removeClass('header__link__focus');
                $("#left-menu").removeClass('header__link__focus');
                $scope.menuClassRight = 'close';
                $scope.menuClassLeft = 'close';
                $scope.viewMenuLeft = false;
                $scope.viewMenuRight = false;
            }

            console.log('phase2R:'+$scope.viewMenuRight);
            console.log('phase2L:'+$scope.viewMenuLeft);

            /*Redirect to the link path*/
            if( path ){
                $location.path( path );
            }
        };

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
                $scope.profilePicture = './img/defaultUserCover.jpg';
        }



		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$window', '$location', 'Authentication', 'fileReader', 'Users', 'Posts',
	function($scope, $stateParams, $window, $location, Authentication, fileReader, Users, Posts) {
		$scope.authentication = Authentication;
/*
        $scope.users = Users.query();
*/


        $scope.findAuthor = function(user_id) {
            Users.query({all:true}).$promise.then(function(data) {
                // success handler
                $scope.users = data;
            }, function(error) {
                // error handler
            });

            if($scope.users.length > 0){
                for(var i = 0; i < $scope.users.length; i++){
                    if($scope.users[i]._id === user_id){
                        return $scope.users[i];
                    }
                }
            }

        };

		// Create new Post
		$scope.createPost = function(eve) {
            // Create new Post object
			var post = new Posts ({
                textContent: this.post.textContent,
                event_id: eve._id,
                user_id: Authentication.user._id,
                guests:[],
                type:{
                    type:[]
                },
                coverImage: [{
                    contentType: $scope.imageContentType,
                    dataUrl: $scope.base64Data,
                    width: $scope.originalWidth,
                    height: $scope.originalHeight
                }]
			});

            post.type.type[0] = 'normal';


            if($scope.post.type === true){
                post.type.type[0] = 'flash';
            }

            if(post.coverImage[0].contentType === undefined){
                post.type.type[0] = 'text';
                post.coverImage[0].contentType = '';
                post.coverImage[0].dataUrl = '';
                post.coverImage[0].width = 0;
                post.coverImage[0].height = 0;
            }

            for (var j = 0; j < eve.guests.length; j++){
                post.guests.push({_id: eve.guests[j]._id});
            }

            // Redirect after save
			post.$save(function(response) {
				$location.path('evenements/' + eve._id);
                $window.location.reload();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


		};

		// Remove existing Post
		$scope.remove = function(post) {
			if ( post ) { 
				post.$remove();

				for (var i in $scope.posts) {
					if ($scope.posts [i] === post) {
						$scope.posts.splice(i, 1);
					}
				}
			} else {
				$scope.post.$remove(function() {
					$location.path('posts');
				});
			}
		};

		// Update existing Post
		$scope.update = function() {
			var post = $scope.post;

			post.$update(function() {
				$location.path('posts/' + post._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Posts
		$scope.findPosts = function(eve) {
            eve.$promise.then(function(data) {
                $scope.evenement = data;
                $scope.posts = Posts.query({eve: $scope.evenement._id});
            });
		};

		// Find existing Post
		$scope.findOnePost = function() {
			$scope.post = Posts.get({ 
				postId: $stateParams.postId
			});
		};

        // Get cover image for the event
        $scope.getFile = function () {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                    $scope.imageSrc = result;
                    var imageSrcSplit = result.split(';base64,'); // return data:image/*
                    var imageTypeSplit = imageSrcSplit[0].split('image/'); // return * the type of the image
                    $scope.imageContentType = imageTypeSplit[1];
                    $scope.base64Data = imageSrcSplit[1];
                    var i = new Image();
                    i.src = result;
                    $scope.originalWidth = i.width;
                    $scope.originalHeight = i.height;
                });
        };
	}
]);

angular.module('posts').directive('ngFileSelect',function(){
    return {
        link: function($scope,el){
            el.bind('change', function(e){
                $scope.file = (e.srcElement || e.target).files[0];
                $scope.getFile();
            });
        }
    };
});
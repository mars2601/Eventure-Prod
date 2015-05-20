'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Evenements', 'Users', 'fileReader',
	function($scope, $stateParams, $location, Authentication, Evenements, Users, fileReader) {
		$scope.authentication = Authentication;
        $scope.guests = Users.query();
        /*global Google */

 /*       $scope.uploadFile = function(){
            var file = $scope.myFile;
            console.log('file is ' + JSON.stringify(file));
            var uploadUrl = "/fileUpload";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };*/

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
                    var marker;
                    for (i = 0; marker = markers[i]; i++) {
                        marker.setMap(null);
                    }

                    // For each place, get the icon, place name, and location.
                    markers = [];
                    var bounds = new google.maps.LatLngBounds();
                    var i;
                    var place;
                    for (i = 0; place = places[i]; i++) {
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
            initialize();
/*
            google.maps.event.addDomListener(window, 'load', initialize);
*/
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

                    /*require("fs").writeFile("/tmp/out.png", base64Data, 'base64', function(err) {
                        console.log(err);
                    });*/
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

		$scope.create = function() {
			// Create new Evenement object

            var beginDate  = $scope.evenement.beginDate;
            var beginTime  = $scope.evenement.beginTime;

            beginDate = beginDate.split('-');
            var begin1 = new Date();
            var begin2 = begin1.getTimezoneOffset();
            var beginCurrentUTCTimeStamp = (new Date(beginDate[1]+' '+beginDate[1]+', '+beginDate[0]+' '+beginTime).getTime());
            var beginUTC0TS = beginCurrentUTCTimeStamp + (begin2*60000);

            var endDate  = $scope.evenement.endDate;
            var endTime  = $scope.evenement.endTime;
            endDate = endDate.split('-');
            var end1 = new Date();
            var end2 = end1.getTimezoneOffset();
            var endCurrentUTCTimeStamp = (new Date(endDate[1]+' '+endDate[1]+', '+endDate[0]+' '+endTime).getTime());
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
                image: null,
                coverImage: [{
                    contentType: $scope.imageContentType,
                    width: $scope.originalWidth,
                    height: $scope.originalHeight,
                    dataUrl: $scope.base64Data
                }]
			});

            for (var j = 0; j < $scope.selection.length; j++){
                evenement.guests.push({_id: $scope.selection[j]});
            }

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


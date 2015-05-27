'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Evenements', 'Users', 'fileReader',
	function($scope, $stateParams, $location, Authentication, Evenements, Users, fileReader) {
		$scope.authentication = Authentication;
        $scope.guests = Users.query();
        $scope.placeName = '';
        $scope.lat = '';
        $scope.long = '';
        $scope.defaultEventCover = './img/defaultEventCover.png';



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
                if(eve.guests){
                    for(var i = 0; i < eve.guests.length; i++){
                        if(user._id === eve.guests[i]._id){
                            return true;
                        }
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

        /* Filter the events where I'm invited */
        $scope.EventsFilterGuest = function(eve) {
            return function( eve ) {
                for (var i = 0; i < eve.guests.length; i++) {
                    if (Authentication.user._id === eve.guests[i]._id) {
                        return true;
                    }
                }
            };
        };

        /* Filter the events that I created */
        $scope.EventsFilterAuthor = function(eve) {
            return function( eve ) {
                if(Authentication.user._id === eve.user._id){
                    return true;
                }
            };
        };

        $scope.googleMapPointer = function(){
        /*    // This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
            var map;
            var input;
            function initialize() {
                var markers = [];

                var mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng(-34.397, 150.644),
                    mapTypeControl: false,
                    streetViewControl: false
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
*//*
            google.maps.event.addDomListener(window, 'load', initialize);
*/
            function initialize() {

                var input = (document.getElementById('pac-input'));
                var searchBox = new google.maps.places.SearchBox((input));

                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();

                    var place;
                    var i;
                    for (i = 0; place = places[i]; i++) {

                        $scope.placeName = place.name;
                        $scope.lat = place.geometry.location.A;
                        $scope.long = place.geometry.location.F;
                        alert($scope.long);
                        alert($scope.placeName);
                    }
                });
            }
            initialize();
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


        $scope.$on('fileProgress', function(e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });

        // Display the create page
        $scope.createDisplay = function() {
            $scope.selection = [];
            $scope.inputSelection = [];
            $scope.inputDeSelection = [];

            var limitStep = 4;
            $scope.limitStep = limitStep;
            $scope.limit = limitStep;
            $scope.incrementLimit = function() {
                $scope.limit += limitStep;
            };
            $scope.decrementLimit = function() {
                $scope.limit -= limitStep;
            };

            $scope.notMe = function( guests ){
                return function( guests ) {
                    if(Authentication.user._id != guests._id){
                            return true;
                        }
                };
            };
            $scope.notCurrentGuests = function(evenement, guests){


            };

            $scope.isInvited = function(eve, guest){
                if(eve){
                    for(var i = 0; i < eve.length; i++){
                        if(eve[i]._id === guest._id){
                            return true;
                        }
                    }
                }
            };

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

            $scope.checkedIsInvited = function(checked, _id) {

                if(checked === true){
                    for(var i=0; i < $scope.inputDeSelection.length; i++){
                        if($scope.inputDeSelection[i] === _id){
                            $scope.inputDeSelection.splice(i, i+1);
                        }
                    }
                    $scope.inputSelection.push({_id});
                }else if(checked === false){
                    for(var j=0; j < $scope.inputSelection.length; j++){
                        if($scope.inputSelection[j] === _id){
                            $scope.inputSelection.splice(j, j+1);
                        }
                    }
                    $scope.inputDeSelection.push({_id});
                }
            };
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
            evenement.localisation[0].name = $scope.placeName;
            evenement.localisation[0].lat = $scope.lat;
            evenement.localisation[0].long = $scope.long;



            var previousGuests = $scope.evenement.guests;

            var newGuests = previousGuests.concat($scope.selection);

            console.log(JSON.stringify($scope.inputSelection));
            console.log("-----deselect--------");

            console.log(JSON.stringify($scope.inputDeSelection));

            console.log("-----previous--------");
            console.log(JSON.stringify(previousGuests));


            var previousGuests1 = previousGuests;

            for(var i = 0; i < previousGuests1.length; i++){
                for(var j = 0; j < $scope.inputDeSelection.length; j++){
                    if(previousGuests1[i] && $scope.inputDeSelection[j]){
                        if(previousGuests1[i]._id === $scope.inputDeSelection[j]._id){
                            previousGuests.splice(i, 1);
                            console.log(previousGuests1);
                        }else{}
                    }else{
                        console.log("wtf"+ i +"-"+ j);
                    }

                }
            }

            console.log("-----previous - deselect--------");

            console.log(JSON.stringify(previousGuests));

            console.log("------guests------");


            for (var j = 0; j < $scope.selection.length; j++){
                evenement.guests.push({_id: $scope.selection[j]});
            }

            console.log(JSON.stringify($scope.evenement.guests));

			evenement.$update(function() {
				$location.path('evenements/' + evenement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a specific list of Evenements
		$scope.find = function(type) {
			$scope.evenements = Evenements.query({all:false});
            $scope.users = Users.query();
            console.log($scope.evenements);
        };

        // Find all Evenements
        $scope.findAll = function() {
            $scope.evenements = Evenements.query({all:true});
            console.log($scope.evenements);
            $scope.users = Users.query();
        };

		// Find existing Evenement
		$scope.findOne = function() {
			$scope.evenement = Evenements.get({
				evenementId: $stateParams.evenementId
			});
            $scope.users = Users.query();
            if($scope.buttonValue == undefined && $scope.stateValue == undefined){
                $scope.buttonValue = "Viendra";
                $scope.stateValue = "En attente";
            }
            $scope.evenement.$promise.then(function(data) {
                $scope.evenement = data;
                for(var i = 0; i < Authentication.user.requests.length; i++){
                    if(Authentication.user.requests[i].event_id != $scope.evenement._id){
                        $scope.askInviteButton = 'Demander un invitation';
                        $scope.askInviteButtonClass = false;
                    }else{
                        $scope.askInviteButton = 'Demande d\'invitation envoyée';
                        $scope.askInviteButtonClass = true;
                    }
                }
            });

        };

        $scope.restoreDataView = function(evenement, user) {
            $scope.users = Users.query();


            $scope.users.$promise.then(function(dataUsers) {
                evenement.$promise.then(function (data) {
                    $scope.evenement = data;
                    $scope.users = dataUsers;
                    for (var i = 0; i < $scope.evenement.guests.length; i++) {
                        if ($scope.evenement.guests[i]._id === user._id) {
                            $scope.currentGuest = $scope.evenement.guests[i];
                        }
                    }
                    $scope.newGuests = [];

                    if (Authentication.user._id === $scope.evenement.user._id) {

                        for (var j = 0; j < $scope.users.length; j++) {

                            for(var g = 0; g < $scope.users[j].requests.length; g++){
                                if ($scope.users[j].requests[g].event_id == $scope.evenement._id) {

                                    console.log($scope.users[j].firstName);
                                    console.log($scope.users[j]);
                                    $scope.newGuests.push($scope.users[j]);
                                    console.log($scope.newGuests);
                                }
                            }

                        }
                    }
                });
            });
        };
            $scope.changeState = function(currentGuest){
                console.log(currentGuest.state[0]);
                switch(currentGuest.state[0]) {
                    case 'waiting':
                        currentGuest.state[0] = 'willcome';
                        $scope.buttonValue = "En route";
                        $scope.stateValue = "Sera présent";
                        alert('Vous comptez être présent à l\'évenement !');
                        break;
                    case 'willcome':
                        currentGuest.state[0] = 'income';
                        $scope.buttonValue = "Est présent";
                        $scope.stateValue = "En route";
                        alert('Vous vous rendez vers l\'évenement !');
                        break;
                    case 'income':
                        currentGuest.state[0] = 'present';
                        $scope.buttonValue = "Retourne";
                        $scope.stateValue = "Est présent";
                        alert('Vous êtes présent à l\'évenement !');
                        break;
                    case 'present':
                        currentGuest.state[0] = 'return';
                        $scope.buttonValue = "Yop";
                        $scope.stateValue = "Est retourné";
                        alert('Vous partez de l\'évenement !');
                        break;
                    case 'return':
                        currentGuest.state[0] = 'return';
                        alert('En espérant que vous ayez fais bonne route !');
                        break;
                }
                for(var i = 0; i < $scope.evenement.guests.length; i++){
                    if($scope.evenement.guests[i]._id === user._id) {
                        $scope.evenement.guests[i].state = currentGuest.state;
                    }
                };

                var evenement = $scope.evenement;
                console.log(evenement);
                evenement.$update(function() {
                    $location.path('evenements/' + evenement._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
        };

        $scope.askInvite = function(eve){
            var allow = true;

            for(var i = 0; i < Authentication.user.requests.length; i++){
                if(Authentication.user.requests[i].event_id == eve._id){
                    allow = false;
                }
            }
            if(allow == true){
                Authentication.user.requests.push({event_id: eve._id});

                var user = new Users(Authentication.user);
                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;

                }, function(response) {
                    $scope.error = response.data.message;
                });
                console.log('votre demande a bien été effectuée');
                $scope.askInviteButton = 'Demande d\'invitation envoyée';
                $scope.askInviteButtonClass = true;
            }else{
                console.log('vous êtes en attente de demande d\'invitations');
                $scope.askInviteButton = 'Demande d\'invitation envoyée';
                $scope.askInviteButtonClass = true;
            }
        };

        $scope.adminInviteRequest = function(){
            $scope.accept = function(newGuest){
                // add in event guest and delete in user request
                var evenement = $scope.evenement;
                var user = newGuest;
                evenement.guests.push({_id: user._id});

                evenement.$update(function() {
                    $location.path('evenements/' + evenement._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

                for(var i = 0; i < user.requests.length; i++){
                    if(user.requests[i].event_id == evenement._id){
                        user.requests.splice(i, 1);
                    }
                }

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;

                }, function(response) {
                    $scope.error = response.data.message;
                });

            };
            $scope.refuse = function(newGuest){
                // delete in user request
                var user = newGuest;
                var evenement = $scope.evenement;

                for(var i = 0; i < user.requests.length; i++){
                    if(user.requests[i].event_id == evenement._id){
                        user.requests.splice(i, 1);
                    }
                }

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;

                }, function(response) {
                    $scope.error = response.data.message;
                });
            };
        };



        $scope.restoreData = function(evenement) {
            evenement.$promise.then(function(data){
                $scope.evenement = data;

                function addZeroBefore(n) { // add 0 before the single digits
                    return (n < 10 ? '0' : '') + n;
                }
                var beginTimestamp = new Date(parseInt($scope.evenement.beginTimestamp));
                var hours = beginTimestamp.getHours(); var minutes = beginTimestamp.getMinutes(); var seconds = beginTimestamp.getSeconds();
                hours = addZeroBefore(hours); minutes = addZeroBefore(minutes); seconds = addZeroBefore(seconds);
                var year = beginTimestamp.getFullYear(); var month = beginTimestamp.getMonth(); var day = beginTimestamp.getDate();
                month = addZeroBefore(month); day = addZeroBefore(day);
                $scope.evenement.beginTime = hours+':'+minutes+':'+seconds;
                $scope.evenement.beginDate = year+'-'+month+'-'+day;

                var endTimestamp = new Date(parseInt($scope.evenement.endTimestamp));
                var hours = endTimestamp.getHours(); var minutes = endTimestamp.getMinutes(); var seconds = endTimestamp.getSeconds();
                hours = addZeroBefore(hours); minutes = addZeroBefore(minutes); seconds = addZeroBefore(seconds);
                var year = endTimestamp.getFullYear(); var month = endTimestamp.getMonth(); var day = endTimestamp.getDate();
                month = addZeroBefore(month); day = addZeroBefore(day);
                $scope.evenement.endTime = hours+':'+minutes+':'+seconds;
                $scope.evenement.endDate = year+'-'+month+'-'+day;
            });
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


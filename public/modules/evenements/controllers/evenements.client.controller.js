'use strict';

// Evenements controller
angular.module('evenements').controller('EvenementsController', ['$scope', '$stateParams', '$location', '$timeout', '$http', 'Authentication', 'Evenements', 'Users', 'fileReader', 'Menus', 'ngDialog',
	function($scope, $stateParams, $location, $timeout, $http, Authentication, Evenements, Users, fileReader, Menus, ngDialog) {
		$scope.authentication = Authentication;
        $scope.guests = Users.query({all:true});
        $scope.menu = Menus.getMenu('bottombar');
        $scope.placeName = '';
        $scope.lat = '';
        $scope.long = '';
        $scope.defaultEventCover = './img/defaultEventCover.jpg';
        $scope.defaultEventCover2 = './img/defaultEventCover2.jpg';
        $scope.defaultUserCover = './img/defaultUserCover.jpg';
        $scope.loading = true;
        $('.uil-ring-css').css("height", $( window ).height());
        $(".header__link__focus").removeClass("header__link__focus");
        $(".nav-item").click(function(){
            $(".header__link").removeClass("header__link__focus");
        });
        var limitStep = 4;
        $scope.limitStep = limitStep;
        $scope.limit = limitStep;
        $scope.incrementLimit = function() {
            $scope.limit += limitStep;
        };
        $scope.decrementLimit = function() {
            $scope.limit -= limitStep;
        };

        $scope.$watch('limit + searchText', function() {

            $timeout( function(){
                console.log($scope.limit);
                console.log($( ".displayName-input").length);
                $( ".displayName-input").unbind( "click" );
                for(var d = 0; d < $( ".displayName-input").length; d++){
                    $( ".displayName-input:eq( "+d+" )" ).click(function() {
                        $(this).parent("label").toggleClass("focus");
                    });
                }
                $( ".displayName-input").each(function(){
                    if($( this).is(":checked")){
                        $(this).parent("label").addClass("focus");
                    }
                });
            }, 500);
        });




            $scope.openCreatePost = function(){
            ngDialog.open({ template: 'postTemplate',
                            controller: 'PostsController',
                            scope: $scope,
                            overlay: true,
                            closeByDocument: true
            });
            $(document).on('click', '.imageButton-photo', function(event) {
                event.preventDefault();
                $(".inputFile").click();
            });
            $(document).on('click', '.imageButton-blue', function(event) {
                event.preventDefault();
                $(".inputSubmit").click();
            });
        };


        /* users Filtered by guest, see if he's guest or not*/
        $scope.UserFilterGuest = function(eve) {
            if(eve){
                return function( user ) {
                    if(eve.guests){
                        for(var i = 0; i < eve.guests.length; i++){
                            if(user._id === eve.guests[i]._id){
                                return true;
                            }
                        }
                    }
                };
            }

        };

        $scope.displayGuests = function(user){

            if(user.providerData){
                switch(user.provider) {
                    case 'twitter':
                        var profilePictureGuest = user.providerData.profile_image_url_https;
                        break;
                    case 'facebook':
                        var profilePictureGuest = 'http://graph.facebook.com/'+user.providerData.id+'/picture?type=square';
                        break;
                    default:
                        var profilePictureGuest = 'a';
                }
            }else{
                var profilePictureGuest = 'a';
            }
        }

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
            $scope.currentItemFilter = 1;
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
            $scope.currentItemFilter = 2;
            return function( eve ) {
                if(Authentication.user._id === eve.user._id){
                    return true;
                }
            };
        };

        $scope.googleMapPointer = function(){
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
                    $scope.inputSelection.push(_id);
                }else if(checked === false){
                    for(var j=0; j < $scope.inputSelection.length; j++){
                        if($scope.inputSelection[j] === _id){
                            $scope.inputSelection.splice(j, j+1);
                        }
                    }
                    $scope.inputDeSelection.push(_id);
                }
            };
        };



		$scope.create = function() {
			// Create new Evenement object

            var beginDate  = $scope.evenement.beginDate;
            var beginTime  = $scope.evenement.beginTime;

            var endDate  = $scope.evenement.endDate;
            var endTime  = $scope.evenement.endTime;

            beginDate = beginDate.split('-');
            endDate = endDate.split('-');

            var begin1 = new Date();
            var begin2 = begin1.getTimezoneOffset();
            var beginCurrentUTCTimeStamp = (new Date(beginDate[1]+' '+beginDate[1]+', '+beginDate[0]+' '+beginTime).getTime());
            var beginUTC0TS = beginCurrentUTCTimeStamp;
            /*+ (begin2*60000)*/



            var end1 = new Date();
            var end2 = end1.getTimezoneOffset();
            var endCurrentUTCTimeStamp = (new Date(endDate[1]+' '+endDate[1]+', '+endDate[0]+' '+endTime).getTime());
            var endUTC0TS = endCurrentUTCTimeStamp;
            /*+ (end2*60000)*/




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
                alert('aie, Il y a une erreur');
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

            /*console.log(JSON.stringify($scope.inputSelection));
            console.log("-----deselect--------");

            console.log(JSON.stringify($scope.inputDeSelection));

            console.log("-----previous--------");
            console.log(JSON.stringify(previousGuests));*/


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

            /*console.log("-----previous - deselect--------");

            console.log(JSON.stringify(previousGuests));

            console.log("------guests------");*/


            for (var j = 0; j < $scope.selection.length; j++){
                evenement.guests.push({_id: $scope.selection[j]});
            }

/*
            console.log(JSON.stringify($scope.evenement.guests));
*/

			evenement.$update(function() {
				$location.path('evenements/' + evenement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a specific list of Evenements
        $scope.find = function(type) {
            $scope.users = Users.query({all:true});
            Evenements.query({all:false}).$promise.then(function(data) {
                // success handler
                $scope.evenements = data;
                $scope.loading = false;
            }, function(error) {
                // error handler
            });
            if ( document.location.href.indexOf('#1') > -1 ) {
                $scope.currentItemFilter = 1;
            }else if(document.location.href.indexOf('#2') > -1){
                $scope.currentItemFilter = 2;
            }

            if($scope.currentItemFilter === 1){
                $scope.showList = $scope.EventsFilterGuest($scope.evenements);
            }else if($scope.currentItemFilter === 2){
                $scope.showList = $scope.EventsFilterAuthor($scope.evenements);
            }
        };

        // Find all Evenements
        $scope.findAll = function() {
            Evenements.query({all:true}).$promise.then(function(data) {
                // success handler
                $scope.evenements = data;
                $scope.loading = false;
            }, function(error) {
                // error handler
            });
            $scope.users = Users.query({all:true});
            $("#searchText").focus();
        };

		// Find existing Evenement
		$scope.findOne = function() {
            $scope.askInviteButton = 'Demander un invitation';


            Evenements.get({
				evenementId: $stateParams.evenementId
			}).$promise.then(function(data) {
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
                    $scope.isAdmin = false;
                    $scope.isGuest = false;
                    $scope.isAny = true;


                    for(var j = 0; j < $scope.evenement.guests.length; j++){
                        if($scope.evenement.guests[j]._id === Authentication.user._id){
                            $scope.isGuest = true;
                            $scope.isAny = false;
                        }
                    }
                    if($scope.evenement.user._id === Authentication.user._id){
                        $scope.isAdmin = true;
                        $scope.isAny = false;
                    }


                    $scope.loading = false;

                    if($scope.evenement.endTimestamp < Date.now()){
                        $scope.eventIsPassed = true;
                    }else{
                        $scope.eventIsPassed = false;
                    }

                    var now = new Date();
                    var TimeZone = now.getTimezoneOffset();

                    var a = $scope.evenement.beginTimestamp.split("T");
                    a = a[1].split(":");
                    $scope.beginTime = (a[0]-(TimeZone/60))+":"+a[1];
                    var b = $scope.evenement.endTimestamp.split("T");
                    b = b[1].split(":")
                    $scope.endTime = (b[0]-(TimeZone/60)+":"+b[1]);


                    var date1 = new Date($scope.evenement.endTimestamp);
                    var date2 = new Date($scope.evenement.beginTimestamp);
                    var diff = dateDiff(date1, date2);


                    $scope.diffDay = diff.day;
/*
                    console.log("Entre le "+date1.toString()+" et "+date2.toString()+" il y a "+diff.day+" jours, "+diff.hour+" heures, "+diff.min+" minutes et "+diff.sec+" secondes");
*/

                    function dateDiff(date1, date2){
                        var diff = {}                           // Initialisation du retour
                        var tmp = date2 - date1;

                        tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
                        diff.sec = tmp % 60;                    // Extraction du nombre de secondes

                        tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
                        diff.min = tmp % 60;                    // Extraction du nombre de minutes

                        tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
                        diff.hour = tmp % 24;                   // Extraction du nombre d'heures

                        tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
                        diff.day = tmp;

                        return diff;
                    }




                    for (var i = 0; i < $scope.evenement.guests.length; i++) {
                                if ($scope.evenement.guests[i]._id === user._id) {
                                    $scope.currentGuest = $scope.evenement.guests[i];
                                }
                            }
                    $scope.newGuests = [];

                    if($scope.guests.length > 0){
                        if (Authentication.user._id === $scope.evenement.user._id) {
                            for (var j = 0; j < $scope.guests.length; j++) {
                                for(var g = 0; g < $scope.guests[j].requests.length; g++){
                                    if ($scope.guests[j].requests[g].event_id == $scope.evenement._id) {
                                        $scope.newGuests.push($scope.guests[j]);
                                    }
                                }

                            }
                        }
                    }

                    $(".event-view-image").load(function(){
                        if($(".event-view-image").height() > $(".event-view-image").width()){
                            $(".event-view-image").css("top", -(($(".event-view-image").height()-200)/2))
                                .css("height", "100%")
                                .css("width", "auto");
                        }else{
                            $(".event-view-image").css("left", -(($(".event-view-image").width()-$(".sail").width)/2))
                                .css("width", "100%")
                                .css("height", "auto");
                        }

                    });

                    var guests = $scope.evenement.guests;
                    var guestTab = [];

                    for(var k = 0; k < guests.length; k++){
                        guestTab.push($scope.evenement.guests[k]._id);
                    }

                    Users.query({all:false, eve:guestTab}).$promise.then(function(data) {
                        // success handler
                        $scope.users = data;

                    }, function(error) {
                        // error handler
                    });


                });

            if($scope.buttonValue == undefined && $scope.stateValue == undefined){
                $scope.buttonValue = "Viendra";
                $scope.stateValue = "En attente";
            }


        };

            $scope.changeState = function(currentGuest){
                switch(currentGuest.state[0]) {
                    case 'waiting':
                        currentGuest.state[0] = 'willcome';
                        $scope.buttonValue = "En route";
                        $scope.stateValue = "Sera présent";
                        break;
                    case 'willcome':
                        currentGuest.state[0] = 'income';
                        $scope.buttonValue = "Est présent";
                        $scope.stateValue = "En route";
                        break;
                    case 'income':
                        currentGuest.state[0] = 'present';
                        $scope.buttonValue = "Retourne";
                        $scope.stateValue = "Est présent";
                        break;
                    case 'present':
                        currentGuest.state[0] = 'return';
                        $scope.buttonValue = "Yop";
                        $scope.stateValue = "Est retourné";
                        break;
                    case 'return':
                        currentGuest.state[0] = 'return';
                        break;
                }
                for(var i = 0; i < $scope.evenement.guests.length; i++){
                    if($scope.evenement.guests[i]._id === user._id) {
                        $scope.evenement.guests[i].state = currentGuest.state;
                    }
                };

                var evenement = $scope.evenement;
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
                Authentication.user.requests.push({event_id: eve._id,
                                                    state: ['waiting']
                                                });
                $scope.user = Authentication.user;

                var user = new Users($scope.user);

                $http.post('/evenements/'+eve._id, $scope.credentials).success(function(response) {
                    // Show user success message and clear form
                    $scope.credentials = null;
                    $scope.success = response.message;

                }).error(function(response) {
                    // Show user error message and clear form
                    $scope.credentials = null;
                    $scope.error = response.message;
                });

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                    $scope.askInviteButton = 'Demande d\'invitation envoyée';
                    $scope.askInviteButtonClass = true;
                }, function(response) {
                    $scope.error = response.data.message;
                });


            }else{
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
            /*evenement.$promise.then(function(data){
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
            });*/
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
}).directive('usersRepeatDirective', function() {
    $( ".displayName-input" ).change(function() {
        $(this).parent("label").toggleClass("focus");
    });

});


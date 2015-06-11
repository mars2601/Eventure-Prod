'use strict';

angular.module('core').controller('TimelineController', ['$scope', 'Authentication', 'Evenements', 'Users',
	function($scope, Authentication, Evenements, Users) {
        $scope.authentication = Authentication;
        $scope.loading = true;



        $scope.findMyInvitations = function() {
            Evenements.query({all:false}).$promise.then(function(data) {
                // success handler
                $scope.myInvitations = data;
                $scope.loading = false;
            }, function(error) {
                // error handler
            });
        };

        $scope.EventsFilterGuest = function(eve) {
            return function( eve ) {
                for (var i = 0; i < eve.guests.length; i++) {
                    if (Authentication.user._id === eve.guests[i]._id) {
                        return true;
                    }
                }
            };
        };

        $scope.EventsFilterAuthor = function(eve) {
            return function( eve ) {
                if(Authentication.user._id === eve.user._id){
                    return true;
                }
            };
        };

        /*$scope.storeEventGuestID = function(id){
            var EventGuestID = id;
        }

        $scope.findUsers = function(guests){
            if(EventGuestID){
            }
        }*/
	}
]);
'use strict';

(function() {
	// Evenements Controller Spec
	describe('Evenements Controller Tests', function() {
		// Initialize global variables
		var EvenementsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Evenements controller.
			EvenementsController = $controller('EvenementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Evenement object fetched from XHR', inject(function(Evenements) {
			// Create sample Evenement using the Evenements service
			var sampleEvenement = new Evenements({
				name: 'New Evenement'
			});

			// Create a sample Evenements array that includes the new Evenement
			var sampleEvenements = [sampleEvenement];

			// Set GET response
			$httpBackend.expectGET('evenements').respond(sampleEvenements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evenements).toEqualData(sampleEvenements);
		}));

		it('$scope.findOne() should create an array with one Evenement object fetched from XHR using a evenementId URL parameter', inject(function(Evenements) {
			// Define a sample Evenement object
			var sampleEvenement = new Evenements({
				name: 'New Evenement'
			});

			// Set the URL parameter
			$stateParams.evenementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/evenements\/([0-9a-fA-F]{24})$/).respond(sampleEvenement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evenement).toEqualData(sampleEvenement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Evenements) {
			// Create a sample Evenement object
			var sampleEvenementPostData = new Evenements({
				name: 'New Evenement'
			});

			// Create a sample Evenement response
			var sampleEvenementResponse = new Evenements({
				_id: '525cf20451979dea2c000001',
				name: 'New Evenement'
			});

			// Fixture mock form input values
			scope.name = 'New Evenement';

			// Set POST response
			$httpBackend.expectPOST('evenements', sampleEvenementPostData).respond(sampleEvenementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Evenement was created
			expect($location.path()).toBe('/evenements/' + sampleEvenementResponse._id);
		}));

		it('$scope.update() should update a valid Evenement', inject(function(Evenements) {
			// Define a sample Evenement put data
			var sampleEvenementPutData = new Evenements({
				_id: '525cf20451979dea2c000001',
				name: 'New Evenement'
			});

			// Mock Evenement in scope
			scope.evenement = sampleEvenementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/evenements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/evenements/' + sampleEvenementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid evenementId and remove the Evenement from the scope', inject(function(Evenements) {
			// Create new Evenement object
			var sampleEvenement = new Evenements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Evenements array and include the Evenement
			scope.evenements = [sampleEvenement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/evenements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEvenement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.evenements.length).toBe(0);
		}));
	});
}());
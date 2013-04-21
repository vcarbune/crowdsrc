
app.factory('pageService', function($rootScope) {
	var pageService = {};
	
	pageService.prepareCompleteTaskForm = function() {
	  $rootScope.$broadcast('prepareCompleteTaskForm');
	};
	
	return pageService;
});

/**
 * Form Controller
 */
app.controller('MasterFormCtrl', function($scope, pageService) {
  $scope.submitForm = function() {
	pageService.prepareCompleteTaskForm();
	
	// TODO: submit form
  };
});
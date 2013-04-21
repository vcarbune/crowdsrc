
app.factory('pageService', function($rootScope) {
	var pageService = {};
	pageService.inputsJsonString = '';
	
	pageService.prepareCompleteTaskForm = function() {
	  $rootScope.$broadcast('prepareCompleteTaskForm');
	};
	
	pageService.setInputsJson = function(json) {
		this.inputsJsonString = json;
	}
	
	pageService.getInputsJson = function() {
		return this.inputsJsonString;
	}
	
	return pageService;
});

/**
 * Form Controller
 */
app.controller('MasterFormCtrl', function($scope, pageService) {
  $scope.submitForm = function() {
	pageService.prepareCompleteTaskForm();
	inputsJson = pageService.getInputsJson();
	$('#complete-task-form input[name="inputs"]').val(inputsJson);
	$('#complete-task-form').submit();
  };
});
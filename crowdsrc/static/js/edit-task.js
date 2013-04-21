
/* We need this to match Django built-in xsrf protection */
app.config(["$httpProvider", function(provider) {
    provider.defaults.headers.common['X-CSRFToken'] =
    provider.defaults.headers.common['csrftoken'] =
        $('input[name=csrfmiddlewaretoken]').val();
}]);

app.factory('pageService', function($rootScope) {
	var pageService = {};
	
	pageService.toolboxJsonString = '';
	
	pageService.prepareCreateTaskForm = function() {
	  $rootScope.$broadcast('prepareCreateTaskForm');
	};
	
	pageService.getToolboxJson = function() {
		return this.toolboxJsonString;
	};
	
	return pageService;
});

/**
 * Form Controller
 */
app.controller('MasterFormCtrl', function($scope, pageService) {
  $scope.submitForm = function() {
	pageService.prepareCreateTaskForm();
	$('#create-task-form input[name="task-content"]').val(pageService.toolboxJsonString);
	$('#create-task-form').submit();
  };
});


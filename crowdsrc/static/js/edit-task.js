
/* We need this to match Django built-in xsrf protection */
app.config(["$httpProvider", function(provider) {
    provider.defaults.headers.common['X-CSRFToken'] =
    provider.defaults.headers.common['csrftoken'] =
        $('input[name=csrfmiddlewaretoken]').val();
}]);

app.factory('pageService', function($rootScope) {
	var pageService = {};
	
	pageService.toolboxJsonString = {};
	
	pageService.submitCreateTaskForm = function() {
	  $rootScope.$broadcast('submitCreateTaskForm');
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
	pageService.submitCreateTaskForm();
	$('#create-task-form input[name="task-html"]').val(pageService.toolboxJsonString);
	$('#create-task-form').submit();
  };
});


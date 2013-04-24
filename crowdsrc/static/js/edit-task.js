/**
 * The MasterFormCtrl defined in this file is used when **editing** a task.
 */
app.controller('MasterFormCtrl', function($scope, toolboxService) {
  $scope.submitForm = function() {
    toolboxService.prepareToolboxFormElements();

	  $('#create-task-form input[name="task-content"]').val(
        toolboxService.getToolboxStringifiedJson());

	  $('#create-task-form').submit();
  };
});


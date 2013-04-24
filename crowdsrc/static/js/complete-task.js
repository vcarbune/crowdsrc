/**
 * The MasterFormCtrl defined in this file is used when **completing** a task.
 */
app.controller('MasterFormCtrl', function($scope, toolboxService) {
  $scope.submitForm = function() {
	  toolboxService.prepareToolboxInputElements();

	  $('#complete-task-form input[name="inputs"]').val(
        toolboxService.getInputsStringifiedJson());

	  $('#complete-task-form').submit();
  };
});

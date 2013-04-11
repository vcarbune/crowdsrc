/**
 * Toolbox - Generic Item Controller
 */
function ToolboxItemCtrl($scope, toggleToolboxStateService)
{
  $scope.makeEditableForWorker = function() {
    $scope.isEditable = false;
    $scope.disabled = false;
  };

  $scope.makeEditableForCreator = function() {
    $scope.isEditable = true;
    $scope.disabled = true;
  };

  $scope.makeEditableForCreator();

  $scope.$on('stateChanged', function() {
    if (toggleToolboxStateService.state == toggleToolboxStateService.STATE.PREVIEW)
      $scope.makeEditableForWorker();
    else
      $scope.makeEditableForCreator();
  });
}

/**
 * Toolbox - Description Item Controller.
 */
function TaskDescriptionCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
};

/**
 * Toolbox - Submit Item Controller.
 */
function TaskSubmitCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService
  });
};

/**
 * Toolbox - Input Item Controller.
 */
function TaskInputCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
};

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

  $scope.updateItemState = function() {
    if (toggleToolboxStateService.state == toggleToolboxStateService.STATE.PREVIEW)
      $scope.makeEditableForWorker();
    else
      $scope.makeEditableForCreator();
  }

  $scope.$on('stateChanged', $scope.updateItemState);

  $scope.updateItemState();
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

/**
 * Toolbox - Text Field Controller.
 */
function ParagraphCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
};

/**
 * Toolbox - Text Field Controller.
 */
function TextFieldCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
};

/**
 * Toolbox - Checkbox Controller.
 */
function CheckboxCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
};

/**
 * Toolbox - Ranking Comp Controller.
 */
function RadioGroupCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
  
  $scope.items = []
  $scope.selectedItem = null;
  
  $scope.addItem = function() {
	$scope.items.push({
		id: $scope.items.length,
		name: "New item"
	});
  };
  
  $scope.removeItem = function(id) {
	  for (var i=0;i<$scope.items.length;i++) { 
		  if ($scope.items[i].id == id) {
			  $scope.items.splice(i, 1);
			  break;
		  }
	  }
  };
  
};
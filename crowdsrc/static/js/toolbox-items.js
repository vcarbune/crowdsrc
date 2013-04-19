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
 * Toolbox - Radio Group Controller.
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
	  for (var i=0; i<$scope.items.length; i++) {
		  if ($scope.items[i].id == id) {
			  for (var j=0; j<$scope.items.length; j++) {
				  if ($scope.items[j].id > id) {
					  $scope.items[j].id--;
				  }
			  }
			  $scope.items.splice(i, 1);
			  break;
		  }
	  }
  };
};

/**
 * Toolbox - Ranking Component Controller.
 */
function RankingCtrl($scope, toggleToolboxStateService)
{
  angular.injector().invoke(ToolboxItemCtrl, this, {
    $scope: $scope,
    toggleToolboxStateService: toggleToolboxStateService  
  });
  
  $scope.items = []
  $scope.orderedItems = [];
  $scope.currentRank = 0;
  
  $scope.addItem = function() {
	$scope.items.push({
		id: $scope.items.length,
		name: 'New item',
		rank: 100, // big enough
		state: 'free',
	});
  };
  
  $scope.removeItem = function(id) {
	  for (var i=0; i<$scope.items.length; i++) {
		  if ($scope.items[i].id == id) {
			  for (var j=0; j<$scope.items.length; j++) {
				  if ($scope.items[j].id > id) {
					  $scope.items[j].id--;
				  }
			  }
			  $scope.items.splice(i, 1);
			  break;
		  }
	  }
  };
  
  $scope.toggleSelectItem = function(id) {
	  if ($scope.isEditable === true) {
		  return;
	  }
	  
	  for (var i=0; i<$scope.items.length; i++) { 
		  if ($scope.items[i].id == id) {
			  var item = $scope.items[i];
			  if (item.state === 'selected') {
				  item.state = 'free';
				  for (var j=0; j<$scope.items.length; j++) {
					  if ($scope.items[j].state === 'selected' && $scope.items[j].rank > item.rank) {
						  $scope.items[j].rank--;
					  }
				  }
				  item.rank = 0;
				  $scope.currentRank--;
			  }
			  else {
				  item.state = 'selected';
				  item.rank = ++$scope.currentRank;
			  }
			  break;
		  }
	  }
  }
};

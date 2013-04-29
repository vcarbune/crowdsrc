// Toolbox Controllers and HTML Structures

// You MUST define in the page: app = angularjs.module('angularjs-toolbox');

// For contenteditable data-binding.
app.directive('contenteditable', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // view -> model
      elm.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(elm.html());
        });
      });
    
      // model -> view
      ctrl.$render = function(value) {
        elm.html(value);
      };
     
      // load init value from DOM
      //ctrl.$setViewValue(elm.html());
    }
  };
});


app.directive('toolboxItem', function($compile) {
  var linker = function(scope, element, attrs) {
    element.html(ToolboxItemCtrl.StringToCtrlMap[scope.content.type].HTML);
    $compile(element.contents())(scope);
  };

  return {
    restrict: 'E',
    replace: true,
    link: linker,
    scope: {
      content: '=',
      itemContent: '=itemcontent',
      desc: '=desc'
    }
  }
});

/**
 * Toolbox - Master Controller
 */
app.controller('ToolboxCtrl', function($scope, internalService) {
  $scope.state = StateService.STATES.EDIT;
 
  $scope.isEditable = function() {
    return $scope.state == StateService.STATES.EDIT;
  };

  $scope.toolboxItemCtrls = ToolboxItemCtrl.StringToCtrlMap;
 
  $scope.changeState = function(newState) {
    switch(newState)
    {
    case StateService.STATES.EDIT:
      $scope.state = newState;
      $('.toolbox-item-list').sortable("enable");
      break;
    case StateService.STATES.PREVIEW:
    case StateService.STATES.COMPLETED:
      $scope.state = newState;
      $('.toolbox-item-list').sortable("disable");
      break;
    default:
      // do nothing
      break;
    }

    internalService.stateService.setState($scope.state);
  };

  /* List of elements currently in the toolbox for the current task */
  $scope.content = [];
  
  $scope.sortableOptions = {
	  cancel: ':input,button,.toolbox-editable',
	  axis: 'y'
  };
  
  $scope.init = function(jsonItems, state, solutionId) { 
	  // TODO: find a better way to get the resources than to receive the solution id and 
	  // to use a hardcoded url in the imageGroup component 
	  if (solutionId !== undefined) {
        $scope.solutionId = solutionId;
	  }  
	  
	  for (var item in jsonItems) {
	    if (jsonItems[item].type == ImageGroupCtrl.TYPE && $scope.solutionId) {
		    jsonItems[item].solutionId = solutionId;
	    }	
	    $scope.addExistingElement(jsonItems[item]);
	  }
	  
	  if (state) {
	    $scope.state = state;
	    internalService.stateService.setState($scope.state);
  	  }
  };
  
  $scope.initEmpty = function() {
	  $scope.addElement(ParagraphCtrl.TYPE);
	  $scope.addElement(TextFieldCtrl.TYPE);
  };
  
  $scope.addExistingElement = function(elem) {
    // Note: the IDs are valid only for saving, not for reconstructing. Hence,
    // we override the previously stored IDs with new ones, given in the order
    // the elements are added.

    // FIXME: Don't store this IDs in the first place.
    elem.id = $scope.content.length;
	  $scope.content.push({
		  id: $scope.content.length,
		  type: elem.type,
		  desc: ToolboxItemCtrl.StringToCtrlMap[elem.type].NAME,
		  itemContent: elem
	  });
  };
  
  $scope.addElement = function(type) {
    if (!(type in ToolboxItemCtrl.StringToCtrlMap))
      return;

    if (type == ImageGroupCtrl.TYPE) {
      if ($scope.hasImageGroup) {
        $scope.warning = 'There already is an Image Group!';
        return;
      } else {
        $scope.hasImageGroup = true;
      }
    }

    $scope.content.push({
		  id: $scope.content.length,
		  type: type,
		  desc: ToolboxItemCtrl.StringToCtrlMap[type].NAME,
		  itemContent: '',
	  });
  };

  $scope.removeElement = function (id) {
	  for (var i=0; i<$scope.content.length; i++) {
		  if ($scope.content[i].id == id) {
        if ($scope.content[i].type == ImageGroupCtrl.TYPE) {
          $scope.hasImageGroup = false;
          $scope.warning = '';
        }

			  for (var j=0; j<$scope.content.length; j++) {
				  if ($scope.content[j].id > id) {
					  $scope.content[j].id--;
				  }
			  }
			  $scope.content.splice(i, 1);
			  break;
		  }
	  }
  };
  
  /* Method called when serializing the toolbox */
  $scope.serialize = function() {
    internalService.serializationService.start();
  };
  
  /* Method called when extracting the input values */
  $scope.extractInputs = function() {
    internalService.inputExtractionService.start();
  };
  
  /* Method called when validating the input values */
  $scope.validate = function() {
	  internalService.validationService.start();
  }
  
  $scope.$on('prepareValidation', $scope.validate);

  /* When the task form should be submited */ 
  $scope.$on('prepareCreateTaskForm', $scope.serialize);
  
  /* When the solution form should be submited */ 
  $scope.$on('prepareCompleteTaskForm', $scope.extractInputs);

  /* Debugging */
  $scope.toolboxJsonString = function() {
    return internalService.serializationService.getContent();
  };
});

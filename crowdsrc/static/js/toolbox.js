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
  // FIXME: each toolbox item can have the HTML in a separate file. This
  // requires different angular JS directives (needs change in ToolboxCtrl also).

  // Note: not really important right now.
  var paragraphTemplate = 
	  "<div ng-controller='ParagraphCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
      "<p contenteditable='{{isEditable}}'" +
        "class='toolbox-editable' ng-model='itemContent.paragraphText'>{{itemContent.paragraphText}}</p>" +
      "</div>";
  
  var textFieldTemplate =
	  "<div ng-controller='TextFieldCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.textFieldLabel'>{{itemContent.textFieldLabel}}</div>" + 
      "<input id='task_{{content.id}}' ng-model='textFieldValue' name='task_{{content.id}}' value='{{textFieldValue}}' type='text' ng-disabled='disabled' />" +
      "</div>";
  
  var checkboxTemplate = 
	  "<div ng-controller='CheckboxCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
      "<input id='task_{{content.id}}' ng-model='checkBoxValue' name='task_{{content.id}}' type='checkbox' ng-disabled='disabled' />" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.checkBoxLabel'>{{itemContent.checkBoxLabel}}</div>" +
      "</div>";
  
  var radioGroupTemplate = 
	  "<div ng-controller='RadioGroupCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
	  "<div ng:repeat='i in items'>" +
      "<input type='radio' name='task_{{content.id}}' value='{{i.id}}' ng-model='radioValue' ng-change='setRadioValue(radioValue)' id='radio_{{i.id}}' ng-disabled='disabled' />" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='items[i.id].name'>{{items[i.id].name}}</div>" +
      "<button type='button' ng-click='removeItem(i.id)' ng-show='isEditable'>Remove Item</button>" +
      "</div>" +
      "<button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";
  
  var rankingTemplate = 
	  "<div ng-controller='RankingCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
    "<div ng-model='itemContent.id' ng-show='false'>{{content.id}}</div>" +
	  "<ul class='toolbox-ranking-list'>" +
	  "<li ng-repeat='i in items' class='{{i.state}}'>" +
	  	"<span class='toolbox-ranking-name toolbox-editable' " + 
          "contenteditable='{{isEditable}}' ng-click='toggleSelectItem(i.id)' ng-model='items[i.id].name'>{{items[i.id].name}}</span>" +
	  	"<span class='toolbox-ranking-rank' ng-hide='isEditable || i.state===\"free\"'>{{i.rank}}</span>" +
	  	"<button type='button' ng-click='removeItem(i.id)' ng-show='isEditable'>Remove Item</button>" +
	  "</li>" +
      "</ul>" +
      "<br /><button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";

  var imageGroupTemplate =
      // Content for EDIT state.
      "<div ng-controller='ImageGroupCtrl' ng-init='init(content.id)' class='task-generic-item'>" +
      "<label for='resources_{{content.id}}' ng-show='isEditable'>" +
        "Select images to upload:" +
      "</label><br/>" +
      "<input type='file' name='resource_files' ng-model-instant onchange='angular.element(this).scope().setFiles(this)' ng-show='isEditable' multiple required />" +
      "<p ng-show='isEditable'>" +
        "Number of images per single task:" +
      "</p>" +
      "<input ng-model='itemContent.nrImagesPerTask' type='text' ng-show='isEditable' ng-change='refreshPreviewImages()' required />" +
      "<button type='button' ng-click='uploadFiles()' ng-show='isEditable'> Upload resources </button>" +
      // Content for PREVIEW state.
      "<div style='text-align:center; margin: 0 auto; overflow: hidden;' ng-hide='isEditable'>" +
        "<div style='float:left' ng-repeat='image in previewImgs' ng-hide='isEditable'>" +
          "<img src={{image}} ng-hide='isEditable' Hspace='30' />" +
          "<br/>Image {{$index+1}}<br/><br/>" +
         "</div ng-hide='isEditable'>" +
      "</div ng-hide='isEditable'>" +
      "</div>";
  
  var getTemplate = function(taskElementType) { 
    switch(taskElementType) {
      case 'textField':
    	  return textFieldTemplate;
      case 'checkbox':
      	return checkboxTemplate;
      case 'paragraph':
    	  return paragraphTemplate; 
      case 'radioGroup':
    	  return radioGroupTemplate;  
      case 'ranking':
    	  return rankingTemplate; 
      case 'imageGroup':
          return imageGroupTemplate;
    }
  };

  var linker = function(scope, element, attrs) {
    element.html(getTemplate(scope.content.type));
    $compile(element.contents())(scope);
  };

  return {
    restrict: 'E',
    replace: true,
    link: linker,
    scope: {
      content: '=',
      itemContent: '=itemcontent'
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

  $scope.elemTypes = [
    {code:'textField', name: 'Text Field'},
    {code:'paragraph', name: 'Paragraph'},
    {code:'checkbox', name: 'Checkbox'},
    {code:'radioGroup', name: 'Radio Group'},
    {code:'ranking', name: 'Ranking Component'},
    {code:'imageGroup', name: 'Image Group'},
  ];
  
  $scope.newElemType = '';

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
	    if (jsonItems[item].type == 'imageGroup' && $scope.solutionId) {
		    jsonItems[item].solutionId = solutionId;
	    }	
	    $scope.addExistingElement(jsonItems[item]);
	  }
	  
	  if (state) {
	    $scope.state = state;
	    internalService.stateService.setState($scope.state);
  	}
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
		  desc: '',
		  itemContent: elem
	  });
  };
  
  $scope.addElement = function() {
	  $scope.content.push({
		  id: $scope.content.length,
		  type: $scope.newElemType,
		  desc: '',
		  itemContent: '',
	  });
  };
  
  $scope.removeElement = function (id) {
	  for (var i=0; i<$scope.content.length; i++) {
		  if ($scope.content[i].id == id) {
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

  /* When the task form should be submited */ 
  $scope.$on('prepareCreateTaskForm', $scope.serialize);
  
  /* When the solution form should be submited */ 
  $scope.$on('prepareCompleteTaskForm', $scope.extractInputs);

  /* Debugging */
  $scope.toolboxJsonString = function() {
    return internalService.serializationService.getContent();
  };
});

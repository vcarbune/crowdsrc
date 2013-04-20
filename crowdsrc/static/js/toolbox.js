// Toolbox Controllers and HTML Structures
var app = angular.module('angularjs-toolbox', ['ui']);

// This service broadcasts to each component whether it needs to change
// its state or not (e.g. preview for workers or edit for creators)
app.factory('toggleToolboxStateService', function($rootScope) {
  var toggleToolboxStateService = {};

  toggleToolboxStateService.STATE = {
    PREVIEW: 'PREVIEW',
    EDIT: 'EDIT'
  };
  toggleToolboxStateService.currentState = toggleToolboxStateService.STATE.EDIT;

  toggleToolboxStateService.validateValue = function(value)
  {
    if (value == this.STATE.PREVIEW || value == this.STATE.EDIT)
      return;

    console.log('Incompatible state value: ' + value);
    value = this.STATE.PREVIEW;
  };

  toggleToolboxStateService.setState = function(value) {
    this.validateValue(value);

    this.currentState = value;
    $rootScope.$broadcast('stateChanged');
  };

  toggleToolboxStateService.getState = function() {
    return this.currentState;
  };

  return toggleToolboxStateService;
});

app.directive('toolboxItem', function($compile) {
  // FIXME: each toolbox item can have the HTML in a separate file. This
  // requires different angular JS directives (needs change in ToolboxCtrl also).

  // Note: not really important right now.
  var paragraphTemplate = 
	  "<div ng-controller='ParagraphCtrl' class='task-generic-item'>" +
      "<p for='task_{{content.crt}}' contenteditable='{{isEditable}}' class='editable'>Add text here...</p>" + 
      "</div>";
  
  var textFieldTemplate =
	  "<div ng-controller='TextFieldCtrl' class='task-generic-item'>" +
      "<label for='task_{{content.crt}}' contenteditable='{{isEditable}}' class='editable'>Label:</label>" + 
      "<input id='task_{{content.crt}}' name='task_{{content.crt}}' type='text' ng-disabled='disabled' />" +
      "</div>";
  
  var checkboxTemplate = 
	  "<div ng-controller='CheckboxCtrl' class='task-generic-item'>" +
      "<input id='task_{{content.crt}}' name='task_{{content.crt}}' type='checkbox' ng-disabled='disabled' />" +
      "<label for='task_{{content.crt}}' contenteditable='{{isEditable}}' class='editable'>Label</label>" +
      "</div>";
  
  var radioGroupTemplate = 
	  "<div ng-controller='RadioGroupCtrl' class='task-generic-item'>" +
	  "<div ng:repeat='i in items'>" +
      "<input type='radio' value='{{i.id}}' name='task_{{content.crt}}' id='radio_{{i.id}}' ng-disabled='disabled' />" +
      "<label for='radio_{{i.id}}' contenteditable='{{isEditable}}' class='editable'>{{i.name}}</label>" +
      "<button type='button' ng-click='removeItem(i.id)' ng-show='isEditable'>Remove Item</button>" +
      "</div>" +
      "<button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";
  
  var rankingTemplate = 
	  "<div ng-controller='RankingCtrl' class='task-generic-item'>" +
	  "<ul class='toolbox-ranking-list'>" +
	  "<li ng-repeat='i in items' class='{{i.state}}'>" +
	  	"<span class='toolbox-ranking-name editable' contenteditable='{{isEditable}}' ng-click='toggleSelectItem(i.id)'>{{i.name}}</span>" +
	  	" <span class='toolbox-ranking-rank' ng-hide='isEditable || i.state===\"free\"'>{{i.rank}}</span>" +
	  	"<button type='button' ng-click='removeItem(i.id)' ng-show='isEditable'>Remove Item</button>" +
	  "</li>" +
      "</ul>" +
      "<br /><button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";

  var imageGroupTemplate =
      // Content for EDIT state.
           "<div ng-controller='ImageGroupCtrl' class='task-generic-item'>" +
      "<label for='resources_{{content.crt}}' ng-show='isEditable'>" +
        "Select images to upload:" +
      "</label><br/>" +
      "<input type='file' ng-model-instant onchange='angular.element(this).scope().setFiles(this)' ng-show='isEditable' multiple required />" +
      "<p ng-show='isEditable'>" +
        "Number of images per single task:" +
      "</p>" +
      "<input ng-model='nrImagesPerTask' type='text' ng-show='isEditable' required />" +
      // Content for PREVIEW state.
      "<img ng-repeat='image in previewImgs' src={{image}} ng-hide='isEditable' Hspace='30' />" +
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
      content: '='
    }
  }
});

/**
 * Toolbox - Master Controller
 */
app.controller('ToolboxCtrl', function($scope, toggleToolboxStateService) {
  $scope.state = toggleToolboxStateService.STATE.EDIT;
 
  $scope.isEditable = function() {
    return $scope.state == toggleToolboxStateService.STATE.EDIT;
  };
 
  $scope.toggleState = function() {
    if ($scope.state == toggleToolboxStateService.STATE.EDIT) {
      $scope.state = toggleToolboxStateService.STATE.PREVIEW;
    }
    else {
      $scope.state = toggleToolboxStateService.STATE.EDIT;
  	}

    toggleToolboxStateService.setState($scope.state);
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
	  cancel: ':input,button,.editable',
	  axis: 'y'
  };
  
  $scope.addElement = function() {
	  $scope.content.push({
		  id: $scope.content.length,
		  type: $scope.newElemType,
		  desc: '',
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

  /* Helper methods to be used for serialization */
  $scope.prepareSerialization = function() {
    $scope.toolboxElement = document.querySelector('[ng-controller="ToolboxCtrl"]');
    $scope.toolboxHtml = '';
  };

  /* Method called when serializing the toolbox */
  $scope.serialize = function() {
    $scope.prepareSerialization();

    var previousState = toggleToolboxStateService.getState();
    toggleToolboxStateService.setState(toggleToolboxStateService.STATE.PREVIEW);

    var rootNode = document.createElement('div');
    rootNode.setAttribute('ng-controller', 'ToolboxCtrl');
    rootNode.setAttribute('class', 'toolbox');
 
    var toolboxItems = $scope.toolboxElement.querySelectorAll('toolbox-item');
    angular.forEach(toolboxItems, function(el) {
      rootNode.innerHTML += el.outerHTML;
    });

    $scope.toolboxHtml = rootNode.outerHTML;

    toggleToolboxStateService.setState(previousState);
  };
});

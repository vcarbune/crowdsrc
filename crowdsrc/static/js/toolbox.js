// Toolbox Controllers and HTML Structures
var app = angular.module('angularjs-toolbox', ['ui']);

// This service broadcasts to each component whether it needs to change
// its state or not (e.g. preview for workers or edit for creators)
app.factory('toggleToolboxStateService', function($rootScope) {
  var toggleToolboxStateService = {};

  toggleToolboxStateService.currentState = '';
  toggleToolboxStateService.STATE = {
    PREVIEW: 'PREVIEW',
    EDIT: 'EDIT'
  };

  toggleToolboxStateService.validateValue = function(value)
  {
    if (value == this.STATE.PREVIEW || value == this.STATE.EDIT)
      return;

    console.log('Incompatible state value: ' + value);
    value = this.STATE.PREVIEW;
  }

  toggleToolboxStateService.setState = function(value) {
    this.validateValue(value);

    this.state = value;
    $rootScope.$broadcast('stateChanged');
  };

  return toggleToolboxStateService;
});

app.directive('toolboxItem', function($compile) {
  // FIXME: each toolbox item can have the HTML in a separate file. This
  // requires different angular JS directives (needs change in ToolboxCtrl also).

  // Note: not really important right now.
  
  /*
  var descriptionItemTemplate =
      "<div ng-controller='TaskDescriptionCtrl' class='task-generic-item'>" +
      "<b>Task:</b><div ng-model='desc' contenteditable='{{isEditable}}'>Add text here...</div>" +
      "</div>";

  var inputItemTemplate =
      "<div ng-controller='TaskInputCtrl' class='task-generic-item'>" +
      "<b>Solution:</b> <input id='task_{{content.crt}}' type='text' ng-disabled='disabled' />" +
      "</div>";
  
  var submitItemTemplate =
      "<div ng-controller='TaskSubmitCtrl' class='task-generic-item'>" +
      "<button ng-click='completeTask()' ng-disabled='disabled'>Submit</button>" +
      "</div>";
  */

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
      "<button type='button' ng-click='removeItem({{i.id}})' ng-show='isEditable'>Remove Item</button>" +
      "</div>" +
      "<button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";
  
  var getTemplate = function(taskElementType) { 
    switch(taskElementType) {
//      case 'descriptionItem':
//        return descriptionItemTemplate;
//      case 'inputItem':
//        return inputItemTemplate;
//      case 'submitItem':
//        return submitItemTemplate;
      case 'textField':
    	return textFieldTemplate;
      case 'checkbox':
      	return checkboxTemplate;
      case 'paragraph':
    	return paragraphTemplate; 
      case 'radioGroup':
    	return radioGroupTemplate;  
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

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

/**
 * Toolbox - Master Controller
 */
app.controller('ToolboxCtrl', function($scope, toggleToolboxStateService) {
	
  $scope.state = toggleToolboxStateService.STATE.EDIT;
  
  $scope.toggleState = function() {
    if ($scope.state == toggleToolboxStateService.STATE.EDIT)
      $scope.state = toggleToolboxStateService.STATE.PREVIEW;
    else
      $scope.state = toggleToolboxStateService.STATE.EDIT;

    toggleToolboxStateService.setState($scope.state);
  };
  
  $scope.elemTypes = [
    {code:'textField', name: 'Text Field'},
    {code:'paragraph', name: 'Paragraph'},
    {code:'checkbox', name: 'Checkbox'},
    {code:'radioGroup', name: 'Radio Group'}
  ];
  
  $scope.newElemType = '';

  /* List of elements currently in the toolbox for the current task */
  $scope.content = [];
  
  $scope.sortableOptions = {
	cancel: ':input,button,.editable',
	axis: 'y'
  };
  
  /*
  $scope.insertDescriptionElement = function() {
    $scope.content.unshift({
      type: 'descriptionItem',
      desc: 'magic',
      crt: $scope.content.length
    });
  };

  $scope.insertAnswerElement = function() {
    $scope.content.unshift({
      type: 'inputItem',
      desc: 'double magic',
      crt: $scope.content.length
    });
  };

  $scope.addDescription = function() {
     $scope.insertDescriptionElement();
  };

  $scope.addAnswerInput = function() {
     $scope.insertAnswerElement();
  };
  */
  
  $scope.addElement = function() {
	  $scope.content.push({
	    type: $scope.newElemType,
	    desc: '',
	    crt: $scope.content.length
	  });
  };
  
  $scope.removeElement = function (crt) {
	  for (var i=0;i<$scope.content.length;i++) { 
		  if ($scope.content[i].crt == crt) {
			  $scope.content.splice(i, 1);
			  break;
		  }
	  }
  };
  
});

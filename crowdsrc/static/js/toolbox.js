// Toolbox Controllers and HTML Structures

// You MUST define in the page: app = angularjs.module('angularjs-toolbox');

// This service serializes the toolbox and all the components.
app.factory('serializationService', function($rootScope) {
  var serializationService = {};
  serializationService.content = [];

  serializationService.appendItem = function(item) {
    this.content.push(item);
  };

  serializationService.start = function() {
    this.content = [];
    $rootScope.$broadcast('serializationStart');
  };

  serializationService.getContent = function() {
    return window.JSON.stringify(this.content);
  };

  return serializationService;
});

// This service broadcasts to each component whether it needs to change
// its state or not (e.g. preview for workers or edit for creators)
app.factory('toggleStateService', function($rootScope) {
  var toggleStateService = {};

  toggleStateService.STATE = {
    PREVIEW: 'PREVIEW',
    EDIT: 'EDIT'
  };
  toggleStateService.currentState = toggleStateService.STATE.EDIT;

  toggleStateService.validateValue = function(value)
  {
    if (value == this.STATE.PREVIEW || value == this.STATE.EDIT)
      return;

    console.log('Incompatible state value: ' + value);
    value = this.STATE.PREVIEW;
  };

  toggleStateService.setState = function(value) {
    this.validateValue(value);

    this.currentState = value;
    $rootScope.$broadcast('stateChanged');
  };

  toggleStateService.getState = function() {
    return this.currentState;
  };

  return toggleStateService;
});

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
      ctrl.$setViewValue(elm.html());
      }
  };
});


app.directive('toolboxItem', function($compile) {
  // FIXME: each toolbox item can have the HTML in a separate file. This
  // requires different angular JS directives (needs change in ToolboxCtrl also).

  // Note: not really important right now.
  var paragraphTemplate = 
	  "<div ng-controller='ParagraphCtrl' class='task-generic-item'>" +
      "<p for='task_{{content.id}}' contenteditable='{{isEditable}}'" +
        "class='toolbox-editable' ng-model='itemContent.paragraphText'>Add text here...</p>" + 
      "</div>";
  
  var textFieldTemplate =
	  "<div ng-controller='TextFieldCtrl' class='task-generic-item'>" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.textFieldLabel'>Label:</div>" + 
      "<input id='task_{{content.id}}' name='task_{{content.id}}' type='text' ng-disabled='disabled' />" +
      "</div>";
  
  var checkboxTemplate = 
	  "<div ng-controller='CheckboxCtrl' class='task-generic-item'>" +
      "<input id='task_{{content.id}}' name='task_{{content.id}}' type='checkbox' ng-disabled='disabled' />" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='itemContent.checkBoxLabel'>Label</div>" +
      "</div>";
  
  var radioGroupTemplate = 
	  "<div ng-controller='RadioGroupCtrl' class='task-generic-item'>" +
	  "<div ng:repeat='i in items'>" +
      "<input type='radio' value='{{i.id}}' name='task_{{content.id}}' id='radio_{{i.id}}' ng-disabled='disabled' />" +
      "<div contenteditable='{{isEditable}}' class='toolbox-editable' ng-model='items[i.id].name'>New Item</div>" +
      "<button type='button' ng-click='removeItem(i.id)' ng-show='isEditable'>Remove Item</button>" +
      "</div>" +
      "<button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";
  
  var rankingTemplate = 
	  "<div ng-controller='RankingCtrl' class='task-generic-item'>" +
	  "<ul class='toolbox-ranking-list'>" +
	  "<li ng-repeat='i in items' class='{{i.state}}'>" +
	  	"<span class='toolbox-ranking-name toolbox-editable' " + 
          "contenteditable='{{isEditable}}' ng-click='toggleSelectItem(i.id)' ng-model='items[i.id].name'>New Item</span>" +
	  	"<span class='toolbox-ranking-rank' ng-hide='isEditable || i.state===\"free\"'>{{i.rank}}</span>" +
	  	"<button type='button' ng-click='removeItem(i.id)' ng-show='isEditable'>Remove Item</button>" +
	  "</li>" +
      "</ul>" +
      "<br /><button type='button' ng-click='addItem()' ng-show='isEditable'>Add Item</button>" +
      "</div>";

  var imageGroupTemplate =
      // Content for EDIT state.
           "<div ng-controller='ImageGroupCtrl' class='task-generic-item'>" +
      "<label for='resources_{{content.id}}' ng-show='isEditable'>" +
        "Select images to upload:" +
      "</label><br/>" +
      "<input type='file' ng-model-instant onchange='angular.element(this).scope().setFiles(this)' ng-show='isEditable' multiple required />" +
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
      content: '='
    }
  }
});

/**
 * Toolbox - Master Controller
 */
app.controller('ToolboxCtrl', function($scope, toggleStateService, serializationService) {
  $scope.state = toggleStateService.STATE.EDIT;
 
  $scope.isEditable = function() {
    return $scope.state == toggleStateService.STATE.EDIT;
  };
 
  $scope.toggleState = function() {
    if ($scope.state == toggleStateService.STATE.EDIT) {
      $scope.state = toggleStateService.STATE.PREVIEW;
    }
    else {
      $scope.state = toggleStateService.STATE.EDIT;
  	}

    toggleStateService.setState($scope.state);
  };

  /* Method called when serializing the toolbox */
  $scope.serialize = function() {
    serializationService.start();
    $scope.toolboxJsonString = serializationService.getContent();
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

  $scope.$on('masterFormSubmit', function() {
    alert('The toolbox got informed');
  });
});

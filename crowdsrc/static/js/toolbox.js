// Toolbox Controllers and HTML Structures
var app = angular.module('angularjs-toolbox', []);

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
  var descriptionItemTemplate =
      "<div ng-controller='TaskDescriptionCtrl' class='task-generic-item'>" +
      "<b>Task:</b><div ng-model='desc' contenteditable='{{isEditable}}'></div>" +
      "</div>";

  var inputItemTemplate =
      "<div ng-controller='TaskInputCtrl' class='task-generic-item'>" +
      "<b>Solution:</b> <input id='task_{{content.crt}}' type='text' ng-disabled='disabled' />" +
      "</div>";

  var submitItemTemplate =
      "<div ng-controller='TaskSubmitCtrl' class='task-generic-item'>" +
      "<button ng-click='completeTask()' ng-disabled='disabled'>Submit</button>" +
      "</div>";

  var getTemplate = function(taskElementType) {
    switch(taskElementType) {
      case 'descriptionItem':
        return descriptionItemTemplate;
      case 'inputItem':
        return inputItemTemplate;
      case 'submitItem':
        return submitItemTemplate;
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

  /* List of elements currently in the toolbox for the current task */
  $scope.content = [
  {
    type: 'submitItem',
    desc: 'Submit'
  }];

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
});

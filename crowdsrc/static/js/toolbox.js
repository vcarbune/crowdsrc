// Toolbox Controllers and HTML Structures
var app = angular.module('angularjs-starter', []);

app.directive('toolboxItem', function($compile) {
  // Each toolbox item will have its controller and the HTML below, ideally, in a separate file.
  var descriptionItemTemplate =
      "<div ng-controller='TaskDescriptionCtrl' class='task-generic-item'>" +
      "<b>Task:</b><div ng-model='desc' contenteditable='true'>{{desc}}</div>" +
      "</div>";
  // "<button type='button' ng-click='ctrlFctn()'>Item Specific Function</button>" +

  var inputItemTemplate =
      "<div ng-controller='TaskInputCtrl' class='task-generic-item'>" +
      "<b>Solution:</b> <input id='task_{{content.crt}}' type='text' disabled />" +
      "</div>";

  var submitItemTemplate =
      "<div ng-controller='TaskSubmitCtrl' class='task-generic-item'>" +
      "<button ng-click='completeTask()' disabled>{{content.desc}}</button>" +
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
function ToolboxCtrl($scope) {
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
};

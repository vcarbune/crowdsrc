/* Require item_controllers.js to be included before */

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
    $scope.apply($scope.insertDescriptionElement());
  };

  $scope.addAnswerInput = function() {
    $scope.apply($scope.insertAnswerElement());
  };

/*
  setTimeout(function() {
    alert('heh');
    $scope.$apply(function() {
      $scope.content = shuffle($scope.content);
    });
  }, 100);
*/
  // $scope.content = shuffle($scope.content);
};

/**
 * Form Controller
 */
function MasterFormCtrl($scope, $http) {
  $scope.isActive = true;

  // I think this is the wrong way to do it. We need to use $compile,
  // directives, something else from AngularJS. Just draft stuff.
  $scope.toolboxHtml = "";

  // Prepare the task for storing and rendering for the worker.
  $scope.prepareTaskComponents = function() {
    var toolboxClass = 'toolbox';
    toolboxElement = document.getElementsByClassName(toolboxClass)[0];

    if (!toolboxElement) {
      console.log("There is no toolbox on this page");
      return;
    }

    // Get all div elements that have contenteditable attribute.
    var contentEditableElements = toolboxElement.querySelectorAll("div[contenteditable=true]");
    angular.forEach(contentEditableElements, function(el) {
      el.contentEditable = false;
    });

    // Get all the input elements that are currently disabled.
    var disabledInputElements = toolboxElement.querySelectorAll("[disabled]");
    angular.forEach(disabledInputElements, function(el) {
      el.removeAttribute("disabled");
    });
  };

  $scope.submit = function() {
    $scope.prepareTaskComponents();

    var toolboxItems = document.getElementsByTagName('toolbox-item');
    for (i = 0; i < toolboxItems.length; ++i)
      $scope.toolboxHtml += toolboxItems[i].innerHTML;

    task = {
      'name': $scope.title,
      'html': $scope.toolboxHtml,
      'is_active': $scope.isActive,
      'cost': $scope.cost
    };

    request = {
      method: 'POST',
      url: '/create_task/',
      data: task
    };

    $http(request).
      success(function(data, status, headers, config) {
        alert('success!');
      }).
      error(function(data, status, headers, config) {
        alert('error');
      }).
      then(function(response) {
        console.log(response);
      });
  }
};

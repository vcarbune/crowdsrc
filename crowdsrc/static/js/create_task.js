var app = angular.module('angularjs-starter', ["ngSanitize"]);

/* We need this to match Django built-in xsrf protection */
app.config(["$httpProvider", function(provider) {
    provider.defaults.headers.common['X-CSRFToken'] =
    provider.defaults.headers.common['csrftoken'] =
        $('input[name=csrfmiddlewaretoken]').val();
}]);

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
      return -1;
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

    return 0;
  };

  $scope.submit = function() {
    if($scope.prepareTaskComponents())
      return;

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

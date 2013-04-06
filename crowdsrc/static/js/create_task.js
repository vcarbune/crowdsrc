/**
 * Create Task (using AngularJS)
 */
function ToolboxCtrl($scope) {
  $scope.items = [{
    'name': 'First',
    'desc': 'Desc1'
  },
  {
    'name': 'Second',
    'desc': 'Desc2'
  }
  ];

  $scope.$watch(function() {
    console.log('digesting stuff..');
  });
};

function MasterFormCtrl($scope) {
  $scope.title = "Insert title here...";
  $scope.cost = "30";
  $scope.isActive = true;

  // I think this is the wrong way to do it. We need to use $compile,
  // directives, something else from AngularJS.
  $scope.toolboxHtml = "<div style=\"background:yellow\">Wassupws</div>";

  $scope.serialize = function() {
    alert($scope.title);
    // TODO: this needs to be sent through POST to /create_html
  }
};

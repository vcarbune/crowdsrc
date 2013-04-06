/**
 * Create Task (using AngularJS)
 */

function ToolboxCtrl($scope) {
  $scope.buttonLabel = "yeah";

  $scope.items = [{
    "name": "First",
    "desc": "Desc1"
  },
  {
    "name": "Second",
    "desc": "Desc2"
  }
  ];

  $scope.$watch(function() {
    console.log("digesting stuff..");
  });

  $scope.update = function() {
    $scope.buttonLabel = "yap";
  }
}

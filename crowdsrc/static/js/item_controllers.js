
/**
 * Toolbox - Description Item Controller.
 */
function TaskDescriptionCtrl($scope) {
  $scope.desc = "This is an editable field";

  $scope.ctrlFctn = function() {
    alert("Alert generated from TaskDescriptionCtrl");
    return false;
  }
};

/**
 * Toolbox - Submit Item Controller.
 */
function TaskSubmitCtrl($scope) {
};

/**
 * Toolbox - Input Item Controller.
 */
function TaskInputCtrl($scope) {
};



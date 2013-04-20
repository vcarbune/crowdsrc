
/* We need this to match Django built-in xsrf protection */
app.config(["$httpProvider", function(provider) {
    provider.defaults.headers.common['X-CSRFToken'] =
    provider.defaults.headers.common['csrftoken'] =
        $('input[name=csrfmiddlewaretoken]').val();
}]);

/**
 * Form Controller
 */
app.controller('MasterFormCtrl', function($scope) {
  $scope.yeah = function() {
    alert('gicu');
  };
});

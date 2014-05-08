angular.module('clickToEdit', [])

.directive("clickToEdit", function() {
  var editorTemplate = '<div class="click-to-edit">' +
    '<div ng-hide="view.editorEnabled">' +
        '{{value || "N/A"}} ' +
        '<a ng-click="enableEditor()">Edit</a>' +
    '</div>' +
    '<div ng-show="view.editorEnabled">' +
        '<input ng-model="view.editableValue">' +
        '<a ng-click="save()">Done</a>' +
        ' or ' +
        '<a ng-click="disableEditor()">Cancel</a>.' +
    '</div>' +
    '</div>';

  return {
    restrict: "A",
    replace: true,
    template: editorTemplate,
    scope: {
      value: "=clickToEdit"
    },
    controller: function($scope) {
      $scope.view = {
        editableValue: $scope.value,
        editorEnabled: false
      };

      $scope.enableEditor = function() {
        $scope.view.editorEnabled = true;
        $scope.view.editableValue = $scope.value;
      };

      $scope.disableEditor = function() {
        $scope.view.editorEnabled = false;  
      };

      $scope.save = function() {
        $scope.value = $scope.view.editableValue;
        $scope.disableEditor();
      };
    }
  };
});
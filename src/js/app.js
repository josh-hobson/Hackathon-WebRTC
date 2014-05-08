angular.module( 'tracker', [
  'templates-app',
  'tracker.issue',
  'tracker.table',
  'ui.route',
  'ui.router',
  'ui.select2',
  'ui.bootstrap',
  'ngAnimate',
  'clickToEdit',
  'ngTable'
])

.config( function ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/' );

  $stateProvider.state( 'table', {
    url: '/?q&c&s',
    views: {
      "main": {
        controller: 'TableCtrl',
        templateUrl: '../templates/table.tpl.html'
      }
    }
  })
  .state( 'issue', {
    url: '/{instanceID:[0-9]{1,5}}?q&c&s',
    views: {
      "main": {
        controller: 'IssueCtrl',
        templateUrl: '../templates/issue.tpl.html'
      }
    }
  });
})

.controller( 'TrackerCtrl', function ( $rootScope, $http, $scope, $state ) {
  $scope.searchID = '';

  $scope.state = function() {
    return $state.current.name;
  };

  $http.get('/user').then(function (result) {
    $rootScope.user = result.data;
  });

  $scope.goToBranding = function() {
    if ($scope.searchID) {
      $state.go('issue', {instanceID: $scope.searchID});
    }
  };
});

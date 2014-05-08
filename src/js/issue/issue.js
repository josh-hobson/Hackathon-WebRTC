angular.module( 'tracker.issue', [
])

.controller( 'IssueCtrl', function ($rootScope, $scope, $http, $stateParams) {
  $scope.brandingID = $stateParams.instanceID;
  $scope.newNote = '';
  $scope.params = $stateParams;
  $scope.branding = {};
  $scope.notes = [];

  $http.get('/brandingtracker/' + $scope.brandingID + '/info')
  .then(function(result) {
    $scope.branding = result.data[0];
  });

  $http.get('/brandingtracker/branders')
  .then(function(result) {
    $scope.branders = result.data;
  });

  $http.get('/brandingtracker/' + $scope.brandingID + '/notes')
  .then(function(result) {
    $scope.notes = result.data;
  });

  $scope.updateToNow = function() {
    return $http.post('/brandingtracker/' + $scope.brandingID + '/date', {})
    .then(function() {
      $scope.branding.LastModifiedUser = 'Metaswitch';
      $scope.branding.LastModifiedDate = new Date();
    });
  };

  $scope.updateInfo = function() {
    return $http.post('/brandingtracker/' + $scope.brandingID + '/update', {
      InternalOwner: $scope.branding.InternalOwnerID,
      UnbrandingDelivered: $scope.branding.UnbrandingDelivered,
      IssueNo: $scope.branding.IssueNo,
      DeliveredVersion: $scope.branding.DeliveredVersion
    });
  };
  
  $scope.addNote = function() {
    if ($scope.newNote) {
      if (!$scope.initials) {
        for (var i = 0; i < $scope.branders.length; i++) {
          if ($rootScope.user.id === $scope.branders[i].Username) {
            $scope.initials = $scope.branders[i].Initials.toUpperCase();
            break;
          }
        }
      }

      if (!$scope.initials) {
        $scope.newNote = 'You do not have permission to leave notes';
        return;
      }

      var note = {
        Brander: $scope.initials,
        Note: $scope.newNote,
        Date: new Date()
      };

      return $http.post('/brandingtracker/' + $scope.brandingID + '/addNote', note)
      .then(function(result) {
        $scope.notes.push(note);
        $scope.newNote = '';
        return;
      });
    }
  };
  
})

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

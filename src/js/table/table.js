angular.module( 'tracker.table', [
])

.service( 'tableState', function () {
  this.fields = "BrandingID,BrandingType,CustomerName,OrderNo";
  this.query = "";
  this.sort = "";
  this.tableParams = {
    page: 1,
    count: 10
  };
})

.controller( 'TableCtrl', function HomeController( $scope, $state, $http, $stateParams, $filter, tableState,ngTableParams, $q ) {
  tableState.fields = $stateParams.f || tableState.fields;
  tableState.query = $stateParams.q || tableState.query;
  tableState.sort = $stateParams.s || tableState.sort;

  $scope.fields = tableState.fields.split(',');
  $scope.query = tableState.query;
  $scope.sort = tableState.sort;

  $scope.loaded = $q.defer();
  $scope.brandings = [];
  $scope.getBrandings = function() {
    tableState.fields = $scope.fields.join(',') || tableState.fields;
    tableState.query = $scope.query || tableState.query;
    tableState.sort = $scope.sort || tableState.sort;

    $http.post('/brandingtracker/query', {
      filter: tableState.query,
      sort: tableState.sort
    })
    .then(function(result) {
      $scope.brandings = result.data;
      $scope.loaded.resolve();
      $scope.columns = tableState.fields.split(',');
      $scope.tableParams.$params.page = 1;
      $scope.tableParams.reload();
    });
  };

  $scope.columns = [];
  $scope.columnVis = function(name) {
    return $scope.columns.indexOf(name) > -1;
  };

  $scope.allFields = [
    'BrandingType',
    'BrandingID',
    'OrderNo',
    'CustomerName',
    'CustomerID',
    'NextActionWith',
    'PrimaryContact',
    'InterestedParties',
    'FriendlyName',
    'LastModifiedDate',
    'LastModifiedUser',
    'Stage',
    'StageID',
    'Hidden',
    'ManualCreation',
    'InternalOwner',
    'UnbrandingDelivered',
    'IssueNo',
    'DeliveredVersion'
  ];

  $scope.viewBranding = function(branding) {
    tableState.tableParams = $scope.tableParams.$params;
    $state.go('issue', {instanceID: branding.BrandingID});
  };

  $scope.getBrandings();

  $scope.getClass = function(branding) {
    var oneWeek = 1000 * 60 * 60 * 24 * 7;
    var weeks = Math.floor((new Date() - new Date(branding.LastModifiedDate))/oneWeek);
    if ((branding.StageID === 6 && weeks >= 2) ||
        (branding.StageID === 1 && weeks >= 2) ||
        (weeks >= 8 && [2,3,4,5,7].indexOf(StageID) >= 0)) {
      return 'priority1';
    }
    else if ((branding.StageID === 6 && weeks >= 1) ||
             (branding.StageID === 1 && weeks >= 1) ||
             (weeks >= 6 && [2,3,4,5,7].indexOf(StageID) >= 0)) {
      return 'priority2';
    }
    else if ((branding.StageID === 6) ||
             (branding.StageID === 1) ||
             (weeks >= 4 && [2,3,4,5,7].indexOf(StageID) >= 0)) {
      return 'priority3';
    }
    else {
      return 'normal';
    }
  };

  var TableParams = ngTableParams;

  $scope.tableParams = new TableParams(
    tableState.tableParams, {
      total: $scope.brandings.length, // length of data
      getData: function($defer, params) {
        $scope.loaded.promise.then(function() {
          params.total($scope.brandings.length);
          var orderedResults = params.sorting() ?
                               $filter('orderBy')($scope.brandings, params.orderBy()) :
                               $scope.brandings;
          var results = orderedResults.slice((params.page() - 1) * params.count(), params.page() * params.count());
          $defer.resolve(results);
        });
      }
    }
  );
});

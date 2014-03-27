'use strict';

angular.module('mean.users')

.controller('UsersController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Users', function ($scope, $stateParams, $location, $http, Global, Users) {
    $scope.global = Global;

    $scope.$on('location-changed', function(evt, user) {
        var newLocation = new Users({
            address: user.address,
        });
        console.log("this is the new user location", newLocation)
        newLocation.$save(function(response) {
            $location.path('users/' + response._id);
        });

    });

}])


.controller('AreaSelectModalController', ['$scope', '$modal', '$log', '$rootScope', function ($scope, $modal, $log, $rootScope) {


  $scope.user = {
  }

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'views/users/user_area_select.html',
      controller: AreaModalInstanceCtrl,
      resolve: {
        user: function () {
          return $scope.user;
          $log.info($scope.user)
        }
      }
    });

    modalInstance.result.then(function (user) {
      $scope.user = user;
      $rootScope.$broadcast('location-changed', user);
      console.log("broadcasting: ", user);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])


var AreaModalInstanceCtrl = function ($scope, $http, $modalInstance, user) {

  $scope.user = {};

  $scope.changeLocation = function () {
    $modalInstance.close($scope.user);
    console.log($scope.user)
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.location = '';

  $scope.getLocation = function(val) {
  return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: val,
      sensor: false,
    }
  }).then(function(res){
    var addresses = [];
    angular.forEach(res.data.results, function(user){
      addresses.push(user.formatted_address);
    });
    return addresses;
  });
};

};

'use strict';

angular.module('mean.users')

.controller('UsersController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Users', function ($scope, $stateParams, $location, $http, Global, Users) {
    $scope.user = Global.user;
    console.log("This is the user", $scope.user);

    $scope.$on('location-changed', function(evt, userAddress) {
        $scope.user.address = userAddress.address;
        console.log("this is updatedUser", $scope.user);
        var userpath = "users/:" + $scope.user._id;
        console.log("this is the userpath", userpath);


      Users.update($scope.user);
      //     // $location.path("home");
      //     // console.log("home");
        // })
    });
}])


.controller('AreaSelectModalController', ['$scope', '$modal', '$log', '$rootScope', function ($scope, $modal, $log, $rootScope) {


  $scope.userAddress = {
  }

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'views/users/user_area_select.html',
      controller: AreaModalInstanceCtrl,
      resolve: {
        userAddress: function () {
          return $scope.userAddress;
          $log.info($scope.userAddress)
        }
      }
    });

    modalInstance.result.then(function (userAddress) {
      $scope.userAddress = userAddress;
      $rootScope.$broadcast('location-changed', userAddress);
      console.log("broadcasting: ", userAddress);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])


var AreaModalInstanceCtrl = function ($scope, $http, $modalInstance, userAddress) {

  $scope.userAddress = {};

  $scope.changeLocation = function () {
    $modalInstance.close($scope.userAddress);
    console.log($scope.userAddress)
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

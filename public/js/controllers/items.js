'use strict';

angular.module('mean.items').controller('ItemsController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Items', function ($scope, $stateParams, $location, $http, Global, Items) {
    $scope.global = Global;

    $scope.$on('item-added', function(evt, item) {
        var mitem = new Items({
            title: item.title,
            picture: item.picture,
            category: item.category,
            duration: item.duration,
            address: item.address,
            condition: item.condition,
            owned_by: user._id
        });
        console.log("this is the new created item", mitem)
        mitem.$save(function(response) {
            $location.path('items/' + response._id);
        });

    });

    $scope.remove = function(item) {
        if (item) {
            item.$remove();

            for (var i in $scope.items) {
                if ($scope.items[i] === item) {
                    $scope.items.splice(i, 1);
                }
            }
        }
        else {
            $scope.item.$remove();
            $location.path('item');
        }
    };

    $scope.update = function() {
        var item = $scope.item;
        if (!item.updated) {
            item.updated = [];
        }
        item.updated.push(new Date().getTime());

        item.$update(function() {
            $location.path('items/' + item._id);
        });
    };

    $scope.find = function() {
        Items.query(function(items) {
            $scope.items = items;
        });
    };

    $scope.findOne = function() {
        Items.get({
            itemId: $stateParams.itemId
        }, function(item) {
            $scope.item = item;
        });
    };
}])

.controller('MasonryController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {

  $scope.bricks = [
      {src: '../img/chair.jpg',
      text: "Beautiful cat to give away - she's so sweet!!!",
      distance: "1/2 mile",
      time_left: "1 day"},

      {src: '../img/puppy.jpg',
      text: "item.couch needs a new person to take care of",
      distance: "2 miles",
      time_left: "7 days"},

      {src: '../img/cookie.png',
      text: "Fishfood - my fish don't like it ;-(",
      distance: "1 mile",
      time_left: "4 days"},

      {src: '../img/cookie.png',
      text: "A book you have to read once in your life - come get it",
      distance: "1/2 mile",
      time_left: "7 days"},

      {src: '../img/chair.jpg',
      text: "Old but super-nice bicycle needs a new rider",
      distance: "1 mile",
      time_left: "1 day"},

      {src: '../img/puppy.jpg',
      text: "Sunglasses for the cool guys out there",
      distance: "3 miles",
      time_left: "3 days"},

      {src: '../img/cookie.png',
      text: "Little Bonzai tree",
      distance: "1/2 mile",
      time_left: "1 day"},

      {src: '../img/cookie.png',
      text: "Beautiful cat to give away - she's so sweet!!!",
      distance: "1/2 mile",
      time_left: "1 day"},

      {src: '../img/chair.jpg',
      text: "item.couch needs a new person to take care of",
      distance: "2 miles",
      time_left: "7 days"},

      {src: '../img/puppy.jpg',
      text: "Fishfood - my fish don't like it ;-(",
      distance: "1 mile",
      time_left: "4 days"},

      {src: '../img/puppy.jpg',
      text: "A book you have to read once in your life - come get it",
      distance: "1/2 mile",
      time_left: "7 days"},

      {src: '../img/chair.jpg',
      text: "Old but super-nice bicycle needs a new rider",
      distance: "1 mile",
      time_left: "1 day"},

      {src: '../img/puppy.jpg',
      text: "Sunglasses for the cool guys out there",
      distance: "3 miles",
      time_left: "3 days"},

      {src: '../img/chair.jpg',
      text: "Little Bonzai tree",
      distance: "1/2 mile",
      time_left: "1 day"},
      // genBrick(),
      // genBrick(),
      // genBrick()
  ];

  $scope.categories = [
    "Household",
    "Outdoor",
    "Electronics",
    "Animals",
    "Clothes",
    "Furniture",
    "Other",
    "All"
  ];

  $scope.hover = function(brick) {
      // Shows/hides the delete button on hover
    return brick.showDeal = ! brick.showDeal;
  };

  $scope.deal = function(brick) {
      // Hides a row of brick, if the deal button was clicked
    alert("You are officially asking for " + brick.text);
  };

  $scope.gotoSearch = function (){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('search');
      // call $anchorScroll()
      $anchorScroll();
    };


}])

.controller('ModalController', ['$scope', '$modal', '$log', '$rootScope', function ($scope, $modal, $log, $rootScope) {

  // console.log('Hello');
  // console.log($scope.item)

  $scope.item = {
    // title: 'hippie',
    // picture: '',
    // category: '',
    // duration: '',
    // condition: '',
    // street: '',
    // street_number: '',
    // city: '',
    // state: '',
  }

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'views/items/create.html',
      controller: ModalInstanceCtrl,
      resolve: {
        item: function () {
          return $scope.item;
          $log.info($scope.item)
        }
      }
    });

    modalInstance.result.then(function (item) {
      $scope.item = item;
      $rootScope.$broadcast('item-added', item);
      console.log("broadcasting: ", item);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])


var ModalInstanceCtrl = function ($scope, $http, $modalInstance, item) {

  $scope.item = {};

  $scope.addItem = function () {
    $modalInstance.close($scope.item);
    console.log($scope.item)
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
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
    angular.forEach(res.data.results, function(item){
      addresses.push(item.formatted_address);
    });
    return addresses;
  });
};

};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
// Not entirely sure why it isnt working with item.controller and only the variable way works
// .controller('ModalInstanceController', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {

//   $scope.items = items;
//   $scope.selected = {
//     item: $scope.items[0]
//   };

//   $scope.ok = function () {
//     $modalInstance.close($scope.selected.item);
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// }])

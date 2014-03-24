'use strict';

angular.module('mean.items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Global', 'Items', function ($scope, $stateParams, $location, Global, Items) {
    $scope.global = Global;

    $scope.create = function() {
        var item = new Items({
            title: this.title,
            pic_url: this.pic_url,
            category: this.category,
            location: this.location,
            duration: this.duration,
            owned_by: global.user._id
            // not so sure how to save global.users id in here
        });
        item.$save(function(response) {
            $location.path('items/' + response._id);
        });

    };

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

.controller('MasonryController', ['$scope', function ($scope) {
  function genBrick() {
      return {
          src: 'http://lorempixel.com/g/400/200/?' + ~~(Math.random() * 10000)
      };
  };

  $scope.bricks = [
      {src: '../img/chair.jpg',
      text: "Beautiful cat to give away - she's so sweet!!!",
      distance: "1/2 mile",
      time_left: "1 day"},

      {src: '../img/puppy.jpg',
      text: "This couch needs a new person to take care of",
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
      text: "This couch needs a new person to take care of",
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

  $scope.add = function add() {
      $scope.bricks.push(genBrick());
  };

  $scope.remove = function remove() {
      $scope.bricks.splice(
          ~~(Math.random() * $scope.bricks.length),
          1
      )
  };

  $scope.categories = [
    "Household",
    "Outdoor",
    "Electronics",
    "Animals",
    "Clothes",
    "Furniture",
    "Other"
  ];

  $scope.hover = function(brick) {
      // Shows/hides the delete button on hover
    return brick.showDeal = ! brick.showDeal;
  };

  $scope.deal = function(brick) {
      // Hides a row of brick, if the deal button was clicked
    alert("You are officially asking for " + brick.text);
  };


}])

.controller('ModalController', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'views/items/create.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])


var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.title = '';

  $scope.picture = '';

  $scope.category = 'Other'

  $scope.duration = '7 days';

  $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.location = '';

};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
// Not entirely sure why it isnt working with this controller and only the variable way works
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

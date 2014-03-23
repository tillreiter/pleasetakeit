'use strict';

angular.module('mean.items').controller('ItemsController', ['$scope', '$stateParams', '$location', 'Global', 'Items', function ($scope, $stateParams, $location, Global, Items) {
    $scope.global = Global;

    $scope.create = function() {
        var item = new Items({
            title: this.title,
            content: this.content
        });
        item.$save(function(response) {
            $location.path('items/' + response._id);
        });

        this.title = '';
        this.content = '';
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
      {src: '../img/cat.jpg',
      text: "Beautiful cat to give away - she's so sweet!!!",
      distance: "1/2 mile",
      time_left: "1 day"},

      {src: '../img/couch.jpg',
      text: "This couch needs a new person to take care of",
      distance: "2 miles",
      time_left: "7 days"},

      {src: '../img/shrimp.jpg',
      text: "Fishfood - my fish don't like it ;-(",
      distance: "1 mile",
      time_left: "4 days"},

      {src: '../img/snake.jpg',
      text: "A book you have to read once in your life - come get it",
      distance: "1/2 mile",
      time_left: "7 days"},

      {src: '../img/snake.jpg',
      text: "Old but super-nice bicycle needs a new rider",
      distance: "1 mile",
      time_left: "1 day"},

      {src: '../img/snake.jpg',
      text: "Sunglasses for the cool guys out there",
      distance: "3 miles",
      time_left: "3 days"},

      {src: '../img/snake.jpg',
      text: "Little Bonzai tree",
      distance: "1/2 mile",
      time_left: "1 day"}


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
  }
}]);


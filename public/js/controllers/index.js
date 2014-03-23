'use strict';

angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
      $scope.global = Global;
  }])

  .controller('DemoCtrl', function ($scope) {
    function genBrick() {
        return {
            src: 'http://lorempixel.com/g/400/200/?' + ~~(Math.random() * 10000)
        };
    };

    $scope.bricks = [
        genBrick(),
        genBrick(),
        genBrick()
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
  });

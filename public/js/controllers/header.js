'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'Items', function ($scope, Global, Items) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Articles',
        'link': 'articles'
    }, {
        'title': 'Create New Article',
        'link': 'articles/create'
    }];

    // Search for items on wishlist
    $scope.findWanted = function () {
      Items.query({
        wantedItemsUserId: user._id
      }, function (items){
        console.log("sending back users wishlist");
        sock.send(JSON.stringify(items));
        // SharedService.prepBroadcast(items);
      });
    };

    $scope.findOwned = function () {
      Items.query({
        ownedItemsUserId: user._id
      }, function (items){
        console.log("sending back users owned items")
        sock.send(JSON.stringify(items));
        // SharedService.prepBroadcast(items);
      });
    };

    $scope.findAll = function() {
        Items.query(function(items) {
          console.log("sending back all items")
          sock.send(JSON.stringify(items));
        });
    };

    $scope.isCollapsed = false;
}]);

'use strict';

angular.module('mean.items').controller('ItemsController', ['$scope', '$stateParams', '$location', '$http', 'Global', 'Items', 'Deal', 'Sold', function ($scope, $stateParams, $location, $http, Global, Items, Deal, Sold) {
    $scope.global = Global;

    $scope.$on('item-added', function(evt, item) {
        var mitem = new Items({
            title: item.title,
            picture: item.picture,
            category: item.category,
            duration: item.duration,
            address: item.address,
            condition: item.condition,
            owned_by: user._id,
            picture_file: item.picture
        });
        mitem.$save(function(response) {
            $location.path('items/' + response._id);
        console.log("this is the new created item", mitem)
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

    $scope.findAll = function() {
        Items.query(function(items) {
            $scope.items = items;
        });
    };

    $scope.findNear = function (radius) {
        Items.query({
          itemRadius: radius
        }, function (items) {
          $scope.items = items
        });
      };

    $scope.findWanted = function () {
      Items.query({
        wantedItemsUserId: user._id
      }, function (items){
        $scope.items = items;
      });
    };

    $scope.findOne = function() {
        Items.get({
            itemId: $stateParams.itemId
        }, function(item) {
            $scope.item = item;
            console.log("got it + ",item)
        });
    };

    $scope.payDeposit = function (brick) {
    // Items.update(status; bought_by; bought_on)
    var item = Items.get({
      itemId: brick._id},
      // get payment
      function(item){
        console.log(item);
        item.bought_by = user._id;
        item.status = "reserved";
        Items.update({itemId:brick._id}, item, function(item){
        //send email to buyer and seller
          Deal.save({itemId: item._id}, item, function(dealItem){
            console.log("dealitem is", dealItem)
          })
        });
      });
    };

    $scope.confirmPickUp = function (item) {
    // Items.update(status; bought_by; bought_on)
    var item = Items.get({
      itemId: item._id},
      // get payment
      function(item){
        console.log(item);
        item.status = "sold";
        Items.update({itemId:item._id}, item, function(item){
        //send email to buyer and seller
          Sold.save({itemId: item._id}, item, function(soldItem){
            console.log("soldItem is", dealItem)
          })
        });
      });
    };

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

    $scope.radioDistanceModel = 0.5;

    $scope.radioCategoryModel = "";

}])

.controller('MasonryController', ['$scope', '$location', '$anchorScroll', 'Items', '$log', function ($scope, $location, $anchorScroll, Items, $log) {


  $scope.hover = function(brick) {
      // Shows/hides the delete button on hover
    return brick.showDeal = !brick.showDeal;
  };

  $scope.deal = function(brick) {
      // Hides a row of brick, if the deal button was clicked
    alert("You are officially asking for " + brick.text);
  };

  $scope.showDetails = function (brick) {
    // return brick.showDetails = true;
    $scope.details = !$scope.details;
    $scope.brick = brick;
  }

  $scope.gotoSearch = function (){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('search');
      // call $anchorScroll()
      $anchorScroll();
    };

  $scope.details = false;
  $scope.confirmation = false;

  $scope.confirm = function () {
    $scope.confirmation = !$scope.confirmation;
  }

  $scope.wantItem = function (brick) {
  var item = Items.get({
    itemId: $scope.brick._id},
      function(item){
        console.log(item);
        item.wanted_by = user._id;
        item.status = "wanted";
        Items.update({itemId:$scope.brick._id}, item)
      });
  }
}])

.controller('ModalController', ['$scope', '$modal', '$log', '$rootScope', function ($scope, $modal, $log, $rootScope) {

  $scope.item = {
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

  $scope.complete = function(content) {
    $modalInstance.close(content);
  };

  $scope.addItem = function () {
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.condition = 7;
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

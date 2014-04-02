'use strict';

// service used for items REST endpoint
angular.module('mean.items').factory('Items', ['$resource', function($resource) {
    return $resource('items/:itemId/:docController', {
        itemId: '@_id',
        docController: '@docController'
    },
    {
        update: {
            method: 'PUT'
        },
        unwantItem: {
            method: 'POST',
            params: {
                docController: 'unwantItem'
            }
        }

    });
}]).factory('Deal', ['$resource', function($resource) {
    return $resource('buy/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]).factory('Sold', ['$resource', function($resource) {
    return $resource('sold/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

// .factory('SharedService', ['$rootscope', function($rootscope) {
//     var SharedService = {};

//     SharedService.items = {};

//     SharedService.prepBroadcast = function (items) {
//       this.items = items;
//       this.broadcastItems();
//     };

//     SharedService.broadcastItems = function () {
//       rootscope.$broadcast('itemsBroadcast')
//     }
// }]);




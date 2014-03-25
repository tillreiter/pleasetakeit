'use strict';

//Articles service used for items REST endpoint
angular.module('mean.items').factory('Items', ['$resource', function($resource) {
    return $resource('items/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

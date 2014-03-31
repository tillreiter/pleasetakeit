'use strict';

// service used for items REST endpoint
angular.module('mean.items').factory('Items', ['$resource', function($resource) {
    return $resource('items/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT'
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
}])

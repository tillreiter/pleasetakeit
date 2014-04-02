'use strict';

//payments service used for payments REST endpoint
angular.module('mean.payments').factory('Payment', ['$resource', function($resource) {
    return $resource('payments/:paymentId', {
        paymentId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);

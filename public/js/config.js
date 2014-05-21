'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/index.html'
    })
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
    })
      .state('success_deposit', {
        url: '/success_deposit',
        templateUrl: 'views/success_deposit.html'
    })
      .state('deal_confirm', {
        url: '/deal_confirmation/:itemId',
        templateUrl: 'views/items/confirm_deal.html',
        controller: 'UsersController'
    });
  }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);

'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.articles', 'mean.items', 'mean.users', 'wu.masonry', 'ngUpload']);

angular.module('mean.system', []);
angular.module('mean.articles', []);
angular.module('mean.items', ['ngUpload']);
angular.module('mean.users', []);
// angular.module('mean.shared', []);


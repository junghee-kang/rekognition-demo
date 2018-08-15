// Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#4dbd74';
var brandInfo = '#63c2de';
var brandWarning = '#f8cb00';
var brandDanger = '#f86c6b';

var grayDark = '#2a2c36';
var gray = '#55595c';
var grayLight = '#818a91';
var grayLighter = '#d1d4d7';
var grayLightest = '#f8f9fa';

angular
  .module('app', [
    'ui.router',
    'oc.lazyLoad',
    'angular-loading-bar',
    'config',
    'object-detect-controller',
    'face-detect-controller'
  ])
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 1;
  }])
  .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$on('$stateChangeSuccess', function () {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
    $rootScope.$state = $state;
    return $rootScope.$stateParams = $stateParams;
  }]).factory('logTimeTaken', [function () {
    var logTimeTaken = {
      request: function (config) {
        config.requestTimestamp = new Date().getTime();
        return config;
      },
      response: function (response) {
        response.config.responseTimestamp = new Date().getTime();
        return response;
      }
    };
    return logTimeTaken;
  }]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('logTimeTaken');
  }]);


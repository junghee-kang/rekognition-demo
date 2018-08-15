angular
  .module('app')
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise('/face');
    $ocLazyLoadProvider.config({
      debug: false
    });
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'views/common/layouts/full.html',
        resolve: {
          loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
            // you can lazy load CSS files
            return $ocLazyLoad.load([{
              serie: true,
              name: 'Font Awesome',
              files: ['css/font-awesome.min.css']
            }, {
              serie: true,
              name: 'Simple Line Icons',
              files: ['css/simple-line-icons.css']
            }]);
          }],
        }
      })
      .state('app.object', {
        url: '/object',
        templateUrl: 'views/main.html',
        params: { subtitle: 'This is a Serverless Rekognition Client.' },
        controller: 'ObjectDetectController as ctr'
      })
      .state('app.face', {
        url: '/face',
        templateUrl: 'views/search.html',
        params: { subtitle: 'This is a Serverless Rekognition Client.' },
        controller: 'FaceDetectController as ctr'
      });
  }]);

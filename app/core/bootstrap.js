require('./vendor')();

angular.module('ElJimador', [
  'ngTouch',
  'ngSanitize',
  'ngCookies',
  'ngAudio',
  'ui.router',
  'ui.bootstrap',
  'ui.select',
  'angular-carousel',
  'angular-parallax',
  'duScroll',
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.poster",
  "com.2fdevs.videogular.plugins.buffering",
  "oitozero.ngSweetAlert",
  'angulartics',
  'angulartics.google.analytics',
  require('./config').name,
  require('./controllers').name,
  require('./directives').name,
  require('./services').name,
])

.run(function ($rootScope, $cookies, $state, $window) {
  $rootScope.$on('$stateChangeSuccess', function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $rootScope.$broadcast("shutdownMedia");
  });

  var w = angular.element($window);
  $rootScope.$watch(
    function () {
      return $window.innerWidth;
    },
    function (value) {
      $rootScope.isMobileDevice = (value > 768) ? false : true;
      $rootScope.isDesktop = !$rootScope.isMobileDevice;
      if ($state.current.name !== "" && $state.current.name === "home-video" && value < 768) {
        $state.go("home");
        $rootScope.$broadcast("shutdownMedia");
      }
    }, true);

  w.bind('resize', function() {
    $rootScope.$apply();
  });

  $rootScope.$on('$stateChangeStart',
    function(event, toState) {
      if (toState.name === "home" && $rootScope.isDesktop === true) {
        event.preventDefault();
        $state.go("home-video");
      }
      if (toState.name === "home-video" && $rootScope.isMobileDevice === true) {
        event.preventDefault();
        $state.go("home");
      }
    });

  var ejCookie = $cookies.getObject('elJimadorAgeGate');
  if (!angular.isDefined(ejCookie) || ejCookie.isUnderAge === true) {
    $state.go("login");
  }


})

.constant('SETTINGS', {
  development: (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? true : false,
  apiHost: "http://bf-webservice.herokuapp.com/api/",
})
;

angular.element(document).ready(() => {
  angular.bootstrap(document, ['ElJimador'], {});
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/sw.js')
           .then(function() { console.log('SW Registered'); });
}


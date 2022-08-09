export default class LoginCtrl {
  /* @ngInject */
  constructor($scope, $state, $cookies, SweetAlert, $timeout, $window, $http, SETTINGS, $analytics) {
    $scope.currentCountry = {name: "Chile", iso: "cl"};
    var now = Date.now();
    var ageCookie = $cookies.getObject('elJimadorAgeGate');
    $scope.isUnderAge = angular.isDefined(ageCookie) && ageCookie.isUnderAge ? ageCookie.isUnderAge : false;

    if (angular.isDefined(ageCookie) && $scope.isUnderAge === false) {
      $state.go("home");
    }

    // angular.forEach($cookies.getAll(), function (v, k) {
    //   $cookies.remove(k);
    // });

    var validateData = function (data) {
      return $http.post(SETTINGS.apiHost + "validatelda", data);
    };

    $scope.checkAge = function (ageGate) {
      var _2HoursFromNow = new Date( now + 2 * 60 * 60 * 1000 );
      var data = {
        month: ageGate.month || ageGate.date.getUTCMonth() + 1,
        day: ageGate.day || ageGate.date.getUTCDate(),
        year: ageGate.year || ageGate.date.getUTCFullYear(),
        country: $scope.currentCountry.iso,
        category: "spirit"
      };
      validateData(data).then(function (response) {
        if (response.data === true) {
          $analytics.eventTrack('ageGate_success', {category: 'click', label: 'Usuario mayor de edad para ingresar'});
          if (ageGate.remindUser === true) {
            var _aYearAfter = new Date( now + 365 * 24 * 60 * 60 * 1000 );
            $cookies.putObject('elJimadorAgeGate', {isUnderAge: false}, {'expires': _aYearAfter});
          } else {
            $cookies.putObject('elJimadorAgeGate', {isUnderAge: false}, {'expires': _2HoursFromNow});
          }
          $state.go("home");
        } else {
          $analytics.eventTrack('ageGate_failed', {category: 'click', label: 'Usuario menor de edad, no puede entrar'});
          $scope.isUnderAge = true;
          // Setting a cookie
          $cookies.putObject('elJimadorAgeGate', {isUnderAge: true}, {'expires': _2HoursFromNow});
          SweetAlert.swal({
            title: "Lo sentimos, tienes que ser mayor de edad para poder ingresar.",
            text: "No puedes ingresar al sitio.",
            imageUrl: "images/error.png"
          }, function () {
            $timeout(function () {
              $window.location.href = "http://alcoholinformate.org.mx/";
            }, 2000);
          });
        }
      }, function (WSerror) {
        console.warn(WSerror);
        $state.go("home");
      });
    };

    $http.get(SETTINGS.apiHost + "countries").then(function (response) {
      $scope.countries = response.data;
    }, function (error) {
      console.warn(error);
    });

  }
}

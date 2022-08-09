export default class PolicyCtrl {
  /* @ngInject */
  constructor($scope, $http, SweetAlert, SETTINGS) {
    console.info("PolicyCtrl inits");
    var currentHost = document.location.protocol + '//' + document.location.hostname;
    var currentPath = SETTINGS.development ? "/el_jimador/app/" : "/";
    $scope.d = {};
    $scope.d.country = {name: "Chile", iso: "cl"};
    $scope.register = function (data, form) {
      if (data.agree === "no") {
        SweetAlert.swal({
          title: "No se puede registrar.",
          text: "Para poder registrarse debe aceptar los terminos y condiciones.",
          imageUrl: "images/error.png" }
        );
      } else {
        data.country = data.country.name;
        delete country.name;
        delete country.iso;
        var req = {
          method: 'POST',
          url: currentHost + currentPath + 'php/contact.php',
          transformRequest: function (request) {
            return request === undefined ? request : $.param(request);
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'},
          data: data
        };
        $http(req).then(function () {
          SweetAlert.swal({
            title: "Se ha registrado correctamente.",
            text: "Gracias por aceptar nuestra politica de vinculación",
            type: "success" }
          );
          form.$setPristine();
          $scope.d = {};
        }, function (error) {
          console.warn(error);
          SweetAlert.swal({
            title: "No se pudo registrar.",
            text: "Ha ocurrido un error, por favor reintente.",
            imageUrl: "images/error.png" }
          );
        });
      }
    };

    $http.get(SETTINGS.apiHost + "countries").then(function (response) {
      $scope.countries = response.data;
    }, function (error) {
      console.warn(error);
    });
  }
}

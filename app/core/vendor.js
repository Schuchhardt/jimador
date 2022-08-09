// Requerir/importar aquí las librerías (fonts, css, js)
// de uso común en todo el proyecto.

module.exports = function() {
  /* Styles */
  require('bootstrap/dist/css/bootstrap.css');
  require('sweetalert/dist/sweetalert.css');
  require('angular-carousel/dist/angular-carousel.min.css');
  require('../css/main.scss');
  /* JS */
  global.$ = global.jQuery = require('jquery');
  require('angular');
  require('angular-i18n/angular-locale_es-cl.js');
  require('angular-cookies');
  require('angular-touch');
  require('angular-carousel');
  require('angular-scroll');
  require('angular-sanitize');
  require('angular-ui-router');
  require('angular-ui-bootstrap');
  require('angular-ui-select/select.min.js');
  require('angular-audio/app/angular.audio.js');
  require('sweetalert');

  require('ngSweetAlert');
  require('angular-parallax');
  require('lodash');
  require('videogular');
  require('videogular-poster');
  require('videogular-controls');
  require('videogular-buffering');
  require('angular-ui-select/select.min.css');
  require('angulartics');
  require('angulartics-google-analytics');
};

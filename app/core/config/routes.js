export default [ "$stateProvider", "$urlRouterProvider", ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('login', {
      url: '/',
      controller: 'LoginCtrl',
      template: require('../modules/login/login.jade'),
    })
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      template: require('../modules/home/home.jade'),
    })
    .state('historia', {
      url: '/historia',
      controller: 'HomeCtrl',
      template: require('../modules/home/historia.jade'),
    })
    .state('el-jimador', {
      url: '/el-jimador',
      controller: 'HomeCtrl',
      template: require('../modules/home/eljimador.jade'),
    })
    .state('redescubre', {
      url: '/redescubre-el-tequila',
      controller: 'RedescubreCtrl',
      template: require('../modules/home/redescubre.jade'),
    })
    .state('home-video', {
      url: '/home-video',
      controller: 'VideoCtrl',
      template: require('../modules/home/video.jade'),
    })
    .state('agenda', {
      url: '/agenda',
      controller: 'AgendaCtrl',
      template: require('../modules/home/agenda.jade'),
    })
    .state('experiencias', {
      url: '/experiencias',
      controller: 'ExperienciasCtrl',
      template: require('../modules/home/experiencias.jade'),
    })
    .state('politica-de-vinculacion', {
      url: '/politica-de-vinculacion',
      controller: 'PolicyCtrl',
      template: require('../modules/lp/link-policy.jade'),
    })
    ;
}];

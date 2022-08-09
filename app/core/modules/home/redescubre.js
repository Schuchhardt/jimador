export default class RedescubreCtrl {
  /* @ngInject */
  constructor($scope, $state, $rootScope) {
    $rootScope.currentState = $state.current.name;

  }
}

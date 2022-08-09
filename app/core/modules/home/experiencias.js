export default class ExperienciasCtrl {
  /* @ngInject */
  constructor($scope, $sce, $uibModal, $stateParams, $state, $http, $rootScope ) {
    console.info("ExperienciasCtrl inits");
    $rootScope.currentState = $state.current.name;
    $scope.player = {};
    var count = 0;
    $scope.noMore = false;
    $http.get("/data/experiencias.json").then(function (response) {
      $scope.experiencias = response.data.experiencias;
      $scope.selectedExperiencias = [$scope.experiencias[0]];
      $scope.selectedImagenes = [];
      angular.forEach($scope.selectedExperiencias[0].imagenes, function (img) {
        $scope.selectedImagenes.push({img: img, exp: $scope.experiencias[0]});
      });
      angular.forEach($scope.experiencias, function (exp) {
        if (exp.hasVideo) {
          exp.video = {
            sources: [
              {src: $sce.trustAsResourceUrl("../images/experiencias/" + exp.slug + "/video.mp4"), type: "video/mp4"},
            ],
            theme: {url: "css/videogular.css"},
          };
        }
      });
    }, function (error) {
      console.warn(error);
    });

    $scope.getBgImg = function (photo) {
      return {"background-image": "url(../images/experiencias/" + photo.exp.slug + "/" + photo.img + "-th.jpg)"};
    };

    $scope.onPlayerReady = function(API) {
      $scope.player = API;
    };

    $scope.play = function () {
      $scope.player.playPause();
    };

    $scope.loadMore = function () {
      var total = $scope.experiencias.length;
      count += 1;
      if (count !== total) {
        $scope.selectedExperiencias.push($scope.experiencias[count]);
        angular.forEach($scope.experiencias[count].imagenes, function (img) {
          $scope.selectedImagenes.push({img: img, exp: $scope.experiencias[count]});
        });
      } else {
        $scope.noMore = true;
      }
    };

    $scope.showSlider = function (photo) {
      $uibModal.open({
        animation: false,
        templateUrl: 'sliderPhotos',
        controller: 'sliderPhotosCtrl',
        size: "lg",
        resolve: {
          experiencia: function () {
            return photo.exp;
          },
          currentImage: function () {
            return photo.img;
          }
        }
      });
    };

    // Experiencias
    // Nikitta Arts & Music - 28 noviembre
    // Nikitta Arts & Music - 7 enero
    // Noches One - jueves 14 enero
    // Noches One - jueves 28 enero
    // Noche ONE - Casa piedra_ jueves 3 marzo
    // Noche Nikkita - Centro Parque_sabado 12 marzo

  }
}

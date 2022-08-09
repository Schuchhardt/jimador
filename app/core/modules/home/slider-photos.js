export default class sliderPhotosCtrl {
  /* @ngInject */
  constructor($scope, $uibModalInstance, $sce, $timeout, experiencia, currentImage) {
    console.info("sliderPhotosCtrl inits");
    $scope.currentSlide = _.indexOf(experiencia.imagenes, currentImage);
    $scope.experiencia = experiencia;

    $scope.close = function () {
      $uibModalInstance.dismiss();
    };

    $scope.getBg = function (img) {
      return {"background-image": "url(images/experiencias/" + $scope.experiencia.slug + "/" + img + ".jpg)" };
    };

  }
}

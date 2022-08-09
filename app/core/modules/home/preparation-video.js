export default class PreparationVideoCtrl {
  /* @ngInject */
  constructor($scope, $uibModalInstance, $sce, videoName) {
    console.info("PreparationVideoCtrl inits");
    $scope.currentVideo = {
      sources: [
        {src: $sce.trustAsResourceUrl("videos/preparacion/" + videoName + ".mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("videos/preparacion" + videoName + ".webm"), type: "video/webm"}
        // {src: $sce.trustAsResourceUrl("videos/preparacion" + videoName + ".ogg"), type: "video/ogg"}
      ],
      theme: {
        url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
      }
    };

  }
}

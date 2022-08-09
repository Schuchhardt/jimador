export default class HomeCtrl {
  /* @ngInject */
  constructor($scope, $state, $rootScope, $uibModal, $sce, $document, $timeout) {
    $rootScope.currentState = $state.current.name;
    $scope.currentSlide = 1;
    $scope.playingVideo = false;
    $scope.videoName = "submarino";
    var duration = 2000; // milliseconds
    var offset = 60;
    var videoElement = angular.element(document.getElementById('video'));

    $scope.player = {};

    $scope.onPlayerReady = function(API) {
      $scope.player = API;
    };

    $scope.play = function () {
      $scope.player.playPause();
    };

    $scope.currentVideo = {
      sources: [
        {src: $sce.trustAsResourceUrl("videos/preparacion/" + $scope.videoName + ".mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("videos/preparacion" + $scope.videoName + ".webm"), type: "video/webm"}
      ],
      theme: {url: "css/videogular.css"},
    };

    $scope.playPreparation = function (name) {
      $uibModal.open({
        animation: false,
        templateUrl: 'preparationVideo',
        controller: 'PreparationVideoCtrl',
        size: "lg",
        resolve: {
          videoName: function () {
            return name;
          }
        }
      });
    };

    $scope.slides = [
      {id: 1, name: "marchelita"},
      {id: 2, name: "submarino"},
      {id: 3, name: "paloma"},
      {id: 4, name: "guadalupe"}
    ];

    var scrollTo = function (element) {
      $document.scrollToElement(element, offset, duration);
    };

    var selectTrago = function (videoName) {
      $scope.playingVideo = true;
      $scope.currentVideo.sources = [
        {src: $sce.trustAsResourceUrl("videos/preparacion/" + videoName + ".mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("videos/preparacion/" + videoName + ".webm"), type: "video/webm"}
      ];
      scrollTo(videoElement);
      $timeout( function () {
        $scope.play();
      }, 1000);
    };


    $scope.playVideo = function (slide) {
      selectTrago(slide.name);
    };

  }
}

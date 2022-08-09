export default class VideoCtrl {
  /* @ngInject */
  constructor($scope, $sce, $timeout, $uibModal, $window, $rootScope, $analytics, ngAudio, $state, $cookies) {
    console.info("VideoCtrl inits");
    $rootScope.currentState = $state.current.name;
    $scope.player = {};
    $scope.ingredientesSeleccionados = [];
    $scope.tragoReady = false;
    $scope.showSplash = false;
    $scope.sound = ngAudio.load("videos/music.mp3");
    $scope.sound.loop = true;
    $scope.sound.setVolume(0.2);
    $scope.soundPlaying = true;
    $scope.showPoster = false;
    $scope.loopVideos = false;
    var salidaPlayed = false;
    var magiaPlayed = false;

    var setVideoConfig = function () {
      $scope.config = {
        preload: "auto",
        sources: [
          {src: $sce.trustAsResourceUrl("videos/entrada/entrada.mp4"), type: "video/mp4"},
          {src: $sce.trustAsResourceUrl("videos/entrada/entrada.webm"), type: "video/webm"},
        ],
        theme: {url: "css/videogular.css"},
        plugins: {
          poster: "images/redescubre-video/video_cover.jpg"
        }
      };
    };


    $scope.onPlayerReady = function(API) {
      $scope.player = API;
    };

    $scope.getIngredienteImg = function (ingrediente) {
      return angular.isDefined(ingrediente) ? "images/redescubre-video/ingredientes/" + ingrediente.slug + ".png" : null;
    };

    $scope.toggleSound = function () {
      $analytics.eventTrack('mute_sound', {category: 'click', label: 'Mutea el sonido'});
      $scope.sound.setMuting($scope.soundPlaying);
      $cookies.put('elJimadorSoundOff', $scope.soundPlaying.toString());
      $scope.soundPlaying = !$scope.soundPlaying;
    };

    $scope.reset = function () {
      $analytics.eventTrack('reset_preparation', {category: 'click', label: 'Intenta armar otro trago'});
      setVideoConfig();
      $scope.ingredientesSeleccionados = [];
      $scope.tragoReady = false;
      $scope.showSplash = false;
      $scope.showPoster = false;
      $scope.showEndTitles = false;
      $scope.showingFinalStep = false;
      $scope.canChoose = true;
      $scope.lastIngredient = false;
      salidaPlayed = false;
      magiaPlayed = false;
      var resetIngredientes = [];
      angular.forEach($scope.ingredientes, function (ing) {
        delete ing.disabled;
        resetIngredientes.push(ing);
      });
      $scope.ingredientes = resetIngredientes;
    };

    $scope.playPreparation = function () {
      $analytics.eventTrack('see_video', {category: 'click', label: 'Ve el video de preparacion paso a paso'});
      $scope.sound.stop();
      $uibModal.open({
        animation: false,
        templateUrl: 'preparationVideo',
        controller: 'PreparationVideoCtrl',
        size: "lg",
        resolve: {
          videoName: function () {
            return $scope.currentTrago;
          }
        }
      });
    };

    var tragos = {
      "guadalupe": [
        {slug: "azucar-flor"},
        {slug: "hielo-frappe"},
        {slug: "jugo-de-limon"},
        {slug: "menta", unique: true, parent: "guadalupe"},
        {slug: "pulpa-de-frutilla", unique: true, parent: "guadalupe"},
        // {slug: "tequila-blanco"},
      ],
      "marchelita": [
        {slug: "azucar-flor"},
        {slug: "cerveza"},
        {slug: "triple-sec", unique: true, parent: "marchelita"},
        {slug: "hielo-frappe"},
        {slug: "jugo-de-limon"},
        {slug: "pulpa-de-mango", unique: true, parent: "marchelita"},
        // {slug: "tequila-blanco"},
      ],
      "paloma": [
        {slug: "hielo", unique: true, parent: "paloma"},
        {slug: "jugo-de-limon"},
        {slug: "sal", unique: true, parent: "paloma"},
        {slug: "gaseosa-blanca", unique: true, parent: "paloma"},
        // {slug: "tequila-blanco"},
      ],
      "submarino": [
        {slug: "cerveza"},
        // {slug: "tequila-dorado"},
      ]
    };

    var uniques = _.pluck(_.where(_.flatten(_.values(tragos)), {unique: true}), 'slug');


    $scope.ingredientes = [
      {name: "Pulpa de Frutilla", slug: "pulpa-de-frutilla"},
      {name: "Hielo", slug: "hielo"},
      {name: "Hielo Frappé", slug: "hielo-frappe"},
      {name: "Sal", slug: "sal"},
      {name: "Pulpa de Mango", slug: "pulpa-de-mango"},
      {name: "Azúcar Flor", slug: "azucar-flor"},
      {name: "Gaseosa Blanca", slug: "gaseosa-blanca"},
      {name: "Menta", slug: "menta"},
      {name: "Jugo de Limón", slug: "jugo-de-limon"},
      {name: "Triple Sec", slug: "triple-sec"},
      {name: "Cerveza", slug: "cerveza"},
      // {name: "Tequila Blanco", slug: "tequila_blanco"},
      // {name: "Cerveza", slug: "cerveza"},
      // {name: "Frutillas", slug: "frutillas"},
      // {name: "Limón de pica", slug: "limon-pica"},
      // {name: "Naranja", slug: "naranja"},
      // {name: "Azúcar", slug: "azucar"},
      // {name: "Granadina", slug: "granadina"},
    ];


    var filterTragos = function (ingrediente) {
      if ( _.contains(uniques, ingrediente.slug)) {
        var currentIngrediente = _.findWhere(_.flatten(_.values(tragos)), {slug: ingrediente.slug});
        var newIngredientes = [];
        angular.forEach(tragos[currentIngrediente.parent], function (ing) {
          var newIng =  _.findWhere($scope.ingredientes, {slug: ing.slug});
          if (angular.isDefined(newIng)) {
            newIngredientes.push(newIng);
          }
        });
        console.info("Armando un", currentIngrediente.parent );
        $analytics.eventTrack('begin_preparation', {category: 'click', label: 'Empieza a Armar un ' + currentIngrediente.parent});
        $analytics.eventTrack('begin_preparation', {category: 'click', label: 'Empieza a Armar un trago'});
        _.map($scope.ingredientes, function (val) {
          if (!angular.isDefined(_.findWhere(newIngredientes, {slug: val.slug}) ) ) {
            val.disabled = true;
          }
        });
        $scope.currentTrago = currentIngrediente.parent;
      } else {
        angular.forEach(tragos, function (ingredientes, nombreTrago) {
          var qu = _.findWhere(ingredientes, {slug: ingrediente.slug});
          var hasIt = angular.isDefined(qu);
          if (hasIt === false) {
            angular.forEach(tragos[nombreTrago], function (ing) {
              if (ing.unique === true) {
                var ingre = _.findWhere($scope.ingredientes, {slug: ing.slug});
                ingre.disabled = true;
              }
            });
          }
        });
      }
    };

    $scope.putReposoVideo = function () {
      $scope.sound.play();
      var arr;
      if ($scope.showingFinalStep === true) {
        $scope.loopVideos = false;
        var salidaSelected = ($scope.currentTrago === "paloma" || $scope.currentTrago === "submarino" ) ? "salida" : "salida_shake";
        if (salidaPlayed === false) {
          salidaPlayed = true;
          arr = [
            {src: $sce.trustAsResourceUrl("videos/salida/" + salidaSelected + ".mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("videos/salida/" + salidaSelected + ".webm"), type: "video/webm"}
          ];
        } else {
          magiaPlayed = true;
          arr = [
            {src: $sce.trustAsResourceUrl("videos/magia/" + $scope.currentTrago + ".mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("videos/magia/" + $scope.currentTrago + ".webm"), type: "video/webm"}
          ];
        }

      } else {
        if ($scope.ingredienteChosen === true) {
          $scope.ingredienteChosen = false;
          $scope.showIngredienteSplash = false;
          $scope.canChoose = true;
          arr = $scope.videoIngredientes;
          $scope.playingReposo = false;
          $scope.canMix = false;
          $scope.loopVideos = false;
        } else {
          $scope.canMix = true;
          $scope.playingReposo = true;
          var reposoSelected = _.sample( ["reposo1-2", "reposo3-2"] );
          arr = [
            {src: $sce.trustAsResourceUrl("videos/reposo/" + reposoSelected + ".mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("videos/reposo/" + reposoSelected + ".webm"), type: "video/webm"}
          ];
          $scope.loopVideos = true;
        }
      }

      if ($scope.lastIngredient === true) {
        $scope.tragoReady = true;
      }

      if ($scope.showPoster === false) {
        $scope.config.sources = arr;
      }

      if (salidaPlayed === true) {
        $scope.showSplash = true;
      }

      if (magiaPlayed === true) {
        $analytics.eventTrack('end_preparation', {category: 'click', label: 'Termina preparacion'});
        $analytics.eventTrack('end_preparation_' + $scope.currentTrago, {category: 'click', label: 'Termina la preparacion de ' + $scope.currentTrago});
        $scope.showPoster = true;
        $timeout(function() {
          $scope.showEndTitles = true;
        }, 5000);
      }

    };

    $scope.selectIngrediente = function (ingrediente) {
      $analytics.eventTrack('select_ingredient', {category: 'click', label: 'Usuario selecciona un ingrediente'});
      $analytics.eventTrack('select_ingredient_' + ingrediente.slug, {category: 'click', label: 'Usuario selecciona ' + ingrediente.name});
      if ($scope.canChoose === false || ingrediente.disabled === true) {
        return false;
      }
      $scope.loopVideos = false;
      $scope.currentIngrediente = ingrediente;
      $scope.canChoose = false;
      $scope.videoIngredientes = [
        {src: $sce.trustAsResourceUrl("videos/ingredientes/" + ingrediente.slug + ".mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("videos/ingredientes/" + ingrediente.slug + ".webm"), type: "video/webm"}
      ];

      filterTragos(ingrediente);

      ingrediente.disabled = true;
      $scope.ingredientesSeleccionados.push(ingrediente);

      if (angular.isDefined($scope.currentTrago) && tragos[$scope.currentTrago].length === $scope.ingredientesSeleccionados.length ) {
        $scope.lastIngredient = true;
      }

      if ((ingrediente.slug === "cerveza" && $scope.ingredientesSeleccionados.length === 1)) {
        $scope.lastIngredient = true;
        $scope.currentTrago = "submarino";
        $analytics.eventTrack('begin_preparation', {category: 'click', label: 'Empieza a Armar un submarino'});
      }

      if ($scope.ingredienteChosen !== true) {
        $scope.ingredienteChosen = true;
        if ($scope.playingReposo === true) {
          $scope.showIngredienteSplash = true;
        }
      }
    };

    var getFinalIngredient = function (trago) {
      var tequila = "";
      switch (trago) {
      case "guadalupe":
        tequila = {name: "El Jimador Blanco", slug: "tequila_blanco_2", isTequila: true, img: "tequila_blanco"};
        break;
      case "marchelita":
        tequila = {name: "El Jimador Blanco", slug: "tequila_blanco_02", isTequila: true, img: "tequila_blanco"};
        break;
      case "paloma":
        tequila = {name: "El Jimador Dorado", slug: "tequila_dorado_02_2", isTequila: true, img: "tequila_dorado"}; // es con tequila blanco
        break;
      case "submarino":
        tequila = {name: "El Jimador Dorado", slug: "tequila_dorado_01_2", isTequila: true, img: "tequila_dorado"};

        break;
      }
      return tequila;
    };

    $scope.showFinalStep = function () {
      if ($scope.canChoose === false || $scope.playingReposo !== true) {
        return false;
      }
      $scope.canChoose = false;

      var ingredienteFinal = getFinalIngredient($scope.currentTrago);
      $scope.ingredientesSeleccionados.push(ingredienteFinal);

      $scope.config.sources = [
        {src: $sce.trustAsResourceUrl("videos/ingredientes/" + ingredienteFinal.slug + ".mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("videos/ingredientes/" + ingredienteFinal.slug + ".webm"), type: "video/webm"}
      ];
      $scope.showingFinalStep = true;
      $scope.loopVideos = false;
    };

    $scope.postTo = function (social) {
      $analytics.eventTrack('share_video', {category: 'click', label: 'Se comparte preparacion en redes sociales'});
      var siteUrl = "http://www.redescubreeltequila.cl/";
      var url;
      $timeout(function() {
        switch (social) {
        case 2:
          $analytics.eventTrack('share_video_twitter', {category: 'click', label: 'Se comparte preparacion en Twitter'});
          var tit = encodeURIComponent('Redescubre el Tequila con el Jimador!');
          url = 'https://twitter.com/intent/tweet?text=' + tit + '&hashtags=eljimador&url=' + siteUrl;
          $window.open(url, 'Twitter', 'status = 1, left = 350, top = 90, height = 350, width = 420, resizable = 0');
          break;
        case 1:
          $analytics.eventTrack('share_video_facebook', {category: 'click', label: 'Se comparte preparacion en Facebook'});
          url = "https://www.facebook.com/sharer/sharer.php?u=http%3A//redescubreeltequila.cl";
          $window.open(url, 'Facebook', 'status = 1, left = 350, top = 90, height = 350, width = 420, resizable = 0');
          break;
        }
      }, 1000);
    };

    $rootScope.$on("shutdownMedia", function() {
      $scope.sound.setMuting(true);
      $scope.player.stop();
    });

    $timeout( function () {
      setVideoConfig();
      if ($cookies.get('elJimadorSoundOff') === "true" ) {
        $scope.toggleSound();
      }
    }, 1000);

  }
}

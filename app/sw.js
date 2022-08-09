var dataCacheName = 'elJimador-v1';
var cacheName = 'elJimador-cache';
var filesToCache = [
  '/',
  '/index.html',
  '/bundle.js',
  '/vendor.css',
  '/app.css',
  '/fonts/ChineseRocks.ttf',
  '/fonts/ChineseRocks.woff',
  '/images/logo_jimador_nuevo.png',
  '/images/error.png',
  '/images/rayo.png',
  '/images/sound-on.png',
  '/images/sound-off.png',
  '/images/redescubre-video/scroll-blanco.png',
  '/images/redescubre-video/selecciona.png',
  '/images/redescubre-video/tu_tequila_es.png',
  '/images/redescubre-video/ver_video.png',
  '/images/redescubre-video/compartir-title.png',
  '/images/redescubre-video/compartir-fb.png',
  '/images/redescubre-video/compartir-tw.png',
  '/images/redescubre-video/otro_trago.png',
  '/images/redescubre-video/video_cover.jpg',
  '/images/redescubre-video/titular-guadalupe.png',
  '/images/redescubre-video/titular-marchelita.png',
  '/images/redescubre-video/titular-paloma.png',
  '/images/redescubre-video/titular-submarino.png',
  '/images/redescubre-video/ingredientes/azucar-flor.png',
  '/images/redescubre-video/ingredientes/cerveza.png',
  '/images/redescubre-video/ingredientes/gaseosa-blanca.png',
  '/images/redescubre-video/ingredientes/hielo-frappe.png',
  '/images/redescubre-video/ingredientes/hielo.png',
  '/images/redescubre-video/ingredientes/jugo-de-limon.png',
  '/images/redescubre-video/ingredientes/menta.png',
  '/images/redescubre-video/ingredientes/pulpa-de-frutilla.png',
  '/images/redescubre-video/ingredientes/pulpa-de-mango.png',
  '/images/redescubre-video/ingredientes/sal.png',
  '/images/redescubre-video/ingredientes/triple-sec.png',
  '/images/redescubre-video/ingredientes/tequila_dorado.png',
  '/images/redescubre-video/ingredientes/tequila_blanco.png',
  '/images/redescubre-video/splash/azucar-flor.png',
  '/images/redescubre-video/splash/cerveza.png',
  '/images/redescubre-video/splash/gaseosa-blanca.png',
  '/images/redescubre-video/splash/hielo-frappe.png',
  '/images/redescubre-video/splash/hielo.png',
  '/images/redescubre-video/splash/jugo-de-limon.png',
  '/images/redescubre-video/splash/menta.png',
  '/images/redescubre-video/splash/pulpa-de-frutilla.png',
  '/images/redescubre-video/splash/pulpa-de-mango.png',
  '/images/redescubre-video/splash/sal.png',
  '/videos/music.mp3',
  '/videos/entrada/entrada.mp4',
  '/videos/salida/salida.mp4',
  '/videos/salida/salida_shake.mp4',
  '/videos/reposo/reposo1-2.mp4',
  '/videos/reposo/reposo3-2.mp4',
  '/videos/magia/guadalupe.mp4',
  '/videos/magia/marchelita.mp4',
  '/videos/magia/paloma.mp4',
  '/videos/magia/submarino.mp4',
  '/videos/ingredientes/azucar-flor.mp4',
  '/videos/ingredientes/cerveza.mp4',
  '/videos/ingredientes/gaseosa-blanca.mp4',
  '/videos/ingredientes/hielo-frappe.mp4',
  '/videos/ingredientes/hielo.mp4',
  '/videos/ingredientes/jugo-de-limon.mp4',
  '/videos/ingredientes/menta.mp4',
  '/videos/ingredientes/pulpa-de-frutilla.mp4',
  '/videos/ingredientes/pulpa-de-mango.mp4',
  '/videos/ingredientes/sal.mp4',
  '/videos/ingredientes/triple-sec.mp4',
  '/videos/ingredientes/tequila_dorado_01_2.mp4',
  '/videos/ingredientes/tequila_dorado_02_2.mp4',
  '/videos/ingredientes/tequila_blanco_2.mp4',
  '/videos/ingredientes/tequila_blanco_02.mp4',
  '/videos/preparacion/guadalupe.mp4',
  '/videos/preparacion/marchelita.mp4',
  '/videos/preparacion/paloma.mp4',
  '/videos/preparacion/submarino.mp4',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = 'http://www.redescubreeltequila.cl/' || 'http://staging.redescubreeltequila.cl/';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

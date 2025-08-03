const CACHE_NAME = 'cronicas-medievales-v2';
const OFFLINE_URL = 'offline.html';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './engine.js',
  './novelData.js',
  './img/medieval-bg.jpg',
  './img/wood-planks.jpg',
  './img/parchment-texture.jpg',
  './img/characters/lilianne.png',
  './img/characters/feyra.png',
  './img/backgrounds/hospital.jpg',
  './img/backgrounds/dungeon.jpg',
  './img/backgrounds/fortress.jpg',
  './img/backgrounds/throne_room.jpg',
  './img/backgrounds/city.jpg',
  './img/backgrounds/black.jpg',
  './sounds/medieval-ambient.mp3',
  './sounds/button-click.mp3',
  './sounds/page-turn.mp3',
  './sounds/door-open.mp3',
  './sounds/door-close.mp3',
  './sounds/error.mp3',
  './sounds/wind-howling.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando recursos esenciales');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));

            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL || './index.html');
            }
            return new Response('', { status: 408, statusText: 'Offline' });
          });
      })
  );
});

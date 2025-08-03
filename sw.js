// sw.js - Service Worker para Crónicas Medievales en GitHub Pages (repo: Regnum)

const CACHE_NAME = 'Regnum-v1';
const OFFLINE_URL = '/Regnum/index.html'; // Página de respaldo en caso de estar offline
const ASSETS_TO_CACHE = [
  '/Regnum/',
  '/Regnum/index.html',
  '/Regnum/styles.css',
  '/Regnum/script.js',
  '/Regnum/engine.js',
  '/Regnum/novelData.js',
  '/Regnum/manifest.json',
  '/Regnum/img/medieval-bg.jpg',
  '/Regnum/img/wood-planks.jpg',
  '/Regnum/img/parchment-texture.jpg',
  '/Regnum/img/characters/lilianne.png',
  '/Regnum/img/characters/feyra.png',
  '/Regnum/img/backgrounds/hospital.jpg',
  '/Regnum/img/backgrounds/dungeon.jpg',
  '/Regnum/img/backgrounds/fortress.jpg',
  '/Regnum/img/backgrounds/throne_room.jpg',
  '/Regnum/img/backgrounds/city.jpg',
  '/Regnum/img/backgrounds/black.jpg',
  '/Regnum/sounds/medieval-ambient.mp3',
  '/Regnum/sounds/button-click.mp3',
  '/Regnum/sounds/page-turn.mp3',
  '/Regnum/sounds/door-open.mp3',
  '/Regnum/sounds/door-close.mp3',
  '/Regnum/sounds/error.mp3',
  '/Regnum/sounds/wind-howling.mp3'
];

// Instalación: cachear recursos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando recursos esenciales...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Eliminando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: estrategia Cache First, Network Fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));

            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('', { status: 408, statusText: 'Offline' });
          });
      })
  );
});

// Escuchar mensajes del cliente (para actualizaciones)
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

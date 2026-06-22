// sw.js - Service Worker for Rina & Daisuke English Adventure

const CACHE_NAME = 'rina-daisuke-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        const urls = [
          '/rina-daisuke-english/',
          '/rina-daisuke-english/index.html',
          '/rina-daisuke-english/manifest.json'
        ];
        return Promise.all(
          urls.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
            });
          })
        );
      })
      .catch(err => {
        console.error('Cache failed:', err);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).catch(() => {
          return new Response('Offline - please connect to the internet');
        });
      })
  );
});
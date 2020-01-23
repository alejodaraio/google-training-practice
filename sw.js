const cacheName = 'cache-version-11';
const precache = [
  '/',
  'js/main.js',
  'js/chuck-messages.js',
  'js/articles.js',
  'css/main.css',
  'index.html',
  'pages/offline.html',
  'pages/404.html'
];

self.addEventListener('install', event => {

  self.skipWaiting();

  event.waitUntil(
      caches.open(cacheName).then(cache => {
        return cache.addAll(precache)
      })
  );
});

self.addEventListener('activate', event => {

  const cacheWhitelist = [cacheName];

  // Remove outdate cache files.
  event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
        )
      })
  );
});

self.addEventListener('fetch', event => {
  // Check if exists on cache to render else it will cache the new request.
  event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache.match(event.request).then(response => {

          return response || fetch(event.request).then(response => {

            if (response.status === 404) {
              return caches.match('pages/404.html');
            }

            // here we are creating a new cache file.
            if (event.request.url !== 'https://api.chucknorris.io/jokes/random') {
              cache.put(event.request, response.clone());
            }

            return response;
          })
        }).catch(error => {
          // if the request fails ( offline mode )
          // we will show a custom offline page.
          return caches.match('pages/offline.html');
        });
      })
  );
});
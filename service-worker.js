importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log("Workbox berhasil dimuat");
  workbox.precaching.precacheAndRoute([
    { url: './', revision: '1' },
    { url: './nav.html', revision: '1' },
    { url: './index.html', revision: '1' },
    { url: './manifest.json', revision: '1' },
    { url: './pages/home.html', revision: '1' },
    { url: './pages/team.html', revision: '1' },
    { url: './pages/favourite.html', revision: '1' },
    { url: './css/materialize.min.css', revision: '1' },
    { url: './js/materialize.min.js', revision: '1' },
    { url: './js/nav.js', revision: '1' },
    { url: './js/api.js', revision: '1' },
    { url: './js/idb.js', revision: '1' },
    { url: './img/icon.png', revision: '1' }
  ]);

  workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages'
    })
  );

  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    'img/icon.png',
    workbox.strategies.cacheOnly()
  );

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst()
  );

  workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-font-stylesheets',
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        }),
      ],
    })
  );

} else {
  console.log("Workbox gagal dimuat");
}

self.addEventListener("push", function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push Message No Payload";
  }

  var options = {
    body: body,
    icon: "img/icon.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { NetworkFirst, StaleWhileRevalidate, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== workbox.core.cacheNames.precache)
          .map(name => caches.delete(name))
      )
    )
  );
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'pages' })
);

registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new StaleWhileRevalidate({ cacheName: 'assets' })
);

const bgSyncPlugin = new BackgroundSyncPlugin('apiQueue', {
  maxRetentionTime: 24 * 60,
});

registerRoute(
  /\/api\//,
  new NetworkOnly({ plugins: [bgSyncPlugin] }),
  'POST'
);


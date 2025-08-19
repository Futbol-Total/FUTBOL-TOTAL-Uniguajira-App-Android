// Service Worker para PWA
const CACHE_NAME = 'futbol-total-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/loguin.html',
  '/ajustes.html',
  '/pantalla de carga.html',
  '/estilo.css',
  '/styles.css',
  '/ajustes.css',
  '/cargando.css',
  '/mobile-styles.css',
  '/mobile-components.js',
  '/ajustes.js',
  '/cargando.js',
  '/img/logo_3-removebg-preview.png',
  '/img/logo_3-removebg-preview.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devolver desde cache si existe
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar la respuesta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Actualizar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de Futbol Total',
    icon: '/img/logo_3-removebg-preview.png',
    badge: '/img/logo_3-removebg-preview.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver más',
        icon: '/img/logo_3-removebg-preview.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/img/logo_3-removebg-preview.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Futbol Total', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Lógica para sincronizar datos cuando se recupere la conexión
  return fetch('/api/sync')
    .then(response => response.json())
    .then(data => {
      console.log('Sincronización completada:', data);
    })
    .catch(error => {
      console.error('Error en sincronización:', error);
    });
}
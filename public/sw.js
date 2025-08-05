// Service Worker mejorado para notificaciones gratuitas
const CACHE_NAME = 'fidelya-notifications-v1';
const urlsToCache = [
  '/favicon.ico',
  '/dashboard'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Manejo de push notifications mejorado
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received:', event);
  
  if (!event.data) {
    console.warn('⚠️ Push event without data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('📨 Push data:', data);
    
    // Extraer datos de la notificación
    const { notification, data: customData } = data;
    const title = notification?.title || data.title || 'Fidelya';
    const body = notification?.body || data.message || 'Nueva notificación';
    
    // Configurar opciones de la notificación
    const options = {
      body: body,
      icon: notification?.icon || '/favicon.ico',
      badge: notification?.badge || '/favicon.ico',
      tag: notification?.tag || customData?.notificationId || 'fidelya-notification',
      requireInteraction: customData?.priority === 'urgent',
      silent: false,
      vibrate: customData?.priority === 'urgent' ? [200, 100, 200, 100, 200] : [200, 100, 200],
      data: {
        ...customData,
        timestamp: Date.now(),
        actionUrl: customData?.actionUrl || notification?.click_action || '/dashboard'
      },
      actions: []
    };

    // Agregar acciones si hay URL de acción
    if (customData?.actionUrl || notification?.click_action) {
      options.actions = [
        {
          action: 'view',
          title: customData?.actionLabel || 'Ver más',
          icon: '/favicon.ico'
        },
        {
          action: 'dismiss',
          title: 'Descartar',
          icon: '/favicon.ico'
        }
      ];
    }

    // Mostrar la notificación
    event.waitUntil(
      self.registration.showNotification(title, options)
        .then(() => {
          console.log('✅ Push notification displayed successfully');
          
          // Enviar evento de entrega al servidor (opcional)
          if (customData?.trackingId) {
            fetch('/api/notifications/delivery-event', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                trackingId: customData.trackingId,
                event: 'delivered',
                timestamp: Date.now()
              })
            }).catch(console.error);
          }
        })
        .catch((error) => {
          console.error('❌ Error displaying push notification:', error);
        })
    );
  } catch (error) {
    console.error('❌ Error processing push notification:', error);
    
    // Mostrar notificación de fallback
    event.waitUntil(
      self.registration.showNotification('Fidelya', {
        body: 'Nueva notificación disponible',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'fidelya-fallback',
        data: { actionUrl: '/dashboard' }
      })
    );
  }
});

// Manejo de clicks en notificaciones mejorado
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event);
  
  const { notification, action } = event;
  const data = notification.data || {};
  
  // Cerrar la notificación
  notification.close();
  
  // Manejar acciones
  if (action === 'dismiss') {
    console.log('❌ Notification dismissed');
    return;
  }
  
  // Determinar URL a abrir
  let urlToOpen = '/dashboard';
  
  if (action === 'view' && data.actionUrl) {
    urlToOpen = data.actionUrl;
  } else if (data.actionUrl) {
    urlToOpen = data.actionUrl;
  }
  
  // Asegurar que la URL sea absoluta
  if (!urlToOpen.startsWith('http')) {
    urlToOpen = self.location.origin + (urlToOpen.startsWith('/') ? urlToOpen : '/' + urlToOpen);
  }
  
  console.log('🔗 Opening URL:', urlToOpen);
  
  // Abrir o enfocar ventana
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Buscar ventana existente con la URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            console.log('👁️ Focusing existing window');
            return client.focus();
          }
        }
        
        // Buscar cualquier ventana de la aplicación
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            console.log('🔄 Navigating existing window');
            client.postMessage({
              type: 'NAVIGATE',
              url: urlToOpen
            });
            return client.focus();
          }
        }
        
        // Abrir nueva ventana si no hay ninguna
        if (clients.openWindow) {
          console.log('🆕 Opening new window');
          return clients.openWindow(urlToOpen);
        }
      })
      .then(() => {
        // Enviar evento de click al servidor (opcional)
        if (data.trackingId) {
          fetch('/api/notifications/delivery-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trackingId: data.trackingId,
              event: 'clicked',
              timestamp: Date.now(),
              action: action || 'default'
            })
          }).catch(console.error);
        }
      })
      .catch((error) => {
        console.error('❌ Error handling notification click:', error);
      })
  );
});

// Manejo de cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification closed:', event);
  
  const data = event.notification.data || {};
  
  // Enviar evento de cierre al servidor (opcional)
  if (data.trackingId) {
    fetch('/api/notifications/delivery-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingId: data.trackingId,
        event: 'closed',
        timestamp: Date.now()
      })
    }).catch(console.error);
  }
});

// Manejo de mensajes desde la aplicación
self.addEventListener('message', (event) => {
  console.log('📬 Message received:', event.data);
  
  const { type } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_NOTIFICATIONS':
      // Limpiar todas las notificaciones
      self.registration.getNotifications()
        .then((notifications) => {
          notifications.forEach(notification => notification.close());
          console.log(`🧹 Cleared ${notifications.length} notifications`);
        })
        .catch(console.error);
      break;
      
    default:
      console.log('❓ Unknown message type:', type);
  }
});

// Manejo de fetch (cache de recursos)
self.addEventListener('fetch', (event) => {
  // Solo cachear recursos de la misma origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Solo cachear GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devolver desde cache si existe
        if (response) {
          return response;
        }
        
        // Fetch desde la red
        return fetch(event.request)
          .then((response) => {
            // Verificar si es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta
            const responseToCache = response.clone();
            
            // Agregar al cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch((error) => {
        console.error('❌ Fetch error:', error);
        
        // Devolver página offline si está disponible
        if (event.request.destination === 'document') {
          return caches.match('/dashboard');
        }
      })
  );
});

// Manejo de errores globales
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});

console.log('🚀 Service Worker loaded successfully');
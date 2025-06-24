// ===== SERVICE WORKER ULTRA OPTIMIZADO PARA STARFLEX =====
const CACHE_NAME = 'starflex-v1.0.0';
const STATIC_CACHE = 'starflex-static-v1.0.0';
const DYNAMIC_CACHE = 'starflex-dynamic-v1.0.0';

// Recursos críticos para cachear inmediatamente
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/assets/logo.avif',
    '/assets/logo.webp',
    '/assets/logo.png',
    '/assets/phones/Hero.avif',
    '/assets/phones/Hero.webp',
    '/assets/phones/Hero.jpg',
    '/assets/phones/Hero.mp4',
    '/manifest.json'
];

// Recursos de imágenes para cachear bajo demanda
const IMAGE_RESOURCES = [
    '/assets/phones/Horario.avif',
    '/assets/phones/Horario.webp',
    '/assets/phones/Horario.jpg',
    '/assets/phones/Estaciones.avif',
    '/assets/phones/Estaciones.webp',
    '/assets/phones/Estaciones.jpg',
    '/assets/phones/Calendario.avif',
    '/assets/phones/Calendario.webp',
    '/assets/phones/Calendario.jpg',
    '/assets/phones/Registro.avif',
    '/assets/phones/Registro.webp',
    '/assets/phones/Registro.jpg',
    '/assets/phones/Notificaciones.avif',
    '/assets/phones/Notificaciones.webp',
    '/assets/phones/Notificaciones.jpg',
    '/assets/phones/Referidos.avif',
    '/assets/phones/Referidos.webp',
    '/assets/phones/Referidos.jpg',
    '/assets/AppleStore.avif',
    '/assets/AppleStore.webp',
    '/assets/AppleStore.png',
    '/assets/GooglePlay.avif',
    '/assets/GooglePlay.webp',
    '/assets/GooglePlay.png'
];

// Recursos de video para cachear bajo demanda
const VIDEO_RESOURCES = [
    '/assets/StarFlex.mp4'
];

// ===== INSTALACIÓN DEL SERVICE WORKER =====
self.addEventListener('install', (event) => {
    console.log('SW: Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('SW: Cacheando recursos críticos...');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                console.log('SW: Recursos críticos cacheados exitosamente');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('SW: Error cacheando recursos críticos:', error);
            })
    );
});

// ===== ACTIVACIÓN DEL SERVICE WORKER =====
self.addEventListener('activate', (event) => {
    console.log('SW: Activando Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('SW: Eliminando cache obsoleto:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('SW: Service Worker activado');
                return self.clients.claim();
            })
    );
});

// ===== ESTRATEGIA DE FETCH ULTRA OPTIMIZADA =====
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo manejar requests del mismo origen
    if (url.origin !== location.origin) {
        return;
    }
    
    // Estrategia Cache First para recursos estáticos
    if (isCriticalResource(request.url) || isImageResource(request.url)) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // Estrategia Network First para videos
    if (isVideoResource(request.url)) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Estrategia Stale While Revalidate para el HTML principal
    if (request.mode === 'navigate') {
        event.respondWith(staleWhileRevalidateStrategy(request));
        return;
    }
    
    // Estrategia por defecto: Network First
    event.respondWith(networkFirstStrategy(request));
});

// ===== ESTRATEGIAS DE CACHING =====

// Cache First: Ideal para recursos estáticos que no cambian
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('SW: Error en Cache First:', error);
        return new Response('Recurso no disponible', { status: 503 });
    }
}

// Network First: Ideal para contenido dinámico
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('SW: Red no disponible, buscando en cache...');
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Contenido no disponible offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Stale While Revalidate: Ideal para HTML que puede cambiar
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Si falla la red, devolver la versión cacheada
        return cachedResponse;
    });
    
    // Devolver inmediatamente la versión cacheada si existe
    return cachedResponse || fetchPromise;
}

// ===== FUNCIONES AUXILIARES =====
function isCriticalResource(url) {
    return CRITICAL_RESOURCES.some(resource => url.includes(resource));
}

function isImageResource(url) {
    return IMAGE_RESOURCES.some(resource => url.includes(resource)) ||
           url.match(/\.(avif|webp|jpg|jpeg|png|gif|svg)$/i);
}

function isVideoResource(url) {
    return VIDEO_RESOURCES.some(resource => url.includes(resource)) ||
           url.match(/\.(mp4|webm|ogg|avi|mov)$/i);
}

// ===== LIMPIEZA AUTOMÁTICA DE CACHE =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanOldCaches();
    }
});

async function cleanOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        !name.includes('v1.0.0') && 
        (name.includes('starflex') || name.includes('STATIC') || name.includes('DYNAMIC'))
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    console.log('SW: Caches antiguos limpiados');
}

// ===== PRECARGA DE RECURSOS BAJO DEMANDA =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PRELOAD_IMAGES') {
        preloadImages();
    }
});

async function preloadImages() {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const imagePromises = IMAGE_RESOURCES.map(async (url) => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                }
            } catch (error) {
                console.warn('SW: No se pudo precargar imagen:', url);
            }
        });
        
        await Promise.all(imagePromises);
        console.log('SW: Imágenes precargadas exitosamente');
    } catch (error) {
        console.error('SW: Error precargando imágenes:', error);
    }
}

// ===== NOTIFICACIONES PUSH (PREPARADO PARA FUTURO) =====
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/icon-192.png',
            badge: '/assets/badge-72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ver más',
                    icon: '/assets/checkmark.png'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/assets/xmark.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// ===== MANEJO DE CLICS EN NOTIFICACIONES =====
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('https://starflexapp.com')
        );
    }
});

console.log('SW: Service Worker de StarFlex cargado exitosamente');

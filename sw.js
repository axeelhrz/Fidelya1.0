// ===== SERVICE WORKER ULTRA OPTIMIZADO PARA PERFORMANCE =====
const CACHE_NAME = 'starflex-v2.0.0';
const STATIC_CACHE = 'starflex-static-v2.0.0';
const DYNAMIC_CACHE = 'starflex-dynamic-v2.0.0';
const IMAGE_CACHE = 'starflex-images-v2.0.0';

// Recursos críticos para cachear inmediatamente
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/css/critical.css',
    '/js/script-optimized.js',
    '/assets/logo.avif',
    '/assets/logo.webp',
    '/assets/logo.png',
    '/assets/phones/Hero.avif',
    '/assets/phones/Hero.webp',
    '/assets/phones/Hero.jpg',
    '/manifest.json'
];

// Recursos de imágenes para cachear bajo demanda
const IMAGE_RESOURCES = [
    '/assets/phones/Horario.avif',
    '/assets/phones/Estaciones.avif',
    '/assets/phones/Calendario.avif',
    '/assets/phones/Registro.avif',
    '/assets/phones/Notificaciones.avif',
    '/assets/phones/Referidos.avif',
    '/assets/AppleStore.avif',
    '/assets/AppleStore.webp',
    '/assets/AppleStore.png',
    '/assets/GooglePlay.avif',
    '/assets/GooglePlay.webp',
    '/assets/GooglePlay.png'
];

// ===== INSTALACIÓN OPTIMIZADA =====
self.addEventListener('install', (event) => {
    console.log('SW: Instalando Service Worker optimizado...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('SW: Cacheando recursos críticos...');
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                console.log('SW: Recursos críticos cacheados');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('SW: Error cacheando recursos críticos:', error);
            })
    );
});

// ===== ACTIVACIÓN OPTIMIZADA =====
self.addEventListener('activate', (event) => {
    console.log('SW: Activando Service Worker...');
    
    event.waitUntil(
        Promise.all([
            // Limpiar caches antiguos
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== IMAGE_CACHE &&
                            cacheName.includes('starflex')) {
                            console.log('SW: Eliminando cache obsoleto:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Tomar control inmediatamente
            self.clients.claim()
        ]).then(() => {
            console.log('SW: Service Worker activado y optimizado');
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
    
    // Estrategia Cache First para recursos críticos
    if (isCriticalResource(request.url)) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
        return;
    }
    
    // Estrategia Cache First optimizada para imágenes
    if (isImageResource(request.url)) {
        event.respondWith(imageOptimizedStrategy(request));
        return;
    }
    
    // Estrategia Stale While Revalidate para HTML
    if (request.mode === 'navigate') {
        event.respondWith(staleWhileRevalidateStrategy(request));
        return;
    }
    
    // Estrategia Network First para otros recursos
    event.respondWith(networkFirstStrategy(request));
});

// ===== ESTRATEGIAS OPTIMIZADAS =====

// Cache First optimizado para recursos críticos
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('SW: Error en Cache First:', error);
        return new Response('Recurso no disponible', { status: 503 });
    }
}

// Estrategia optimizada para imágenes con compresión
async function imageOptimizedStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            
            // Solo cachear imágenes menores a 1MB
            const contentLength = networkResponse.headers.get('content-length');
            if (!contentLength || parseInt(contentLength) < 1048576) {
                cache.put(request, networkResponse.clone());
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.error('SW: Error cargando imagen:', error);
        return new Response('Imagen no disponible', { status: 503 });
    }
}

// Network First optimizado
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Contenido no disponible', { status: 503 });
    }
}

// Stale While Revalidate optimizado
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
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

// ===== LIMPIEZA AUTOMÁTICA DE CACHE =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanOldCaches();
    }
    
    if (event.data && event.data.type === 'PRELOAD_IMAGES') {
        preloadCriticalImages();
    }
});

async function cleanOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name.includes('starflex') && !name.includes('v2.0.0')
    );
    
    await Promise.all(oldCaches.map(name => caches.delete(name)));
    console.log('SW: Caches antiguos limpiados');
}

async function preloadCriticalImages() {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const criticalImages = [
            '/assets/phones/Hero.avif',
            '/assets/phones/Hero.webp',
            '/assets/phones/Hero.jpg',
            '/assets/logo.avif',
            '/assets/logo.webp',
            '/assets/logo.png'
        ];
        
        const imagePromises = criticalImages.map(async (url) => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                }
            } catch (error) {
                console.warn('SW: No se pudo precargar imagen crítica:', url);
            }
        });
        
        await Promise.all(imagePromises);
        console.log('SW: Imágenes críticas precargadas');
    } catch (error) {
        console.error('SW: Error precargando imágenes críticas:', error);
    }
}

console.log('SW: Service Worker optimizado de StarFlex cargado');
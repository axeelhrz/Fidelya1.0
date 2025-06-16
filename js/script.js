// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    // Configuración de animaciones
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    
    // Configuración de imágenes optimizadas
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
        WEBP: 'image/webp',
        JPEG: 'image/jpeg',
        PNG: 'image/png'
    },
    
    // Rutas de imágenes optimizadas
    IMAGE_PATHS: {
        hero: {
            avif: './assets/phones/Hero.avif',
            webp: './assets/phones/Hero.webp',
            jpg: './assets/phones/Hero.jpg'
        },
        logo: {
            avif: './assets/logo.avif',
            webp: './assets/logo.webp',
            png: './assets/logo.png'
        },
        phones: {
            horario: {
                avif: './assets/phones/Horario.avif',
                webp: './assets/phones/Horario.webp',
                jpg: './assets/phones/Horario.jpg'
            },
            estaciones: {
                avif: './assets/phones/Estaciones.avif',
                webp: './assets/phones/Estaciones.webp',
                jpg: './assets/phones/Estaciones.jpg'
            },
            calendario: {
                avif: './assets/phones/Calendario.avif',
                webp: './assets/phones/Calendario.webp',
                jpg: './assets/phones/Calendario.jpg'
            },
            registro: {
                avif: './assets/phones/Registro.avif',
                webp: './assets/phones/Registro.webp',
                jpg: './assets/phones/Registro.jpg'
            },
            notificaciones: {
                avif: './assets/phones/Notificaciones.avif',
                webp: './assets/phones/Notificaciones.webp',
                jpg: './assets/phones/Notificaciones.jpg'
            },
            referidos: {
                avif: './assets/phones/Referidos.avif',
                webp: './assets/phones/Referidos.webp',
                jpg: './assets/phones/Referidos.jpg'
            }
        },
        downloads: {
            apple: {
                avif: './assets/AppleStore.avif',
                webp: './assets/AppleStore.webp',
                png: './assets/AppleStore.png'
            },
            google: {
                avif: './assets/GooglePlay.avif',
                webp: './assets/GooglePlay.webp',
                png: './assets/GooglePlay.png'
            }
        }
    }
};

// ===== CLASE PARA OPTIMIZACIÓN DE IMÁGENES =====
class ImageOptimizer {
    constructor() {
        this.supportedFormats = new Set();
        this.imageCache = new Map();
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        
        this.init();
    }
    
    async init() {
        await this.detectFormatSupport();
        this.setupLazyLoading();
        this.preloadCriticalImages();
    }
    
    // Detectar soporte de formatos de imagen
    async detectFormatSupport() {
        const formats = [
            { type: 'avif', data: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=' },
            { type: 'webp', data: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA' }
        ];
        
        const promises = formats.map(format => 
            this.canUseFormat(format.data).then(supported => {
                if (supported) {
                    this.supportedFormats.add(format.type);
                }
            })
        );
        
        await Promise.all(promises);
        
        // Siempre agregar JPEG y PNG como fallbacks
        this.supportedFormats.add('jpeg');
        this.supportedFormats.add('png');
        
        console.log('Formatos soportados:', Array.from(this.supportedFormats));
    }
    
    // Verificar si el navegador puede usar un formato específico
    canUseFormat(dataUrl) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img.width > 0 && img.height > 0);
            img.onerror = () => resolve(false);
            img.src = dataUrl;
        });
    }
    
    // Obtener la mejor URL de imagen disponible
    getBestImageUrl(imageConfig) {
        if (this.supportedFormats.has('avif') && imageConfig.avif) {
            return imageConfig.avif;
        }
        if (this.supportedFormats.has('webp') && imageConfig.webp) {
            return imageConfig.webp;
        }
        return imageConfig.jpg || imageConfig.png;
    }
    
    // Configurar lazy loading con Intersection Observer
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.intersectionObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );
        }
    }
    
    // Cargar imagen optimizada
    async loadImage(element) {
        const imageKey = element.dataset.imageKey;
        const imageConfig = this.getImageConfig(imageKey);
        
        if (!imageConfig) {
            console.warn(`Configuración de imagen no encontrada para: ${imageKey}`);
            return;
        }
        
        const bestUrl = this.getBestImageUrl(imageConfig);
        
        try {
            // Mostrar estado de carga
            element.classList.add('loading');
            
            // Precargar la imagen
            await this.preloadImage(bestUrl);
            
            // Aplicar la imagen
            if (element.tagName === 'IMG') {
                element.src = bestUrl;
            } else {
                element.style.backgroundImage = `url('${bestUrl}')`;
            }
            
            // Remover estado de carga
            element.classList.remove('loading');
            element.classList.add('loaded');
            
            console.log(`Imagen cargada: ${imageKey} -> ${bestUrl}`);
            
        } catch (error) {
            console.error(`Error cargando imagen ${imageKey}:`, error);
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }
    
    // Precargar imagen
    preloadImage(url) {
        if (this.imageCache.has(url)) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(url, true);
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });
    }
    
    // Obtener configuración de imagen por clave
    getImageConfig(key) {
        const parts = key.split('.');
        let config = CONFIG.IMAGE_PATHS;
        
        for (const part of parts) {
            config = config[part];
            if (!config) return null;
        }
        
        return config;
    }
    
    // Precargar imágenes críticas
    async preloadCriticalImages() {
        const criticalImages = [
            'hero',
            'logo',
            'phones.horario'
        ];
        
        const preloadPromises = criticalImages.map(async (key) => {
            const config = this.getImageConfig(key);
            if (config) {
                const url = this.getBestImageUrl(config);
                try {
                    await this.preloadImage(url);
                    console.log(`Imagen crítica precargada: ${key} -> ${url}`);
                } catch (error) {
                    console.warn(`Error precargando imagen crítica ${key}:`, error);
                }
            }
        });
        
        await Promise.all(preloadPromises);
    }
    
    // Registrar imagen para lazy loading
    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.lazyImages.add(element);
        
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(element);
        } else {
            // Fallback para navegadores sin Intersection Observer
            this.loadImage(element);
        }
    }
    
    // Cargar imagen inmediatamente (para imágenes críticas)
    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
let imageOptimizer;

// ===== FUNCIONES DE INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar optimizador de imágenes
    imageOptimizer = new ImageOptimizer();
    
    // Inicializar otras funcionalidades
    initializeNavigation();
    initializeVideoPlayer();
    initializeFAQ();
    initializeFloatingWidget();
    initializeScrollEffects();
    initializeImageOptimization();
    
    // Configurar lazy loading para imágenes
    setupImageLazyLoading();
});

// ===== CONFIGURACIÓN DE LAZY LOADING PARA IMÁGENES =====
function setupImageLazyLoading() {
    // Esperar a que el optimizador esté listo
    const waitForOptimizer = () => {
        if (!imageOptimizer || !imageOptimizer.supportedFormats.size) {
            setTimeout(waitForOptimizer, 100);
            return;
        }
        
        // Configurar imagen del hero (crítica - cargar inmediatamente)
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroImage) {
            imageOptimizer.loadImageImmediately(heroImage, 'hero');
        }
        
        // Configurar imágenes de características (lazy loading)
        const featureImages = document.querySelectorAll('.phone__app-image');
        featureImages.forEach((img, index) => {
            const imageKeys = [
                'phones.horario',
                'phones.estaciones', 
                'phones.calendario',
                'phones.registro',
                'phones.notificaciones',
                'phones.referidos'
            ];
            
            if (imageKeys[index]) {
                imageOptimizer.observeImage(img, imageKeys[index]);
            }
        });
        
        // Configurar botones de descarga
        const appleBtn = document.querySelector('.download-btn--app-store .download-btn__image');
        const googleBtn = document.querySelector('.download-btn:not(.download-btn--app-store) .download-btn__image');
        
        if (appleBtn) {
            imageOptimizer.loadImageImmediately(appleBtn, 'downloads.apple');
        }
        if (googleBtn) {
            imageOptimizer.loadImageImmediately(googleBtn, 'downloads.google');
        }
    };
    
    waitForOptimizer();
}

// ===== NAVEGACIÓN MEJORADA =====
function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Scroll effect para header
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > CONFIG.SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateHeader, 10);
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    function openMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.classList.add('no-scroll');
        navToggle.setAttribute('aria-expanded', 'true');
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ===== REPRODUCTOR DE VIDEO MEJORADO =====
function initializeVideoPlayer() {
    const video = document.getElementById('main-video');
    const playOverlay = document.getElementById('play-overlay');
    const progressIndicators = document.querySelector('.videos__progress-indicators');
    const progressFill = document.querySelector('.videos__progress-fill');
    const currentTimeDisplay = document.querySelector('.videos__current-time');
    const durationDisplay = document.querySelector('.videos__duration');
    const progressBar = document.querySelector('.videos__progress-bar');
    
    if (!video || !playOverlay) return;
    
    let isPlaying = false;
    
    // Play/Pause functionality
    function togglePlay() {
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    }
    
    // Event listeners
    playOverlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    
    video.addEventListener('play', () => {
        isPlaying = true;
        playOverlay.classList.add('hidden');
        progressIndicators.classList.add('visible');
    });
    
    video.addEventListener('pause', () => {
        isPlaying = false;
        playOverlay.classList.remove('hidden');
    });
    
    video.addEventListener('ended', () => {
        isPlaying = false;
        playOverlay.classList.remove('hidden');
        progressIndicators.classList.remove('visible');
    });
    
    // Progress tracking
    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${progress}%`;
            
            currentTimeDisplay.textContent = formatTime(video.currentTime);
        }
    });
    
    video.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(video.duration);
    });
    
    // Progress bar click
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickTime = (clickX / width) * video.duration;
            video.currentTime = clickTime;
        });
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// ===== FAQ MEJORADO =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    const searchInput = document.getElementById('faq-search');
    const faqList = document.getElementById('faq-list');
    const noResults = document.getElementById('faq-no-results');
    
    // FAQ accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq__answer');
                        const otherQuestion = otherItem.querySelector('.faq__question');
                        if (otherAnswer) otherAnswer.classList.remove('active');
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answer.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
    
    // FAQ search functionality
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value.toLowerCase().trim());
            }, 300);
        });
    }
    
    function performSearch(query) {
        let visibleCount = 0;
        
        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq__question-text')?.textContent.toLowerCase() || '';
            const answerText = item.querySelector('.faq__answer-text')?.textContent.toLowerCase() || '';
            
            const isMatch = !query || 
                           questionText.includes(query) || 
                           answerText.includes(query);
            
            if (isMatch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
                const answer = item.querySelector('.faq__answer');
                const question = item.querySelector('.faq__question');
                if (answer) answer.classList.remove('active');
                if (question) question.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Show/hide no results message
        if (noResults) {
            if (visibleCount === 0 && query) {
                noResults.classList.add('show');
            } else {
                noResults.classList.remove('show');
            }
        }
    }
}

// ===== WIDGET FLOTANTE MEJORADO =====
function initializeFloatingWidget() {
    const widget = document.getElementById('floating-widget');
    const mainBtn = document.getElementById('floating-main-btn');
    const menu = document.getElementById('floating-menu');
    const languageToggle = document.getElementById('floating-language-toggle');
    const languageText = document.getElementById('floating-language-text');
    
    if (!widget || !mainBtn || !menu) return;
    
    let isMenuOpen = false;
    
    // Toggle menu
    mainBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            menu.classList.add('active');
            mainBtn.classList.add('active');
            mainBtn.setAttribute('aria-expanded', 'true');
        } else {
            menu.classList.remove('active');
            mainBtn.classList.remove('active');
            mainBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !widget.contains(e.target)) {
            menu.classList.remove('active');
            mainBtn.classList.remove('active');
            mainBtn.setAttribute('aria-expanded', 'false');
            isMenuOpen = false;
        }
    });
    
    // Language toggle functionality
    if (languageToggle && languageText) {
        let currentLang = 'ES';
        
        languageToggle.addEventListener('click', () => {
            currentLang = currentLang === 'ES' ? 'EN' : 'ES';
            languageText.textContent = currentLang;
            
            // Here you would implement actual language switching
            console.log(`Idioma cambiado a: ${currentLang}`);
        });
    }
}

// ===== EFECTOS DE SCROLL MEJORADOS =====
function initializeScrollEffects() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.feature, .contact__channel');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== OPTIMIZACIÓN DE IMÁGENES ADICIONAL =====
function initializeImageOptimization() {
    // Configurar logo con formato optimizado
    const logo = document.querySelector('.nav__logo');
    if (logo && imageOptimizer) {
        // Esperar a que el optimizador esté listo
        setTimeout(() => {
            const logoConfig = imageOptimizer.getImageConfig('logo');
            if (logoConfig) {
                const bestUrl = imageOptimizer.getBestImageUrl(logoConfig);
                logo.style.backgroundImage = `url('${bestUrl}')`;
                console.log(`Logo optimizado cargado: ${bestUrl}`);
            }
        }, 500);
    }
}

// ===== UTILIDADES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== MANEJO DE ERRORES GLOBAL =====
window.addEventListener('error', (e) => {
    console.error('Error global capturado:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada no manejada:', e.reason);
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Métricas de rendimiento:', {
                'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}

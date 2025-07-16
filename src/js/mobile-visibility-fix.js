// ===== MOBILE VISIBILITY FIX OPTIMIZADO =====
(function() {
    'use strict';
    
    // Configuración optimizada
    const CONFIG = {
        MOBILE_BREAKPOINT: 1024,
        RETRY_DELAY: 100,
        MAX_RETRIES: 3,
        OBSERVER_THROTTLE: 250
    };
    
    let retryCount = 0;
    let isInitialized = false;
    
    // Detección de dispositivo optimizada
    function isMobileDevice() {
        return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Función principal de corrección de visibilidad
    function ensureVisibility() {
        if (!isMobileDevice() || isInitialized) return;
        
        // Deshabilitar animaciones en dispositivos móviles
        disableAnimationsOnMobile();
        
        // Elementos críticos que deben ser visibles
        const criticalSelectors = [
            '.features', '.videos', '.faq', '.contact',
            '.contact__footer', '.contact__footer-content',
            '.contact__footer-text', '.contact__footer-cta',
            '.btn--footer', '.contact__channel',
            '.contact__channel-icon', '.contact__channel-content'
        ];
        
        const elements = document.querySelectorAll(criticalSelectors.join(', '));
        
        if (elements.length === 0 && retryCount < CONFIG.MAX_RETRIES) {
            retryCount++;
            setTimeout(ensureVisibility, CONFIG.RETRY_DELAY * retryCount);
            return;
        }
        
        // Aplicar estilos de visibilidad de forma eficiente
        const visibilityStyles = {
            display: 'block',
            visibility: 'visible',
            opacity: '1',
            transform: 'none',
            animation: 'none',
            position: 'relative'
        };
        
        const flexElements = [
            '.contact__footer-content', '.btn--footer', 
            '.contact__channel', '.contact__channel-icon'
        ];
        
        const gridElements = ['.contact__grid', '.features__grid', '.faq__list'];
        
        // Asegurar que el video móvil sea visible
        const mobileVideo = document.getElementById('hero-mobile-video');
        const mobileVideoContainer = document.querySelector('.hero__mobile-video');
        if (mobileVideo && mobileVideoContainer && isMobileDevice()) {
            mobileVideoContainer.style.display = 'block';
            mobileVideoContainer.style.visibility = 'visible';
            mobileVideoContainer.style.opacity = '1';
            
            // Intentar reproducir el video
            mobileVideo.muted = true;
            mobileVideo.autoplay = true;
            mobileVideo.loop = true;
            mobileVideo.playsInline = true;
            mobileVideo.play().catch(() => {});
        }

        elements.forEach(element => {
            // Aplicar estilos base
            Object.assign(element.style, visibilityStyles);
            
            // Aplicar display específico
            if (flexElements.some(sel => element.matches(sel))) {
                element.style.display = 'flex';
            } else if (gridElements.some(sel => element.matches(sel))) {
                element.style.display = 'grid';
            }
            
            // Configuraciones específicas
            if (element.matches('.contact__footer')) {
                element.style.zIndex = '10';
                element.style.minHeight = '120px';
                element.style.padding = '2rem 1rem';
                element.style.marginTop = '1.5rem';
            }
            
            if (element.matches('.contact__footer-content')) {
                element.style.flexDirection = 'column';
                element.style.gap = '1.5rem';
                element.style.textAlign = 'center';
                element.style.alignItems = 'center';
            }
            
            if (element.matches('.btn--footer')) {
                element.style.width = '100%';
                element.style.maxWidth = '280px';
                element.style.margin = '0 auto';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
                element.style.flexDirection = 'column';
            }
            
            if (element.matches('.contact__channel')) {
                element.style.flexDirection = 'column';
                element.style.alignItems = 'center';
                element.style.textAlign = 'center';
            }
            
            if (element.matches('.contact__channel-icon')) {
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
                element.style.margin = '0 auto 1rem auto';
            }
        });
        
        isInitialized = true;
    }
    
    // Nueva función para deshabilitar animaciones en móviles
    function disableAnimationsOnMobile() {
        if (!isMobileDevice()) return;
        
        // Agregar clase performance-mode al body para deshabilitar animaciones
        document.body.classList.add('performance-mode');
        
        // Agregar estilos CSS para deshabilitar todas las animaciones
        if (!document.getElementById('mobile-no-animations')) {
            const style = document.createElement('style');
            style.id = 'mobile-no-animations';
            style.textContent = `
                /* Desactivar todas las animaciones en móviles */
                .performance-mode * {
                    animation: none !important;
                    transition: none !important;
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0s !important;
                    transition-delay: 0s !important;
                }
                
                /* Desactivar clases de animación específicas */
                .performance-mode .animate-fadeIn,
                .performance-mode .animate-fadeInUp,
                .performance-mode .animate-fadeInDown,
                .performance-mode .animate-fadeInLeft,
                .performance-mode .animate-fadeInRight,
                .performance-mode .animate-slideInUp,
                .performance-mode .animate-slideInDown,
                .performance-mode .animate-slideInLeft,
                .performance-mode .animate-slideInRight,
                .performance-mode .animate-scaleIn,
                .performance-mode .animate-pulse,
                .performance-mode .animate-pulse-gentle,
                .performance-mode .animate-spin,
                .performance-mode .animate-spin-slow,
                .performance-mode .animate-bounce,
                .performance-mode .animate-bounce-gentle,
                .performance-mode .animate-float,
                .performance-mode .animate-shimmer,
                .performance-mode .animate-wave {
                    animation: none !important;
                    transform: none !important;
                    opacity: 1 !important;
                }
                
                /* Asegurar que elementos de navegación sean visibles inmediatamente */
                .performance-mode .nav__link,
                .performance-mode .nav__drawer-link,
                .performance-mode .nav__logo,
                .performance-mode .nav__drawer-logo {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                }
                
                /* Asegurar que elementos críticos sean visibles */
                .performance-mode .hero__title,
                .performance-mode .hero__subtitle,
                .performance-mode .hero__badge,
                .performance-mode .hero__cta-group,
                .performance-mode .feature,
                .performance-mode .feature__content,
                .performance-mode .feature__list-item,
                .performance-mode .faq__item,
                .performance-mode .contact__channel {
                    opacity: 1 !important;
                    transform: none !important;
                    animation: none !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remover clases de animación de elementos existentes
        const animatedElements = document.querySelectorAll('[class*="animate-"]');
        animatedElements.forEach(el => {
            const classList = el.className.split(' ');
            const newClassList = classList.filter(cls => !cls.startsWith('animate-'));
            el.className = newClassList.join(' ');
        });
    }
    
    // Función de inicialización optimizada
    function initialize() {
        if (!isMobileDevice()) return;
        
        // Deshabilitar animaciones inmediatamente
        disableAnimationsOnMobile();
        
        // Asegurar visibilidad
        ensureVisibility();
        
        // Observer optimizado solo si es necesario
        if ('MutationObserver' in window && !isInitialized) {
            const observer = new MutationObserver(function(mutations) {
                let shouldUpdate = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || 
                        (mutation.type === 'attributes' && 
                         ['style', 'class'].includes(mutation.attributeName))) {
                        shouldUpdate = true;
                    }
                });
                
                if (shouldUpdate) {
                    clearTimeout(observer.timeout);
                    observer.timeout = setTimeout(function() {
                        ensureVisibility();
                        disableAnimationsOnMobile(); // Re-aplicar desactivación de animaciones
                    }, CONFIG.OBSERVER_THROTTLE);
                }
            });
            
            // Observar solo elementos críticos
            const footer = document.querySelector('.contact__footer');
            const contact = document.querySelector('.contact');
            
            if (footer) {
                observer.observe(footer, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    attributeFilter: ['style', 'class']
                });
            }
            
            if (contact) {
                observer.observe(contact, {
                    attributes: true,
                    childList: true,
                    subtree: false,
                    attributeFilter: ['style', 'class']
                });
            }
            
            // Cleanup
            window.addEventListener('beforeunload', function() {
                observer.disconnect();
            });
        }
    }
    
    // Resize handler optimizado
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (isMobileDevice()) {
                disableAnimationsOnMobile();
                ensureVisibility();
            }
        }, CONFIG.OBSERVER_THROTTLE);
    }
    
    // Inicialización
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Event listeners optimizados
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            disableAnimationsOnMobile();
            initialize();
        }, 300);
    }, { passive: true });
    
    // Fallback para casos extremos
    setTimeout(function() {
        if (isMobileDevice() && !isInitialized) {
            disableAnimationsOnMobile();
            ensureVisibility();
        }
    }, 2000);
    
})();
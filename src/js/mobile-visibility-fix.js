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
    
    // Función de inicialización optimizada
    function initialize() {
        if (!isMobileDevice()) return;
        
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
                    observer.timeout = setTimeout(ensureVisibility, CONFIG.OBSERVER_THROTTLE);
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
        setTimeout(initialize, 300);
    }, { passive: true });
    
    // Fallback para casos extremos
    setTimeout(function() {
        if (isMobileDevice() && !isInitialized) {
            ensureVisibility();
        }
    }, 2000);
    
})();
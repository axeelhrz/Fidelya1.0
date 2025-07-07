// ===== MEJORA ESPECÍFICA DE SCROLL PARA MÓVILES =====

// Variables globales para el manejo de scroll móvil
let isScrollBlocked = false;
let scrollPosition = 0;
let touchStartY = 0;
let touchEndY = 0;

// ===== INICIALIZACIÓN DE MEJORAS DE SCROLL MÓVIL =====
function initializeMobileScrollEnhancements() {
    const isMobile = window.innerWidth <= 1023;
    
    if (!isMobile) return;
    
    console.log('Inicializando mejoras de scroll para móvil...');
    
    // Aplicar correcciones básicas
    applyBasicScrollFixes();
    
    // Configurar manejo de touch events
    setupTouchScrollHandling();
    
    // Configurar manejo del menú móvil
    setupMobileMenuScrollLock();
    
    // Corregir problemas específicos de iOS
    if (isIOS()) {
        applyIOSScrollFixes();
    }
    
    // Corregir problemas específicos de Android
    if (isAndroid()) {
        applyAndroidScrollFixes();
    }
    
    // Configurar observador de cambios de orientación
    setupOrientationChangeHandler();
    
    // Forzar scroll inicial
    forceInitialScroll();
    
    console.log('Mejoras de scroll móvil aplicadas correctamente');
}

// ===== CORRECCIONES BÁSICAS DE SCROLL =====
function applyBasicScrollFixes() {
    const html = document.documentElement;
    const body = document.body;
    
    // Asegurar propiedades básicas de scroll
    html.style.overflowX = 'hidden';
    html.style.overflowY = 'auto';
    html.style.webkitOverflowScrolling = 'touch';
    html.style.height = '100%';
    html.style.width = '100%';
    
    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
    body.style.webkitOverflowScrolling = 'touch';
    body.style.overscrollBehavior = 'contain';
    body.style.height = 'auto';
    body.style.minHeight = '100vh';
    body.style.width = '100%';
    body.style.position = 'relative';
    
    // Asegurar que todas las secciones sean visibles y scrolleables
    const sections = document.querySelectorAll('.hero, .features, .videos, .faq, .contact');
    sections.forEach(section => {
        section.style.position = 'relative';
        section.style.overflow = 'visible';
        section.style.height = 'auto';
        section.style.minHeight = 'auto';
        section.style.width = '100%';
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
        section.style.zIndex = 'auto';
        section.style.transform = 'none';
        section.style.willChange = 'auto';
    });
    
    // Corregir elementos que pueden interferir con el scroll
    const bgCanvas = document.querySelector('.bg-canvas');
    if (bgCanvas) {
        bgCanvas.style.position = 'fixed';
        bgCanvas.style.pointerEvents = 'none';
        bgCanvas.style.zIndex = '0';
        bgCanvas.style.overflow = 'hidden';
    }
    
    // Asegurar que el header no interfiera
    const header = document.querySelector('.header');
    if (header) {
        header.style.position = 'fixed';
        header.style.zIndex = '1000';
        header.style.pointerEvents = 'auto';
        header.style.overflow = 'visible';
    }
}

// ===== MANEJO DE TOUCH EVENTS PARA SCROLL =====
function setupTouchScrollHandling() {
    let isScrolling = false;
    
    // Prevenir problemas de scroll con touch
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (isScrollBlocked) {
            e.preventDefault();
            return;
        }
        
        touchEndY = e.touches[0].clientY;
        isScrolling = true;
        
        // Permitir scroll vertical normal
        const deltaY = touchStartY - touchEndY;
        
        // Prevenir scroll horizontal
        if (Math.abs(deltaY) < 10) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        isScrolling = false;
    }, { passive: true });
    
    // Mejorar scroll con wheel events en dispositivos que lo soporten
    document.addEventListener('wheel', (e) => {
        if (isScrollBlocked) {
            e.preventDefault();
            return;
        }
    }, { passive: false });
}

// ===== MANEJO DEL MENÚ MÓVIL Y BLOQUEO DE SCROLL =====
function setupMobileMenuScrollLock() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // Función para bloquear scroll
    function lockScroll() {
        scrollPosition = window.pageYOffset;
        isScrollBlocked = true;
        
        body.classList.add('no-scroll');
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
        body.style.width = '100%';
        body.style.height = '100%';
        body.style.overflow = 'hidden';
    }
    
    // Función para desbloquear scroll
    function unlockScroll() {
        isScrollBlocked = false;
        
        body.classList.remove('no-scroll');
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.height = '';
        body.style.overflow = '';
        
        // Restaurar posición de scroll
        window.scrollTo(0, scrollPosition);
    }
    
    // Observar cambios en el menú
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (navMenu.classList.contains('active')) {
                    lockScroll();
                } else {
                    unlockScroll();
                }
            }
        });
    });
    
    observer.observe(navMenu, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Cerrar menú al hacer scroll (si de alguna manera el scroll no está bloqueado)
    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('active') && !isScrollBlocked) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, { passive: true });
    
    // Hacer funciones globales
    window.lockMobileScroll = lockScroll;
    window.unlockMobileScroll = unlockScroll;
}

// ===== CORRECCIONES ESPECÍFICAS PARA IOS =====
function applyIOSScrollFixes() {
    const body = document.body;
    const html = document.documentElement;
    
    // Prevenir rebote en iOS
    body.style.overscrollBehavior = 'none';
    html.style.overscrollBehavior = 'none';
    
    // Corregir viewport en iOS
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    // Manejar cambios de orientación
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY);
            // Forzar recálculo de altura
            document.body.style.height = 'auto';
            document.body.style.minHeight = '100vh';
        }, 100);
    });
    
    // Prevenir zoom en inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type !== 'range') {
            input.style.fontSize = 'max(16px, 1rem)';
        }
    });
    
    // Corregir problemas con el teclado virtual
    window.addEventListener('resize', debounce(() => {
        if (document.activeElement && 
            (document.activeElement.tagName === 'INPUT' || 
             document.activeElement.tagName === 'TEXTAREA')) {
            setTimeout(() => {
                document.activeElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        }
    }, 150));
}

// ===== CORRECCIONES ESPECÍFICAS PARA ANDROID =====
function applyAndroidScrollFixes() {
    const body = document.body;
    
    // Optimizar para Chrome Android
    body.style.overscrollBehavior = 'contain';
    
    // Corregir problemas con el teclado virtual
    window.addEventListener('resize', debounce(() => {
        // Detectar si el teclado está abierto
        const heightDifference = window.innerHeight - document.documentElement.clientHeight;
        
        if (heightDifference > 150) { // Teclado probablemente abierto
            document.body.style.height = `${window.innerHeight}px`;
        } else {
            document.body.style.height = 'auto';
            document.body.style.minHeight = '100vh';
        }
    }, 100));
}

// ===== MANEJO DE CAMBIOS DE ORIENTACIÓN =====
function setupOrientationChangeHandler() {
    let orientationChangeTimeout;
    
    window.addEventListener('orientationchange', () => {
        clearTimeout(orientationChangeTimeout);
        
        orientationChangeTimeout = setTimeout(() => {
            // Recalcular dimensiones
            const isMobile = window.innerWidth <= 1023;
            
            if (isMobile) {
                // Forzar recálculo de scroll
                window.scrollTo(0, window.scrollY);
                
                // Recalcular altura del body
                document.body.style.height = 'auto';
                document.body.style.minHeight = '100vh';
                
                // Reaplicar correcciones básicas
                applyBasicScrollFixes();
            }
        }, 500);
    });
}

// ===== FORZAR SCROLL INICIAL =====
function forceInitialScroll() {
    // Asegurar que el scroll funcione desde el inicio
    setTimeout(() => {
        window.scrollTo(0, 0);
        
        // Verificar que el scroll funciona
        setTimeout(() => {
            window.scrollTo(0, 1);
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);
        }, 100);
    }, 100);
}

// ===== FUNCIONES DE DETECCIÓN =====
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

// ===== UTILIDAD DEBOUNCE =====
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

// ===== FUNCIÓN DE DIAGNÓSTICO =====
function diagnoseScrollIssues() {
    const isMobile = window.innerWidth <= 1023;
    
    if (!isMobile) return;
    
    console.log('=== DIAGNÓSTICO DE SCROLL MÓVIL ===');
    console.log('Ancho de ventana:', window.innerWidth);
    console.log('Alto de ventana:', window.innerHeight);
    console.log('Scroll Y actual:', window.scrollY);
    console.log('Altura del body:', document.body.scrollHeight);
    console.log('Overflow X del body:', getComputedStyle(document.body).overflowX);
    console.log('Overflow Y del body:', getComputedStyle(document.body).overflowY);
    console.log('Position del body:', getComputedStyle(document.body).position);
    console.log('Menú móvil activo:', document.querySelector('.nav__menu')?.classList.contains('active'));
    console.log('Scroll bloqueado:', isScrollBlocked);
    
    // Verificar elementos problemáticos
    const problematicElements = document.querySelectorAll('*');
    let elementsWithFixedPosition = 0;
    let elementsWithOverflow = 0;
    
    problematicElements.forEach(el => {
        const styles = getComputedStyle(el);
        if (styles.position === 'fixed') elementsWithFixedPosition++;
        if (styles.overflow === 'hidden') elementsWithOverflow++;
    });
    
    console.log('Elementos con position fixed:', elementsWithFixedPosition);
    console.log('Elementos con overflow hidden:', elementsWithOverflow);
    console.log('=== FIN DIAGNÓSTICO ===');
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
        initializeMobileScrollEnhancements();
        
        // Diagnóstico opcional (solo en desarrollo)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(diagnoseScrollIssues, 1000);
        }
    }
});

// ===== MANEJO DE RESIZE =====
window.addEventListener('resize', debounce(() => {
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
        applyBasicScrollFixes();
    }
}, 250));

// ===== EXPORTAR FUNCIONES PARA USO GLOBAL =====
window.initializeMobileScrollEnhancements = initializeMobileScrollEnhancements;
window.diagnoseScrollIssues = diagnoseScrollIssues;

console.log('Sistema de mejora de scroll móvil cargado correctamente');

// ===== MEJORAS DE SCROLL PARA STARFLEX =====

// Variables globales para scroll
let isScrolling = false;
let scrollTimeout;
let lastScrollTop = 0;
let scrollDirection = 'up';

// ===== INICIALIZACIÓN DE MEJORAS DE SCROLL =====
function initializeScrollEnhancements() {
    // Detectar capacidades del dispositivo
    const isMobile = window.innerWidth <= 1023;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Aplicar correcciones específicas
    if (isMobile) {
        applyMobileScrollFixes();
    }
    
    if (isIOS) {
        applyIOSScrollFixes();
    }
    
    if (isAndroid) {
        applyAndroidScrollFixes();
    }
    
    // Configurar scroll suave mejorado
    setupSmoothScroll();
    
    // Configurar detección de dirección de scroll
    setupScrollDirection();
    
    // Configurar prevención de scroll horizontal
    preventHorizontalScroll();
    
    // Configurar manejo del menú móvil
    setupMobileMenuScrollHandling();
    
    console.log('Mejoras de scroll inicializadas correctamente');
}

// ===== CORRECCIONES ESPECÍFICAS PARA MÓVIL =====
function applyMobileScrollFixes() {
    const body = document.body;
    const html = document.documentElement;
    
    // Optimizar scroll táctil
    body.style.webkitOverflowScrolling = 'touch';
    body.style.overscrollBehavior = 'contain';
    
    // Prevenir zoom en inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type !== 'range') {
            input.style.fontSize = 'max(16px, 1rem)';
        }
    });
    
    // Optimizar elementos para scroll móvil
    const sections = document.querySelectorAll('.hero, .features, .videos, .faq, .contact');
    sections.forEach(section => {
        section.style.transform = 'translateZ(0)';
        section.style.backfaceVisibility = 'hidden';
    });
}

// ===== CORRECCIONES ESPECÍFICAS PARA IOS =====
function applyIOSScrollFixes() {
    const body = document.body;
    
    // Prevenir rebote en iOS
    body.style.overscrollBehavior = 'none';
    body.style.webkitOverflowScrolling = 'touch';
    
    // Corrección para el viewport en iOS
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
    
    // Manejar cambios de orientación
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY);
        }, 100);
    });
}

// ===== CORRECCIONES ESPECÍFICAS PARA ANDROID =====
function applyAndroidScrollFixes() {
    const body = document.body;
    
    // Optimizar para Chrome Android
    body.style.overscrollBehavior = 'contain';
    
    // Prevenir problemas con el teclado virtual
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

// ===== CONFIGURACIÓN DE SCROLL SUAVE MEJORADO =====
function setupSmoothScroll() {
    // Verificar soporte para scroll-behavior
    const supportsScrollBehavior = 'scrollBehavior' in document.documentElement.style;
    
    if (!supportsScrollBehavior) {
        // Polyfill para scroll suave
        implementSmoothScrollPolyfill();
    }
    
    // Configurar enlaces de navegación
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScrollClick);
    });
    
    // Configurar logo como enlace al inicio
    const logo = document.querySelector('.nav__logo');
    if (logo) {
        logo.addEventListener('click', () => {
            smoothScrollToTop();
        });
    }
}

// ===== MANEJO DE CLICKS PARA SCROLL SUAVE =====
function handleSmoothScrollClick(e) {
    e.preventDefault();
    
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        // Cerrar menú móvil si está abierto
        const mobileMenu = document.getElementById('nav-menu');
        const body = document.body;
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
            
            // Esperar a que se cierre el menú antes de hacer scroll
            setTimeout(() => {
                smoothScrollToElement(targetElement);
            }, 300);
        } else {
            smoothScrollToElement(targetElement);
        }
        
        // Actualizar enlace activo
        updateActiveNavLink(e.currentTarget);
    }
}

// ===== SCROLL SUAVE A ELEMENTO =====
function smoothScrollToElement(element) {
    const headerHeight = window.innerWidth <= 1023 ? 70 : 75;
    const targetPosition = element.offsetTop - headerHeight;
    
    // Usar scroll nativo si está disponible
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Usar animación personalizada
        animateScrollTo(targetPosition);
    }
}

// ===== SCROLL SUAVE AL INICIO =====
function smoothScrollToTop() {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        animateScrollTo(0);
    }
}

// ===== ANIMACIÓN PERSONALIZADA DE SCROLL =====
function animateScrollTo(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) / 2, 1000); // Máximo 1 segundo
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Función de easing suave
        const ease = easeInOutCubic(progress);
        const currentPosition = startPosition + (distance * ease);
        
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// ===== FUNCIÓN DE EASING =====
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// ===== POLYFILL PARA SCROLL SUAVE =====
function implementSmoothScrollPolyfill() {
    // Implementación básica para navegadores que no soportan scroll-behavior
    const originalScrollTo = window.scrollTo;
    
    window.scrollTo = function(x, y) {
        if (typeof x === 'object' && x.behavior === 'smooth') {
            animateScrollTo(x.top || 0);
        } else {
            originalScrollTo.call(this, x, y);
        }
    };
}

// ===== DETECCIÓN DE DIRECCIÓN DE SCROLL =====
function setupScrollDirection() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollDirection();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function updateScrollDirection() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > lastScrollTop) {
        scrollDirection = 'down';
    } else {
        scrollDirection = 'up';
    }
    
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    
    // Actualizar clases en el body para CSS
    document.body.classList.toggle('scrolling-down', scrollDirection === 'down');
    document.body.classList.toggle('scrolling-up', scrollDirection === 'up');
}

// ===== PREVENCIÓN DE SCROLL HORIZONTAL =====
function preventHorizontalScroll() {
    // Detectar y corregir elementos que causan scroll horizontal
    function checkForHorizontalOverflow() {
        const body = document.body;
        const html = document.documentElement;
        
        const bodyScrollWidth = body.scrollWidth;
        const htmlScrollWidth = html.scrollWidth;
        const windowWidth = window.innerWidth;
        
        if (bodyScrollWidth > windowWidth || htmlScrollWidth > windowWidth) {
            console.warn('Detectado scroll horizontal. Aplicando correcciones...');
            
            // Aplicar correcciones
            body.style.overflowX = 'hidden';
            html.style.overflowX = 'hidden';
            
            // Buscar elementos problemáticos
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.right > windowWidth) {
                    element.style.maxWidth = '100%';
                    element.style.overflowX = 'hidden';
                }
            });
        }
    }
    
    // Verificar al cargar y al redimensionar
    checkForHorizontalOverflow();
    window.addEventListener('resize', debounce(checkForHorizontalOverflow, 250));
}

// ===== MANEJO DEL MENÚ MÓVIL Y SCROLL =====
function setupMobileMenuScrollHandling() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // Guardar posición de scroll al abrir menú
    let scrollPosition = 0;
    
    navToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    function openMobileMenu() {
        // Guardar posición actual
        scrollPosition = window.pageYOffset;
        
        // Bloquear scroll del body
        body.classList.add('no-scroll');
        body.style.top = `-${scrollPosition}px`;
        
        // Activar menú
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
    }
    
    function closeMobileMenu() {
        // Restaurar scroll del body
        body.classList.remove('no-scroll');
        body.style.top = '';
        
        // Restaurar posición de scroll
        window.scrollTo(0, scrollPosition);
        
        // Desactivar menú
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Hacer funciones globales para uso en otros scripts
    window.closeMobileMenu = closeMobileMenu;
    window.openMobileMenu = openMobileMenu;
}

// ===== ACTUALIZACIÓN DE ENLACE ACTIVO =====
function updateActiveNavLink(activeLink) {
    const allLinks = document.querySelectorAll('.nav__link');
    allLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
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

// ===== CORRECCIÓN DE PROBLEMAS DE ALTURA EN MÓVILES =====
function fixMobileViewportHeight() {
    // Corrección para 100vh en móviles
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', debounce(setVH, 100));
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
}

// ===== OPTIMIZACIÓN DE RENDIMIENTO PARA SCROLL =====
function optimizeScrollPerformance() {
    // Optimizar elementos que pueden causar lag durante el scroll
    const elementsToOptimize = document.querySelectorAll(
        '.hero__phone, .feature__phone, .contact__channel, .floating-widget'
    );
    
    elementsToOptimize.forEach(element => {
        element.style.transform = 'translateZ(0)';
        element.style.backfaceVisibility = 'hidden';
        element.style.willChange = 'transform';
    });
    
    // Optimizar imágenes para scroll
    const images = document.querySelectorAll('img, video');
    images.forEach(media => {
        media.style.transform = 'translateZ(0)';
    });
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollEnhancements();
    fixMobileViewportHeight();
    optimizeScrollPerformance();
});

// ===== MANEJO DE RESIZE =====
window.addEventListener('resize', debounce(() => {
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
        applyMobileScrollFixes();
    }
    
    // Recalcular optimizaciones
    optimizeScrollPerformance();
}, 250));

// ===== EXPORTAR FUNCIONES PARA USO GLOBAL =====
window.smoothScrollToElement = smoothScrollToElement;
window.smoothScrollToTop = smoothScrollToTop;
window.updateActiveNavLink = updateActiveNavLink;

console.log('Sistema de scroll mejorado cargado correctamente');

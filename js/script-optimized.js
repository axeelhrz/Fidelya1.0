// ===== SCRIPT ULTRA OPTIMIZADO PARA CORE WEB VITALS =====

// Variables globales optimizadas
let isMenuOpen = false;
let isFloatingMenuOpen = false;
let isLanguageSwitcherOpen = false;
let currentLanguage = 'es';
let imageOptimizer = null;

// Configuración optimizada
const CONFIG = {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 150,
    THROTTLE_DELAY: 16,
    
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
        WEBP: 'image/webp',
        JPEG: 'image/jpeg'
    }
};

// ===== OPTIMIZADOR DE IMÁGENES SIMPLIFICADO =====
class ImageOptimizer {
    constructor() {
        this.supportedFormats = new Set(['jpeg', 'png']);
        this.init();
    }
    
    init() {
        // Detectar formatos soportados usando las clases del HTML
        if (document.documentElement.classList.contains('avif')) {
            this.supportedFormats.add('avif');
        }
        if (document.documentElement.classList.contains('webp')) {
            this.supportedFormats.add('webp');
        }
        
        this.setupLazyLoading();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Observar imágenes lazy
            document.querySelectorAll('img[data-src]').forEach(img => {
                observer.observe(img);
            });
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }
}

// ===== FUNCIONES DE NAVEGACIÓN OPTIMIZADAS =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const navLogo = document.querySelector('.nav__logo');
    
    // Logo click handler
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            if (isMenuOpen) closeMobileMenu();
            smoothScrollTo(0);
        });
        
        navLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLogo.click();
            }
        });
    }
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isMenuOpen) closeMobileMenu();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = window.innerWidth <= 768 ? 70 : 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                smoothScrollTo(targetPosition);
                updateActiveNavLink(link);
            }
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            e.preventDefault();
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    if (isMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = true;
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    document.body.classList.add('no-scroll');
    
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    // Focus first link after animation
    setTimeout(() => {
        const firstLink = navMenu.querySelector('.nav__link');
        if (firstLink) firstLink.focus();
    }, CONFIG.ANIMATION_DURATION);
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = false;
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    navToggle.focus();
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');
}

// ===== SMOOTH SCROLL OPTIMIZADO =====
function smoothScrollTo(targetPosition) {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback para navegadores sin soporte
        window.scrollTo(0, targetPosition);
    }
}

// ===== SELECTOR DE IDIOMA OPTIMIZADO =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcher = document.getElementById('language-switcher');
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    
    if (!languageSwitcherBtn || !languageSwitcher) return;
    
    languageSwitcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLanguageSwitcher();
    });
    
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = option.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
                closeLanguageSwitcher();
            }
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (isLanguageSwitcherOpen && !languageSwitcher.contains(e.target)) {
            closeLanguageSwitcher();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLanguageSwitcherOpen) {
            closeLanguageSwitcher();
        }
    });
}

function toggleLanguageSwitcher() {
    if (isLanguageSwitcherOpen) {
        closeLanguageSwitcher();
    } else {
        openLanguageSwitcher();
    }
}

function openLanguageSwitcher() {
    const languageSwitcher = document.getElementById('language-switcher');
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    
    if (!languageSwitcher || !languageSwitcherBtn) return;
    
    isLanguageSwitcherOpen = true;
    languageSwitcher.classList.add('active');
    languageSwitcherBtn.setAttribute('aria-expanded', 'true');
}

function closeLanguageSwitcher() {
    const languageSwitcher = document.getElementById('language-switcher');
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    
    if (!languageSwitcher || !languageSwitcherBtn) return;
    
    isLanguageSwitcherOpen = false;
    languageSwitcher.classList.remove('active');
    languageSwitcherBtn.setAttribute('aria-expanded', 'false');
}

function switchLanguage(newLanguage) {
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    // Update language switcher text
    const languageSwitcherText = document.getElementById('language-switcher-text');
    if (languageSwitcherText) {
        languageSwitcherText.textContent = newLanguage.toUpperCase();
    }
    
    // Update active option
    document.querySelectorAll('.language-switcher__option').forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    document.documentElement.lang = newLanguage;
}

// ===== WIDGET FLOTANTE OPTIMIZADO =====
function initializeFloatingWidget() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    floatingMainBtn.addEventListener('click', () => {
        toggleFloatingMenu();
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        const floatingWidget = document.getElementById('floating-widget');
        if (isFloatingMenuOpen && floatingWidget && !floatingWidget.contains(e.target)) {
            closeFloatingMenu();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFloatingMenuOpen) {
            closeFloatingMenu();
        }
    });
}

function toggleFloatingMenu() {
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    } else {
        openFloatingMenu();
    }
}

function openFloatingMenu() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    isFloatingMenuOpen = true;
    floatingMainBtn.classList.add('active');
    floatingMenu.classList.add('active');
    floatingMainBtn.setAttribute('aria-expanded', 'true');
}

function closeFloatingMenu() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    isFloatingMenuOpen = false;
    floatingMainBtn.classList.remove('active');
    floatingMenu.classList.remove('active');
    floatingMainBtn.setAttribute('aria-expanded', 'false');
}

// ===== SCROLL EFFECTS OPTIMIZADOS =====
function initializeScrollEffects() {
    let ticking = false;
    
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink && !activeLink.classList.contains('active')) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// ===== OPTIMIZACIÓN DE RESIZE =====
function initializeResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMenuOpen && window.innerWidth > 1024) {
                closeMobileMenu();
            }
            if (isFloatingMenuOpen) {
                closeFloatingMenu();
            }
            if (isLanguageSwitcherOpen) {
                closeLanguageSwitcher();
            }
        }, 250);
    });
}

// ===== INICIALIZACIÓN PRINCIPAL OPTIMIZADA =====
function initializeApp() {
    console.log('🚀 Inicializando StarFlex Landing Page Optimizada...');
    
    // Inicializar componentes críticos
    initializeNavigation();
    initializeLanguageSwitcher();
    initializeFloatingWidget();
    
    // Usar requestIdleCallback para componentes menos críticos
    const initializeNonCritical = () => {
        imageOptimizer = new ImageOptimizer();
        initializeScrollEffects();
        initializeResizeHandler();
        
        // Cargar idioma guardado
        const savedLanguage = localStorage.getItem('starflex-language');
        if (savedLanguage && savedLanguage !== currentLanguage) {
            switchLanguage(savedLanguage);
        }
    };
    
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initializeNonCritical);
    } else {
        setTimeout(initializeNonCritical, 100);
    }
    
    console.log('✅ StarFlex Landing Page Optimizada inicializada');
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error capturado:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});

// ===== INICIALIZACIÓN =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===== EXPORTAR PARA DEBUGGING =====
window.StarFlexDebug = {
    imageOptimizer,
    toggleMobileMenu,
    switchLanguage,
    currentLanguage,
    isMenuOpen,
    isFloatingMenuOpen,
    isLanguageSwitcherOpen
};
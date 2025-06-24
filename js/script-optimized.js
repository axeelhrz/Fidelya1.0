// ===== JAVASCRIPT ULTRA OPTIMIZADO - SOLO FUNCIONALIDAD CRÍTICA =====

// Variables globales mínimas
let isMenuOpen = false;
let currentLanguage = 'es';

// Configuración optimizada
const CONFIG = {
    ANIMATION_DURATION: 300,
    IMAGE_FORMATS: ['avif', 'webp', 'jpg', 'png']
};

// Traducciones mínimas
const translations = {
    es: {
        'nav-home': 'Inicio',
        'nav-features': 'Características',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contacto'
    },
    en: {
        'nav-home': 'Home',
        'nav-features': 'Features',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contact'
    }
};

// ===== OPTIMIZACIÓN DE IMÁGENES CRÍTICAS =====
class CriticalImageOptimizer {
    constructor() {
        this.supportedFormats = new Set();
        this.init();
    }
    
    init() {
        this.detectFormats();
        this.optimizeCriticalImages();
    }
    
    detectFormats() {
        const html = document.documentElement;
        if (html.classList.contains('avif')) this.supportedFormats.add('avif');
        if (html.classList.contains('webp')) this.supportedFormats.add('webp');
        this.supportedFormats.add('jpg');
    }
    
    optimizeCriticalImages() {
        // Optimizar logo
        const logo = document.querySelector('.nav__logo');
        if (logo) {
            const logoSrc = this.getBestFormat('logo');
            logo.style.backgroundImage = `url('${logoSrc}')`;
        }
        
        // Optimizar imágenes de descarga
        this.optimizeDownloadButtons();
    }
    
    getBestFormat(imageKey) {
        const basePath = './assets/';
        const paths = {
            logo: {
                avif: `${basePath}logo.avif`,
                webp: `${basePath}logo.webp`,
                jpg: `${basePath}logo.png`
            }
        };
        
        const imagePaths = paths[imageKey];
        if (!imagePaths) return '';
        
        if (this.supportedFormats.has('avif') && imagePaths.avif) return imagePaths.avif;
        if (this.supportedFormats.has('webp') && imagePaths.webp) return imagePaths.webp;
        return imagePaths.jpg;
    }
    
    optimizeDownloadButtons() {
        const downloadImages = document.querySelectorAll('.download-btn__image');
        downloadImages.forEach((img, index) => {
            const imageType = index === 0 ? 'google' : 'apple';
            const optimizedSrc = this.getDownloadButtonSrc(imageType);
            if (optimizedSrc) {
                img.src = optimizedSrc;
            }
        });
    }
    
    getDownloadButtonSrc(type) {
        const basePath = './assets/';
        const paths = {
            google: {
                avif: `${basePath}GooglePlay.avif`,
                webp: `${basePath}GooglePlay.webp`,
                jpg: `${basePath}GooglePlay.png`
            },
            apple: {
                avif: `${basePath}AppleStore.avif`,
                webp: `${basePath}AppleStore.webp`,
                jpg: `${basePath}AppleStore.png`
            }
        };
        
        const imagePaths = paths[type];
        if (!imagePaths) return '';
        
        if (this.supportedFormats.has('avif') && imagePaths.avif) return imagePaths.avif;
        if (this.supportedFormats.has('webp') && imagePaths.webp) return imagePaths.webp;
        return imagePaths.jpg;
    }
}

// ===== NAVEGACIÓN CRÍTICA =====
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
    }
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (isMenuOpen) closeMobileMenu();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = window.innerWidth <= 768 ? 70 : 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                smoothScrollTo(targetPosition);
            }
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
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
}

// ===== SMOOTH SCROLL OPTIMIZADO =====
function smoothScrollTo(targetPosition) {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback para navegadores antiguos
        window.scrollTo(0, targetPosition);
    }
}

// ===== SELECTOR DE IDIOMA CRÍTICO =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    
    if (!languageSwitcherBtn) return;
    
    languageSwitcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const switcher = document.getElementById('language-switcher');
        if (switcher) {
            switcher.classList.toggle('active');
        }
    });
    
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = option.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
            }
        });
    });
}

function switchLanguage(newLanguage) {
    if (!translations[newLanguage]) return;
    
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    // Aplicar traducciones críticas
    const currentTranslations = translations[currentLanguage];
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = currentTranslations[key];
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Actualizar selector de idioma
    const languageSwitcherText = document.getElementById('language-switcher-text');
    if (languageSwitcherText) {
        languageSwitcherText.textContent = newLanguage.toUpperCase();
    }
    
    // Cerrar dropdown
    const switcher = document.getElementById('language-switcher');
    if (switcher) {
        switcher.classList.remove('active');
    }
}

// ===== LAZY LOADING DE CONTENIDO NO CRÍTICO =====
function initializeLazyContent() {
    // Cargar contenido no crítico después de que se complete el LCP
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            loadNonCriticalContent();
        });
    } else {
        setTimeout(loadNonCriticalContent, 2000);
    }
}

function loadNonCriticalContent() {
    // Cargar CSS no crítico si no se ha cargado
    const criticalCSS = document.querySelector('link[href*="style.css"]');
    if (!criticalCSS) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/style.css';
        document.head.appendChild(link);
    }
    
    // Cargar JavaScript no crítico
    const script = document.createElement('script');
    script.src = 'js/script.js';
    script.defer = true;
    document.body.appendChild(script);
}

// ===== INICIALIZACIÓN CRÍTICA =====
function initializeCriticalApp() {
    // Solo funcionalidad crítica para el LCP
    const imageOptimizer = new CriticalImageOptimizer();
    initializeNavigation();
    initializeLanguageSwitcher();
    
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('starflex-language');
    if (savedLanguage && translations[savedLanguage]) {
        switchLanguage(savedLanguage);
    }
    
    // Inicializar lazy loading después del LCP
    initializeLazyContent();
}

// ===== INICIALIZACIÓN INMEDIATA =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCriticalApp);
} else {
    initializeCriticalApp();
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error crítico:', e.error);
});

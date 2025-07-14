// ===== VARIABLES GLOBALES OPTIMIZADAS =====
let isMenuOpen = false;
let isMobileMenuOpen = false;
let currentFeature = 0;
let currentLanguage = 'es';
let isFloatingMenuOpen = false;
let isLanguageSwitcherOpen = false;
let lastScrollY = 0;
let isScrollingDown = false;
let ticking = false;
let isNavbarVisible = true;
let isMobile = window.innerWidth <= 1023;
let isReducedMotion = false;
let performanceMode = false;

// ===== CONFIGURACIÓN GLOBAL OPTIMIZADA =====
const CONFIG = {
    ANIMATION_DURATION: isMobile ? 150 : 250,
    SCROLL_THRESHOLD: isMobile ? 20 : 30,
    
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
        WEBP: 'image/webp',
        JPEG: 'image/jpeg',
        PNG: 'image/png'
    },
    
    IMAGE_PATHS: {
        hero: { avif: './assets/phones/Hero.avif' },
        logo: { avif: './assets/logo.avif' },
        phones: {
            horario: { avif: './assets/phones/Schedule.avif' },
            estaciones: { avif: './assets/phones/Stations.avif' },
            calendario: { avif: './assets/phones/Calendar.avif' },
            registro: { avif: './assets/phones/Log.avif' },
            notificaciones: { avif: './assets/phones/Notifications.avif' },
            referidos: { avif: './assets/phones/Referrals.avif' }
        },
        downloads: {
            apple: { png: './assets/AppleStore.png' },
            google: { png: './assets/GooglePlay.png' }
        }
    }
};

// ===== SISTEMA DE TRADUCCIONES OPTIMIZADO =====
const translationData = {
    es: {
        'page-title': 'StarFlex - Automatiza tus Bloques de Amazon Flex | Prueba Gratis',
        'page-description': 'Starflex revoluciona Amazon Flex. Automatización inteligente de bloques, optimización de horarios y máximas ganancias. Únete a +15,000 conductores exitosos.',
        'nav-home': 'Inicio',
        'nav-features': 'Características',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contacto',
        'nav-cta': 'Comienza tu prueba gratuita',
        'hero-badge': 'Next-Gen Amazon Flex Revolution',
        'hero_title--main': 'DOMINA LOS',
        'hero_title--highlight': 'BLOQUES DE',
        'hero_title--amazon': 'AMAZON FLEX',
        'hero-company-description': 'Somos una empresa dedicada a mejorar la experiencia laboral de los conductores de Amazon Flex permitiendo seleccionar de forma automática y eficiente los mejores bloques de su preferencia.',
        'hero-subtitle': 'Automatización inteligente de última generación que multiplica tus ganancias. La plataforma más avanzada para conductores profesionales del futuro.',
        'hero-cta-main': 'PRUEBA <strong>GRATUITA</strong>',
        'hero-cta-trial': '3 DÍAS GRATIS',
        'hero-trust': 'Más de 15,000 conductores han transformado sus ganancias',
        'features-title': 'Características',
        'features-subtitle': 'Descubre todas las funcionalidades que StarFlex te ofrece para maximizar tus ganancias.',
        'feature-schedule-title': 'HORARIO',
        'feature-schedule-description': 'Elige los días y horarios que prefieras para tus bloques de entrega. Configura tu disponibilidad de manera inteligente y deja que StarFlex encuentre los mejores bloques en tus horarios preferidos.',
        'feature-stations-title': 'ESTACIONES',
        'feature-stations-description': 'Selecciona tus estaciones preferidas y configura precios mínimos para que nuestra aplicación pueda ofrecerte automáticamente los bloques que se ajusten perfectamente a tus preferencias y ubicación.',
        'feature-calendar-title': 'CALENDARIO',
        'feature-calendar-description': 'En el calendario podrás ver todos tus bloques aceptados y acceder a funciones avanzadas como identificación desde cualquier ubicación, opción de saltar la selfie y cancelación rápida de bloques.',
        'feature-log-title': 'REGISTRO',
        'feature-log-description': 'En el registro detallado podrás ver todos los bloques disponibles y el motivo específico por el cual algunos fueron ignorados.',
        'feature-notifications-title': 'NOTIFICACIONES',
        'feature-notifications-description': 'StarFlex te mantiene siempre informado con un sistema completo de notificaciones múltiples para que nunca te pierdas los mejores bloques disponibles.',
        'feature-referrals-title': 'REFERIDOS',
        'feature-referrals-description': 'Invita a otros conductores a unirse a la revolución StarFlex y obtén beneficios exclusivos por cada referido que se registre exitosamente.',
        'videos-title-main': 'VE STARFLEX',
        'videos-title-highlight': 'EN ACCIÓN',
        'videos-subtitle': 'Descubre cómo StarFlex revoluciona tu experiencia con Amazon Flex. Mira la automatización inteligente trabajando en tiempo real.',
        'faq-title': 'Preguntas Frecuentes',
        'faq-subtitle': 'Encuentra respuestas claras a las dudas más comunes sobre StarFlex y descubre cómo transformar tu experiencia con Amazon Flex.',
        'faq-search-placeholder': 'Buscar pregunta...',
        'contact-title-main': 'MEJORES BLOQUES DE',
        'contact-title-highlight': 'AMAZON FLEX',
        'contact-subtitle': 'No olvides seguirnos en nuestras redes sociales ya que publicamos diariamente en nuestros canales la recopilación de los mejores bloques aceptados.',
        'footer-cta-main': 'COMENZAR AHORA',
        'footer-cta-trial': '3 días gratis'
    },
    en: {
        'page-title': 'StarFlex - Automate your Amazon Flex Blocks | Free Trial',
        'page-description': 'Starflex revolutionizes Amazon Flex. Intelligent block automation, schedule optimization and maximum earnings. Join +15,000 successful drivers.',
        'nav-home': 'Home',
        'nav-features': 'Features',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contact',
        'nav-cta': 'Start your free trial',
        'hero-badge': 'Next-Gen Amazon Flex Revolution',
        'hero_title--main': 'MASTER THE',
        'hero_title--highlight': 'AMAZON FLEX',
        'hero_title--amazon': 'BLOCKS',
        'hero-company-description': 'We are a company dedicated to improving the work experience of Amazon Flex drivers by allowing them to automatically and efficiently select the best blocks of their preference.',
        'hero-subtitle': 'Next-generation intelligent automation that multiplies your earnings. The most advanced platform for professional drivers of the future.',
        'hero-cta-main': '<strong>FREE</strong> TRIAL',
        'hero-cta-trial': '3 DAYS FREE',
        'hero-trust': 'More than 15,000 drivers have transformed their earnings',
        'features-title': 'Features',
        'features-subtitle': 'Discover all the functionalities that StarFlex offers you to maximize your earnings.',
        'feature-schedule-title': 'SCHEDULE',
        'feature-schedule-description': 'Choose the days and times you prefer for your delivery blocks. Configure your availability intelligently and let StarFlex find the best blocks in your preferred schedules.',
        'feature-stations-title': 'STATIONS',
        'feature-stations-description': 'Select your preferred stations and configure minimum prices so our application can automatically offer you blocks that perfectly fit your preferences and location.',
        'feature-calendar-title': 'CALENDAR',
        'feature-calendar-description': 'In the calendar you can see all your accepted blocks and access advanced functions like identification from any location, option to skip selfie and quick block cancellation.',
        'feature-log-title': 'LOG',
        'feature-log-description': 'In the detailed log you can see all available blocks and the specific reason why some were ignored.',
        'feature-notifications-title': 'NOTIFICATIONS',
        'feature-notifications-description': 'StarFlex keeps you always informed with a complete system of multiple notifications so you never miss the best available blocks.',
        'feature-referrals-title': 'REFERRALS',
        'feature-referrals-description': 'Invite other drivers to join the StarFlex revolution and get exclusive benefits for each referral that successfully registers.',
        'videos-title-main': 'SEE STARFLEX',
        'videos-title-highlight': 'IN ACTION',
        'videos-subtitle': 'Discover how StarFlex revolutionizes your Amazon Flex experience. Watch intelligent automation working in real time.',
        'faq-title': 'Frequently Asked Questions',
        'faq-subtitle': 'Find clear answers to the most common questions about StarFlex and discover how to transform your Amazon Flex experience.',
        'faq-search-placeholder': 'Search question...',
        'contact-title-main': 'BEST BLOCKS OF',
        'contact-title-highlight': 'AMAZON FLEX',
        'contact-subtitle': 'Don\'t forget to follow us on our social networks as we publish daily on our channels the compilation of the best accepted blocks.',
        'footer-cta-main': 'START NOW',
        'footer-cta-trial': '3 days free'
    }
};

// ===== DETECCIÓN DE DISPOSITIVO OPTIMIZADA =====
function detectDeviceCapabilities() {
    isMobile = window.innerWidth <= 1023;
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    performanceMode = isMobile && (isSlowConnection || isLowEndDevice || isReducedMotion);
    
    if (performanceMode) {
        document.body.classList.add('performance-mode');
        const style = document.createElement('style');
        style.textContent = `
            .performance-mode * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== DETECCIÓN DE FORMATOS DE IMAGEN OPTIMIZADA =====
function detectImageFormats() {
    return new Promise((resolve) => {
        const formats = { avif: false, webp: false };
        let testsCompleted = 0;
        
        function checkComplete() {
            testsCompleted++;
            if (testsCompleted === 2) {
                if (formats.avif) document.documentElement.classList.add('avif');
                if (formats.webp) document.documentElement.classList.add('webp');
                resolve(formats);
            }
        }
        
        const avifImg = new Image();
        avifImg.onload = avifImg.onerror = function() {
            formats.avif = avifImg.height === 2;
            checkComplete();
        };
        avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        
        const webpImg = new Image();
        webpImg.onload = webpImg.onerror = function() {
            formats.webp = webpImg.height === 2;
            checkComplete();
        };
        webpImg.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// ===== CLASE OPTIMIZADA PARA IMÁGENES =====
class OptimizedImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.supportedFormats = { avif: false, webp: false };
        this.init();
    }
    
    async init() {
        this.supportedFormats = await detectImageFormats();
        this.setupLazyLoading();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window && !performanceMode) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.intersectionObserver.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: isMobile ? '50px 0px' : '100px 0px', threshold: 0.01 }
            );
        }
    }
    
    getBestImageUrl(imageConfig) {
        if (!imageConfig) return null;
        if (this.supportedFormats.avif && imageConfig.avif) return imageConfig.avif;
        if (this.supportedFormats.webp && imageConfig.webp) return imageConfig.webp;
        return imageConfig.jpg || imageConfig.png || imageConfig.avif;
    }
    
    async loadImage(element) {
        const imageKey = element.dataset.imageKey;
        const imageConfig = this.getImageConfig(imageKey);
        const imageUrl = this.getBestImageUrl(imageConfig);
        
        if (!imageUrl) return;
        
        try {
            element.classList.add('loading');
            await this.preloadImage(imageUrl);
            
            if (element.tagName === 'IMG') {
                element.src = imageUrl;
            } else {
                element.style.backgroundImage = `url('${imageUrl}')`;
            }
            
            element.classList.remove('loading');
            element.classList.add('loaded');
        } catch (error) {
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }
    
    preloadImage(url) {
        if (this.imageCache.has(url)) return Promise.resolve();
        
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
    
    getImageConfig(key) {
        const parts = key.split('.');
        let config = CONFIG.IMAGE_PATHS;
        for (const part of parts) {
            config = config[part];
            if (!config) return null;
        }
        return config;
    }
    
    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        if (this.intersectionObserver && !performanceMode) {
            this.intersectionObserver.observe(element);
        } else {
            this.loadImage(element);
        }
    }
    
    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

let imageOptimizer;

// ===== FUNCIONES DE TRADUCCIÓN OPTIMIZADAS =====
function initializeLanguageSystem() {
    const savedLanguage = localStorage.getItem('starflex-language');
    const browserLanguage = navigator.language.slice(0, 2);
    
    if (savedLanguage && translationData[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else if (translationData[browserLanguage]) {
        currentLanguage = browserLanguage;
    } else {
        currentLanguage = 'es';
    }
    
    applyTranslations();
    updateLanguageButtons();
    setupLanguageToggle();
}

function setupLanguageToggle() {
    const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
            }
        });

        if (isMobile) {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            }, { passive: true });
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            }, { passive: true });
        }
    });
}

function switchLanguage(newLanguage) {
    if (!translationData[newLanguage]) return;
    
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    applyTranslations();
    updateLanguageButtons();
    document.documentElement.lang = newLanguage;
    
    if (!isMobile && !performanceMode) {
        document.body.style.opacity = '0.95';
        setTimeout(() => { document.body.style.opacity = '1'; }, 50);
    }
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    if (!currentTranslations) return;
    
    requestAnimationFrame(() => {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = currentTranslations[key];
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else if (element.tagName === 'META') {
                    element.content = translation;
                } else if (element.tagName === 'TITLE') {
                    element.textContent = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        });
    });
}

function updateLanguageButtons() {
    const allButtons = document.querySelectorAll('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
    allButtons.forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        if (buttonLang === currentLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    updateLanguageSwitcher();
}

// ===== SELECTOR DE IDIOMA FLOTANTE OPTIMIZADO =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcher = document.getElementById('language-switcher');
    const languageOptions = languageSwitcher?.querySelectorAll('.language-switcher__option');
    
    if (!languageSwitcherBtn || !languageSwitcher || isMobile) return;
    
    languageSwitcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLanguageSwitcher();
    });
    
    languageOptions?.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = option.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
                closeLanguageSwitcher();
            }
        });
    });
    
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

function updateLanguageSwitcher() {
    const languageSwitcherText = document.getElementById('language-switcher-text');
    if (languageSwitcherText) {
        languageSwitcherText.textContent = currentLanguage.toUpperCase();
    }
    
    const allOptions = document.querySelectorAll('.language-switcher__option');
    allOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// ===== FUNCIONES DEL BOTÓN FLOTANTE OPTIMIZADAS =====
function initializeFloatingWidget() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    floatingMainBtn.addEventListener('click', () => {
        toggleFloatingMenu();
    });
    
    if (isMobile) {
        floatingMainBtn.addEventListener('touchstart', () => {
            floatingMainBtn.style.transform = 'scale(0.95)';
        }, { passive: true });
        floatingMainBtn.addEventListener('touchend', () => {
            floatingMainBtn.style.transform = '';
        }, { passive: true });
    }
    
    document.addEventListener('click', (e) => {
        const floatingWidget = document.getElementById('floating-widget');
        if (isFloatingMenuOpen && floatingWidget && !floatingWidget.contains(e.target)) {
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
    
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.opacity = '1';
        }, index * (isMobile ? 30 : 50));
    });
}

function closeFloatingMenu() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    isFloatingMenuOpen = false;
    floatingMainBtn.classList.remove('active');
    floatingMenu.classList.remove('active');
    floatingMainBtn.setAttribute('aria-expanded', 'false');
    
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach(item => {
        item.style.transform = '';
        item.style.opacity = '';
    });
}

// ===== NAVEGACIÓN OPTIMIZADA =====
function initializeNavigation() {
    if (isMobile) {
        initializeMobileNavigation();
    } else {
        initializeDesktopNavigation();
    }
    initializeActiveSection();
}

function initializeDesktopNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    const navLogo = document.querySelector('.nav__logo');
    
    if (navLogo && !isMobile) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            if (isMenuOpen) closeMobileMenu();
            const homeSection = document.querySelector('#home');
            if (homeSection) {
                smoothScrollToSection(homeSection);
                const homeLink = document.querySelector('.nav__link[href="#home"]');
                if (homeLink) updateActiveNavLink(homeLink);
            }
        });
        navLogo.style.cursor = 'pointer';
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) closeMobileMenu();
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                smoothScrollToSection(targetSection);
                updateActiveNavLink(link);
            }
        });
    });
}

function initializeMobileNavigation() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
    
    if (!mobileNavToggle || !mobileNavMenu) return;
    
    const mobileNavLogo = document.querySelector('.mobile-nav__logo');
    if (mobileNavLogo) {
        mobileNavLogo.addEventListener('click', (e) => {
            e.preventDefault();
            if (isMobileMenuOpen) closeMobileNavMenu();
            const homeSection = document.querySelector('#home');
            if (homeSection) {
                setTimeout(() => {
                    smoothScrollToSection(homeSection);
                    const homeLink = document.querySelector('.mobile-nav__link[href="#home"]');
                    if (homeLink) updateActiveMobileNavLink(homeLink);
                }, 150);
            }
        });
        mobileNavLogo.style.cursor = 'pointer';
    }
    
    mobileNavToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNavMenu();
    });

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileNavMenu();
        });
    }
    
    mobileNavLinks.forEach(link => {
        const handleNavigation = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = link.getAttribute('href');
            if (isMobileMenuOpen) closeMobileNavMenu();
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                setTimeout(() => {
                    smoothScrollToSection(targetSection);
                    updateActiveMobileNavLink(link);
                }, 50);
            }
        };
        
        link.addEventListener('click', handleNavigation);
        link.addEventListener('touchend', (e) => {
            if (e.cancelable) e.preventDefault();
            handleNavigation(e);
        });
        
        link.addEventListener('touchstart', () => {
            link.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        link.addEventListener('touchcancel', () => {
            link.style.transform = '';
        }, { passive: true });
    });
    
    document.addEventListener('touchstart', (e) => {
        if (isMobileMenuOpen && mobileNavMenu && !mobileNavMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            closeMobileNavMenu();
        }
    }, { passive: true });
}

function toggleMobileNavMenu() {
    if (isMobileMenuOpen) {
        closeMobileNavMenu();
    } else {
        openMobileNavMenu();
    }
}

function openMobileNavMenu() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const body = document.body;
    
    if (!mobileNavToggle || !mobileNavMenu) return;
    
    isMobileMenuOpen = true;
    mobileNavToggle.classList.add('active');
    mobileNavMenu.classList.add('active');
    body.classList.add('mobile-menu-open');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
}

function closeMobileNavMenu() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const body = document.body;
    
    if (!mobileNavToggle || !mobileNavMenu) return;
    
    isMobileMenuOpen = false;
    mobileNavToggle.classList.remove('active');
    mobileNavMenu.classList.remove('active');
    body.classList.remove('mobile-menu-open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
}

function updateActiveMobileNavLink(activeLink) {
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function smoothScrollToSection(targetSection) {
    if (!targetSection) return;
    
    const headerHeight = isMobile ? 70 : 80;
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    if ('scrollBehavior' in document.documentElement.style && !performanceMode) {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    } else {
        window.scrollTo(0, targetPosition);
    }
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
    });
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function initializeActiveSection() {
    setTimeout(() => { updateActiveNavOnScroll(); }, 100);
}

// Funciones legacy para compatibilidad
function toggleMobileMenu() { if (isMobile) toggleMobileNavMenu(); }
function openMobileMenu() { if (isMobile) openMobileNavMenu(); }
function closeMobileMenu() { if (isMobile) closeMobileNavMenu(); }

// ===== EFECTOS DE SCROLL OPTIMIZADOS =====
function initializeScrollEffects() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveNavOnScroll();
                    handleScrollDirection();
                    updateHeaderOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
            scrollTimeout = null;
        }, isMobile ? 30 : 15);
    }, { passive: true });
}

function handleScrollDirection() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > (isMobile ? 30 : 50)) {
        isScrollingDown = true;
    } else {
        isScrollingDown = false;
    }
    lastScrollY = currentScrollY;
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const headerHeight = isMobile ? 80 : 100;
    
    let activeSection = null;
    let maxVisibleArea = 0;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        const viewportTop = scrollY + headerHeight;
        const viewportBottom = scrollY + window.innerHeight;
        
        const visibleTop = Math.max(viewportTop, sectionTop);
        const visibleBottom = Math.min(viewportBottom, sectionTop + sectionHeight);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleArea > maxVisibleArea && visibleArea > 50) {
            maxVisibleArea = visibleArea;
            activeSection = sectionId;
        }
    });
    
    if (activeSection) {
        const activeLink = document.querySelector(`.nav__link[href="#${activeSection}"]`);
        const currentActiveLink = document.querySelector('.nav__link.active');
        
        if (activeLink && activeLink !== currentActiveLink) {
            updateActiveNavLink(activeLink);
        }
        
        const activeMobileLink = document.querySelector(`.mobile-nav__link[href="#${activeSection}"]`);
        const currentActiveMobileLink = document.querySelector('.mobile-nav__link.active');
        
        if (activeMobileLink && activeMobileLink !== currentActiveMobileLink) {
            updateActiveMobileNavLink(activeMobileLink);
        }
    }
}

function updateHeaderOnScroll() {
    const header = document.getElementById('header');
    const mobileHeader = document.getElementById('mobile-header');
    const scrollY = window.scrollY;
    const threshold = isMobile ? 30 : 50;
    
    if (header && !isMobile) {
        if (scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    if (mobileHeader && isMobile) {
        if (scrollY > threshold) {
            mobileHeader.classList.add('scrolled');
        } else {
            mobileHeader.classList.remove('scrolled');
        }
        
        if (scrollY > lastScrollY && scrollY > threshold && !isMobileMenuOpen) {
            if (isNavbarVisible) {
                mobileHeader.style.transform = 'translateY(-100%)';
                isNavbarVisible = false;
            }
        } else {
            if (!isNavbarVisible) {
                mobileHeader.style.transform = 'translateY(0)';
                isNavbarVisible = true;
            }
        }
    }
}

// ===== REPRODUCTOR DE VIDEO OPTIMIZADO =====
function initializeVideoPlayer() {
    const video = document.getElementById('main-video');
    const playOverlay = document.getElementById('play-overlay');
    const progressBar = document.querySelector('.videos__progress-bar');
    const progressFill = document.querySelector('.videos__progress-fill');
    
    if (!video || !playOverlay) return;
    
    video.controls = false;
    video.preload = isMobile ? 'none' : 'metadata';
    
    playOverlay.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playOverlay.classList.add('hidden');
        }
    });
    
    video.addEventListener('click', () => {
        if (!video.paused) {
            video.pause();
            playOverlay.classList.remove('hidden');
        }
    });
    
    video.addEventListener('timeupdate', () => {
        if (video.duration && progressFill) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${progress}%`;
        }
    });
    
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickTime = (clickX / width) * video.duration;
            video.currentTime = clickTime;
        });
    }
    
    video.addEventListener('ended', () => {
        playOverlay.classList.remove('hidden');
        if (progressFill) progressFill.style.width = '0%';
    });
}

// ===== FAQ OPTIMIZADO =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    const searchInput = document.getElementById('faq-search');
    const noResults = document.getElementById('faq-no-results');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq__answer');
                        const otherQuestion = otherItem.querySelector('.faq__question');
                        if (otherAnswer) otherAnswer.classList.remove('active');
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
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
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleItems = 0;
            
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq__question-text');
                const answerText = item.querySelector('.faq__answer-text');
                
                if (questionText && answerText) {
                    const questionContent = questionText.textContent.toLowerCase();
                    const answerContent = answerText.textContent.toLowerCase();
                    
                    if (searchTerm === '' || questionContent.includes(searchTerm) || answerContent.includes(searchTerm)) {
                        item.style.display = 'block';
                        visibleItems++;
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                        const answer = item.querySelector('.faq__answer');
                        const question = item.querySelector('.faq__question');
                        if (answer) answer.classList.remove('active');
                        if (question) question.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            if (noResults) {
                if (visibleItems === 0 && searchTerm !== '') {
                    noResults.classList.add('show');
                } else {
                    noResults.classList.remove('show');
                }
            }
        }, isMobile ? 200 : 150));
    }
}

// ===== INTERSECTION OBSERVER OPTIMIZADO =====
function initializeIntersectionObserver() {
    if (performanceMode) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('feature')) {
                    animateFeature(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile ? 0.1 : 0.15,
        rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    });
    
    const elementsToObserve = document.querySelectorAll('.feature, .faq__item, .contact__channel');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

function animateFeature(feature) {
    if (performanceMode) return;
    
    const content = feature.querySelector('.feature__content');
    if (content) {
        const listItems = content.querySelectorAll('.feature__list-item');
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + (index * (isMobile ? 25 : 50)));
        });
    }
}

// ===== CONFIGURACIÓN DE LAZY LOADING OPTIMIZADA =====
function setupImageLazyLoading() {
    const waitForOptimizer = () => {
        if (!imageOptimizer) {
            setTimeout(waitForOptimizer, 50);
            return;
        }
        
        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) imageOptimizer.loadImageImmediately(navLogo, 'logo');
        
        const mobileNavLogo = document.querySelector('.mobile-nav__logo');
        if (mobileNavLogo) imageOptimizer.loadImageImmediately(mobileNavLogo, 'logo');
        
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroImage) imageOptimizer.loadImageImmediately(heroImage, 'hero');
        
        const featureImages = document.querySelectorAll('.phone__app-image');
        const imageKeys = ['phones.horario', 'phones.estaciones', 'phones.calendario', 'phones.registro', 'phones.notificaciones', 'phones.referidos'];
        
        featureImages.forEach((img, index) => {
            if (imageKeys[index]) {
                if (performanceMode) {
                    imageOptimizer.loadImageImmediately(img, imageKeys[index]);
                } else {
                    imageOptimizer.observeImage(img, imageKeys[index]);
                }
            }
        });
        
        const appleBtn = document.querySelector('.download-btn--app-store .download-btn__image');
        const googleBtn = document.querySelector('.download-btn--google .download-btn__image');
        
        if (appleBtn) imageOptimizer.loadImageImmediately(appleBtn, 'downloads.apple');
        if (googleBtn) imageOptimizer.loadImageImmediately(googleBtn, 'downloads.google');
    };
    
    waitForOptimizer();
}

// ===== VIDEO HERO OPTIMIZADO =====
function initializeHeroVideoFallback() {
    const heroVideo = document.getElementById('hero-video');
    const heroFallbackImage = document.querySelector('.hero__phone-app-image');
    const heroMobileVideo = document.getElementById('hero-mobile-video');
    
    if (heroMobileVideo && isMobile) {
        heroMobileVideo.muted = true;
        heroMobileVideo.autoplay = true;
        heroMobileVideo.loop = true;
        heroMobileVideo.playsInline = true;
        heroMobileVideo.preload = 'auto';
    }
    
    if (!heroVideo || !heroFallbackImage) return;
    
    if (isMobile || performanceMode) {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
        return;
    }
    
    heroVideo.muted = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'auto';
    
    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('loaded');
    });
    
    heroVideo.addEventListener('error', () => {
        showVideoFallback();
    });
    
    function showVideoFallback() {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
    }
    
    setTimeout(() => {
        if (heroVideo.readyState < 2) {
            showVideoFallback();
        }
    }, 1000);
}

// ===== UTILIDADES OPTIMIZADAS =====
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
    }
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
function initializePerformanceOptimizations() {
    if (!performanceMode) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                preloadCriticalResources();
            });
        } else {
            setTimeout(preloadCriticalResources, 2000);
        }
    }
    
    if (isMobile) {
        const elementsToOptimize = document.querySelectorAll('.hero__phone, .nav__logo, .mobile-nav__logo, .floating-widget__main-btn');
        elementsToOptimize.forEach(element => {
            element.style.willChange = 'transform';
        });
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, isMobile ? 500 : 250);
    });
}

function preloadCriticalResources() {
    const criticalResources = ['./assets/phones/Hero.avif', './assets/logo.avif'];
    
    criticalResources.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

function handleResize() {
    const newIsMobile = window.innerWidth <= 1023;
    
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        detectDeviceCapabilities();
        
        if (isMenuOpen) closeMobileMenu();
        if (isMobileMenuOpen) closeMobileNavMenu();
        
        setTimeout(() => {
            initializeNavigation();
            updateActiveNavOnScroll();
        }, 50);
    }
    
    if (isFloatingMenuOpen) closeFloatingMenu();
    if (isLanguageSwitcherOpen) closeLanguageSwitcher();
}

// ===== ACCESIBILIDAD OPTIMIZADA =====
function initializeAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isMenuOpen) closeMobileMenu();
            if (isMobileMenuOpen) closeMobileNavMenu();
            if (isFloatingMenuOpen) closeFloatingMenu();
            if (isLanguageSwitcherOpen) closeLanguageSwitcher();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    if (isMobile) {
        document.addEventListener('touchstart', () => {
            document.body.classList.add('touch-navigation');
        }, { passive: true });
    }
}

// ===== INICIALIZACIÓN PRINCIPAL OPTIMIZADA =====
document.addEventListener('DOMContentLoaded', () => {
    detectDeviceCapabilities();
    
    imageOptimizer = new OptimizedImageLoader();
    
    initializeLanguageSystem();
    initializeLanguageSwitcher();
    initializeNavigation();
    initializeScrollEffects();
    initializeVideoPlayer();
    initializeFAQ();
    initializeHeroVideoFallback();
    initializeAccessibility();
    initializeFloatingWidget();
    
    setupImageLazyLoading();
    
    if (!performanceMode) {
        initializeIntersectionObserver();
    }
    
    initializePerformanceOptimizations();
});

// ===== MANEJO DE ERRORES OPTIMIZADO =====
window.addEventListener('error', (e) => {
    if (isMobile && e.error && e.error.message.includes('video')) {
        const heroVideo = document.getElementById('hero-video');
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroVideo && heroImage) {
            heroVideo.style.display = 'none';
            heroImage.style.display = 'block';
            heroImage.style.zIndex = '2';
        }
    }
});

// ===== LIMPIEZA AL SALIR =====
window.addEventListener('beforeunload', () => {
    if (imageOptimizer && imageOptimizer.intersectionObserver) {
        imageOptimizer.intersectionObserver.disconnect();
    }
});

// ===== SOPORTE PARA PWA OPTIMIZADO =====
if ('serviceWorker' in navigator && !isMobile && !performanceMode) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
            })
            .catch(registrationError => {
                console.log('SW falló:', registrationError);
            });
    });
}

// ===== STARFLEX 2.0 - ULTRA OPTIMIZADO PARA MÓVILES (FUNCIONALIDADES INTACTAS) =====
const state = {
    isDrawerOpen: false, 
    currentLanguage: 'es',
    isFloatingMenuOpen: false, 
    isLanguageSwitcherOpen: false,
    lastScrollY: 0, 
    isScrollingDown: false, 
    ticking: false, 
    isNavbarVisible: true,
    isMobile: window.innerWidth <= 768, 
    isReducedMotion: false, 
    performanceMode: false
};

const CONFIG = {
    ANIMATION_DURATION: state.isMobile ? 0 : 250,
    SCROLL_THRESHOLD: state.isMobile ? 15 : 30,
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

// ===== TRADUCCIONES COMPACTAS =====
const translations = {
    es: {
        'page-title': 'StarFlex - Automatiza tus Bloques de Amazon Flex | Prueba Gratis',
        'page-description': 'Starflex revoluciona Amazon Flex. Automatización inteligente de bloques, optimización de horarios y máximas ganancias. Únete a +15,000 conductores exitosos.',
        'nav-home': 'Inicio', 'nav-features': 'Características', 'nav-videos': 'Videos', 'nav-faq': 'FAQ', 'nav-contact': 'Contacto',
        'nav-cta': 'Comienza tu prueba gratuita', 'nav-language-title': 'Idioma', 'hero-badge': 'Next-Gen Amazon Flex Revolution',
        'hero_title--main': 'DOMINA LOS', 'hero_title--highlight': 'BLOQUES DE', 'hero_title--amazon': 'AMAZON FLEX',
        'hero-company-description': 'Somos una empresa dedicada a mejorar la experiencia laboral de los conductores de Amazon Flex permitiendo seleccionar de forma automática y eficiente los mejores bloques de su preferencia.',
        'hero-subtitle': 'Automatización inteligente de última generación que multiplica tus ganancias. La plataforma más avanzada para conductores profesionales del futuro.',
        'hero-cta-main': 'PRUEBA <strong>GRATUITA</strong>', 'hero-cta-trial': '3 DÍAS GRATIS',
        'hero-trust': 'Más de 15,000 conductores han transformado sus ganancias',
        'features-title': 'Características', 'features-subtitle': 'Descubre todas las funcionalidades que StarFlex te ofrece para maximizar tus ganancias.',
        'feature-schedule-title': 'HORARIO', 'feature-schedule-description': 'Elige los días y horarios que prefieras para tus bloques de entrega. Configura tu disponibilidad de manera inteligente y deja que StarFlex encuentre los mejores bloques en tus horarios preferidos.',
        'feature-stations-title': 'ESTACIONES', 'feature-stations-description': 'Selecciona tus estaciones preferidas y configura precios mínimos para que nuestra aplicación pueda ofrecerte automáticamente los bloques que se ajusten perfectamente a tus preferencias y ubicación.',
        'feature-calendar-title': 'CALENDARIO', 'feature-calendar-description': 'En el calendario podrás ver todos tus bloques aceptados y acceder a funciones avanzadas como identificación desde cualquier ubicación, opción de saltar la selfie y cancelación rápida de bloques.',
        'feature-log-title': 'REGISTRO', 'feature-log-description': 'En el registro detallado podrás ver todos los bloques disponibles y el motivo específico por el cual algunos fueron ignorados.',
        'feature-notifications-title': 'NOTIFICACIONES', 'feature-notifications-description': 'StarFlex te mantiene siempre informado con un sistema completo de notificaciones múltiples para que nunca te pierdas los mejores bloques disponibles.',
        'feature-referrals-title': 'REFERIDOS', 'feature-referrals-description': 'Invita a otros conductores a unirse a la revolución StarFlex y obtén beneficios exclusivos por cada referido que se registre exitosamente.',
        'videos-title-main': 'VE STARFLEX', 'videos-title-highlight': 'EN ACCIÓN',
        'videos-subtitle': 'Descubre cómo StarFlex revoluciona tu experiencia con Amazon Flex. Mira la automatización inteligente trabajando en tiempo real.',
        'faq-title': 'Preguntas Frecuentes', 'faq-subtitle': 'Encuentra respuestas claras a las dudas más comunes sobre StarFlex y descubre cómo transformar tu experiencia con Amazon Flex.',
        'faq-search-placeholder': 'Buscar pregunta...', 'contact-title-main': 'MEJORES BLOQUES DE', 'contact-title-highlight': 'AMAZON FLEX',
        'contact-subtitle': 'No olvides seguirnos en nuestras redes sociales ya que publicamos diariamente en nuestros canales la recopilación de los mejores bloques aceptados.',
        'footer-cta-main': 'COMENZAR AHORA', 'footer-cta-trial': '3 días gratis'
    },
    en: {
        'page-title': 'StarFlex - Automate your Amazon Flex Blocks | Free Trial',
        'page-description': 'Starflex revolutionizes Amazon Flex. Intelligent block automation, schedule optimization and maximum earnings. Join +15,000 successful drivers.',
        'nav-home': 'Home', 'nav-features': 'Features', 'nav-videos': 'Videos', 'nav-faq': 'FAQ', 'nav-contact': 'Contact',
        'nav-cta': 'Start your free trial', 'nav-language-title': 'Language', 'hero-badge': 'Next-Gen Amazon Flex Revolution',
        'hero_title--main': 'MASTER THE', 'hero_title--highlight': 'AMAZON FLEX', 'hero_title--amazon': 'BLOCKS',
        'hero-company-description': 'We are a company dedicated to improving the work experience of Amazon Flex drivers by allowing them to automatically and efficiently select the best blocks of their preference.',
        'hero-subtitle': 'Next-generation intelligent automation that multiplies your earnings. The most advanced platform for professional drivers of the future.',
        'hero-cta-main': '<strong>FREE</strong> TRIAL', 'hero-cta-trial': '3 DAYS FREE',
        'hero-trust': 'More than 15,000 drivers have transformed their earnings',
        'features-title': 'Features', 'features-subtitle': 'Discover all the functionalities that StarFlex offers you to maximize your earnings.',
        'feature-schedule-title': 'SCHEDULE', 'feature-schedule-description': 'Choose the days and times you prefer for your delivery blocks. Configure your availability intelligently and let StarFlex find the best blocks in your preferred schedules.',
        'feature-stations-title': 'STATIONS', 'feature-stations-description': 'Select your preferred stations and configure minimum prices so our application can automatically offer you blocks that perfectly fit your preferences and location.',
        'feature-calendar-title': 'CALENDAR', 'feature-calendar-description': 'In the calendar you can see all your accepted blocks and access advanced functions like identification from any location, option to skip selfie and quick block cancellation.',
        'feature-log-title': 'LOG', 'feature-log-description': 'In the detailed log you can see all available blocks and the specific reason why some were ignored.',
        'feature-notifications-title': 'NOTIFICATIONS', 'feature-notifications-description': 'StarFlex keeps you always informed with a complete system of multiple notifications so you never miss the best available blocks.',
        'feature-referrals-title': 'REFERRALS', 'feature-referrals-description': 'Invite other drivers to join the StarFlex revolution and get exclusive benefits for each referral that successfully registers.',
        'videos-title-main': 'SEE STARFLEX', 'videos-title-highlight': 'IN ACTION',
        'videos-subtitle': 'Discover how StarFlex revolutionizes your Amazon Flex experience. Watch intelligent automation working in real time.',
        'faq-title': 'Frequently Asked Questions', 'faq-subtitle': 'Find clear answers to the most common questions about StarFlex and discover how to transform your Amazon Flex experience.',
        'faq-search-placeholder': 'Search question...', 'contact-title-main': 'BEST BLOCKS OF', 'contact-title-highlight': 'AMAZON FLEX',
        'contact-subtitle': 'Don\'t forget to follow us on our social networks as we publish daily on our channels the compilation of the best accepted blocks.',
        'footer-cta-main': 'START NOW', 'footer-cta-trial': '3 days free'
    }
};

// ===== UTILIDADES ULTRA-OPTIMIZADAS =====
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== DETECCIÓN DE DISPOSITIVO ULTRA-OPTIMIZADA =====
const detectDevice = () => {
    state.isMobile = window.innerWidth <= 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    state.isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (state.isMobile) {
        state.performanceMode = true;
        document.body.classList.add('performance-mode');
        
        // CSS ultra-optimizado inyectado directamente
        if (!document.getElementById('mobile-ultra-perf')) {
            const style = document.createElement('style');
            style.id = 'mobile-ultra-perf';
            style.textContent = `
                .performance-mode *{animation:none!important;transition:none!important;transform:none!important;will-change:auto!important}
                .performance-mode img,.performance-mode video{image-rendering:auto!important}
            `;
            document.head.appendChild(style);
        }
    }
};

// ===== CLASE ULTRA-OPTIMIZADA PARA IMÁGENES =====
class UltraImageLoader {
    constructor() {
        this.cache = state.isMobile ? null : new Map(); // Sin cache en móviles
        this.formats = { avif: false, webp: false };
        this.init();
    }
    
    async init() {
        if (state.isMobile) {
            // Detección ultra-rápida solo AVIF en móviles
            const img = new Image();
            img.onload = img.onerror = () => this.formats.avif = img.height === 2;
            img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQ==';
            return;
        }
        
        // Desktop: detección completa
        const testImg = (data) => new Promise(resolve => {
            const img = new Image();
            img.onload = img.onerror = () => resolve(img.height === 2);
            img.src = data;
        });
        
        [this.formats.avif, this.formats.webp] = await Promise.all([
            testImg('data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='),
            testImg('data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA')
        ]);
        
        if (this.formats.avif) document.documentElement.classList.add('avif');
        if (this.formats.webp) document.documentElement.classList.add('webp');
        
        // Intersection Observer solo en desktop
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px', threshold: 0.01 });
        }
    }
    
    getBestUrl(config) {
        if (!config) return null;
        if (this.formats.avif && config.avif) return config.avif;
        if (this.formats.webp && config.webp) return config.webp;
        return config.jpg || config.png || config.avif;
    }
    
    getConfig(key) {
        return key.split('.').reduce((config, part) => config?.[part], CONFIG.IMAGE_PATHS);
    }
    
    async loadImage(el) {
        const url = this.getBestUrl(this.getConfig(el.dataset.imageKey));
        if (!url) return;
        
        try {
            if (state.isMobile) {
                // Carga directa ultra-rápida en móviles
                el.tagName === 'IMG' ? el.src = url : el.style.backgroundImage = `url('${url}')`;
                el.classList.add('loaded');
                return;
            }
            
            // Desktop: con cache
            el.classList.add('loading');
            if (!this.cache.has(url)) {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => { this.cache.set(url, true); resolve(); };
                    img.onerror = reject;
                    img.src = url;
                });
            }
            el.tagName === 'IMG' ? el.src = url : el.style.backgroundImage = `url('${url}')`;
            el.classList.replace('loading', 'loaded');
        } catch {
            el.classList.replace('loading', 'error');
        }
    }
    
    observe(el, key) {
        el.dataset.imageKey = key;
        if (state.isMobile || !this.observer) {
            this.loadImage(el); // Carga inmediata en móviles
        } else {
            this.observer.observe(el);
        }
    }
    
    loadNow(el, key) {
        el.dataset.imageKey = key;
        this.loadImage(el);
    }
}

let imageLoader;

// ===== SISTEMA DE TRADUCCIONES OPTIMIZADO =====
const initLanguage = () => {
    const saved = localStorage.getItem('starflex-language');
    const browser = navigator.language.slice(0, 2);
    state.currentLanguage = (saved && translations[saved]) ? saved : translations[browser] ? browser : 'es';
    
    applyTranslations();
    updateLanguageButtons();
    setupLanguageToggle();
};

const setupLanguageToggle = () => {
    document.querySelectorAll('.nav__language-option, .nav__drawer-language-option')
        .forEach(btn => {
            const handleClick = e => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                if (lang && lang !== state.currentLanguage) switchLanguage(lang);
            };
            
            btn.addEventListener('click', handleClick);
            if (state.isMobile) {
                btn.addEventListener('touchstart', () => btn.style.transform = 'scale(0.98)', { passive: true });
                btn.addEventListener('touchend', () => btn.style.transform = '', { passive: true });
            }
        });
};

const switchLanguage = lang => {
    if (!translations[lang]) return;
    state.currentLanguage = lang;
    localStorage.setItem('starflex-language', lang);
    applyTranslations();
    updateLanguageButtons();
    document.documentElement.lang = lang;
    
    if (!state.isMobile && !state.performanceMode) {
        document.body.style.opacity = '0.95';
        setTimeout(() => document.body.style.opacity = '1', 50);
    }
};

const applyTranslations = () => {
    const current = translations[state.currentLanguage];
    if (!current) return;
    
    // Optimización: usar fragment para batch DOM updates
    const fragment = document.createDocumentFragment();
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(el => {
        const text = current[el.getAttribute('data-translate')];
        if (text) {
            if (el.tagName === 'INPUT' && el.type === 'text') el.placeholder = text;
            else if (el.tagName === 'META') el.content = text;
            else if (el.tagName === 'TITLE') el.textContent = text;
            else el.innerHTML = text;
        }
    });
};

const updateLanguageButtons = () => {
    document.querySelectorAll('.nav__language-option, .nav__drawer-language-option')
        .forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === state.currentLanguage));
    updateLanguageSwitcher();
};

// ===== SELECTOR DE IDIOMA FLOTANTE =====
const initLanguageSwitcher = () => {
    if (state.isMobile) return;
    
    const btn = document.getElementById('language-switcher-btn');
    const switcher = document.getElementById('language-switcher');
    if (!btn || !switcher) return;
    
    btn.addEventListener('click', e => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        toggleLanguageSwitcher(); 
    });
    
    document.addEventListener('click', e => {
        if (state.isLanguageSwitcherOpen && !switcher.contains(e.target)) {
            closeLanguageSwitcher();
        }
    });
    
    document.addEventListener('keydown', e => e.key === 'Escape' && state.isLanguageSwitcherOpen && closeLanguageSwitcher());
};

const toggleLanguageSwitcher = () => state.isLanguageSwitcherOpen ? closeLanguageSwitcher() : openLanguageSwitcher();

const openLanguageSwitcher = () => {
    const switcher = document.getElementById('language-switcher');
    const btn = document.getElementById('language-switcher-btn');
    if (!switcher || !btn) return;
    state.isLanguageSwitcherOpen = true;
    switcher.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
};

const closeLanguageSwitcher = () => {
    const switcher = document.getElementById('language-switcher');
    const btn = document.getElementById('language-switcher-btn');
    if (!switcher || !btn) return;
    state.isLanguageSwitcherOpen = false;
    switcher.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
};

const updateLanguageSwitcher = () => {
    const text = document.getElementById('language-switcher-text');
    if (text) text.textContent = state.currentLanguage.toUpperCase();
    document.querySelectorAll('.nav__language-option')
        .forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-lang') === state.currentLanguage));
};

// ===== DRAWER MÓVIL ULTRA-OPTIMIZADO =====
const initDrawer = () => {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-drawer-overlay');
    const close = document.getElementById('nav-drawer-close');
    
    if (!toggle || !drawer || !overlay || !close) return;
    
    toggle.addEventListener('click', e => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        toggleDrawer(); 
    });
    
    close.addEventListener('click', e => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        closeDrawer(); 
    });
    
    overlay.addEventListener('click', closeDrawer);
    
    // Enlaces optimizados con event delegation
    drawer.addEventListener('click', e => {
        const link = e.target.closest('.nav__drawer-link');
        if (!link) return;
        
        e.preventDefault();
        closeDrawer();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            setTimeout(() => {
                smoothScroll(target);
                updateActiveNavLink(link);
            }, state.isMobile ? 50 : 300);
        }
    });
    
    if (state.isMobile) {
        drawer.addEventListener('touchend', e => {
            const link = e.target.closest('.nav__drawer-link');
            if (link && e.cancelable) e.preventDefault();
        });
    }
};

const toggleDrawer = () => state.isDrawerOpen ? closeDrawer() : openDrawer();

const openDrawer = () => {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-drawer-overlay');
    
    if (!toggle || !drawer || !overlay) return;
    
    state.isDrawerOpen = true;
    toggle.classList.add('active');
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('nav-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    
    document.body.style.overflow = 'hidden';
};

const closeDrawer = () => {
    const toggle = document.getElementById('nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const overlay = document.getElementById('nav-drawer-overlay');
    
    if (!toggle || !drawer || !overlay) return;
    
    state.isDrawerOpen = false;
    toggle.classList.remove('active');
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('nav-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    
    document.body.style.overflow = '';
};

// ===== WIDGET FLOTANTE ULTRA-OPTIMIZADO =====
const initFloatingWidget = () => {
    const btn = document.getElementById('floating-main-btn');
    const menu = document.getElementById('floating-menu');
    if (!btn || !menu) return;
    
    btn.addEventListener('click', toggleFloatingMenu);
    
    if (state.isMobile) {
        btn.addEventListener('touchstart', () => btn.style.transform = 'scale(0.95)', { passive: true });
        btn.addEventListener('touchend', () => btn.style.transform = '', { passive: true });
    }
    
    document.addEventListener('click', e => {
        const widget = document.getElementById('floating-widget');
        if (state.isFloatingMenuOpen && widget && !widget.contains(e.target)) closeFloatingMenu();
    }, { passive: true });
};

const toggleFloatingMenu = () => state.isFloatingMenuOpen ? closeFloatingMenu() : openFloatingMenu();

const openFloatingMenu = () => {
    const btn = document.getElementById('floating-main-btn');
    const menu = document.getElementById('floating-menu');
    if (!btn || !menu) return;
    
    state.isFloatingMenuOpen = true;
    btn.classList.add('active');
    menu.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    
    const items = menu.querySelectorAll('.floating-widget__menu-item');
    if (state.isMobile || state.performanceMode) {
        // Mostrar inmediatamente en móviles
        items.forEach(item => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.opacity = '1';
        });
    } else {
        // Animación escalonada en desktop
        items.forEach((item, i) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.opacity = '1';
            }, i * 50);
        });
    }
};

const closeFloatingMenu = () => {
    const btn = document.getElementById('floating-main-btn');
    const menu = document.getElementById('floating-menu');
    if (!btn || !menu) return;
    
    state.isFloatingMenuOpen = false;
    btn.classList.remove('active');
    menu.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    
    menu.querySelectorAll('.floating-widget__menu-item').forEach(item => {
        item.style.transform = '';
        item.style.opacity = '';
    });
};

// ===== NAVEGACIÓN ULTRA-OPTIMIZADA =====
const initNavigation = () => {
    const logo = document.querySelector('.nav__logo');
    if (logo) {
        logo.addEventListener('click', e => {
            e.preventDefault();
            if (state.isDrawerOpen) closeDrawer();
            const home = document.querySelector('#home');
            if (home) {
                smoothScroll(home);
                updateActiveNavLink(document.querySelector('.nav__link[href="#home"], .nav__drawer-link[href="#home"]'));
            }
        });
        logo.style.cursor = 'pointer';
    }
    
    // Event delegation para enlaces desktop
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.addEventListener('click', e => {
            const link = e.target.closest('.nav__link');
            if (!link) return;
            
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                smoothScroll(target);
                updateActiveNavLink(link);
            }
        });
    }
    
    initDrawer();
    
    setTimeout(() => {
        if (!state.isMobile) updateActiveNavOnScroll();
    }, 100);
};

const smoothScroll = target => {
    if (!target) return;
    const headerHeight = state.isMobile ? 70 : 80;
    const pos = target.offsetTop - headerHeight;
    
    if (state.isMobile || state.performanceMode) {
        window.scrollTo(0, pos);
    } else if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: pos, behavior: 'smooth' });
    } else {
        window.scrollTo(0, pos);
    }
};

const updateActiveNavLink = activeLink => {
    document.querySelectorAll('.nav__link, .nav__drawer-link').forEach(link => link.classList.remove('active'));
    activeLink?.classList.add('active');
};

// ===== EFECTOS DE SCROLL ULTRA-OPTIMIZADOS =====
const initScrollEffects = () => {
    const throttleTime = state.isMobile ? 200 : 15; // Más agresivo en móviles
    
    const throttledScroll = throttle(() => {
        if (!state.ticking) {
            requestAnimationFrame(() => {
                if (state.isMobile) {
                    // Solo funciones esenciales en móviles
                    handleScrollDirectionMobile();
                    updateHeaderOnScrollMobile();
                } else {
                    // Funciones completas en desktop
                    updateActiveNavOnScroll();
                    handleScrollDirection();
                    updateHeaderOnScroll();
                }
                state.ticking = false;
            });
            state.ticking = true;
        }
    }, throttleTime);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
};

// Versión ultra-optimizada para móviles
const handleScrollDirectionMobile = () => {
    const currentScrollY = window.scrollY;
    state.isScrollingDown = currentScrollY > state.lastScrollY && currentScrollY > 20;
    state.lastScrollY = currentScrollY;
};

const updateHeaderOnScrollMobile = () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    
    if (header) {
        header.classList.toggle('scrolled', scrollY > 20);
        
        const shouldHide = scrollY > state.lastScrollY && scrollY > 20 && !state.isDrawerOpen;
        if (shouldHide !== !state.isNavbarVisible) {
            header.style.transform = shouldHide ? 'translateY(-100%)' : 'translateY(0)';
            state.isNavbarVisible = !shouldHide;
        }
    }
};

// Versiones desktop (mantener funcionalidad completa)
const handleScrollDirection = () => {
    const currentScrollY = window.scrollY;
    state.isScrollingDown = currentScrollY > state.lastScrollY && currentScrollY > 50;
    state.lastScrollY = currentScrollY;
};

const updateActiveNavOnScroll = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const headerHeight = 100;
    
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
        const activeLink = document.querySelector(`.nav__link[href="#${activeSection}"], .nav__drawer-link[href="#${activeSection}"]`);
        const currentActiveLink = document.querySelector('.nav__link.active, .nav__drawer-link.active');
        if (activeLink && activeLink !== currentActiveLink) updateActiveNavLink(activeLink);
    }
};

const updateHeaderOnScroll = () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    
    if (header) {
        header.classList.toggle('scrolled', scrollY > 50);
        
        if (state.isMobile) {
            const shouldHide = scrollY > state.lastScrollY && scrollY > 50 && !state.isDrawerOpen;
            if (shouldHide !== !state.isNavbarVisible) {
                header.style.transform = shouldHide ? 'translateY(-100%)' : 'translateY(0)';
                state.isNavbarVisible = !shouldHide;
            }
        }
    }
};

// ===== FAQ ULTRA-OPTIMIZADO =====
const initFAQ = () => {
    const items = document.querySelectorAll('.faq__item');
    const search = document.getElementById('faq-search');
    const noResults = document.getElementById('faq-no-results');
    
    // Event delegation para mejor rendimiento
    const faqContainer = document.querySelector('.faq__list');
    if (faqContainer) {
        faqContainer.addEventListener('click', e => {
            const question = e.target.closest('.faq__question');
            if (!question) return;
            
            const item = question.closest('.faq__item');
            const answer = item.querySelector('.faq__answer');
            if (!item || !answer) return;
            
            const isActive = item.classList.contains('active');
            
            // Cerrar otros items
            items.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const otherAnswer = other.querySelector('.faq__answer');
                    const otherQuestion = other.querySelector('.faq__question');
                    otherAnswer?.classList.remove('active');
                    otherQuestion?.setAttribute('aria-expanded', 'false');
                }
            });
            
            item.classList.toggle('active', !isActive);
            answer.classList.toggle('active', !isActive);
            question.setAttribute('aria-expanded', !isActive);
        });
    }
    
    if (search) {
        const debounceTime = state.isMobile ? 500 : 150; // Más largo en móviles
        search.addEventListener('input', debounce(e => {
            const term = e.target.value.toLowerCase().trim();
            let visible = 0;
            
            items.forEach(item => {
                const questionText = item.querySelector('.faq__question-text');
                const answerText = item.querySelector('.faq__answer-text');
                
                if (questionText && answerText) {
                    const matches = term === '' || 
                        questionText.textContent.toLowerCase().includes(term) || 
                        answerText.textContent.toLowerCase().includes(term);
                    
                    item.style.display = matches ? 'block' : 'none';
                    if (matches) visible++;
                    else {
                        item.classList.remove('active');
                        const answer = item.querySelector('.faq__answer');
                        const question = item.querySelector('.faq__question');
                        answer?.classList.remove('active');
                        question?.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            noResults?.classList.toggle('show', visible === 0 && term !== '');
        }, debounceTime));
    }
};

// ===== INTERSECTION OBSERVER OPTIMIZADO =====
const initIntersectionObserver = () => {
    if (state.isMobile || state.performanceMode) {
        // Mostrar inmediatamente en móviles
        document.querySelectorAll('.feature, .faq__item, .contact__channel').forEach(el => {
            el.classList.add('in-view');
            if (el.classList.contains('feature')) {
                const content = el.querySelector('.feature__content');
                content?.querySelectorAll('.feature__list-item').forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                });
            }
        });
        return;
    }
    
    // Desktop: usar Intersection Observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('feature')) animateFeature(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.feature, .faq__item, .contact__channel').forEach(el => observer.observe(el));
};

const animateFeature = feature => {
    if (state.performanceMode) return;
    const content = feature.querySelector('.feature__content');
    content?.querySelectorAll('.feature__list-item').forEach((item, i) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (i * 50));
    });
};

// ===== LAZY LOADING ULTRA-OPTIMIZADO =====
const setupImageLazyLoading = () => {
    const wait = () => {
        if (!imageLoader) return setTimeout(wait, 50);
        
        const loadNow = (sel, key) => { 
            const el = document.querySelector(sel); 
            if (el) imageLoader.loadNow(el, key); 
        };
        
        const observe = (sel, key) => { 
            const el = document.querySelector(sel); 
            if (el) imageLoader.observe(el, key); 
        };
        
        // Críticas: cargar inmediatamente
        loadNow('.nav__logo', 'logo');
        loadNow('.nav__drawer-logo', 'logo');
        loadNow('.hero__phone-app-image', 'hero');
        
        // Features: cargar según dispositivo
        const keys = ['phones.horario', 'phones.estaciones', 'phones.calendario', 'phones.registro', 'phones.notificaciones', 'phones.referidos'];
        document.querySelectorAll('.phone__app-image').forEach((img, i) => {
            if (keys[i]) {
                state.isMobile ? imageLoader.loadNow(img, keys[i]) : imageLoader.observe(img, keys[i]);
            }
        });
        
        loadNow('.download-btn--app-store .download-btn__image', 'downloads.apple');
        loadNow('.download-btn--google .download-btn__image', 'downloads.google');
    };
    wait();
};

// ===== VIDEO HERO ULTRA-OPTIMIZADO =====
const initHeroVideo = () => {
    const desktopVideo = document.getElementById('hero-video');
    const fallback = document.querySelector('.hero__phone-app-image');
    const mobileVideo = document.getElementById('hero-mobile-video');
    
    if (state.isMobile) {
        // Móviles: solo imagen estática para máximo rendimiento
        if (fallback) {
            fallback.style.display = 'block';
            fallback.style.zIndex = '2';
        }
        
        // Ocultar todos los videos en móviles
        [desktopVideo, mobileVideo].forEach(video => {
            if (video) video.style.display = 'none';
        });
        
        const mobileContainer = document.querySelector('.hero__mobile-video');
        if (mobileContainer) mobileContainer.style.display = 'none';
        
        return;
    }
    
    // Desktop: mantener funcionalidad de video completa
    if (!desktopVideo || !fallback) return;
    
    const showFallback = () => {
        if (desktopVideo) desktopVideo.style.display = 'none';
        if (fallback) {
            fallback.style.display = 'block';
            fallback.style.zIndex = '2';
        }
    };
    
    if (state.performanceMode) return showFallback();
    
    desktopVideo.muted = true;
    desktopVideo.autoplay = true;
    desktopVideo.loop = true;
    desktopVideo.playsInline = true;
    desktopVideo.preload = 'metadata';
    
    desktopVideo.addEventListener('loadeddata', () => {
        desktopVideo.classList.replace('loading', 'loaded');
    });
    
    desktopVideo.addEventListener('error', showFallback);
    
    setTimeout(() => {
        if (desktopVideo.readyState < 2) showFallback();
    }, 1500);
};

// ===== OPTIMIZACIONES DE RENDIMIENTO ULTRA =====
const initPerformanceOptimizations = () => {
    // Preload solo en desktop
    if (!state.isMobile && !state.performanceMode) {
        const preload = () => {
            ['./assets/phones/Hero.mp4', './assets/logo.avif'].forEach(src => {
                const link = document.createElement('link');
                Object.assign(link, { rel: 'preload', as: 'image', href: src });
                document.head.appendChild(link);
            });
        };
        
        'requestIdleCallback' in window ? requestIdleCallback(preload) : setTimeout(preload, 3000);
    }
    
    // Will-change solo en desktop
    if (!state.performanceMode) {
        document.querySelectorAll('.hero__phone, .nav__logo, .nav__drawer-logo, .floating-widget__main-btn')
            .forEach(el => el.style.willChange = 'transform');
    }
    
    // Resize handler ultra-optimizado
    const handleResize = debounce(() => {
        const newIsMobile = window.innerWidth <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (newIsMobile !== state.isMobile) {
            state.isMobile = newIsMobile;
            detectDevice();
            if (state.isDrawerOpen) closeDrawer();
            setTimeout(() => { 
                initNavigation(); 
                if (!state.isMobile) updateActiveNavOnScroll(); 
            }, 50);
        }
        if (state.isFloatingMenuOpen) closeFloatingMenu();
        if (state.isLanguageSwitcherOpen) closeLanguageSwitcher();
    }, state.isMobile ? 500 : 250); // Más lento en móviles
    
    window.addEventListener('resize', handleResize);
};

// ===== ACCESIBILIDAD ULTRA-OPTIMIZADA =====
const initAccessibility = () => {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (state.isDrawerOpen) closeDrawer();
            if (state.isFloatingMenuOpen) closeFloatingMenu();
            if (state.isLanguageSwitcherOpen) closeLanguageSwitcher();
        }
        if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
    });
    
    document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-navigation'));
    
    if (state.isMobile) {
        document.addEventListener('touchstart', () => document.body.classList.add('touch-navigation'), { passive: true });
        
        // Prevenir zoom iOS - ultra-optimizado
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
        const viewport = document.querySelector('meta[name="viewport"]');
        
        if (viewport) {
            const handleFocus = () => {
                if (window.innerWidth < 768) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            };
            
            const handleBlur = () => {
                if (window.innerWidth < 768) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
                }
            };
            
            inputs.forEach(input => {
                input.addEventListener('focus', handleFocus);
                input.addEventListener('blur', handleBlur);
            });
        }
    }
};

// ===== INICIALIZACIÓN ULTRA-OPTIMIZADA =====
document.addEventListener('DOMContentLoaded', () => {
    detectDevice();
    imageLoader = new UltraImageLoader();
    
    initLanguage();
    initLanguageSwitcher();
    initNavigation();
    initScrollEffects();
    initFAQ();
    initHeroVideo();
    initAccessibility();
    initFloatingWidget();
    setupImageLazyLoading();
    
    // Intersection Observer según dispositivo
    initIntersectionObserver();
    
    initPerformanceOptimizations();
    
    // Setup drawer más rápido en móviles
    setTimeout(() => {
        if (state.isMobile) {
            const drawer = document.getElementById('nav-drawer');
            if (drawer) drawer.setAttribute('aria-hidden', 'true');
        }
    }, state.isMobile ? 25 : 100);
});

// ===== MANEJO DE ERRORES ULTRA-OPTIMIZADO =====
// ===== MANEJO DE ERRORES ULTRA-OPTIMIZADO =====
window.addEventListener('error', e => {
    if (state.isMobile && e.error?.message.includes('video')) {
        const video = document.getElementById('hero-video');
        const image = document.querySelector('.hero__phone-app-image');
        if (video && image) {
            video.style.display = 'none';
            image.style.display = 'block';
            image.style.zIndex = '2';
        }
    }
});

// ===== LIMPIEZA ULTRA-OPTIMIZADA =====
window.addEventListener('beforeunload', () => {
    imageLoader?.observer?.disconnect();
    document.body.style.overflow = '';
    document.body.classList.remove('nav-menu-open');
});

// ===== PWA SOLO EN DESKTOP =====
if ('serviceWorker' in navigator && !state.isMobile && !state.performanceMode) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registrado:', reg))
            .catch(err => console.log('SW falló:', err));
    });
}

// ===== FUNCIONES LEGACY PARA COMPATIBILIDAD =====
const toggleMobileMenu = () => state.isMobile && toggleDrawer();
const openMobileMenu = () => state.isMobile && openDrawer();
const closeMobileMenu = () => state.isMobile && closeDrawer();

// ===== OPTIMIZACIONES MÓVILES ESPECÍFICAS ULTRA =====
if (state.isMobile) {
    // Orientación ultra-optimizada
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (state.isDrawerOpen) {
                const drawer = document.getElementById('nav-drawer');
                if (drawer) drawer.style.height = '100vh';
            }
        }, 100);
    });
    
    // Prevención de scroll elástico iOS ultra-optimizada
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.addEventListener('touchmove', e => {
            if (state.isDrawerOpen) {
                const drawer = document.getElementById('nav-drawer');
                if (drawer && !drawer.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }
    
    // Optimización de memoria para móviles
    const optimizeMemory = () => {
        // Limpiar referencias no utilizadas
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
        
        // Reducir cache de imágenes en móviles
        if (imageLoader && imageLoader.cache) {
            imageLoader.cache.clear();
        }
    };
    
    // Ejecutar limpieza de memoria cada 30 segundos en móviles
    setInterval(optimizeMemory, 30000);
    
    // Pausar funciones no críticas cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pausar animaciones y timers no críticos
            if (state.isFloatingMenuOpen) closeFloatingMenu();
            if (state.isLanguageSwitcherOpen) closeLanguageSwitcher();
        }
    });
}

// ===== OPTIMIZACIONES ADICIONALES PARA DISPOSITIVOS DE GAMA BAJA =====
if (state.isMobile) {
    // Detectar dispositivos de gama baja
    const isLowEndDevice = () => {
        return navigator.hardwareConcurrency <= 2 || 
               navigator.deviceMemory <= 2 || 
               /Android.*Chrome\/[1-6][0-9]/.test(navigator.userAgent);
    };
    
    if (isLowEndDevice()) {
        // Optimizaciones adicionales para dispositivos de gama baja
        document.body.classList.add('low-end-device');
        
        // CSS adicional para dispositivos de gama baja
        const lowEndStyle = document.createElement('style');
        lowEndStyle.textContent = `
            .low-end-device * {
                backface-visibility: hidden !important;
                perspective: none !important;
                transform-style: flat !important;
            }
            .low-end-device img {
                image-rendering: pixelated !important;
            }
        `;
        document.head.appendChild(lowEndStyle);
        
        // Reducir calidad de imágenes en dispositivos de gama baja
        CONFIG.IMAGE_PATHS = Object.fromEntries(
            Object.entries(CONFIG.IMAGE_PATHS).map(([key, value]) => [
                key, 
                typeof value === 'object' ? { jpg: value.avif || value.webp || value.jpg } : value
            ])
        );
    }
}

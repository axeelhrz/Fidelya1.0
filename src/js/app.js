// ===== STARFLEX 2.0 - OPTIMIZADO PARA MÓVILES =====
const state = {
    isMenuOpen: false,
    isMobileMenuOpen: false,
    currentLanguage: 'es',
    isFloatingMenuOpen: false,
    isLanguageSwitcherOpen: false,
    lastScrollY: 0,
    isScrollingDown: false,
    ticking: false,
    isNavbarVisible: true,
    isMobile: window.innerWidth <= 1023,
    isReducedMotion: false,
    performanceMode: false
};

const CONFIG = {
    ANIMATION_DURATION: state.isMobile ? 100 : 250,
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
        'nav-cta': 'Comienza tu prueba gratuita', 'hero-badge': 'Next-Gen Amazon Flex Revolution',
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
        'nav-cta': 'Start your free trial', 'hero-badge': 'Next-Gen Amazon Flex Revolution',
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

// ===== DETECCIÓN DE DISPOSITIVO OPTIMIZADA =====
const detectDevice = () => {
    state.isMobile = window.innerWidth <= 1023;
    state.isReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (state.isMobile) {
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        const conn = navigator.connection;
        const isSlowConn = conn && ['slow-2g', '2g', '3g'].includes(conn.effectiveType);
        
        state.performanceMode = isSlowConn || isLowEnd || state.isReducedMotion;
        
        if (state.performanceMode) {
            document.body.classList.add('performance-mode');
            if (!document.getElementById('perf-css')) {
                const style = document.createElement('style');
                style.id = 'perf-css';
                style.textContent = '.performance-mode *{animation-duration:0.1s!important;transition-duration:0.1s!important}';
                document.head.appendChild(style);
            }
        }
    }
};

// ===== DETECCIÓN DE FORMATOS DE IMAGEN OPTIMIZADA =====
const detectImageFormats = () => {
    if (state.performanceMode) {
        return Promise.resolve({ avif: false, webp: false });
    }
    
    return new Promise(resolve => {
        const formats = { avif: false, webp: false };
        let completed = 0;
        
        const check = () => {
            if (++completed === 2) {
                if (formats.avif) document.documentElement.classList.add('avif');
                if (formats.webp) document.documentElement.classList.add('webp');
                resolve(formats);
            }
        };
        
        const testImg = (format, data) => {
            const img = new Image();
            img.onload = img.onerror = () => { formats[format] = img.height === 2; check(); };
            img.src = data;
        };
        
        testImg('avif', 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=');
        testImg('webp', 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA');
    });
};

// ===== CLASE OPTIMIZADA PARA IMÁGENES =====
class ImageLoader {
    constructor() {
        this.cache = new Map();
        this.formats = { avif: false, webp: false };
        this.init();
    }
    
    async init() {
        this.formats = await detectImageFormats();
        
        if ('IntersectionObserver' in window && (!state.isMobile || !state.performanceMode)) {
            this.observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, { 
                rootMargin: state.isMobile ? '20px 0px' : '100px 0px', 
                threshold: 0.01 
            });
        }
    }
    
    getBestUrl(config) {
        if (!config) return null;
        if (this.formats.avif && config.avif) return config.avif;
        if (this.formats.webp && config.webp) return config.webp;
        return config.jpg || config.png || config.avif;
    }
    
    async loadImage(el) {
        const key = el.dataset.imageKey;
        const url = this.getBestUrl(this.getConfig(key));
        if (!url) return;
        
        try {
            el.classList.add('loading');
            
            if (state.isMobile) {
                el.tagName === 'IMG' ? el.src = url : el.style.backgroundImage = `url('${url}')`;
                el.classList.replace('loading', 'loaded');
            } else {
                await this.preload(url);
                el.tagName === 'IMG' ? el.src = url : el.style.backgroundImage = `url('${url}')`;
                el.classList.replace('loading', 'loaded');
            }
        } catch {
            el.classList.replace('loading', 'error');
        }
    }
    
    preload(url) {
        if (this.cache.has(url)) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { this.cache.set(url, true); resolve(); };
            img.onerror = reject;
            img.src = url;
        });
    }
    
    getConfig(key) {
        return key.split('.').reduce((config, part) => config?.[part], CONFIG.IMAGE_PATHS);
    }
    
    observe(el, key) {
        el.dataset.imageKey = key;
        this.observer && (!state.isMobile || !state.performanceMode) ? this.observer.observe(el) : this.loadImage(el);
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
    const buttons = document.querySelectorAll('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
    
    buttons.forEach(btn => {
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
    
    requestAnimationFrame(() => {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            const text = current[key];
            if (text) {
                if (el.tagName === 'INPUT' && el.type === 'text') el.placeholder = text;
                else if (el.tagName === 'META') el.content = text;
                else if (el.tagName === 'TITLE') el.textContent = text;
                else el.innerHTML = text;
            }
        });
    });
};

const updateLanguageButtons = () => {
    document.querySelectorAll('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option')
        .forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-lang') === state.currentLanguage));
    updateLanguageSwitcher();
};

// ===== SELECTOR DE IDIOMA FLOTANTE (SOLO DESKTOP) =====
const initLanguageSwitcher = () => {
    if (state.isMobile) return;
    
    const btn = document.getElementById('language-switcher-btn');
    const switcher = document.getElementById('language-switcher');
    if (!btn || !switcher) return;
    
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleLanguageSwitcher(); });
    switcher.querySelectorAll('.language-switcher__option').forEach(opt => {
        opt.addEventListener('click', e => {
            e.preventDefault();
            const lang = opt.getAttribute('data-lang');
            if (lang && lang !== state.currentLanguage) { switchLanguage(lang); closeLanguageSwitcher(); }
        });
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
    document.querySelectorAll('.language-switcher__option')
        .forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-lang') === state.currentLanguage));
};

// ===== WIDGET FLOTANTE OPTIMIZADO =====
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
    
    if (!state.performanceMode) {
        menu.querySelectorAll('.floating-widget__menu-item').forEach((item, i) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.opacity = '1';
            }, i * (state.isMobile ? 20 : 50));
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

// ===== NAVEGACIÓN OPTIMIZADA =====
const initNavigation = () => {
    state.isMobile ? initMobileNav() : initDesktopNav();
    setTimeout(updateActiveNavOnScroll, 100);
};

const initDesktopNav = () => {
    const logo = document.querySelector('.nav__logo');
    if (logo) {
        logo.addEventListener('click', e => {
            e.preventDefault();
            if (state.isMenuOpen) closeMobileMenu();
            const home = document.querySelector('#home');
            if (home) {
                smoothScroll(home);
                updateActiveNavLink(document.querySelector('.nav__link[href="#home"]'));
            }
        });
        logo.style.cursor = 'pointer';
    }
    
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', e => {
            if (state.isMenuOpen) closeMobileMenu();
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) { smoothScroll(target); updateActiveNavLink(link); }
        });
    });
};

const initMobileNav = () => {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    const close = document.getElementById('mobile-nav-close');
    if (!toggle || !menu) return;
    
    const logo = document.querySelector('.mobile-nav__logo');
    if (logo) {
        logo.addEventListener('click', e => {
            e.preventDefault();
            if (state.isMobileMenuOpen) closeMobileNavMenu();
            const home = document.querySelector('#home');
            if (home) {
                setTimeout(() => {
                    smoothScroll(home);
                    updateActiveMobileNavLink(document.querySelector('.mobile-nav__link[href="#home"]'));
                }, 150);
            }
        });
        logo.style.cursor = 'pointer';
    }
    
    toggle.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleMobileNavMenu(); });
    close?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); closeMobileNavMenu(); });
    
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        const handleNav = e => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = link.getAttribute('href');
            if (state.isMobileMenuOpen) closeMobileNavMenu();
            const target = document.querySelector(targetId);
            if (target) setTimeout(() => { smoothScroll(target); updateActiveMobileNavLink(link); }, 50);
        };
        
        link.addEventListener('click', handleNav);
        link.addEventListener('touchend', e => { if (e.cancelable) e.preventDefault(); handleNav(e); });
        link.addEventListener('touchstart', () => link.style.transform = 'scale(0.98)', { passive: true });
        link.addEventListener('touchcancel', () => link.style.transform = '', { passive: true });
    });
    
    document.addEventListener('touchstart', e => {
        if (state.isMobileMenuOpen && menu && !menu.contains(e.target) && !toggle.contains(e.target)) closeMobileNavMenu();
    }, { passive: true });
};

const toggleMobileNavMenu = () => state.isMobileMenuOpen ? closeMobileNavMenu() : openMobileNavMenu();

const openMobileNavMenu = () => {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    if (!toggle || !menu) return;
    
    state.isMobileMenuOpen = true;
    toggle.classList.add('active');
    menu.classList.add('active');
    document.body.classList.add('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
};

const closeMobileNavMenu = () => {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    if (!toggle || !menu) return;
    
    state.isMobileMenuOpen = false;
    toggle.classList.remove('active');
    menu.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
};

const updateActiveMobileNavLink = activeLink => {
    document.querySelectorAll('.mobile-nav__link').forEach(link => link.classList.remove('active'));
    activeLink?.classList.add('active');
};

const smoothScroll = target => {
    if (!target) return;
    const headerHeight = state.isMobile ? 70 : 80;
    const pos = target.offsetTop - headerHeight;
    
    if ('scrollBehavior' in document.documentElement.style && !state.performanceMode) {
        window.scrollTo({ top: pos, behavior: 'smooth' });
    } else {
        window.scrollTo(0, pos);
    }
};

const updateActiveNavLink = activeLink => {
    document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('active'));
    activeLink?.classList.add('active');
};

// Funciones legacy
const toggleMobileMenu = () => state.isMobile && toggleMobileNavMenu();
const openMobileMenu = () => state.isMobile && openMobileNavMenu();
const closeMobileMenu = () => state.isMobile && closeMobileNavMenu();

// ===== EFECTOS DE SCROLL OPTIMIZADOS =====
const initScrollEffects = () => {
    let scrollTimeout;
    const scrollDelay = state.isMobile ? 50 : 15;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            if (!state.ticking) {
                requestAnimationFrame(() => {
                    updateActiveNavOnScroll();
                    handleScrollDirection();
                    updateHeaderOnScroll();
                    state.ticking = false;
                });
                state.ticking = true;
            }
            scrollTimeout = null;
        }, scrollDelay);
    }, { passive: true });
};

const handleScrollDirection = () => {
    const currentScrollY = window.scrollY;
    state.isScrollingDown = currentScrollY > state.lastScrollY && currentScrollY > (state.isMobile ? 20 : 50);
    state.lastScrollY = currentScrollY;
};

const updateActiveNavOnScroll = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const headerHeight = state.isMobile ? 80 : 100;
    
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
        if (activeLink && activeLink !== currentActiveLink) updateActiveNavLink(activeLink);
        
        const activeMobileLink = document.querySelector(`.mobile-nav__link[href="#${activeSection}"]`);
        const currentActiveMobileLink = document.querySelector('.mobile-nav__link.active');
        if (activeMobileLink && activeMobileLink !== currentActiveMobileLink) updateActiveMobileNavLink(activeMobileLink);
    }
};

const updateHeaderOnScroll = () => {
    const header = document.getElementById(state.isMobile ? 'mobile-header' : 'header');
    const scrollY = window.scrollY;
    const threshold = state.isMobile ? 20 : 50;
    
    if (header) {
        header.classList.toggle('scrolled', scrollY > threshold);
        
        if (state.isMobile) {
            const shouldHide = scrollY > state.lastScrollY && scrollY > threshold && !state.isMobileMenuOpen;
            if (shouldHide !== !state.isNavbarVisible) {
                header.style.transform = shouldHide ? 'translateY(-100%)' : 'translateY(0)';
                state.isNavbarVisible = !shouldHide;
            }
        }
    }
};

// ===== REPRODUCTOR DE VIDEO OPTIMIZADO =====
const initVideoPlayer = () => {
    if (state.performanceMode) return;
    
    const video = document.getElementById('main-video');
    const overlay = document.getElementById('play-overlay');
    const progressBar = document.querySelector('.videos__progress-bar');
    const progressFill = document.querySelector('.videos__progress-fill');
    
    if (!video || !overlay) return;
    
    video.controls = false;
    video.preload = state.isMobile ? 'none' : 'metadata';
    
    overlay.addEventListener('click', () => {
        if (video.paused) { video.play(); overlay.classList.add('hidden'); }
    });
    
    video.addEventListener('click', () => {
        if (!video.paused) { video.pause(); overlay.classList.remove('hidden'); }
    });
    
    video.addEventListener('timeupdate', () => {
        if (video.duration && progressFill) {
            progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
        }
    });
    
    progressBar?.addEventListener('click', e => {
        const rect = progressBar.getBoundingClientRect();
        video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
    });
    
    video.addEventListener('ended', () => {
        overlay.classList.remove('hidden');
        if (progressFill) progressFill.style.width = '0%';
    });
};

// ===== FAQ OPTIMIZADO =====
const initFAQ = () => {
    const items = document.querySelectorAll('.faq__item');
    const search = document.getElementById('faq-search');
    const noResults = document.getElementById('faq-no-results');
    
    items.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
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
    });
    
    if (search) {
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
        }, state.isMobile ? 300 : 150));
    }
};

// ===== INTERSECTION OBSERVER OPTIMIZADO =====
const initIntersectionObserver = () => {
    if (state.performanceMode) return;
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('feature')) animateFeature(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: state.isMobile ? 0.05 : 0.15,
        rootMargin: state.isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
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
        }, 100 + (i * (state.isMobile ? 15 : 50)));
    });
};

// ===== LAZY LOADING DE IMÁGENES OPTIMIZADO =====
const setupImageLazyLoading = () => {
    const wait = () => {
        if (!imageLoader) return setTimeout(wait, 50);
        
        const loadNow = (sel, key) => { const el = document.querySelector(sel); if (el) imageLoader.loadNow(el, key); };
        const observe = (sel, key) => { const el = document.querySelector(sel); if (el) imageLoader.observe(el, key); };
        
        loadNow('.nav__logo', 'logo');
        loadNow('.mobile-nav__logo', 'logo');
        loadNow('.hero__phone-app-image', 'hero');
        
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

// ===== VIDEO HERO OPTIMIZADO =====
const initHeroVideo = () => {
    const video = document.getElementById('hero-video');
    const fallback = document.querySelector('.hero__phone-app-image');
    const mobileVideo = document.getElementById('hero-mobile-video');
    
    if (mobileVideo && state.isMobile) {
        Object.assign(mobileVideo, { 
            muted: true, 
            autoplay: !state.performanceMode, 
            loop: true, 
            playsInline: true, 
            preload: state.performanceMode ? 'none' : 'metadata' 
        });
    }
    
    if (!video || !fallback) return;
    
    const showFallback = () => {
        video.style.display = 'none';
        fallback.style.display = 'block';
        fallback.style.zIndex = '2';
    };
    
    if (state.isMobile || state.performanceMode) return showFallback();
    
    Object.assign(video, { muted: true, autoplay: true, loop: true, playsInline: true, preload: 'metadata' });
    video.addEventListener('loadeddata', () => video.classList.replace('loading', 'loaded'));
    video.addEventListener('error', showFallback);
    setTimeout(() => video.readyState < 2 && showFallback(), 1500);
};

// ===== UTILIDADES =====
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
const initPerformanceOptimizations = () => {
    if (!state.isMobile && !state.performanceMode) {
        const preload = () => {
            ['./assets/phones/Hero.avif', './assets/logo.avif'].forEach(src => {
                const link = document.createElement('link');
                Object.assign(link, { rel: 'preload', as: 'image', href: src });
                document.head.appendChild(link);
            });
        };
        
        'requestIdleCallback' in window ? requestIdleCallback(preload) : setTimeout(preload, 3000);
    }
    
    if (!state.performanceMode) {
        document.querySelectorAll('.hero__phone, .nav__logo, .mobile-nav__logo, .floating-widget__main-btn')
            .forEach(el => el.style.willChange = 'transform');
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newIsMobile = window.innerWidth <= 1023;
            if (newIsMobile !== state.isMobile) {
                state.isMobile = newIsMobile;
                detectDevice();
                if (state.isMenuOpen) closeMobileMenu();
                if (state.isMobileMenuOpen) closeMobileNavMenu();
                setTimeout(() => { initNavigation(); updateActiveNavOnScroll(); }, 50);
            }
            if (state.isFloatingMenuOpen) closeFloatingMenu();
            if (state.isLanguageSwitcherOpen) closeLanguageSwitcher();
        }, state.isMobile ? 300 : 250);
    });
};

// ===== ACCESIBILIDAD OPTIMIZADA =====
const initAccessibility = () => {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (state.isMenuOpen) closeMobileMenu();
            if (state.isMobileMenuOpen) closeMobileNavMenu();
            if (state.isFloatingMenuOpen) closeFloatingMenu();
            if (state.isLanguageSwitcherOpen) closeLanguageSwitcher();
        }
        if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
    });
    
    document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-navigation'));
    
    if (state.isMobile) {
        document.addEventListener('touchstart', () => document.body.classList.add('touch-navigation'), { passive: true });
    }
};

// ===== INICIALIZACIÓN OPTIMIZADA =====
document.addEventListener('DOMContentLoaded', () => {
    detectDevice();
    imageLoader = new ImageLoader();
    
    initLanguage();
    initLanguageSwitcher();
    initNavigation();
    initScrollEffects();
    initFAQ();
    initHeroVideo();
    initAccessibility();
    initFloatingWidget();
    setupImageLazyLoading();
    
    if (!state.performanceMode) {
        initVideoPlayer();
        initIntersectionObserver();
    }
    
    initPerformanceOptimizations();
});

// ===== MANEJO DE ERRORES OPTIMIZADO =====
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

// ===== LIMPIEZA =====
window.addEventListener('beforeunload', () => {
    imageLoader?.observer?.disconnect();
});

// ===== PWA SOLO EN DESKTOP =====
if ('serviceWorker' in navigator && !state.isMobile && !state.performanceMode) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registrado:', reg))
            .catch(err => console.log('SW falló:', err));
    });
}
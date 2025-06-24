// ===== VARIABLES GLOBALES OPTIMIZADAS =====
let isMenuOpen = false;
let isFloatingMenuOpen = false;
let isLanguageSwitcherOpen = false;
let currentLanguage = 'es';
let lastScrollY = 0;
let ticking = false;
let isReducedMotion = false;

// ===== CONFIGURACIÓN OPTIMIZADA =====
const CONFIG = {
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    DEBOUNCE_DELAY: 250,
    THROTTLE_DELAY: 16,
    
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
        WEBP: 'image/webp',
        JPEG: 'image/jpeg',
        PNG: 'image/png'
    }
};

// ===== SISTEMA DE TRADUCCIONES OPTIMIZADO =====
const translationData = {
    es: {
        'nav-home': 'Inicio',
        'nav-features': 'Características',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contacto',
        'nav-cta': 'Comienza tu prueba gratuita',
        'hero-title-main': 'DOMINA LOS',
        'hero-title-highlight': 'BLOQUES DE',
        'hero-title-amazon': 'AMAZON FLEX'
    },
    en: {
        'nav-home': 'Home',
        'nav-features': 'Features',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contact',
        'nav-cta': 'Start your free trial',
        'hero-title-main': 'MASTER THE',
        'hero-title-highlight': 'AMAZON FLEX',
        'hero-title-amazon': 'BLOCKS'
    }
};

// ===== CLASE OPTIMIZADA PARA LAZY LOADING =====
class LazyImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.observer = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );
        }
        this.setupLazyImages();
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    async loadImage(element) {
        const src = element.dataset.src;
        if (!src || this.imageCache.has(src)) return;
        
        try {
            element.classList.add('loading');
            
            await this.preloadImage(src);
            
            if (element.tagName === 'IMG') {
                element.src = src;
            } else {
                element.style.backgroundImage = `url('${src}')`;
            }
            
            element.classList.remove('loading');
            element.classList.add('loaded');
            this.imageCache.set(src, true);
            
        } catch (error) {
            console.error(`Error loading image: ${src}`, error);
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }
    
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }
    
    setupLazyImages() {
        const lazyImages = document.querySelectorAll('[data-src]');
        lazyImages.forEach(img => {
            if (this.observer) {
                this.observer.observe(img);
            } else {
                this.loadImage(img);
            }
        });
    }
}

// ===== FUNCIONES DE NAVEGACIÓN OPTIMIZADAS =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const navLogo = document.querySelector('.nav__logo');
    
    // Logo navigation
    if (navLogo) {
        navLogo.addEventListener('click', handleLogoClick);
        navLogo.addEventListener('keydown', handleLogoKeydown);
    }
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', handleToggleClick);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Close menu on outside click
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
}

function handleLogoClick(e) {
    e.preventDefault();
    if (isMenuOpen) closeMobileMenu();
    scrollToSection('#home');
}

function handleLogoKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLogoClick(e);
    }
}

function handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
}

function handleNavLinkClick(e) {
    e.preventDefault();
    if (isMenuOpen) closeMobileMenu();
    
    const targetId = e.target.getAttribute('href');
    scrollToSection(targetId);
    updateActiveNavLink(e.target);
}

function handleOutsideClick(e) {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileMenu();
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        if (isMenuOpen) closeMobileMenu();
        if (isFloatingMenuOpen) closeFloatingMenu();
        if (isLanguageSwitcherOpen) closeLanguageSwitcher();
    }
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
    
    // Focus management
    requestAnimationFrame(() => {
        const firstLink = navMenu.querySelector('.nav__link');
        if (firstLink) firstLink.focus();
    });
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
}

function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;
    
    const headerHeight = window.innerWidth <= 768 ? 70 : 80;
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback for older browsers
        animateScrollTo(targetPosition, 800);
    }
}

function animateScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');
}

// ===== LANGUAGE SWITCHER OPTIMIZADO =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    
    if (!languageSwitcherBtn) return;
    
    languageSwitcherBtn.addEventListener('click', handleLanguageSwitcherClick);
    
    languageOptions.forEach(option => {
        option.addEventListener('click', handleLanguageOptionClick);
    });
    
    updateLanguageSwitcher();
}

function handleLanguageSwitcherClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleLanguageSwitcher();
}

function handleLanguageOptionClick(e) {
    e.preventDefault();
    const selectedLanguage = e.target.getAttribute('data-lang');
    if (selectedLanguage && selectedLanguage !== currentLanguage) {
        switchLanguage(selectedLanguage);
        closeLanguageSwitcher();
    }
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
    if (!languageSwitcher) return;
    
    isLanguageSwitcherOpen = true;
    languageSwitcher.classList.add('active');
}

function closeLanguageSwitcher() {
    const languageSwitcher = document.getElementById('language-switcher');
    if (!languageSwitcher) return;
    
    isLanguageSwitcherOpen = false;
    languageSwitcher.classList.remove('active');
}

function switchLanguage(newLanguage) {
    if (!translationData[newLanguage]) return;
    
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    applyTranslations();
    updateLanguageSwitcher();
    document.documentElement.lang = newLanguage;
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    if (!currentTranslations) return;
    
    // Use requestIdleCallback for non-critical translation updates
    const translateElements = () => {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = currentTranslations[key];
            if (translation) {
                element.textContent = translation;
            }
        });
    };
    
    if ('requestIdleCallback' in window) {
        requestIdleCallback(translateElements);
    } else {
        setTimeout(translateElements, 0);
    }
}

function updateLanguageSwitcher() {
    const languageSwitcherText = document.getElementById('language-switcher-text');
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    
    if (languageSwitcherText) {
        languageSwitcherText.textContent = currentLanguage.toUpperCase();
    }
    
    languageOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        option.classList.toggle('active', optionLang === currentLanguage);
    });
}

// ===== FLOATING WIDGET OPTIMIZADO =====
function initializeFloatingWidget() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    if (!floatingMainBtn) return;
    
    floatingMainBtn.addEventListener('click', toggleFloatingMenu);
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

// ===== VIDEO PLAYER OPTIMIZADO =====
function initializeVideoPlayer() {
    const video = document.getElementById('main-video');
    const playOverlay = document.getElementById('play-overlay');
    
    if (!video || !playOverlay) return;
    
    playOverlay.addEventListener('click', handleVideoPlay);
    
    video.addEventListener('loadedmetadata', handleVideoLoadedMetadata);
    video.addEventListener('timeupdate', handleVideoTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('error', handleVideoError);
}

function handleVideoPlay() {
    const video = document.getElementById('main-video');
    const playOverlay = document.getElementById('play-overlay');
    
    if (!video || !playOverlay) return;
    
    if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playOverlay.style.opacity = '0';
                playOverlay.style.pointerEvents = 'none';
            }).catch(error => {
                console.error('Error playing video:', error);
            });
        }
    } else {
        video.pause();
        playOverlay.style.opacity = '1';
        playOverlay.style.pointerEvents = 'auto';
    }
}

function handleVideoLoadedMetadata() {
    const video = document.getElementById('main-video');
    const durationDisplay = document.querySelector('.videos__duration');
    
    if (durationDisplay && video) {
        durationDisplay.textContent = formatTime(video.duration);
    }
}

function handleVideoTimeUpdate() {
    const video = document.getElementById('main-video');
    const progressFill = document.querySelector('.videos__progress-fill');
    const currentTimeDisplay = document.querySelector('.videos__current-time');
    
    if (!video || !progressFill || !currentTimeDisplay) return;
    
    const progress = (video.currentTime / video.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(video.currentTime);
}

function handleVideoEnded() {
    const playOverlay = document.getElementById('play-overlay');
    const progressFill = document.querySelector('.videos__progress-fill');
    const currentTimeDisplay = document.querySelector('.videos__current-time');
    
    if (playOverlay) {
        playOverlay.style.opacity = '1';
        playOverlay.style.pointerEvents = 'auto';
    }
    
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    if (currentTimeDisplay) {
        currentTimeDisplay.textContent = '0:00';
    }
}

function handleVideoError() {
    const playOverlay = document.getElementById('play-overlay');
    if (playOverlay) {
        playOverlay.innerHTML = `
            <div class="videos__error">
                <div class="videos__error-icon">⚠️</div>
                <div class="videos__error-text">Error al cargar el video</div>
                <div class="videos__error-subtitle">Intenta recargar la página</div>
            </div>
        `;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ===== FAQ OPTIMIZADO =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    const searchInput = document.getElementById('faq-search');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (question) {
            question.addEventListener('click', () => handleFAQClick(item));
            question.addEventListener('keydown', (e) => handleFAQKeydown(e, item));
        }
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleFAQSearch, 300));
    }
}

function handleFAQClick(item) {
    const isActive = item.classList.contains('active');
    const answer = item.querySelector('.faq__answer');
    const question = item.querySelector('.faq__question');
    
    // Close all other items
    document.querySelectorAll('.faq__item').forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq__answer');
            const otherQuestion = otherItem.querySelector('.faq__question');
            if (otherAnswer) otherAnswer.classList.remove('active');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Toggle current item
    if (!isActive) {
        item.classList.add('active');
        if (answer) answer.classList.add('active');
        if (question) question.setAttribute('aria-expanded', 'true');
    } else {
        item.classList.remove('active');
        if (answer) answer.classList.remove('active');
        if (question) question.setAttribute('aria-expanded', 'false');
    }
}

function handleFAQKeydown(e, item) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFAQClick(item);
    }
}

function handleFAQSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const faqItems = document.querySelectorAll('.faq__item');
    const noResults = document.getElementById('faq-no-results');
    let visibleItems = 0;
    
    faqItems.forEach(item => {
        const questionText = item.querySelector('.faq__question-text');
        const answerText = item.querySelector('.faq__answer-text');
        
        if (questionText && answerText) {
            const questionContent = questionText.textContent.toLowerCase();
            const answerContent = answerText.textContent.toLowerCase();
            
            if (searchTerm === '' || 
                questionContent.includes(searchTerm) || 
                answerContent.includes(searchTerm)) {
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
        noResults.classList.toggle('show', visibleItems === 0 && searchTerm !== '');
    }
}

// ===== SCROLL EFFECTS OPTIMIZADO =====
function initializeScrollEffects() {
    window.addEventListener('scroll', throttle(handleScroll, CONFIG.THROTTLE_DELAY), { passive: true });
}

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNavOnScroll();
            ticking = false;
        });
        ticking = true;
    }
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

// ===== UTILITY FUNCTIONS =====
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

function checkReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
        document.body.classList.add('reduced-motion');
    }
}

function handleResize() {
    if (isMenuOpen && window.innerWidth > 1024) {
        closeMobileMenu();
    }
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    }
    if (isLanguageSwitcherOpen) {
        closeLanguageSwitcher();
    }
}

// ===== INITIALIZATION =====
function initializeApp() {
    console.log('🚀 Initializing StarFlex Performance Optimized...');
    
    checkReducedMotion();
    
    // Initialize critical components first
    initializeNavigation();
    initializeLanguageSwitcher();
    initializeFloatingWidget();
    
    // Initialize lazy loading
    new LazyImageLoader();
    
    // Use requestIdleCallback for non-critical components
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initializeVideoPlayer();
            initializeFAQ();
            initializeScrollEffects();
        });
    } else {
        setTimeout(() => {
            initializeVideoPlayer();
            initializeFAQ();
            initializeScrollEffects();
        }, 100);
    }
    
    // Handle resize efficiently
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, CONFIG.DEBOUNCE_DELAY);
    });
    
    console.log('✅ StarFlex Performance Optimized initialized');
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== INITIALIZATION =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===== DEBUG EXPORTS =====
window.StarFlexDebug = {
    toggleMobileMenu,
    switchLanguage,
    currentLanguage,
    isMenuOpen,
    isFloatingMenuOpen,
    isLanguageSwitcherOpen
};

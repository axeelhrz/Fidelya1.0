// ===== VARIABLES GLOBALES ULTRA OPTIMIZADAS =====
let isMenuOpen = false;
let currentFeature = 0;
const features = document.querySelectorAll('.feature');
let particleSystems = [];
let animationId = null;
let isReducedMotion = false;
let currentLanguage = 'es';
const translations = {};
let isFloatingMenuOpen = false;
let isLanguageSwitcherOpen = false;
let lastScrollY = 0;
let isScrollingDown = false;
let ticking = false;
let touchStartY = 0;
let touchEndY = 0;
let isNavbarVisible = true;

// ===== CONFIGURACIÓN ULTRA OPTIMIZADA =====
const CONFIG = {
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
        WEBP: 'image/webp',
        JPEG: 'image/jpeg',
        PNG: 'image/png'
    },
    
    IMAGE_PATHS: {
        logo: {
            avif: './assets/logo.avif',
            webp: './assets/logo.webp',
            png: './assets/logo.png'
        },
        phones: {
            horario: {
                avif: './assets/phones/Horario.avif'
            },
            estaciones: {
                avif: './assets/phones/Estaciones.avif'
            },
            calendario: {
                avif: './assets/phones/Calendario.avif'
            },
            registro: {
                avif: './assets/phones/Registro.avif'
            },
            notificaciones: {
                avif: './assets/phones/Notificaciones.avif'
            },
            referidos: {
                avif: './assets/phones/Referidos.avif'
            }
        },
        downloads: {
            apple: {
                avif: './assets/AppleStore.avif',
                webp: './assets/AppleStore.webp',
                png: './assets/AppleStore.png'
            },
            google: {
                avif: './assets/GooglePlay.avif',
                webp: './assets/GooglePlay.webp',
                png: './assets/GooglePlay.png'
            }
        }
    }
};

// ===== SISTEMA DE TRADUCCIONES ULTRA OPTIMIZADO =====
const translationData = {
    es: {
        'page-title': 'StarFlex - Automatiza tus Bloques de Amazon Flex | Prueba Gratis',
        'page-description': 'Starflex revoluciona Amazon Flex. Automatización inteligente de bloques, optimización de horarios y máximas ganancias. Únete a +15,000 conductores exitosos.',
        'og-title': 'Starflex - La Revolución de Amazon Flex',
        'og-description': 'Automatización inteligente que multiplica tus ganancias. La herramienta que todo conductor profesional necesita.',
        'nav-home': 'Inicio',
        'nav-features': 'Características',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contacto',
        'nav-cta': 'Comienza tu prueba gratuita',
        'hero-badge': 'Next-Gen Amazon Flex Revolution',
        'hero-title-main': 'DOMINA LOS',
        'hero-title-highlight': 'BLOQUES DE',
        'hero-title-amazon': 'AMAZON FLEX',
        'hero-company-description': 'Somos una empresa dedicada a mejorar la experiencia laboral de los conductores de Amazon Flex permitiendo seleccionar de forma automática y eficiente los mejores bloques de su preferencia.',
        'hero-subtitle': 'Automatización inteligente de última generación que multiplica tus ganancias. La plataforma más avanzada para conductores profesionales del futuro.',
        'hero-cta-main': 'PRUEBA <strong>GRATUITA</strong>',
        'hero-cta-trial': '3 DÍAS GRATIS',
        'hero-trust': 'Más de 15,000 conductores han transformado sus ganancias',
        'download-google': 'Descargar en Google Play',
        'download-apple': 'Descargar en App Store',
        'download-google-alt': 'Descargar en Google Play',
        'download-apple-alt': 'Descargar en App Store',
        'features-title': 'Características',
        'features-subtitle': 'Aquí puedes ver lo que te ofrece StarFlex.',
        'feature-schedule-title': 'HORARIO',
        'feature-schedule-description': 'Elige los días y horarios que prefieras para tus bloques de entrega.',
        'feature-schedule-item-1': 'Configuración personalizada por día',
        'feature-schedule-item-2': 'Horarios flexibles de trabajo',
        'feature-schedule-item-3': 'Optimización automática de turnos',
        'feature-schedule-item-4': 'Sincronización con tu calendario',
        'feature-stations-title': 'ESTACIONES',
        'feature-stations-description': 'Selecciona tus estaciones preferidas y precios para que nuestra app pueda ofrecerte los bloques que se ajusten a tus preferencias.',
        'feature-stations-item-1': 'Selección personalizada de estaciones favoritas',
        'feature-stations-item-2': 'Configuración de precios mínimos por estación',
        'feature-stations-item-3': 'Análisis de rentabilidad por ubicación',
        'feature-stations-item-4': 'Notificaciones instantáneas de bloques disponibles',
        'feature-stations-item-5': 'Mapa interactivo con todas las estaciones',
        'feature-calendar-title': 'CALENDARIO',
        'feature-calendar-description': 'En el calendario podrás ver tus bloques aceptados y encontrar las opciones para identificarte desde cualquier ubicación, así como la posibilidad de saltarte la selfie y cancelar bloques, todo en un solo lugar para tu máxima comodidad.',
        'feature-calendar-item-1': 'Identificación desde cualquier ubicación',
        'feature-calendar-item-2': 'Opción de saltar selfie',
        'feature-calendar-item-3': 'Cancelación rápida de bloques',
        'feature-log-title': 'REGISTRO',
        'feature-log-description': 'En el registro, podrá ver todos los bloques disponibles y el motivo detallado por el cual se ignoraron algunos. Esto le ayudará a ajustar sus filtros de preferencias según sea necesario para optimizar sus opciones.',
        'feature-log-item-1': 'Historial completo de bloques',
        'feature-log-item-2': 'Motivos detallados de rechazo',
        'feature-log-item-3': 'Optimización de filtros',
        'feature-log-item-4': 'Análisis de patrones',
        'feature-notifications-title': 'NOTIFICACIONES',
        'feature-notifications-description': 'StarFlex te mantiene informado con múltiples tipos de notificaciones para que nunca te pierdas los mejores bloques disponibles. Configura tus alertas según tus preferencias.',
        'feature-notifications-item-1': 'Notificaciones Push instantáneas',
        'feature-notifications-item-2': 'Alertas por correo electrónico',
        'feature-notifications-item-3': 'Llamadas telefónicas automáticas',
        'feature-notifications-item-4': 'Mensajes SMS directos',
        'feature-notifications-item-5': 'Alertas personalizables por tipo de bloque',
        'feature-notifications-item-6': 'Notificaciones en tiempo real',
        'feature-notifications-item-7': 'Filtros avanzados de notificación',
        'feature-referrals-title': 'REFERIDOS',
        'feature-referrals-description': 'Invitá a otros usuarios a unirse a Starflex y obtené beneficios exclusivos por cada referido que se registre.',
        'feature-referrals-item-1': 'Enlace único de referido personalizado',
        'feature-referrals-item-2': 'Gana 1 semana gratis por cada referido',
        'feature-referrals-item-3': 'Código QR para compartir fácilmente',
        'videos-badge': 'Experiencia Visual Inmersiva',
        'videos-title-main': 'VE STARFLEX',
        'videos-title-highlight': 'EN ACCIÓN',
        'videos-subtitle': 'Descubre cómo StarFlex revoluciona tu experiencia con Amazon Flex. Mira la automatización inteligente trabajando en tiempo real.',
        'video-not-supported': 'Tu navegador no soporta videos HTML5. <a href="./assets/StarFlex.mp4">Descargar video</a>.',
        'video-play-title': 'REPRODUCIR DEMO',
        'video-play-subtitle': 'Ver StarFlex en acción',
        'video-info-title': 'StarFlex Demo Completo',
        'video-info-description': 'Observa cómo StarFlex automatiza completamente tu experiencia con Amazon Flex. Desde la configuración inicial hasta la captura automática de bloques.',
        'videos-cta-title': '¿Listo para Transformar tus Ganancias?',
        'videos-cta-description': 'Únete a más de 15,000 conductores que ya están maximizando sus ingresos con StarFlex',
        'videos-cta-start': 'COMENZAR AHORA',
        'videos-cta-trial': '3 días gratis',
        'videos-cta-demo': 'VER DEMO PERSONALIZADA',
        'faq-title': 'Preguntas Frecuentes',
        'faq-subtitle': 'Encuentra respuestas claras a las dudas más comunes sobre StarFlex y descubre cómo transformar tu experiencia con Amazon Flex.',
        'faq-search-placeholder': 'Buscar pregunta...',
        'faq-1-question': '¿Cuáles son los principales beneficios de utilizar StarFlex?',
        'faq-1-answer': 'StarFlex está diseñado para <span class="faq__answer-highlight">eliminar la conducción distraída</span> mediante automatización inteligente. Te permite concentrarte completamente en la conducción segura mientras nuestro sistema trabaja para encontrar los mejores bloques. Con StarFlex, no necesitas revisar constantemente tu teléfono, garantizando una experiencia más segura y eficiente que te permite maximizar tus ganancias.',
        'faq-2-question': '¿StarFlex puede resolver automáticamente los CAPTCHA?',
        'faq-2-answer': 'Sí, StarFlex incluye <span class="faq__answer-highlight">tecnología avanzada para resolver CAPTCHA automáticamente</span>. Nuestro sistema utiliza algoritmos inteligentes que pueden interpretar y resolver diferentes tipos de verificaciones, permitiendo una navegación fluida sin interrupciones manuales. Esto optimiza tu tiempo y hace que tu experiencia diaria sea más eficiente.',
        'faq-3-question': '¿Es seguro usar StarFlex? ¿Amazon puede detectarlo?',
        'faq-3-answer': 'StarFlex utiliza <span class="faq__answer-highlight">tecnología avanzada de simulación humana</span> que incluye patrones de comportamiento naturales, tiempos de respuesta variables y gestos táctiles realistas. Nuestro enfoque se centra en ayudar a los conductores a brindar un mejor servicio a Amazon y sus clientes, asegurando entregas eficientes y de alta calidad.',
        'faq-4-question': '¿StarFlex funciona en iPhone y Android?',
        'faq-4-answer': 'Sí, StarFlex está disponible para <span class="faq__answer-highlight">iOS (iPhone 8+) y Android (8.0+)</span>. Hemos desarrollado aplicaciones nativas optimizadas para cada plataforma, garantizando el mejor rendimiento y una experiencia de usuario superior. Ambas versiones incluyen todas las funcionalidades y reciben actualizaciones automáticas.',
        'faq-5-question': '¿Qué necesito para empezar a usar StarFlex?',
        'faq-5-answer': 'Solo necesitas una <span class="faq__answer-highlight">cuenta activa de Amazon Flex y un dispositivo compatible</span>. Después de descargar la aplicación, el proceso de configuración toma menos de 5 minutos. Nuestro sistema de configuración guiada te ayudará a optimizar tu experiencia desde el primer día.',
        'faq-no-results': 'No se encontraron preguntas que coincidan con tu búsqueda',
        'faq-no-results-suggestion': 'Intenta con términos diferentes o contacta nuestro soporte',
        'contact-badge': 'Conecta con el Futuro',
        'contact-title-main': 'MEJORES BLOQUES DE',
        'contact-title-highlight': 'AMAZON FLEX',
        'contact-subtitle': 'No olvides seguirnos en nuestras redes sociales ya que publicamos diariamente en nuestros canales la recopilación de los mejores bloques aceptados y así podrás estar al tanto de los horarios y ubicaciones más rentables.',
        'contact-whatsapp-title': 'Canales de noticias de WhatsApp',
        'contact-whatsapp-description': 'Únete a nuestro canal de WhatsApp para recibir las últimas actualizaciones y mejores bloques disponibles',
        'contact-whatsapp-btn': 'Unirse al Canal',
        'contact-instagram-title': 'Instagram',
        'contact-instagram-description': 'Síguenos para contenido visual, tips y actualizaciones diarias sobre los mejores bloques',
        'contact-instagram-btn': 'Seguir',
        'contact-facebook-title': 'Facebook',
        'contact-facebook-description': 'Únete a nuestra comunidad en Facebook para interactuar con otros conductores y compartir experiencias',
        'contact-facebook-btn': 'Seguir',
        'contact-tiktok-title': 'TikTok',
        'contact-tiktok-description': 'Descubre contenido viral, tips rápidos y las últimas tendencias de Amazon Flex',
        'contact-tiktok-btn': 'Seguir',
        'contact-telegram-title': 'Canales de noticias de Telegram',
        'contact-telegram-description': 'Recibe notificaciones instantáneas de los mejores bloques y actualizaciones importantes',
        'contact-telegram-btn': 'Unirse al Canal',
        'contact-email-title': 'support@starflexapp.com',
        'contact-email-description': 'Contacta directamente con nuestro equipo de soporte técnico especializado',
        'contact-email-btn': 'Enviar Email',
        'footer-legal': 'Política de Privacidad • Términos y Condiciones',
        'footer-copyright': '© StarFlex • Todos los derechos reservados',
        'footer-cta-main': 'COMENZAR AHORA',
        'footer-cta-trial': '3 días gratis'
    },
    en: {
        'page-title': 'StarFlex - Automate your Amazon Flex Blocks | Free Trial',
        'page-description': 'Starflex revolutionizes Amazon Flex. Intelligent block automation, schedule optimization and maximum earnings. Join +15,000 successful drivers.',
        'og-title': 'Starflex - The Amazon Flex Revolution',
        'og-description': 'Intelligent automation that multiplies your earnings. The tool every professional driver needs.',
        'nav-home': 'Home',
        'nav-features': 'Features',
        'nav-videos': 'Videos',
        'nav-faq': 'FAQ',
        'nav-contact': 'Contact',
        'nav-cta': 'Start your free trial',
        'hero-badge': 'Next-Gen Amazon Flex Revolution',
        'hero-title-main': 'MASTER THE',
        'hero-title-highlight': 'AMAZON FLEX',
        'hero-title-amazon': 'BLOCKS',
        'hero-company-description': 'We are a company dedicated to improving the work experience of Amazon Flex drivers by allowing them to automatically and efficiently select the best blocks of their preference.',
        'hero-subtitle': 'Next-generation intelligent automation that multiplies your earnings. The most advanced platform for professional drivers of the future.',
        'hero-cta-main': '<strong>FREE</strong> TRIAL',
        'hero-cta-trial': '3 DAYS FREE',
        'hero-trust': 'More than 15,000 drivers have transformed their earnings'
        // ... resto de traducciones en inglés (truncado por brevedad)
    }
};

// ===== CLASE ULTRA OPTIMIZADA PARA OPTIMIZACIÓN DE IMÁGENES =====
class ImageOptimizer {
    constructor() {
        this.supportedFormats = new Set();
        this.imageCache = new Map();
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        this.init();
    }
    
    async init() {
        await this.detectFormatSupport();
        this.setupLazyLoading();
        this.preloadCriticalImages();
    }
    
    async detectFormatSupport() {
        const formats = [
            { type: 'avif', data: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=' },
            { type: 'webp', data: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA' }
        ];
        
        const promises = formats.map(format => 
            this.canUseFormat(format.data).then(supported => {
                if (supported) {
                    this.supportedFormats.add(format.type);
                }
            })
        );
        
        await Promise.all(promises);
        
        this.supportedFormats.add('jpeg');
        this.supportedFormats.add('png');
        
        console.log('Formatos soportados:', Array.from(this.supportedFormats));
    }
    
    canUseFormat(dataUrl) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img.width > 0 && img.height > 0);
            img.onerror = () => resolve(false);
            img.src = dataUrl;
        });
    }
    
    getBestImageUrl(imageConfig) {
        if (this.supportedFormats.has('avif') && imageConfig.avif) {
            return imageConfig.avif;
        }
        if (this.supportedFormats.has('webp') && imageConfig.webp) {
            return imageConfig.webp;
        }
        return imageConfig.jpg || imageConfig.png;
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.intersectionObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );
        }
    }
    
    async loadImage(element) {
        const imageKey = element.dataset.imageKey;
        const imageConfig = this.getImageConfig(imageKey);
        
        if (!imageConfig) {
            console.warn(`Configuración de imagen no encontrada para: ${imageKey}`);
            return;
        }
        
        const bestUrl = this.getBestImageUrl(imageConfig);
        
        try {
            element.classList.add('loading');
            
            await this.preloadImage(bestUrl);
            
            if (element.tagName === 'IMG') {
                element.src = bestUrl;
            } else {
                element.style.backgroundImage = `url('${bestUrl}')`;
            }
            
            element.classList.remove('loading');
            element.classList.add('loaded');
            
            console.log(`Imagen cargada: ${imageKey} -> ${bestUrl}`);
            
        } catch (error) {
            console.error(`Error cargando imagen ${imageKey}:`, error);
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }
    
    preloadImage(url) {
        if (this.imageCache.has(url)) {
            return Promise.resolve();
        }
        
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
    
    async preloadCriticalImages() {
        const criticalImages = [
            'hero',
            'logo'
        ];
        
        const preloadPromises = criticalImages.map(async (key) => {
            const config = this.getImageConfig(key);
            if (config) {
                const url = this.getBestImageUrl(config);
                try {
                    await this.preloadImage(url);
                    console.log(`Imagen crítica precargada: ${key} -> ${url}`);
                } catch (error) {
                    console.warn(`Error precargando imagen crítica ${key}:`, error);
                }
            }
        });
        
        await Promise.all(preloadPromises);
    }
    
    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.lazyImages.add(element);
        
        if (this.intersectionObserver) {
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

// ===== INICIALIZACIÓN GLOBAL =====
let imageOptimizer;

// ===== FUNCIONES DE TRADUCCIÓN ULTRA OPTIMIZADAS =====
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
    const languageButtons = document.querySelectorAll('.language-btn');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
            }
        });
    });
}

function switchLanguage(newLanguage) {
    if (!translationData[newLanguage]) {
        console.warn(`Language ${newLanguage} not supported`);
        return;
    }
    
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    applyTranslations();
    updateLanguageButtons();
    
    document.documentElement.lang = newLanguage;
    
    document.body.style.opacity = '0.95';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 150);
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    
    if (!currentTranslations) {
        console.warn(`Translations for ${currentLanguage} not found`);
        return;
    }
    
    // Usar requestIdleCallback para no bloquear el hilo principal
    const translateElements = () => {
        const elements = document.querySelectorAll('[data-translate]');
        const batchSize = 10;
        let index = 0;
        
        const processBatch = () => {
            const endIndex = Math.min(index + batchSize, elements.length);
            
            for (let i = index; i < endIndex; i++) {
                const element = elements[i];
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
            }
            
            index = endIndex;
            
            if (index < elements.length) {
                requestIdleCallback(processBatch);
            }
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(processBatch);
        } else {
            setTimeout(processBatch, 0);
        }
    };
    
    translateElements();
    
    // Procesar otros atributos de traducción
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = currentTranslations[key];
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    document.querySelectorAll('[data-translate-aria]').forEach(element => {
        const key = element.getAttribute('data-translate-aria');
        const translation = currentTranslations[key];
        if (translation) {
            element.setAttribute('aria-label', translation);
        }
    });
    
    document.querySelectorAll('[data-translate-alt]').forEach(element => {
        const key = element.getAttribute('data-translate-alt');
        const translation = currentTranslations[key];
        if (translation) {
            element.alt = translation;
        }
    });
}

function updateLanguageButtons() {
    const languageButtons = document.querySelectorAll('.language-btn');
    languageButtons.forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        if (buttonLang === currentLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    updateLanguageSwitcher();
}

// ===== FUNCIONES DEL SELECTOR DE IDIOMA ULTRA OPTIMIZADAS =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcherDropdown = document.getElementById('language-switcher-dropdown');
    const languageSwitcher = document.getElementById('language-switcher');
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    
    if (!languageSwitcherBtn || !languageSwitcherDropdown || !languageSwitcher) return;
    
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
    
    document.addEventListener('click', (e) => {
        if (isLanguageSwitcherOpen && languageSwitcher && !languageSwitcher.contains(e.target)) {
            closeLanguageSwitcher();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLanguageSwitcherOpen) {
            closeLanguageSwitcher();
        }
    });
    
    updateLanguageSwitcher();
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
    
    setTimeout(() => {
        const firstOption = languageSwitcher.querySelector('.language-switcher__option');
        if (firstOption) {
            firstOption.focus();
        }
    }, 100);
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
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    
    if (languageSwitcherText) {
        languageSwitcherText.textContent = currentLanguage.toUpperCase();
    }
    
    languageOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// ===== FUNCIONES DEL BOTÓN FLOTANTE ULTRA OPTIMIZADAS =====
function initializeFloatingWidget() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    floatingMainBtn.addEventListener('click', () => {
        toggleFloatingMenu();
    });
    
    document.addEventListener('click', (e) => {
        const floatingWidget = document.getElementById('floating-widget');
        if (isFloatingMenuOpen && floatingWidget && !floatingWidget.contains(e.target)) {
            closeFloatingMenu();
        }
    });
    
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
    
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.opacity = '1';
        }, index * 100);
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

// ===== DETECCIÓN DE PREFERENCIAS DE MOVIMIENTO =====
function checkReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isReducedMotion) {
        document.body.classList.add('reduced-motion');
        particleSystems.forEach(system => system.destroy());
        particleSystems = [];
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
}

// ===== INICIALIZACIÓN DEL VIDEO HERO ULTRA OPTIMIZADA =====
function initializeHeroVideo() {
    const heroVideo = document.getElementById('hero-video');
    const heroFallbackImage = document.querySelector('.hero__phone-app-image');
    
    if (!heroVideo) return;
    
    heroVideo.muted = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'metadata';
    
    heroVideo.style.opacity = '1';
    heroVideo.style.transition = 'none';
    
    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('loaded');
        console.log('Hero video: Datos cargados');
    });
    
    heroVideo.addEventListener('canplay', () => {
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('loaded');
        console.log('Hero video: Listo para reproducir');
        
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Hero video: Error al reproducir automáticamente:', error);
                showVideoFallback();
            });
        }
    });
    
    heroVideo.addEventListener('error', (e) => {
        console.error('Hero video: Error de carga:', e);
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('error');
        showVideoFallback();
    });
    
    heroVideo.addEventListener('playing', () => {
        console.log('Hero video: Reproduciendo');
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('loaded');
    });
    
    function showVideoFallback() {
        if (heroFallbackImage) {
            heroFallbackImage.style.display = 'block';
            heroFallbackImage.style.zIndex = '2';
            console.log('Hero video: Mostrando imagen de fallback');
        }
    }
    
    // Optimización: cargar video solo cuando sea visible
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.load();
                    videoObserver.unobserve(heroVideo);
                }
            });
        }, {
            threshold: 0.1
        });
        
        videoObserver.observe(heroVideo);
    } else {
        heroVideo.load();
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            heroVideo.pause();
        } else if (heroVideo.paused && !heroVideo.ended) {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Hero video: Error al reanudar:', error);
                });
            }
        }
    });
}

// ===== NAVEGACIÓN RESPONSIVE ULTRA OPTIMIZADA =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');
    
    const navLogo = document.querySelector('.nav__logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isMenuOpen) {
                closeMobileMenu();
            }
            
            const homeSection = document.querySelector('#home');
            if (homeSection) {
                smoothScrollToSection(homeSection);
                
                const homeLink = document.querySelector('.nav__link[href="#home"]');
                if (homeLink) {
                    updateActiveNavLink(homeLink);
                }
            }
        });
        
        navLogo.style.cursor = 'pointer';
        navLogo.setAttribute('tabindex', '0');
        navLogo.setAttribute('role', 'button');
        navLogo.setAttribute('aria-label', 'Ir al inicio');
        
        navLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLogo.click();
            }
        });
    }
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollToSection(targetSection);
                updateActiveNavLink(link);
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    initializeTouchGestures();
    initializeKeyboardNavigation();
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
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = true;
    
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    body.classList.add('no-scroll');
    
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
            link.style.transition = 'all 0.3s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
    
    setTimeout(() => {
        const firstLink = navMenu.querySelector('.nav__link');
        if (firstLink) {
            firstLink.focus();
        }
    }, 300);
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = false;
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('no-scroll');
    
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.style.transition = '';
        link.style.opacity = '';
        link.style.transform = '';
    });
    
    navToggle.focus();
}

function smoothScrollToSection(targetSection) {
    const headerHeight = window.innerWidth <= 768 ? 70 : 80;
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
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

// ===== GESTOS TÁCTILES ULTRA OPTIMIZADOS =====
function initializeTouchGestures() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    navMenu.addEventListener('touchstart', (e) => {
        if (!isMenuOpen) return;
        startY = e.touches[0].clientY;
        isDragging = true;
        navMenu.style.transition = 'none';
    }, { passive: true });
    
    navMenu.addEventListener('touchmove', (e) => {
        if (!isDragging || !isMenuOpen) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY < 0) {
            const translateY = Math.abs(deltaY);
            navMenu.style.transform = `translateY(-${translateY}px)`;
            navMenu.style.opacity = Math.max(0.3, 1 - (translateY / 200));
        }
    }, { passive: true });
    
    navMenu.addEventListener('touchend', () => {
        if (!isDragging || !isMenuOpen) return;
        isDragging = false;
        navMenu.style.transition = '';
        const deltaY = currentY - startY;
        
        if (deltaY < -100) {
            closeMobileMenu();
        } else {
            navMenu.style.transform = '';
            navMenu.style.opacity = '';
        }
    }, { passive: true });
}

// ===== NAVEGACIÓN POR TECLADO ULTRA OPTIMIZADA =====
function initializeKeyboardNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (!navMenu || !navToggle) return;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            e.preventDefault();
            closeMobileMenu();
            return;
        }
        
        if (e.key === 'Tab' && isMenuOpen) {
            handleTabTrap(e);
        }
        
        if ((e.key === 'Enter' || e.key === ' ') && e.target === navToggle) {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
}

function handleTabTrap(e) {
    const navMenu = document.getElementById('nav-menu');
    const focusableElements = navMenu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

// ===== EFECTOS DE SCROLL ULTRA OPTIMIZADOS =====
function initializeScrollEffects() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                handleScrollDirection();
                ticking = false;
            });
            ticking = true;
        }
        
        // Debounce para operaciones costosas
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Operaciones menos críticas aquí
        }, 100);
    }, { passive: true });
}

function handleScrollDirection() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        isScrollingDown = true;
    } else {
        isScrollingDown = false;
    }
    
    lastScrollY = currentScrollY;
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

// ===== REPRODUCTOR DE VIDEO ULTRA OPTIMIZADO =====
function initializeVideoPlayer() {
    const video = document.getElementById('main-video');
    const playOverlay = document.getElementById('play-overlay');
    const progressBar = document.querySelector('.videos__progress-bar');
    const progressFill = document.querySelector('.videos__progress-fill');
    const currentTimeDisplay = document.querySelector('.videos__current-time');
    const durationDisplay = document.querySelector('.videos__duration');
    const progressIndicators = document.querySelector('.videos__progress-indicators');
    
    if (!video || !playOverlay) return;
    
    let isPlaying = false;
    let isDragging = false;
    
    // Cargar video solo cuando se hace clic
    playOverlay.addEventListener('click', () => {
        if (!video.src || video.readyState === 0) {
            video.load();
        }
        
        if (video.paused) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    playOverlay.style.opacity = '0';
                    playOverlay.style.pointerEvents = 'none';
                    progressIndicators.style.opacity = '1';
                }).catch(error => {
                    console.error('Error al reproducir video:', error);
                    showVideoError();
                });
            }
        } else {
            video.pause();
            isPlaying = false;
            playOverlay.style.opacity = '1';
            playOverlay.style.pointerEvents = 'auto';
        }
    });
    
    video.addEventListener('loadedmetadata', () => {
        if (durationDisplay) {
            durationDisplay.textContent = formatTime(video.duration);
        }
    });
    
    video.addEventListener('timeupdate', () => {
        if (!isDragging && progressFill && currentTimeDisplay) {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${progress}%`;
            currentTimeDisplay.textContent = formatTime(video.currentTime);
        }
    });
    
    video.addEventListener('ended', () => {
        isPlaying = false;
        playOverlay.style.opacity = '1';
        playOverlay.style.pointerEvents = 'auto';
        progressIndicators.style.opacity = '0.7';
        if (progressFill) {
            progressFill.style.width = '0%';
        }
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = '0:00';
        }
    });
    
    video.addEventListener('error', () => {
        showVideoError();
    });
    
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            video.currentTime = progress * video.duration;
        });
        
        progressBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            video.currentTime = progress * video.duration;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && progressBar) {
                const rect = progressBar.getBoundingClientRect();
                const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const progress = clickX / rect.width;
                video.currentTime = progress * video.duration;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    function showVideoError() {
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
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ===== FAQ SECTION ULTRA OPTIMIZADA =====
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
                
                if (!isActive) {
                    item.classList.add('active');
                    answer.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('active');
                    answer.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                }
            });
            
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
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
                if (visibleItems === 0 && searchTerm !== '') {
                    noResults.classList.add('show');
                } else {
                    noResults.classList.remove('show');
                }
            }
        }, 300));
    }
}

// ===== INTERSECTION OBSERVER ULTRA OPTIMIZADO =====
function initializeIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                if (entry.target.classList.contains('feature')) {
                    const phoneImage = entry.target.querySelector('.phone__app-image');
                    if (phoneImage && !phoneImage.classList.contains('loaded')) {
                        const featureIndex = Array.from(document.querySelectorAll('.feature')).indexOf(entry.target);
                        const imageKeys = [
                            'phones.horario',
                            'phones.estaciones', 
                            'phones.calendario',
                            'phones.registro',
                            'phones.notificaciones',
                            'phones.referidos'
                        ];
                        
                        if (imageOptimizer && imageKeys[featureIndex]) {
                            imageOptimizer.loadImage(phoneImage);
                        }
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToObserve = document.querySelectorAll('.feature, .videos, .faq, .contact');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// ===== LAZY LOADING DE IMÁGENES ULTRA OPTIMIZADO =====
function setupImageLazyLoading() {
    const waitForOptimizer = () => {
        if (!imageOptimizer || !imageOptimizer.supportedFormats.size) {
            setTimeout(waitForOptimizer, 100);
            return;
        }
        
        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) {
            imageOptimizer.loadImageImmediately(navLogo, 'logo');
        }
        
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroImage) {
            imageOptimizer.loadImageImmediately(heroImage, 'hero');
        }
        
        const featureImages = document.querySelectorAll('.phone__app-image');
        featureImages.forEach((img, index) => {
            const imageKeys = [
                'phones.horario',
                'phones.estaciones',
                'phones.calendario',
                'phones.registro',
                'phones.notificaciones',
                'phones.referidos'
            ];
            
            if (imageKeys[index]) {
                imageOptimizer.observeImage(img, imageKeys[index]);
            }
        });
        
        const appleBtn = document.querySelector('.download-btn--app-store .download-btn__image');
        const googleBtn = document.querySelector('.download-btn:not(.download-btn--app-store) .download-btn__image');
        
        if (appleBtn) {
            imageOptimizer.loadImageImmediately(appleBtn, 'downloads.apple');
        }
        if (googleBtn) {
            imageOptimizer.loadImageImmediately(googleBtn, 'downloads.google');
        }
    };
    
    waitForOptimizer();
}

// ===== FUNCIONES UTILITARIAS ULTRA OPTIMIZADAS =====
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

// ===== OPTIMIZACIONES DE RENDIMIENTO ULTRA AVANZADAS =====
function initializePerformanceOptimizations() {
    // Usar requestIdleCallback para tareas no críticas
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            preloadCriticalResources();
        });
    } else {
        setTimeout(preloadCriticalResources, 2000);
    }
    
    // Optimizar will-change solo cuando sea necesario
    const phoneImages = document.querySelectorAll('.phone__app-image, .hero__phone-app-image');
    phoneImages.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.willChange = 'transform';
        });
        img.addEventListener('mouseleave', () => {
            img.style.willChange = 'auto';
        });
    });
    
    // Manejar resize de forma eficiente
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });
    
    // Optimizar scroll con passive listeners
    window.addEventListener('scroll', throttle(() => {
        // Solo operaciones críticas aquí
    }, 16), { passive: true });
}

function preloadCriticalResources() {
    const criticalResources = [
        './assets/phones/Hero.mp4'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });
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

// ===== INICIALIZACIÓN PRINCIPAL ULTRA OPTIMIZADA =====
function initializeApp() {
    console.log('🚀 Inicializando StarFlex Landing Page...');
    
    checkReducedMotion();
    
    // Inicializar optimizador de imágenes
    imageOptimizer = new ImageOptimizer();
    
    // Inicializar componentes críticos primero
    initializeLanguageSystem();
    initializeLanguageSwitcher();
    initializeNavigation();
    initializeFloatingWidget();
    
    // Usar requestIdleCallback para componentes menos críticos
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initializeHeroVideo();
            initializeVideoPlayer();
            initializeFAQ();
            initializeScrollEffects();
            initializeIntersectionObserver();
            setupImageLazyLoading();
            initializePerformanceOptimizations();
        });
    } else {
        setTimeout(() => {
            initializeHeroVideo();
            initializeVideoPlayer();
            initializeFAQ();
            initializeScrollEffects();
            initializeIntersectionObserver();
            setupImageLazyLoading();
            initializePerformanceOptimizations();
        }, 100);
    }
    
    console.log('✅ StarFlex Landing Page inicializada correctamente');
}

// ===== MANEJO GLOBAL DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error global capturado:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});

// ===== INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ===== EXPORTAR FUNCIONES PARA DEBUGGING =====
window.StarFlexDebug = {
    imageOptimizer,
    toggleMobileMenu,
    switchLanguage,
    currentLanguage,
    isMenuOpen,
    isFloatingMenuOpen,
    isLanguageSwitcherOpen
};

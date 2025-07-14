// ===== STARFLEX 2.0 - ULTRA-OPTIMIZED JAVASCRIPT ENGINE =====
// Performance-first architecture with zero-lag guarantee

// ===== ULTRA-OPTIMIZED GLOBAL VARIABLES =====
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
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let performanceMode = false;
let isLowEndDevice = false;

// ===== PERFORMANCE DETECTION SYSTEM =====
const DeviceCapabilities = {
    init() {
        this.detectDevice();
        this.detectConnection();
        this.detectMemory();
        this.setPerformanceMode();
        this.applyOptimizations();
    },

    detectDevice() {
        const ua = navigator.userAgent;
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const deviceMemory = navigator.deviceMemory || 4;
        
        // Detect low-end devices more aggressively
        isLowEndDevice = (
            hardwareConcurrency <= 4 ||
            deviceMemory <= 4 ||
            /Android.*[4-6]\./i.test(ua) ||
            /iPhone.*OS [8-12]_/i.test(ua) ||
            /iPad.*OS [8-12]_/i.test(ua)
        );
        
        isMobile = window.innerWidth <= 1023 || /Mobi|Android/i.test(ua);
    },

    detectConnection() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            const slowConnection = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
            if (slowConnection) isLowEndDevice = true;
        }
    },

    detectMemory() {
        if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
            isLowEndDevice = true;
        }
    },

    setPerformanceMode() {
        performanceMode = isMobile && (isLowEndDevice || isReducedMotion);
        
        if (performanceMode) {
            document.documentElement.classList.add('performance-mode');
            this.injectPerformanceCSS();
        }
    },

    injectPerformanceCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .performance-mode * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.1s !important;
                will-change: auto !important;
            }
            .performance-mode .bg-canvas,
            .performance-mode .nebula-layer,
            .performance-mode .light-blobs,
            .performance-mode .light-particles {
                display: none !important;
            }
            .performance-mode .hero__phone::before,
            .performance-mode .hero__phone::after,
            .performance-mode .feature__phone::before,
            .performance-mode .feature__phone::after {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    applyOptimizations() {
        if (performanceMode) {
            // Disable non-critical animations
            document.querySelectorAll('.hero__phone, .feature__phone').forEach(el => {
                el.style.transform = 'none';
                el.style.animation = 'none';
            });
        }
    }
};

// ===== ULTRA-OPTIMIZED CONFIG SYSTEM =====
const CONFIG = {
    ANIMATION_DURATION: performanceMode ? 100 : (isMobile ? 200 : 400),
    SCROLL_THRESHOLD: isMobile ? 20 : 50,
    DEBOUNCE_DELAY: performanceMode ? 200 : (isMobile ? 150 : 100),
    THROTTLE_DELAY: performanceMode ? 100 : (isMobile ? 50 : 25),
    
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

// ===== ULTRA-OPTIMIZED TRANSLATION SYSTEM =====
const TranslationEngine = {
    data: {
        es: {
            // Meta tags
            'page-title': 'StarFlex - Automatiza tus Bloques de Amazon Flex | Prueba Gratis',
            'page-description': 'Starflex revoluciona Amazon Flex. Automatización inteligente de bloques, optimización de horarios y máximas ganancias. Únete a +15,000 conductores exitosos.',
            'og-title': 'Starflex - La Revolución de Amazon Flex',
            'og-description': 'Automatización inteligente que multiplica tus ganancias. La herramienta que todo conductor profesional necesita.',
            
            // Navigation
            'nav-home': 'Inicio',
            'nav-features': 'Características',
            'nav-videos': 'Videos',
            'nav-faq': 'FAQ',
            'nav-contact': 'Contacto',
            'nav-cta': 'Comienza tu prueba gratuita',
            'nav-language-title': 'Idioma',
            
            // Hero Section
            'hero-badge': 'Next-Gen Amazon Flex Revolution',
            'hero_title--main': 'DOMINA LOS',
            'hero_title--highlight': 'BLOQUES DE',
            'hero_title--amazon': 'AMAZON FLEX',
            'hero-company-description': 'Somos una empresa dedicada a mejorar la experiencia laboral de los conductores de Amazon Flex permitiendo seleccionar de forma automática y eficiente los mejores bloques de su preferencia.',
            'hero-subtitle': 'Automatización inteligente de última generación que multiplica tus ganancias. La plataforma más avanzada para conductores profesionales del futuro.',
            'hero-cta-main': 'PRUEBA <strong>GRATUITA</strong>',
            'hero-cta-trial': '3 DÍAS GRATIS',
            'hero-trust': 'Más de 15,000 conductores han transformado sus ganancias',
            'download-google': 'Descargar en Google Play',
            'download-apple': 'Descargar en App Store',
            'download-google-alt': 'Descargar en Google Play',
            'download-apple-alt': 'Descargar en App Store',
            
            // Features Section
            'features-title': 'Características',
            'features-subtitle': 'Descubre todas las funcionalidades que StarFlex te ofrece para maximizar tus ganancias.',
            
            // Feature 1: Horario
            'feature-schedule-title': 'HORARIO',
            'feature-schedule-description': 'Elige los días y horarios que prefieras para tus bloques de entrega. Configura tu disponibilidad de manera inteligente y deja que StarFlex encuentre los mejores bloques en tus horarios preferidos.',
            'feature-schedule-item-1': 'Configuración personalizada por día de la semana',
            'feature-schedule-item-2': 'Horarios flexibles adaptados a tu estilo de vida',
            'feature-schedule-item-3': 'Optimización automática de turnos rentables',
            'feature-schedule-item-4': 'Sincronización inteligente con tu calendario personal',
            'feature-schedule-item-5': 'Alertas de disponibilidad en tiempo real',
            
            // Feature 2: Estaciones
            'feature-stations-title': 'ESTACIONES',
            'feature-stations-description': 'Selecciona tus estaciones preferidas y configura precios mínimos para que nuestra aplicación pueda ofrecerte automáticamente los bloques que se ajusten perfectamente a tus preferencias y ubicación.',
            'feature-stations-item-1': 'Selección personalizada de estaciones favoritas',
            'feature-stations-item-2': 'Configuración de precios mínimos por estación',
            'feature-stations-item-3': 'Análisis detallado de rentabilidad por ubicación',
            'feature-stations-item-4': 'Notificaciones instantáneas de bloques disponibles',
            'feature-stations-item-5': 'Mapa interactivo con todas las estaciones cercanas',
            'feature-stations-item-6': 'Filtros avanzados por distancia y tipo de entrega',
            
            // Feature 3: Calendario
            'feature-calendar-title': 'CALENDARIO',
            'feature-calendar-description': 'En el calendario podrás ver todos tus bloques aceptados y acceder a funciones avanzadas como identificación desde cualquier ubicación, opción de saltar la selfie y cancelación rápida de bloques, todo centralizado para tu máxima comodidad.',
            'feature-calendar-item-1': 'Identificación automática desde cualquier ubicación',
            'feature-calendar-item-2': 'Opción inteligente para saltar verificación selfie',
            'feature-calendar-item-3': 'Cancelación rápida y segura de bloques',
            'feature-calendar-item-4': 'Vista mensual y semanal de tus entregas',
            'feature-calendar-item-5': 'Recordatorios automáticos de bloques próximos',
            
            // Feature 4: Registro
            'feature-log-title': 'REGISTRO',
            'feature-log-description': 'En el registro detallado podrás ver todos los bloques disponibles y el motivo específico por el cual algunos fueron ignorados. Esta información te ayudará a ajustar tus filtros y preferencias para optimizar continuamente tus opciones de entrega.',
            'feature-log-item-1': 'Historial completo y detallado de todos los bloques',
            'feature-log-item-2': 'Motivos específicos y detallados de rechazo automático',
            'feature-log-item-3': 'Herramientas de optimización de filtros inteligentes',
            'feature-log-item-4': 'Análisis avanzado de patrones y tendencias',
            'feature-log-item-5': 'Estadísticas de rendimiento y ganancias',
            
            // Feature 5: Notificaciones
            'feature-notifications-title': 'NOTIFICACIONES',
            'feature-notifications-description': 'StarFlex te mantiene siempre informado con un sistema completo de notificaciones múltiples para que nunca te pierdas los mejores bloques disponibles. Configura tus alertas según tus preferencias específicas y recibe notificaciones en tiempo real.',
            'feature-notifications-item-1': 'Notificaciones Push instantáneas y personalizables',
            'feature-notifications-item-2': 'Alertas automáticas por correo electrónico',
            'feature-notifications-item-3': 'Llamadas telefónicas automáticas para bloques premium',
            'feature-notifications-item-4': 'Mensajes SMS directos y urgentes',
            'feature-notifications-item-5': 'Alertas personalizables por tipo y valor de bloque',
            'feature-notifications-item-6': 'Sistema de notificaciones en tiempo real 24/7',
            'feature-notifications-item-7': 'Filtros avanzados de notificación por prioridad',
            
            // Feature 6: Referidos
            'feature-referrals-title': 'REFERIDOS',
            'feature-referrals-description': 'Invita a otros conductores a unirse a la revolución StarFlex y obtén beneficios exclusivos por cada referido que se registre exitosamente. Comparte tu experiencia y gana recompensas mientras ayudas a otros conductores a maximizar sus ganancias.',
            'feature-referrals-item-1': 'Enlace único de referido personalizado y rastreable',
            'feature-referrals-item-2': 'Gana 1 semana completamente gratis por cada referido exitoso',
            'feature-referrals-item-3': 'Código QR dinámico para compartir fácilmente',
            'feature-referrals-item-4': 'Panel de seguimiento de referidos en tiempo real',
            'feature-referrals-item-5': 'Bonificaciones adicionales por referidos activos',
            
            // FAQ Section
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
            
            // Contact Section
            'contact-badge': 'Conecta con el Futuro',
            'contact-title-main': 'MEJORES BLOQUES DE',
            'contact-title-highlight': 'AMAZON FLEX',
            'contact-subtitle': 'No olvides seguirnos en nuestras redes sociales ya que publicamos diariamente en nuestros canales la recopilación de los mejores bloques aceptados y así podrás estar al tanto de los horarios y ubicaciones más rentables.',
            'contact-whatsapp-title': 'Canales de noticias de WhatsApp',
            'contact-whatsapp-description': 'Únete a nuestro canal de WhatsApp para recibir las últimas actualizaciones y mejores bloques disponibles',
            'contact-whatsapp-btn': 'Unirse',
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
            'contact-telegram-btn': 'Unirse',
            'contact-email-title': 'support@starflexapp.com',
            'contact-email-description': 'Contacta directamente con nuestro equipo de soporte técnico especializado',
            'contact-email-btn': 'Contactar',
            
            // Footer
            'footer-legal': 'Política de Privacidad • Términos y Condiciones',
            'footer-copyright': '© StarFlex • Todos los derechos reservados',
            'footer-cta-main': 'COMENZAR AHORA',
            'footer-cta-trial': '3 días gratis'
        },
        en: {
            // Meta tags
            'page-title': 'StarFlex - Automate your Amazon Flex Blocks | Free Trial',
            'page-description': 'Starflex revolutionizes Amazon Flex. Intelligent block automation, schedule optimization and maximum earnings. Join +15,000 successful drivers.',
            'og-title': 'Starflex - The Amazon Flex Revolution',
            'og-description': 'Intelligent automation that multiplies your earnings. The tool every professional driver needs.',
            
            // Navigation
            'nav-home': 'Home',
            'nav-features': 'Features',
            'nav-videos': 'Videos',
            'nav-faq': 'FAQ',
            'nav-contact': 'Contact',
            'nav-cta': 'Start your free trial',
            'nav-language-title': 'Language',
            
            // Hero Section
            'hero-badge': 'Next-Gen Amazon Flex Revolution',
            'hero_title--main': 'MASTER THE',
            'hero_title--highlight': 'AMAZON FLEX',
            'hero_title--amazon': 'BLOCKS',
            'hero-company-description': 'We are a company dedicated to improving the work experience of Amazon Flex drivers by allowing them to automatically and efficiently select the best blocks of their preference.',
            'hero-subtitle': 'Next-generation intelligent automation that multiplies your earnings. The most advanced platform for professional drivers of the future.',
            'hero-cta-main': '<strong>FREE</strong> TRIAL',
            'hero-cta-trial': '3 DAYS FREE',
            'hero-trust': 'More than 15,000 drivers have transformed their earnings',
            'download-google': 'Download on Google Play',
            'download-apple': 'Download on App Store',
            'download-google-alt': 'Download on Google Play',
            'download-apple-alt': 'Download on App Store',
            
            // Features Section
            'features-title': 'Features',
            'features-subtitle': 'Discover all the functionalities that StarFlex offers you to maximize your earnings.',
            
            // Feature 1: Schedule
            'feature-schedule-title': 'SCHEDULE',
            'feature-schedule-description': 'Choose the days and times you prefer for your delivery blocks. Configure your availability intelligently and let StarFlex find the best blocks in your preferred schedules.',
            'feature-schedule-item-1': 'Personalized configuration per day of the week',
            'feature-schedule-item-2': 'Flexible schedules adapted to your lifestyle',
            'feature-schedule-item-3': 'Automatic optimization of profitable shifts',
            'feature-schedule-item-4': 'Intelligent synchronization with your personal calendar',
            'feature-schedule-item-5': 'Real-time availability alerts',
            
            // Feature 2: Stations
            'feature-stations-title': 'STATIONS',
            'feature-stations-description': 'Select your preferred stations and configure minimum prices so our application can automatically offer you blocks that perfectly fit your preferences and location.',
            'feature-stations-item-1': 'Personalized selection of favorite stations',
            'feature-stations-item-2': 'Minimum price configuration per station',
            'feature-stations-item-3': 'Detailed profitability analysis by location',
            'feature-stations-item-4': 'Instant notifications of available blocks',
            'feature-stations-item-5': 'Interactive map with all nearby stations',
            'feature-stations-item-6': 'Advanced filters by distance and delivery type',
            
            // Feature 3: Calendar
            'feature-calendar-title': 'CALENDAR',
            'feature-calendar-description': 'In the calendar you can see all your accepted blocks and access advanced functions like identification from any location, option to skip selfie and quick block cancellation, all centralized for your maximum convenience.',
            'feature-calendar-item-1': 'Automatic identification from any location',
            'feature-calendar-item-2': 'Smart option to skip selfie verification',
            'feature-calendar-item-3': 'Quick and secure block cancellation',
            'feature-calendar-item-4': 'Monthly and weekly view of your deliveries',
            'feature-calendar-item-5': 'Automatic reminders of upcoming blocks',
            
            // Feature 4: Log
            'feature-log-title': 'LOG',
            'feature-log-description': 'In the detailed log you can see all available blocks and the specific reason why some were ignored. This information will help you adjust your filters and preferences to continuously optimize your delivery options.',
            'feature-log-item-1': 'Complete and detailed history of all blocks',
            'feature-log-item-2': 'Specific and detailed reasons for automatic rejection',
            'feature-log-item-3': 'Smart filter optimization tools',
            'feature-log-item-4': 'Advanced pattern and trend analysis',
            'feature-log-item-5': 'Performance and earnings statistics',
            
            // Feature 5: Notifications
            'feature-notifications-title': 'NOTIFICATIONS',
            'feature-notifications-description': 'StarFlex keeps you always informed with a complete system of multiple notifications so you never miss the best available blocks. Configure your alerts according to your specific preferences and receive real-time notifications.',
            'feature-notifications-item-1': 'Instant and customizable Push notifications',
            'feature-notifications-item-2': 'Automatic email alerts',
            'feature-notifications-item-3': 'Automatic phone calls for premium blocks',
            'feature-notifications-item-4': 'Direct and urgent SMS messages',
            'feature-notifications-item-5': 'Customizable alerts by block type and value',
            'feature-notifications-item-6': '24/7 real-time notification system',
            'feature-notifications-item-7': 'Advanced notification filters by priority',
            
            // Feature 6: Referrals
            'feature-referrals-title': 'REFERRALS',
            'feature-referrals-description': 'Invite other drivers to join the StarFlex revolution and get exclusive benefits for each referral that successfully registers. Share your experience and earn rewards while helping other drivers maximize their earnings.',
            'feature-referrals-item-1': 'Unique personalized and trackable referral link',
            'feature-referrals-item-2': 'Earn 1 completely free week for each successful referral',
            'feature-referrals-item-3': 'Dynamic QR code for easy sharing',
            'feature-referrals-item-4': 'Real-time referral tracking panel',
            'feature-referrals-item-5': 'Additional bonuses for active referrals',
            
            // FAQ Section
            'faq-title': 'Frequently Asked Questions',
            'faq-subtitle': 'Find clear answers to the most common questions about StarFlex and discover how to transform your Amazon Flex experience.',
            'faq-search-placeholder': 'Search question...',
            'faq-1-question': 'What are the main benefits of using StarFlex?',
            'faq-1-answer': 'StarFlex is designed to <span class="faq__answer-highlight">eliminate distracted driving</span> through intelligent automation. It allows you to focus completely on safe driving while our system works to find the best blocks. With StarFlex, you don\'t need to constantly check your phone, ensuring a safer and more efficient experience that allows you to maximize your earnings.',
            'faq-2-question': 'Can StarFlex automatically solve CAPTCHAs?',
            'faq-2-answer': 'Yes, StarFlex includes <span class="faq__answer-highlight">advanced technology to automatically solve CAPTCHAs</span>. Our system uses intelligent algorithms that can interpret and solve different types of verifications, allowing smooth navigation without manual interruptions. This optimizes your time and makes your daily experience more efficient.',
            'faq-3-question': 'Is it safe to use StarFlex? Can Amazon detect it?',
            'faq-3-answer': 'StarFlex uses <span class="faq__answer-highlight">advanced human simulation technology</span> that includes natural behavior patterns, variable response times and realistic touch gestures. Our approach focuses on helping drivers provide better service to Amazon and its customers, ensuring efficient and high-quality deliveries.',
            'faq-4-question': 'Does StarFlex work on iPhone and Android?',
            'faq-4-answer': 'Yes, StarFlex is available for <span class="faq__answer-highlight">iOS (iPhone 8+) and Android (8.0+)</span>. We have developed native applications optimized for each platform, guaranteeing the best performance and superior user experience. Both versions include all functionalities and receive automatic updates.',
            'faq-5-question': 'What do I need to start using StarFlex?',
            'faq-5-answer': 'You only need an <span class="faq__answer-highlight">active Amazon Flex account and a compatible device</span>. After downloading the application, the setup process takes less than 5 minutes. Our guided setup system will help you optimize your experience from day one.',
            'faq-no-results': 'No questions found matching your search',
            'faq-no-results-suggestion': 'Try different terms or contact our support',
            
            // Contact Section
            'contact-badge': 'Connect with the Future',
            'contact-title-main': 'BEST BLOCKS OF',
            'contact-title-highlight': 'AMAZON FLEX',
            'contact-subtitle': 'Don\'t forget to follow us on our social networks as we publish daily on our channels the compilation of the best accepted blocks so you can stay up to date with the most profitable schedules and locations.',
            'contact-whatsapp-title': 'WhatsApp news channels',
            'contact-whatsapp-description': 'Join our WhatsApp channel to receive the latest updates and best blocks available',
            'contact-whatsapp-btn': 'Join',
            'contact-instagram-title': 'Instagram',
            'contact-instagram-description': 'Follow us for visual content, tips and daily updates on the best blocks',
            'contact-instagram-btn': 'Follow',
            'contact-facebook-title': 'Facebook',
            'contact-facebook-description': 'Join our community on Facebook to interact with other drivers and share experiences',
            'contact-facebook-btn': 'Follow',
            'contact-tiktok-title': 'TikTok',
            'contact-tiktok-description': 'Discover viral content, quick tips and the latest Amazon Flex trends',
            'contact-tiktok-btn': 'Follow',
            'contact-telegram-title': 'Telegram news channels',
            'contact-telegram-description': 'Receive instant notifications of the best blocks and important updates',
            'contact-telegram-btn': 'Join',
            'contact-email-title': 'support@starflexapp.com',
            'contact-email-description': 'Contact our specialized technical support team directly',
            'contact-email-btn': 'Contact',
            
            // Footer
            'footer-legal': 'Privacy Policy • Terms and Conditions',
            'footer-copyright': '© StarFlex • All rights reserved',
            'footer-cta-main': 'START NOW',
            'footer-cta-trial': '3 days free'
        }
    },

    init() {
        const savedLanguage = localStorage.getItem('starflex-language');
        const browserLanguage = navigator.language.slice(0, 2);
        
        currentLanguage = (savedLanguage && this.data[savedLanguage]) ? savedLanguage :
                         (this.data[browserLanguage] ? browserLanguage : 'es');
        
        this.apply();
        this.updateButtons();
        this.setupEventListeners();
    },

    apply() {
        const translations = this.data[currentLanguage];
        if (!translations) return;

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = translations[key];
                
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

            // Handle other translation attributes
            this.applyAttributeTranslations(translations);
        });
    },

    applyAttributeTranslations(translations) {
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        const ariaElements = document.querySelectorAll('[data-translate-aria]');
        const altElements = document.querySelectorAll('[data-translate-alt]');

        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key]) element.placeholder = translations[key];
        });

        ariaElements.forEach(element => {
            const key = element.getAttribute('data-translate-aria');
            if (translations[key]) element.setAttribute('aria-label', translations[key]);
        });

        altElements.forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            if (translations[key]) element.alt = translations[key];
        });
    },

    switch(newLanguage) {
        if (!this.data[newLanguage] || newLanguage === currentLanguage) return;
        
        currentLanguage = newLanguage;
        localStorage.setItem('starflex-language', newLanguage);
        
        this.apply();
        this.updateButtons();
        
        document.documentElement.lang = newLanguage;
        
        if (!performanceMode) {
            document.body.style.opacity = '0.95';
            setTimeout(() => document.body.style.opacity = '1', 100);
        }
    },

    updateButtons() {
        const allButtons = document.querySelectorAll('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
        
        allButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            button.classList.toggle('active', buttonLang === currentLanguage);
        });

        this.updateLanguageSwitcher();
    },

    updateLanguageSwitcher() {
        const languageSwitcherText = document.getElementById('language-switcher-text');
        if (languageSwitcherText) {
            languageSwitcherText.textContent = currentLanguage.toUpperCase();
        }
    },

    setupEventListeners() {
        // Use event delegation for better performance
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
            if (button) {
                e.preventDefault();
                const selectedLanguage = button.getAttribute('data-lang');
                if (selectedLanguage) this.switch(selectedLanguage);
            }
        });

        // Touch feedback for mobile
        if (isMobile) {
            document.addEventListener('touchstart', (e) => {
                const button = e.target.closest('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
                if (button) {
                    button.style.transform = 'scale(0.98)';
                }
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                const button = e.target.closest('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option');
                if (button) {
                    button.style.transform = '';
                }
            }, { passive: true });
        }
    }
};

// ===== ULTRA-OPTIMIZED IMAGE LOADER =====
class UltraImageLoader {
    constructor() {
        this.cache = new Map();
        this.observer = null;
        this.formats = { avif: false, webp: false };
        this.init();
    }

    async init() {
        await this.detectFormats();
        this.setupIntersectionObserver();
        this.preloadCritical();
    }

    async detectFormats() {
        const tests = [
            { format: 'avif', data: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=' },
            { format: 'webp', data: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA' }
        ];

        await Promise.all(tests.map(test => this.testFormat(test.format, test.data)));
        
        if (this.formats.avif) document.documentElement.classList.add('avif');
        if (this.formats.webp) document.documentElement.classList.add('webp');
    }

    testFormat(format, data) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = img.onerror = () => {
                this.formats[format] = img.height === 2;
                resolve();
            };
            img.src = data;
        });
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window) || performanceMode) return;

        this.observer = new IntersectionObserver(
            entries => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            }),
            {
                rootMargin: isMobile ? '50px 0px' : '100px 0px',
                threshold: 0.01
            }
        );
    }

    getBestImageUrl(imageConfig) {
        if (!imageConfig) return null;
        
        if (this.formats.avif && imageConfig.avif) return imageConfig.avif;
        if (this.formats.webp && imageConfig.webp) return imageConfig.webp;
        return imageConfig.jpg || imageConfig.png || imageConfig.avif;
    }

    async loadImage(element) {
        const imageKey = element.dataset.imageKey;
        const imageConfig = this.getImageConfig(imageKey);
        
        if (!imageConfig) return;

        const imageUrl = this.getBestImageUrl(imageConfig);
        if (!imageUrl) return;

        try {
            element.classList.add('loading');
            
            await this.preloadImage(imageUrl);
            
            if (element.tagName === 'IMG') {
                element.src = imageUrl;
                element.alt = element.dataset.alt || '';
            } else {
                element.style.backgroundImage = `url('${imageUrl}')`;
            }
            
            element.classList.remove('loading');
            element.classList.add('loaded');
            
        } catch (error) {
            console.error(`Error loading image ${imageKey}:`, error);
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }

    preloadImage(url) {
        if (this.cache.has(url)) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(url, true);
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

    async preloadCritical() {
        if (performanceMode) return;
        
        const criticalImages = ['hero', 'logo'];
        
        await Promise.all(criticalImages.map(async key => {
            const config = this.getImageConfig(key);
            if (config) {
                const url = this.getBestImageUrl(config);
                if (url) {
                    try {
                        await this.preloadImage(url);
                    } catch (error) {
                        console.warn(`Error preloading critical image ${key}:`, error);
                    }
                }
            }
        }));
    }

    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        
        if (this.observer && !performanceMode) {
            this.observer.observe(element);
        } else {
            this.loadImage(element);
        }
    }

    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

// ===== ULTRA-OPTIMIZED NAVIGATION SYSTEM =====
const NavigationEngine = {
    init() {
        this.setupEventListeners();
        this.initializeActiveSection();
        this.setupKeyboardNavigation();
    },

    setupEventListeners() {
        // Use event delegation for better performance
        document.addEventListener('click', this.handleNavClick.bind(this));
        
        // Mobile touch feedback
        if (isMobile) {
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        }
    },

    handleNavClick(e) {
        // Desktop navigation
        const navLink = e.target.closest('.nav__link');
        if (navLink) {
            e.preventDefault();
            this.navigateToSection(navLink.getAttribute('href'), navLink);
            return;
        }

        // Mobile navigation
        const mobileNavLink = e.target.closest('.mobile-nav__link');
        if (mobileNavLink) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = mobileNavLink.getAttribute('href');
            
            if (isMobileMenuOpen) {
                this.closeMobileMenu();
            }
            
            setTimeout(() => {
                this.navigateToSection(targetId, mobileNavLink);
                this.updateActiveMobileNavLink(mobileNavLink);
            }, 100);
            return;
        }

        // Mobile menu toggle
        const mobileToggle = e.target.closest('#mobile-nav-toggle');
        if (mobileToggle) {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
            return;
        }

        // Mobile menu close
        const mobileClose = e.target.closest('#mobile-nav-close');
        if (mobileClose) {
            e.preventDefault();
            e.stopPropagation();
            this.closeMobileMenu();
            return;
        }

        // Mobile overlay close
        const mobileOverlay = e.target.closest('#mobile-nav-overlay');
        if (mobileOverlay) {
            this.closeMobileMenu();
            return;
        }

        // Logo navigation
        const logo = e.target.closest('.nav__logo, .mobile-nav__logo');
        if (logo) {
            e.preventDefault();
            if (isMobileMenuOpen) this.closeMobileMenu();
            
            setTimeout(() => {
                this.navigateToSection('#home');
                const homeLink = document.querySelector('.nav__link[href="#home"], .mobile-nav__link[href="#home"]');
                if (homeLink) {
                    if (homeLink.classList.contains('mobile-nav__link')) {
                        this.updateActiveMobileNavLink(homeLink);
                    } else {
                        this.updateActiveNavLink(homeLink);
                    }
                }
            }, isMobileMenuOpen ? 300 : 0);
        }
    },

    handleTouchStart(e) {
        const touchableElement = e.target.closest('.mobile-nav__link, #mobile-nav-toggle, #mobile-nav-close, .nav__link');
        if (touchableElement) {
            touchableElement.style.transform = 'scale(0.98)';
            touchableElement.style.transition = 'transform 0.1s ease';
        }
    },

    handleTouchEnd(e) {
        const touchableElement = e.target.closest('.mobile-nav__link, #mobile-nav-toggle, #mobile-nav-close, .nav__link');
        if (touchableElement) {
            setTimeout(() => {
                touchableElement.style.transform = '';
            }, 150);
        }
    },

    navigateToSection(targetId, activeLink = null) {
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        const headerHeight = isMobile ? 70 : 80;
        const targetPosition = targetSection.offsetTop - headerHeight;

        if ('scrollBehavior' in document.documentElement.style && !performanceMode) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, targetPosition);
        }

        if (activeLink) {
            if (activeLink.classList.contains('mobile-nav__link')) {
                this.updateActiveMobileNavLink(activeLink);
            } else {
                this.updateActiveNavLink(activeLink);
            }
        }
    },

    toggleMobileMenu() {
        if (isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu() {
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        const body = document.body;
        
        if (!mobileNavToggle || !mobileNavMenu) return;
        
        isMobileMenuOpen = true;
        
        mobileNavToggle.classList.add('active');
        mobileNavMenu.classList.add('active');
        body.classList.add('mobile-menu-open');
        
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        mobileNavMenu.setAttribute('aria-hidden', 'false');
    },
    closeMobileMenu() {
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        const body = document.body;
        
        if (!mobileNavToggle || !mobileNavMenu) return;
        
        isMobileMenuOpen = false;
        
        mobileNavToggle.classList.remove('active');
        mobileNavMenu.classList.remove('active');
        body.classList.remove('mobile-menu-open');
        
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavMenu.setAttribute('aria-hidden', 'true');
    },

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    },

    updateActiveMobileNavLink(activeLink) {
        document.querySelectorAll('.mobile-nav__link').forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    },

    initializeActiveSection() {
        setTimeout(() => this.updateActiveNavOnScroll(), 100);
    },

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        const headerHeight = isMobile ? 80 : 100;
        const windowHeight = window.innerHeight;
        
        let activeSection = null;
        let maxVisibleArea = 0;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const sectionId = section.getAttribute('id');
            
            const viewportTop = scrollY + headerHeight;
            const viewportBottom = scrollY + windowHeight;
            
            const visibleTop = Math.max(viewportTop, sectionTop);
            const visibleBottom = Math.min(viewportBottom, sectionBottom);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);
            
            if (visibleArea > maxVisibleArea && visibleArea > 50) {
                maxVisibleArea = visibleArea;
                activeSection = sectionId;
            }
        });
        
        if (activeSection) {
            const activeLink = document.querySelector(`.nav__link[href="#${activeSection}"]`);
            const activeMobileLink = document.querySelector(`.mobile-nav__link[href="#${activeSection}"]`);
            
            if (activeLink && !activeLink.classList.contains('active')) {
                this.updateActiveNavLink(activeLink);
            }
            
            if (activeMobileLink && !activeMobileLink.classList.contains('active')) {
                this.updateActiveMobileNavLink(activeMobileLink);
            }
        }
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (isMobileMenuOpen) {
                    e.preventDefault();
                    this.closeMobileMenu();
                }
                if (isFloatingMenuOpen) {
                    e.preventDefault();
                    FloatingWidget.close();
                }
                if (isLanguageSwitcherOpen) {
                    e.preventDefault();
                    LanguageSwitcher.close();
                }
            }
            
            if ((e.key === 'Enter' || e.key === ' ')) {
                const mobileToggle = e.target.closest('#mobile-nav-toggle');
                if (mobileToggle) {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            }
        });
    }
};

// ===== ULTRA-OPTIMIZED SCROLL SYSTEM =====
const ScrollEngine = {
    init() {
        this.setupScrollListener();
    },

    setupScrollListener() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
                scrollTimeout = null;
            }, CONFIG.THROTTLE_DELAY);
        }, { passive: true });
    },

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        this.updateScrollDirection(currentScrollY);
        this.updateHeader(currentScrollY);
        NavigationEngine.updateActiveNavOnScroll();
        
        lastScrollY = currentScrollY;
    },

    updateScrollDirection(currentScrollY) {
        isScrollingDown = currentScrollY > lastScrollY && currentScrollY > CONFIG.SCROLL_THRESHOLD;
    },

    updateHeader(scrollY) {
        const header = document.getElementById('header');
        const mobileHeader = document.getElementById('mobile-header');
        const threshold = CONFIG.SCROLL_THRESHOLD;
        
        // Desktop header
        if (header && !isMobile) {
            header.classList.toggle('scrolled', scrollY > threshold);
        }
        
        // Mobile header
        if (mobileHeader && isMobile) {
            mobileHeader.classList.toggle('scrolled', scrollY > threshold);
            
            // Auto-hide navbar
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
};

// ===== ULTRA-OPTIMIZED FLOATING WIDGET =====
const FloatingWidget = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        const floatingMainBtn = document.getElementById('floating-main-btn');
        if (!floatingMainBtn) return;

        floatingMainBtn.addEventListener('click', () => this.toggle());
        
        if (isMobile) {
            floatingMainBtn.addEventListener('touchstart', () => {
                floatingMainBtn.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            floatingMainBtn.addEventListener('touchend', () => {
                floatingMainBtn.style.transform = '';
            }, { passive: true });
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            const floatingWidget = document.getElementById('floating-widget');
            if (isFloatingMenuOpen && floatingWidget && !floatingWidget.contains(e.target)) {
                this.close();
            }
        });
    },

    toggle() {
        if (isFloatingMenuOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        const floatingMainBtn = document.getElementById('floating-main-btn');
        const floatingMenu = document.getElementById('floating-menu');
        
        if (!floatingMainBtn || !floatingMenu) return;
        
        isFloatingMenuOpen = true;
        floatingMainBtn.classList.add('active');
        floatingMenu.classList.add('active');
        floatingMainBtn.setAttribute('aria-expanded', 'true');
        
        if (!performanceMode) {
            const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
            menuItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateY(0) scale(1)';
                    item.style.opacity = '1';
                }, index * (isMobile ? 60 : 100));
            });
        }
    },

    close() {
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
};

// ===== ULTRA-OPTIMIZED LANGUAGE SWITCHER =====
const LanguageSwitcher = {
    init() {
        if (isMobile) return; // Only for desktop
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        const languageSwitcherBtn = document.getElementById('language-switcher-btn');
        if (!languageSwitcherBtn) return;

        languageSwitcherBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });
    },

    toggle() {
        if (isLanguageSwitcherOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        const languageSwitcher = document.getElementById('language-switcher');
        const languageSwitcherBtn = document.getElementById('language-switcher-btn');
        
        if (!languageSwitcher || !languageSwitcherBtn) return;
        
        isLanguageSwitcherOpen = true;
        languageSwitcher.classList.add('active');
        languageSwitcherBtn.setAttribute('aria-expanded', 'true');
    },

    close() {
        const languageSwitcher = document.getElementById('language-switcher');
        const languageSwitcherBtn = document.getElementById('language-switcher-btn');
        
        if (!languageSwitcher || !languageSwitcherBtn) return;
        
        isLanguageSwitcherOpen = false;
        languageSwitcher.classList.remove('active');
        languageSwitcherBtn.setAttribute('aria-expanded', 'false');
    }
};

// ===== ULTRA-OPTIMIZED VIDEO PLAYER =====
const VideoPlayer = {
    init() {
        this.setupHeroVideo();
        this.setupMainVideo();
    },

    setupHeroVideo() {
        const heroVideo = document.getElementById('hero-video');
        const heroMobileVideo = document.getElementById('hero-mobile-video');
        const heroFallbackImage = document.querySelector('.hero__phone-app-image');
        
        // Mobile video
        if (heroMobileVideo && isMobile) {
            this.configureVideo(heroMobileVideo);
            heroMobileVideo.addEventListener('error', () => {
                const mobileVideoContainer = document.querySelector('.hero__mobile-video');
                if (mobileVideoContainer) mobileVideoContainer.style.display = 'none';
            });
        }
        
        // Desktop video
        if (heroVideo && !isMobile && !performanceMode) {
            this.configureVideo(heroVideo);
            
            heroVideo.addEventListener('loadeddata', () => {
                heroVideo.classList.remove('loading');
                heroVideo.classList.add('loaded');
            });
            
            heroVideo.addEventListener('error', () => {
                this.showVideoFallback(heroVideo, heroFallbackImage);
            });
            
            heroVideo.addEventListener('stalled', () => {
                this.showVideoFallback(heroVideo, heroFallbackImage);
            });
            
            // Fallback timeout
            setTimeout(() => {
                if (heroVideo.readyState < 2) {
                    this.showVideoFallback(heroVideo, heroFallbackImage);
                }
            }, 2000);
        } else if (heroVideo && (isMobile || performanceMode)) {
            this.showVideoFallback(heroVideo, heroFallbackImage);
        }
    },

    setupMainVideo() {
        const video = document.getElementById('main-video');
        const playOverlay = document.getElementById('play-overlay');
        
        if (!video || !playOverlay) return;
        
        video.controls = false;
        video.preload = isMobile ? 'none' : 'metadata';
        
        this.setupVideoControls(video, playOverlay);
    },

    configureVideo(video) {
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
    },

    showVideoFallback(video, fallbackImage) {
        if (video) video.style.display = 'none';
        if (fallbackImage) {
            fallbackImage.style.display = 'block';
            fallbackImage.style.zIndex = '2';
        }
    },

    setupVideoControls(video, playOverlay) {
        const progressBar = document.querySelector('.videos__progress-bar');
        const progressFill = document.querySelector('.videos__progress-fill');
        const currentTimeDisplay = document.querySelector('.videos__current-time');
        const durationDisplay = document.querySelector('.videos__duration');
        const progressIndicators = document.querySelector('.videos__progress-indicators');
        
        // Play/pause functionality
        playOverlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playOverlay.classList.add('hidden');
                if (progressIndicators) progressIndicators.classList.add('visible');
            }
        });
        
        video.addEventListener('click', () => {
            if (!video.paused) {
                video.pause();
                playOverlay.classList.remove('hidden');
                if (progressIndicators) progressIndicators.classList.remove('visible');
            }
        });
        
        // Progress tracking
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (currentTimeDisplay) currentTimeDisplay.textContent = this.formatTime(video.currentTime);
            }
        });
        
        video.addEventListener('loadedmetadata', () => {
            if (durationDisplay) durationDisplay.textContent = this.formatTime(video.duration);
        });
        
        // Progress bar click
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const clickTime = (clickX / width) * video.duration;
                video.currentTime = clickTime;
            });
        }
        
        // Video end
        video.addEventListener('ended', () => {
            playOverlay.classList.remove('hidden');
            if (progressIndicators) progressIndicators.classList.remove('visible');
            if (progressFill) progressFill.style.width = '0%';
            if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
        });
        
        // Touch feedback for mobile
        if (isMobile) {
            playOverlay.addEventListener('touchstart', () => {
                playOverlay.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            playOverlay.addEventListener('touchend', () => {
                playOverlay.style.transform = '';
            }, { passive: true });
        }
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

// ===== ULTRA-OPTIMIZED FAQ SYSTEM =====
const FAQEngine = {
    init() {
        this.setupFAQItems();
        this.setupSearch();
    },

    setupFAQItems() {
        const faqItems = document.querySelectorAll('.faq__item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    this.toggleFAQItem(item, question, answer);
                });

                if (isMobile) {
                    question.addEventListener('touchstart', () => {
                        question.style.transform = 'scale(0.98)';
                    }, { passive: true });
                    
                    question.addEventListener('touchend', () => {
                        question.style.transform = '';
                    }, { passive: true });
                }
            }
        });
    },

    toggleFAQItem(item, question, answer) {
        const isActive = item.classList.contains('active');
        
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
        if (isActive) {
            item.classList.remove('active');
            answer.classList.remove('active');
            question.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('active');
            answer.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    },

    setupSearch() {
        const searchInput = document.getElementById('faq-search');
        const noResults = document.getElementById('faq-no-results');
        
        if (!searchInput) return;
        
        searchInput.addEventListener('input', this.debounce((e) => {
            this.performSearch(e.target.value.toLowerCase().trim(), noResults);
        }, CONFIG.DEBOUNCE_DELAY));
    },

    performSearch(searchTerm, noResults) {
        const faqItems = document.querySelectorAll('.faq__item');
        let visibleItems = 0;
        
        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq__question-text');
            const answerText = item.querySelector('.faq__answer-text');
            
            if (questionText && answerText) {
                const questionContent = questionText.textContent.toLowerCase();
                const answerContent = answerText.textContent.toLowerCase();
                
                const isVisible = searchTerm === '' ||
                                questionContent.includes(searchTerm) ||
                                answerContent.includes(searchTerm);
                
                item.style.display = isVisible ? 'block' : 'none';
                
                if (isVisible) {
                    visibleItems++;
                } else {
                    // Close item if hidden
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
    },

    debounce(func, wait) {
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
};

// ===== ULTRA-OPTIMIZED INTERSECTION OBSERVER =====
const IntersectionEngine = {
    init() {
        if (performanceMode) return;
        
        this.setupObserver();
        this.observeElements();
    },

    setupObserver() {
        const observerOptions = {
            threshold: isMobile ? 0.1 : 0.15,
            rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    if (entry.target.classList.contains('feature')) {
                        this.animateFeature(entry.target);
                    }
                    
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    },

    observeElements() {
        const elementsToObserve = document.querySelectorAll('.feature, .faq__item, .contact__channel');
        elementsToObserve.forEach(element => {
            this.observer.observe(element);
        });
    },

    animateFeature(feature) {
        if (performanceMode) return;
        
        const content = feature.querySelector('.feature__content');
        if (!content) return;
        
        const listItems = content.querySelectorAll('.feature__list-item');
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + (index * (isMobile ? 50 : 100)));
        });
    }
};

// ===== ULTRA-OPTIMIZED IMAGE SETUP =====
const ImageSetup = {
    init() {
        // Wait for image optimizer to be ready
        const waitForOptimizer = () => {
            if (!window.imageOptimizer) {
                setTimeout(waitForOptimizer, 100);
                return;
            }
            
            this.setupImages();
        };
        
        waitForOptimizer();
    },

    setupImages() {
        // Critical images - load immediately
        this.setupCriticalImages();
        
        // Feature images - lazy load
        this.setupFeatureImages();
        
        // Download buttons
        this.setupDownloadButtons();
    },

    setupCriticalImages() {
        const criticalImages = [
            { selector: '.nav__logo', key: 'logo' },
            { selector: '.mobile-nav__logo', key: 'logo' },
            { selector: '.mobile-nav__logo-menu', key: 'logo' },
            { selector: '.hero__phone-app-image', key: 'hero' }
        ];

        criticalImages.forEach(({ selector, key }) => {
            const element = document.querySelector(selector);
            if (element) {
                window.imageOptimizer.loadImageImmediately(element, key);
            }
        });
    },

    setupFeatureImages() {
        const featureImages = document.querySelectorAll('.phone__app-image');
        const imageKeys = [
            'phones.horario',
            'phones.estaciones',
            'phones.calendario',
            'phones.registro',
            'phones.notificaciones',
            'phones.referidos'
        ];
        
        featureImages.forEach((img, index) => {
            if (imageKeys[index]) {
                if (performanceMode) {
                    window.imageOptimizer.loadImageImmediately(img, imageKeys[index]);
                } else {
                    window.imageOptimizer.observeImage(img, imageKeys[index]);
                }
            }
        });
    },

    setupDownloadButtons() {
        const downloadButtons = [
            { selector: '.download-btn--app-store .download-btn__image', key: 'downloads.apple' },
            { selector: '.download-btn--google .download-btn__image', key: 'downloads.google' }
        ];

        downloadButtons.forEach(({ selector, key }) => {
            const element = document.querySelector(selector);
            if (element) {
                window.imageOptimizer.loadImageImmediately(element, key);
            }
        });
    }
};

// ===== ULTRA-OPTIMIZED PERFORMANCE SYSTEM =====
const PerformanceEngine = {
    init() {
        this.setupPerformanceOptimizations();
        this.setupResizeHandler();
        this.preloadCriticalResources();
    },

    setupPerformanceOptimizations() {
        if (isMobile) {
            // Optimize will-change for mobile
            const elementsToOptimize = document.querySelectorAll('.hero__phone, .nav__logo, .mobile-nav__logo, .floating-widget__main-btn');
            elementsToOptimize.forEach(element => {
                element.style.willChange = 'transform';
            });
            
            // Remove will-change from non-critical elements
            const featureElements = document.querySelectorAll('.feature__phone, .phone');
            featureElements.forEach(element => {
                element.style.willChange = 'auto';
            });
        }
    },

    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, isMobile ? 1000 : 500);
        });
    },

    handleResize() {
        const newIsMobile = window.innerWidth <= 1023;
        
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            DeviceCapabilities.init();
            
            // Close open menus
            if (isMobileMenuOpen) NavigationEngine.closeMobileMenu();
            if (isFloatingMenuOpen) FloatingWidget.close();
            if (isLanguageSwitcherOpen) LanguageSwitcher.close();
            
            // Reinitialize navigation
            setTimeout(() => {
                NavigationEngine.updateActiveNavOnScroll();
            }, 100);
        }
    },

    preloadCriticalResources() {
        if (performanceMode) return;
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.loadCriticalResources();
            });
        } else {
            setTimeout(() => this.loadCriticalResources(), 5000);
        }
    },

    loadCriticalResources() {
        const criticalResources = [
            './assets/phones/Hero.avif',
            './assets/logo.avif'
        ];
        
        criticalResources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
};

// ===== ULTRA-OPTIMIZED ACCESSIBILITY SYSTEM =====
const AccessibilityEngine = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupTouchNavigation();
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },

    setupFocusManagement() {
        // Tab trap for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && isMobileMenuOpen) {
                const mobileNavMenu = document.getElementById('mobile-nav-menu');
                if (mobileNavMenu) {
                    this.handleTabTrap(e, mobileNavMenu);
                }
            }
        });
    },

    setupTouchNavigation() {
        if (isMobile) {
            document.addEventListener('touchstart', () => {
                document.body.classList.add('touch-navigation');
            }, { passive: true });
        }
    },

    handleTabTrap(e, menuElement) {
        const focusableElements = menuElement.querySelectorAll(
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
};

// ===== ULTRA-OPTIMIZED ERROR HANDLING =====
const ErrorHandler = {
    init() {
        this.setupErrorHandlers();
    },

    setupErrorHandlers() {
        window.addEventListener('error', (e) => {
            console.error('Application error:', e.error);
            
            if (isMobile && e.error && e.error.message.includes('video')) {
                this.handleVideoError();
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    },

    handleVideoError() {
        const heroVideo = document.getElementById('hero-video');
        const heroImage = document.querySelector('.hero__phone-app-image');
        
        if (heroVideo && heroImage) {
            heroVideo.style.display = 'none';
            heroImage.style.display = 'block';
            heroImage.style.zIndex = '2';
        }
    }
};

// ===== ULTRA-OPTIMIZED INITIALIZATION SYSTEM =====
const StarFlexEngine = {
    async init() {
        console.log('🚀 StarFlex Ultra-Optimized Engine Starting...');
        
        // Phase 1: Critical initialization
        DeviceCapabilities.init();
        
        // Phase 2: Core systems
        TranslationEngine.init();
        NavigationEngine.init();
        ScrollEngine.init();
        
        // Phase 3: UI components
        FloatingWidget.init();
        LanguageSwitcher.init();
        VideoPlayer.init();
        FAQEngine.init();
        
        // Phase 4: Performance systems
        window.imageOptimizer = new UltraImageLoader();
        ImageSetup.init();
        
        if (!performanceMode) {
            IntersectionEngine.init();
        }
        
        PerformanceEngine.init();
        AccessibilityEngine.init();
        ErrorHandler.init();
        
        // Phase 5: Cleanup setup
        this.setupCleanup();
        
        console.log(`✅ StarFlex Ultra-Optimized Engine Ready - Mobile: ${isMobile}, Performance Mode: ${performanceMode}`);
    },

    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            if (window.imageOptimizer && window.imageOptimizer.observer) {
                window.imageOptimizer.observer.disconnect();
            }
            
            if (IntersectionEngine.observer) {
                IntersectionEngine.observer.disconnect();
            }
        });
    }
};

// ===== PWA SUPPORT =====
if ('serviceWorker' in navigator && !isMobile && !performanceMode) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}

// ===== ULTRA-OPTIMIZED INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    StarFlexEngine.init();
});

// ===== LEGACY FUNCTION SUPPORT =====
// Maintain compatibility with existing code
function toggleMobileMenu() { NavigationEngine.toggleMobileMenu(); }
function openMobileMenu() { NavigationEngine.openMobileMenu(); }
function closeMobileMenu() { NavigationEngine.closeMobileMenu(); }
function switchLanguage(lang) { TranslationEngine.switch(lang); }
function toggleFloatingMenu() { FloatingWidget.toggle(); }
function openFloatingMenu() { FloatingWidget.open(); }
function closeFloatingMenu() { FloatingWidget.close(); }

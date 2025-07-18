// ===== VARIABLES GLOBALES ULTRA-OPTIMIZADAS =====
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

// ===== CONFIGURACIÓN GLOBAL ULTRA-OPTIMIZADA =====
const CONFIG = {
    ANIMATION_DURATION: isMobile ? 150 : 300,
    SCROLL_THRESHOLD: isMobile ? 20 : 40,
    
    IMAGE_FORMATS: {
        WEBP: 'image/webp',
        PNG: 'image/png',
        JPEG: 'image/jpeg'
    },
    
    IMAGE_PATHS: {
        hero: { webp: './assets/phones/Hero.webp' },
        logo: { webp: './assets/logo.webp' },
        phones: {
            horario: { webp: './assets/phones/Schedule.webp' },
            estaciones: { webp: './assets/phones/Stations.webp' },
            calendario: { webp: './assets/phones/Calendar.webp' },
            registro: { webp: './assets/phones/Log.webp' },
            notificaciones: { webp: './assets/phones/Notifications.webp' },
            referidos: { webp: './assets/phones/Referrals.webp' }
        },
        downloads: {
            apple: { png: './assets/AppleStore.png' },
            google: { png: './assets/GooglePlay.png' }
        },
        videoPoster: { webp: './assets/video-poster.webp' }
    }
};

// ===== SISTEMA DE TRADUCCIONES OPTIMIZADO =====
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
        'nav-language-title': 'Idioma',
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
        'features-title': 'Características',
        'features-subtitle': 'Descubre todas las funcionalidades que StarFlex te ofrece para maximizar tus ganancias.',
        'feature-schedule-title': 'HORARIO',
        'feature-schedule-description': 'Elige los días y horarios que prefieras para tus bloques de entrega. Configura tu disponibilidad de manera inteligente y deja que StarFlex encuentre los mejores bloques en tus horarios preferidos.',
        'feature-schedule-item-1': 'Configuración personalizada por día de la semana',
        'feature-schedule-item-2': 'Horarios flexibles adaptados a tu estilo de vida',
        'feature-schedule-item-3': 'Optimización automática de turnos rentables',
        'feature-schedule-item-4': 'Sincronización inteligente con tu calendario personal',
        'feature-schedule-item-5': 'Alertas de disponibilidad en tiempo real',
        'feature-stations-title': 'ESTACIONES',
        'feature-stations-description': 'Selecciona tus estaciones preferidas y configura precios mínimos para que nuestra aplicación pueda ofrecerte automáticamente los bloques que se ajusten perfectamente a tus preferencias y ubicación.',
        'feature-stations-item-1': 'Selección personalizada de estaciones favoritas',
        'feature-stations-item-2': 'Configuración de precios mínimos por estación',
        'feature-stations-item-3': 'Análisis detallado de rentabilidad por ubicación',
        'feature-stations-item-4': 'Notificaciones instantáneas de bloques disponibles',
        'feature-stations-item-5': 'Mapa interactivo con todas las estaciones cercanas',
        'feature-stations-item-6': 'Filtros avanzados por distancia y tipo de entrega',
        'feature-calendar-title': 'CALENDARIO',
        'feature-calendar-description': 'En el calendario podrás ver todos tus bloques aceptados y acceder a funciones avanzadas como identificación desde cualquier ubicación, opción de saltar la selfie y cancelación rápida de bloques, todo centralizado para tu máxima comodidad.',
        'feature-calendar-item-1': 'Identificación automática desde cualquier ubicación',
        'feature-calendar-item-2': 'Opción inteligente para saltar verificación selfie',
        'feature-calendar-item-3': 'Cancelación rápida y segura de bloques',
        'feature-calendar-item-4': 'Vista mensual y semanal de tus entregas',
        'feature-calendar-item-5': 'Recordatorios automáticos de bloques próximos',
        'feature-log-title': 'REGISTRO',
        'feature-log-description': 'En el registro detallado podrás ver todos los bloques disponibles y el motivo específico por el cual algunos fueron ignorados. Esta información te ayudará a ajustar tus filtros y preferencias para optimizar continuamente tus opciones de entrega.',
        'feature-log-item-1': 'Historial completo y detallado de todos los bloques',
        'feature-log-item-2': 'Motivos específicos y detallados de rechazo automático',
        'feature-log-item-3': 'Herramientas de optimización de filtros inteligentes',
        'feature-log-item-4': 'Análisis avanzado de patrones y tendencias',
        'feature-log-item-5': 'Estadísticas de rendimiento y ganancias',
        'feature-notifications-title': 'NOTIFICACIONES',
        'feature-notifications-description': 'StarFlex te mantiene siempre informado con un sistema completo de notificaciones múltiples para que nunca te pierdas los mejores bloques disponibles. Configura tus alertas según tus preferencias específicas y recibe notificaciones en tiempo real.',
        'feature-notifications-item-1': 'Notificaciones Push instantáneas y personalizables',
        'feature-notifications-item-2': 'Alertas automáticas por correo electrónico',
        'feature-notifications-item-3': 'Llamadas telefónicas automáticas para bloques premium',
        'feature-notifications-item-4': 'Mensajes SMS directos y urgentes',
        'feature-notifications-item-5': 'Alertas personalizables por tipo y valor de bloque',
        'feature-notifications-item-6': 'Sistema de notificaciones en tiempo real 24/7',
        'feature-notifications-item-7': 'Filtros avanzados de notificación por prioridad',
        'feature-referrals-title': 'REFERIDOS',
        'feature-referrals-description': 'Invita a otros conductores a unirse a la revolución StarFlex y obtén beneficios exclusivos por cada referido que se registre exitosamente. Comparte tu experiencia y gana recompensas mientras ayudas a otros conductores a maximizar sus ganancias.',
        'feature-referrals-item-1': 'Enlace único de referido personalizado y rastreable',
        'feature-referrals-item-2': 'Gana 1 semana completamente gratis por cada referido exitoso',
        'feature-referrals-item-3': 'Código QR dinámico para compartir fácilmente',
        'feature-referrals-item-4': 'Panel de seguimiento de referidos en tiempo real',
        'feature-referrals-item-5': 'Bonificaciones adicionales por referidos activos',
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
        'nav-language-title': 'Language',
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
        'features-title': 'Features',
        'features-subtitle': 'Discover all the functionalities that StarFlex offers you to maximize your earnings.',
        'feature-schedule-title': 'SCHEDULE',
        'feature-schedule-description': 'Choose the days and times you prefer for your delivery blocks. Configure your availability intelligently and let StarFlex find the best blocks in your preferred schedules.',
        'feature-schedule-item-1': 'Personalized configuration per day of the week',
        'feature-schedule-item-2': 'Flexible schedules adapted to your lifestyle',
        'feature-schedule-item-3': 'Automatic optimization of profitable shifts',
        'feature-schedule-item-4': 'Intelligent synchronization with your personal calendar',
        'feature-schedule-item-5': 'Real-time availability alerts',
        'feature-stations-title': 'STATIONS',
        'feature-stations-description': 'Select your preferred stations and configure minimum prices so our application can automatically offer you blocks that perfectly fit your preferences and location.',
        'feature-stations-item-1': 'Personalized selection of favorite stations',
        'feature-stations-item-2': 'Minimum price configuration per station',
        'feature-stations-item-3': 'Detailed profitability analysis by location',
        'feature-stations-item-4': 'Instant notifications of available blocks',
        'feature-stations-item-5': 'Interactive map with all nearby stations',
        'feature-stations-item-6': 'Advanced filters by distance and delivery type',
        'feature-calendar-title': 'CALENDAR',
        'feature-calendar-description': 'In the calendar you can see all your accepted blocks and access advanced functions like identification from any location, option to skip selfie and quick block cancellation, all centralized for your maximum convenience.',
        'feature-calendar-item-1': 'Automatic identification from any location',
        'feature-calendar-item-2': 'Smart option to skip selfie verification',
        'feature-calendar-item-3': 'Quick and secure block cancellation',
        'feature-calendar-item-4': 'Monthly and weekly view of your deliveries',
        'feature-calendar-item-5': 'Automatic reminders of upcoming blocks',
        'feature-log-title': 'LOG',
        'feature-log-description': 'In the detailed log you can see all available blocks and the specific reason why some were ignored. This information will help you adjust your filters and preferences to continuously optimize your delivery options.',
        'feature-log-item-1': 'Complete and detailed history of all blocks',
        'feature-log-item-2': 'Specific and detailed reasons for automatic rejection',
        'feature-log-item-3': 'Smart filter optimization tools',
        'feature-log-item-4': 'Advanced pattern and trend analysis',
        'feature-log-item-5': 'Performance and earnings statistics',
        'feature-notifications-title': 'NOTIFICATIONS',
        'feature-notifications-description': 'StarFlex keeps you always informed with a complete system of multiple notifications so you never miss the best available blocks. Configure your alerts according to your specific preferences and receive real-time notifications.',
        'feature-notifications-item-1': 'Instant and customizable Push notifications',
        'feature-notifications-item-2': 'Automatic email alerts',
        'feature-notifications-item-3': 'Automatic phone calls for premium blocks',
        'feature-notifications-item-4': 'Direct and urgent SMS messages',
        'feature-notifications-item-5': 'Customizable alerts by block type and value',
        'feature-notifications-item-6': '24/7 real-time notification system',
        'feature-notifications-item-7': 'Advanced notification filters by priority',
        'feature-referrals-title': 'REFERRALS',
        'feature-referrals-description': 'Invite other drivers to join the StarFlex revolution and get exclusive benefits for each referral that successfully registers. Share your experience and earn rewards while helping other drivers maximize their earnings.',
        'feature-referrals-item-1': 'Unique personalized and trackable referral link',
        'feature-referrals-item-2': 'Earn 1 completely free week for each successful referral',
        'feature-referrals-item-3': 'Dynamic QR code for easy sharing',
        'feature-referrals-item-4': 'Real-time referral tracking panel',
        'feature-referrals-item-5': 'Additional bonuses for active referrals',
        'videos-badge': 'Immersive Visual Experience',
        'videos-title-main': 'SEE STARFLEX',
        'videos-title-highlight': 'IN ACTION',
        'videos-subtitle': 'Discover how StarFlex revolutionizes your Amazon Flex experience. Watch intelligent automation working in real time.',
        'video-not-supported': 'Your browser does not support HTML5 videos. <a href="./assets/StarFlex.mp4">Download video</a>.',
        'video-play-title': 'PLAY DEMO',
        'video-play-subtitle': 'See StarFlex in action',
        'video-info-title': 'Complete StarFlex Demo',
        'video-info-description': 'Watch how StarFlex completely automates your Amazon Flex experience. From initial setup to automatic block capture.',
        'videos-cta-title': 'Ready to Transform Your Earnings?',
        'videos-cta-description': 'Join more than 15,000 drivers who are already maximizing their income with StarFlex',
        'videos-cta-start': 'START NOW',
        'videos-cta-trial': '3 days free',
        'videos-cta-demo': 'SEE PERSONALIZED DEMO',
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
        'footer-legal': 'Privacy Policy • Terms and Conditions',
        'footer-copyright': '© StarFlex • All rights reserved',
        'footer-cta-main': 'START NOW',
        'footer-cta-trial': '3 days free'
    }
};

// ===== DETECCIÓN DE DISPOSITIVO Y CAPACIDADES ULTRA-OPTIMIZADA =====
const detectDeviceCapabilities = (() => {
    let lastCheck = 0;
    const CACHE_TIME = 5000;
    
    return function() {
        const now = Date.now();
        if (now - lastCheck < CACHE_TIME) return;
        lastCheck = now;
        
        isMobile = window.innerWidth <= 1023;
        isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' || 
            connection.effectiveType === '3g'
        );
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
        
        performanceMode = isMobile && (isSlowConnection || isLowEndDevice || isReducedMotion || isLowMemory);
        
        if (performanceMode && !document.body.classList.contains('performance-mode')) {
            document.body.classList.add('performance-mode');
            const style = document.createElement('style');
            style.textContent = `
                .performance-mode * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.1s !important;
                }
                .performance-mode .features::before,
                .performance-mode .features::after {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
})();

// ===== DETECCIÓN DE SOPORTE DE FORMATOS DE IMAGEN OPTIMIZADA =====
const detectImageFormats = (() => {
    let formatCache = null;
    
    return function() {
        if (formatCache) return Promise.resolve(formatCache);
        
        return new Promise((resolve) => {
            const formats = { webp: false };
            
            const webpImg = new Image();
            webpImg.onload = webpImg.onerror = function() {
                formats.webp = webpImg.height === 2;
                if (formats.webp) {
                    document.documentElement.classList.add('webp');
                }
                formatCache = formats;
                resolve(formats);
            };
            webpImg.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    };
})();
// ===== CLASE ULTRA-OPTIMIZADA PARA IMÁGENES =====
class UltraOptimizedImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        this.supportedFormats = { webp: false };
        this.loadQueue = [];
        this.isProcessing = false;
        this.init();
    }
    
    async init() {
        this.supportedFormats = await detectImageFormats();
        this.setupLazyLoading();
        this.preloadCriticalImages();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window && !performanceMode) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.addToQueue(entry.target);
                            this.intersectionObserver.unobserve(entry.target);
                        }
                    });
                    this.processQueue();
                },
                {
                    rootMargin: isMobile ? '50px 0px' : '100px 0px',
                    threshold: 0.01
                }
            );
        }
    }
    
    addToQueue(element) {
        this.loadQueue.push(element);
    }
    
    async processQueue() {
        if (this.isProcessing || this.loadQueue.length === 0) return;
        
        this.isProcessing = true;
        const batchSize = isMobile ? 2 : 4;
        
        while (this.loadQueue.length > 0) {
            const batch = this.loadQueue.splice(0, batchSize);
            await Promise.all(batch.map(element => this.loadImage(element)));
            
            if (this.loadQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, isMobile ? 100 : 50));
            }
        }
        
        this.isProcessing = false;
    }
    
    getBestImageUrl(imageConfig) {
        if (!imageConfig) return null;
        
        if (this.supportedFormats.webp && imageConfig.webp) {
            return imageConfig.webp;
        }
        
        return imageConfig.png || imageConfig.jpg || imageConfig.jpeg || imageConfig.webp;
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
        if (performanceMode) return;
        
        const criticalImages = ['logo'];
        
        const preloadPromises = criticalImages.map(async (key) => {
            const config = this.getImageConfig(key);
            if (config) {
                const url = this.getBestImageUrl(config);
                if (url) {
                    try {
                        await this.preloadImage(url);
                    } catch (error) {
                        // Silently fail for preload
                    }
                }
            }
        });
        
        await Promise.all(preloadPromises);
    }
    
    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.lazyImages.add(element);
        
        if (this.intersectionObserver && !performanceMode) {
            this.intersectionObserver.observe(element);
        } else {
            this.addToQueue(element);
            this.processQueue();
        }
    }
    
    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

// ===== INICIALIZACIÓN GLOBAL OPTIMIZADA =====
let imageOptimizer;

// ===== FUNCIONES DE TRADUCCIÓN ULTRA-OPTIMIZADAS =====
const initializeLanguageSystem = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
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
    };
})();

const setupLanguageToggle = (() => {
    let setupComplete = false;
    
    return function() {
        if (setupComplete) return;
        setupComplete = true;
        
        const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option');
        const drawerLanguageButtons = document.querySelectorAll('.nav__drawer-language-option');
        
        const handleLanguageClick = (e, button) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
            }
        };
        
        const addTouchFeedback = (button) => {
            if (!isMobile) return;
            
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            }, { passive: true });
        };
        
        languageButtons.forEach(button => {
            button.addEventListener('click', (e) => handleLanguageClick(e, button));
            addTouchFeedback(button);
        });
        
        drawerLanguageButtons.forEach(button => {
            button.addEventListener('click', (e) => handleLanguageClick(e, button));
            addTouchFeedback(button);
        });
    };
})();

const switchLanguage = (() => {
    let switching = false;
    
    return function(newLanguage) {
        if (switching || !translationData[newLanguage]) return;
        switching = true;
        
        currentLanguage = newLanguage;
        localStorage.setItem('starflex-language', newLanguage);
        
        requestAnimationFrame(() => {
            applyTranslations();
            updateLanguageButtons();
            document.documentElement.lang = newLanguage;
            
            if (!isMobile && !performanceMode) {
                document.body.style.opacity = '0.95';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                    switching = false;
                }, 100);
            } else {
                switching = false;
            }
        });
    };
})();

const applyTranslations = (() => {
    const elementCache = new Map();
    
    return function() {
        const currentTranslations = translationData[currentLanguage];
        if (!currentTranslations) return;
        
        requestAnimationFrame(() => {
            // Cache elements on first run
            if (elementCache.size === 0) {
                document.querySelectorAll('[data-translate]').forEach(element => {
                    const key = element.getAttribute('data-translate');
                    if (!elementCache.has(key)) {
                        elementCache.set(key, []);
                    }
                    elementCache.get(key).push(element);
                });
            }
            
            // Apply translations using cache
            elementCache.forEach((elements, key) => {
                const translation = currentTranslations[key];
                if (translation) {
                    elements.forEach(element => {
                        if (element.tagName === 'INPUT' && element.type === 'text') {
                            element.placeholder = translation;
                        } else if (element.tagName === 'META') {
                            element.content = translation;
                        } else if (element.tagName === 'TITLE') {
                            element.textContent = translation;
                        } else {
                            element.innerHTML = translation;
                        }
                    });
                }
            });
            
            // Handle other translation attributes
            const attributeSelectors = [
                { selector: '[data-translate-placeholder]', attr: 'data-translate-placeholder', prop: 'placeholder' },
                { selector: '[data-translate-aria]', attr: 'data-translate-aria', prop: 'aria-label' },
                { selector: '[data-translate-alt]', attr: 'data-translate-alt', prop: 'alt' }
            ];
            
            attributeSelectors.forEach(({ selector, attr, prop }) => {
                document.querySelectorAll(selector).forEach(element => {
                    const key = element.getAttribute(attr);
                    const translation = currentTranslations[key];
                    if (translation) {
                        if (prop === 'aria-label') {
                            element.setAttribute(prop, translation);
                        } else {
                            element[prop] = translation;
                        }
                    }
                });
            });
        });
    };
})();

const updateLanguageButtons = (() => {
    let buttonCache = null;
    
    return function() {
        if (!buttonCache) {
            buttonCache = {
                desktop: document.querySelectorAll('.language-btn, .nav__language-option'),
                drawer: document.querySelectorAll('.nav__drawer-language-option')
            };
        }
        
        const updateButtons = (buttons) => {
            buttons.forEach(button => {
                const buttonLang = button.getAttribute('data-lang');
                if (buttonLang === currentLanguage) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        };
        
        updateButtons(buttonCache.desktop);
        updateButtons(buttonCache.drawer);
        updateLanguageSwitcher();
    };
})();

// ===== SELECTOR DE IDIOMA FLOTANTE OPTIMIZADO (SOLO DESKTOP) =====
const initializeLanguageSwitcher = (() => {
    let initialized = false;
    
    return function() {
        if (initialized || isMobile) return;
        initialized = true;
        
        const languageSwitcherBtn = document.getElementById('language-switcher-btn');
        const languageSwitcherDropdown = document.getElementById('language-switcher-dropdown');
        const languageSwitcher = document.getElementById('language-switcher');
        const languageOptions = languageSwitcher?.querySelectorAll('.language-switcher__option');
        
        if (!languageSwitcherBtn || !languageSwitcherDropdown || !languageSwitcher) return;
        
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
    };
})();

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

const updateLanguageSwitcher = (() => {
    let textElement = null;
    let optionCache = null;
    
    return function() {
        if (!textElement) {
            textElement = document.getElementById('language-switcher-text');
        }
        
        if (textElement) {
            textElement.textContent = currentLanguage.toUpperCase();
        }
        
        if (!optionCache) {
            optionCache = document.querySelectorAll('.language-switcher__option');
        }
        
        optionCache.forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === currentLanguage) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    };
})();

// ===== FUNCIONES DEL BOTÓN FLOTANTE ULTRA-OPTIMIZADAS =====
const initializeFloatingWidget = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const floatingMainBtn = document.getElementById('floating-main-btn');
        const floatingMenu = document.getElementById('floating-menu');
        
        if (!floatingMainBtn || !floatingMenu) return;
        
        floatingMainBtn.addEventListener('click', toggleFloatingMenu);
        
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
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isFloatingMenuOpen) {
                closeFloatingMenu();
            }
        });
    };
})();

function toggleFloatingMenu() {
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    } else {
        openFloatingMenu();
    }
}

const openFloatingMenu = (() => {
    let menuItemsCache = null;
    
    return function() {
        const floatingMainBtn = document.getElementById('floating-main-btn');
        const floatingMenu = document.getElementById('floating-menu');
        
        if (!floatingMainBtn || !floatingMenu) return;
        
        isFloatingMenuOpen = true;
        floatingMainBtn.classList.add('active');
        floatingMenu.classList.add('active');
        floatingMainBtn.setAttribute('aria-expanded', 'true');
        
        if (!menuItemsCache) {
            menuItemsCache = floatingMenu.querySelectorAll('.floating-widget__menu-item');
        }
        
        menuItemsCache.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.opacity = '1';
            }, index * (isMobile ? 60 : 100));
        });
    };
})();

const closeFloatingMenu = (() => {
    let menuItemsCache = null;
    
    return function() {
        const floatingMainBtn = document.getElementById('floating-main-btn');
        const floatingMenu = document.getElementById('floating-menu');
        
        if (!floatingMainBtn || !floatingMenu) return;
        
        isFloatingMenuOpen = false;
        floatingMainBtn.classList.remove('active');
        floatingMenu.classList.remove('active');
        floatingMainBtn.setAttribute('aria-expanded', 'false');
        
        if (!menuItemsCache) {
            menuItemsCache = floatingMenu.querySelectorAll('.floating-widget__menu-item');
        }
        
        menuItemsCache.forEach(item => {
            item.style.transform = '';
            item.style.opacity = '';
        });
    };
})();
// ===== NAVEGACIÓN DESKTOP RESPONSIVE ULTRA-OPTIMIZADA =====
const initializeDesktopNavigation = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const navLinks = document.querySelectorAll('.nav__link');
        const navLogo = document.querySelector('.nav__logo');
        
        // Funcionalidad del logo como enlace (solo desktop)
        if (navLogo && !isMobile) {
            const handleLogoClick = (e) => {
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
            };
            
            navLogo.addEventListener('click', handleLogoClick);
            navLogo.style.cursor = 'pointer';
            navLogo.setAttribute('tabindex', '0');
            navLogo.setAttribute('role', 'button');
            navLogo.setAttribute('aria-label', 'Ir al inicio');
            
            navLogo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLogoClick(e);
                }
            });
        }
        
        // Enlaces de navegación desktop
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
        
        initializeKeyboardNavigation();
        initializeActiveSection();
    };
})();

// ===== NAVEGACIÓN MÓVIL CON DRAWER ULTRA-OPTIMIZADA =====
const initializeMobileNavigation = (() => {
    let initialized = false;
    let elementsCache = null;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        // Cache de elementos
        if (!elementsCache) {
            elementsCache = {
                navToggle: document.getElementById('nav-toggle'),
                navDrawer: document.getElementById('nav-drawer'),
                navDrawerClose: document.getElementById('nav-drawer-close'),
                navDrawerOverlay: document.getElementById('nav-drawer-overlay'),
                drawerLinks: document.querySelectorAll('.nav__drawer-link'),
                drawerLogo: document.querySelector('.nav__drawer-logo')
            };
        }
        
        const { navToggle, navDrawer, navDrawerClose, navDrawerOverlay, drawerLinks, drawerLogo } = elementsCache;
        
        if (!navToggle || !navDrawer) return;
        
        // Funcionalidad del logo del drawer como enlace
        if (drawerLogo) {
            const handleDrawerLogoClick = (e) => {
                e.preventDefault();
                
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
                
                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    setTimeout(() => {
                        smoothScrollToSection(homeSection);
                        const homeLink = document.querySelector('.nav__drawer-link[href="#home"]');
                        if (homeLink) {
                            updateActiveDrawerLink(homeLink);
                        }
                    }, 300);
                }
            };
            
            drawerLogo.addEventListener('click', handleDrawerLogoClick);
            drawerLogo.style.cursor = 'pointer';
            drawerLogo.setAttribute('tabindex', '0');
            drawerLogo.setAttribute('role', 'button');
            drawerLogo.setAttribute('aria-label', 'Ir al inicio');
        }
        
        // Toggle hamburguesa móvil
        const handleToggleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        };
        
        navToggle.addEventListener('click', handleToggleClick);
        navToggle.addEventListener('touchstart', () => {
            navToggle.style.transform = 'scale(0.95)';
        }, { passive: true });
        navToggle.addEventListener('touchend', () => {
            navToggle.style.transform = '';
        }, { passive: true });
        
        // Botón cerrar drawer
        if (navDrawerClose) {
            navDrawerClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMobileMenu();
            });

            navDrawerClose.addEventListener('touchstart', () => {
                navDrawerClose.style.transform = 'scale(0.95)';
            }, { passive: true });
            navDrawerClose.addEventListener('touchend', () => {
                navDrawerClose.style.transform = '';
            }, { passive: true });
        }
        
        // Overlay para cerrar
        if (navDrawerOverlay) {
            navDrawerOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Enlaces del drawer móvil optimizados
        drawerLinks.forEach((link) => {
            const handleNavigation = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = link.getAttribute('href');
                
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    setTimeout(() => {
                        smoothScrollToSection(targetSection);
                        updateActiveDrawerLink(link);
                    }, 100);
                }
            };
            
            link.addEventListener('click', handleNavigation);
            link.addEventListener('touchend', (e) => {
                if (e.cancelable) {
                    e.preventDefault();
                }
                handleNavigation(e);
            });
            
            // Efectos táctiles optimizados
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(0.98)';
                link.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            link.addEventListener('touchcancel', () => {
                link.style.transform = '';
            }, { passive: true });
            
            setTimeout(() => {
                link.addEventListener('touchend', () => {
                    setTimeout(() => {
                        link.style.transform = '';
                    }, 150);
                }, { passive: true });
            }, 100);
        });
        
        // Cerrar drawer tocando fuera - optimizado
        const handleOutsideTouch = (e) => {
            if (isMobileMenuOpen && navDrawer && !navDrawer.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        };
        
        document.addEventListener('touchstart', handleOutsideTouch, { passive: true });
        document.addEventListener('click', handleOutsideTouch);
    };
})();

function toggleMobileMenu() {
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

const openMobileMenu = (() => {
    let elementsCache = null;
    
    return function() {
        if (!elementsCache) {
            elementsCache = {
                navToggle: document.getElementById('nav-toggle'),
                navDrawer: document.getElementById('nav-drawer'),
                navDrawerOverlay: document.getElementById('nav-drawer-overlay'),
                floatingWidget: document.getElementById('floating-widget'),
                body: document.body
            };
        }
        
        const { navToggle, navDrawer, navDrawerOverlay, floatingWidget, body } = elementsCache;
        
        if (!navToggle || !navDrawer) return;
        
        isMobileMenuOpen = true;
        
        navToggle.classList.add('active');
        navDrawer.classList.add('active');
        if (navDrawerOverlay) navDrawerOverlay.classList.add('active');
        body.classList.add('drawer-open');
        
        // Ocultar botón flotante cuando se abre el drawer móvil
        if (floatingWidget && isMobile) {
            floatingWidget.classList.add('hidden-by-drawer');
        }
        
        navToggle.setAttribute('aria-expanded', 'true');
        navDrawer.setAttribute('aria-hidden', 'false');
    };
})();

const closeMobileMenu = (() => {
    let elementsCache = null;
    
    return function() {
        if (!elementsCache) {
            elementsCache = {
                navToggle: document.getElementById('nav-toggle'),
                navDrawer: document.getElementById('nav-drawer'),
                navDrawerOverlay: document.getElementById('nav-drawer-overlay'),
                floatingWidget: document.getElementById('floating-widget'),
                body: document.body
            };
        }
        
        const { navToggle, navDrawer, navDrawerOverlay, floatingWidget, body } = elementsCache;
        
        if (!navToggle || !navDrawer) return;
        
        isMobileMenuOpen = false;
        
        navToggle.classList.remove('active');
        navDrawer.classList.remove('active');
        if (navDrawerOverlay) navDrawerOverlay.classList.remove('active');
        body.classList.remove('drawer-open');
        
        // Mostrar botón flotante cuando se cierra el drawer móvil
        if (floatingWidget && isMobile) {
            floatingWidget.classList.remove('hidden-by-drawer');
        }
        
        navToggle.setAttribute('aria-expanded', 'false');
        navDrawer.setAttribute('aria-hidden', 'true');
    };
})();

const updateActiveDrawerLink = (() => {
    let linksCache = null;
    
    return function(activeLink) {
        if (!linksCache) {
            linksCache = document.querySelectorAll('.nav__drawer-link');
        }
        
        linksCache.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    };
})();

// ===== NAVEGACIÓN GENERAL (FUNCIONES COMPARTIDAS) =====
const initializeNavigation = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        if (isMobile) {
            initializeMobileNavigation();
        } else {
            initializeDesktopNavigation();
        }
        
        initializeActiveSection();
    };
})();

const smoothScrollToSection = (() => {
    const cache = new Map();
    
    return function(targetSection) {
        if (!targetSection) return;
        
        const sectionId = targetSection.id;
        let targetPosition = cache.get(sectionId);
        
        if (targetPosition === undefined) {
            const headerHeight = isMobile ? 70 : 80;
            targetPosition = targetSection.offsetTop - headerHeight;
            cache.set(sectionId, targetPosition);
        }
        
        if ('scrollBehavior' in document.documentElement.style && !performanceMode) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo(0, targetPosition);
        }
    };
})();

const updateActiveNavLink = (() => {
    let linksCache = null;
    
    return function(activeLink) {
        if (!linksCache) {
            linksCache = document.querySelectorAll('.nav__link');
        }
        
        linksCache.forEach(link => {
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
        
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    };
})();

function initializeActiveSection() {
    setTimeout(() => {
        updateActiveNavOnScroll();
    }, 100);
}

// ===== NAVEGACIÓN POR TECLADO OPTIMIZADA =====
const initializeKeyboardNavigation = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navDrawer = document.getElementById('nav-drawer');
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (isMenuOpen) {
                    e.preventDefault();
                    closeMobileMenu();
                    return;
                }
                if (isMobileMenuOpen) {
                    e.preventDefault();
                    closeMobileMenu();
                    return;
                }
            }
            
            // Tab trap para menú desktop
            if (e.key === 'Tab' && isMenuOpen && !isMobile && navMenu) {
                handleTabTrap(e, navMenu);
            }
            
            // Tab trap para drawer móvil
            if (e.key === 'Tab' && isMobileMenuOpen && navDrawer) {
                handleTabTrap(e, navDrawer);
            }
            
            // Enter/Space para toggles
            if ((e.key === 'Enter' || e.key === ' ')) {
                if (e.target === navToggle) {
                    e.preventDefault();
                    toggleMobileMenu();
                }
            }
        });
    };
})();

function handleTabTrap(e, menuElement) {
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

// ===== EFECTOS DE SCROLL ULTRA-OPTIMIZADOS =====
const initializeScrollEffects = (() => {
    let initialized = false;
    let scrollTimeout;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const throttledScrollHandler = throttle(() => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveNavOnScroll();
                    handleScrollDirection();
                    updateHeaderOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, isMobile ? 50 : 25);
        
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    };
})();

function handleScrollDirection() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > (isMobile ? 50 : 100)) {
        isScrollingDown = true;
    } else {
        isScrollingDown = false;
    }
    
    lastScrollY = currentScrollY;
}

const updateActiveNavOnScroll = (() => {
    let sectionsCache = null;
    let headerHeight = null;
    let windowHeight = null;
    
    return function() {
        if (!sectionsCache) {
            sectionsCache = document.querySelectorAll('section[id]');
            headerHeight = isMobile ? 80 : 100;
        }
        
        if (!windowHeight) {
            windowHeight = window.innerHeight;
        }
        
        const scrollY = window.scrollY;
        let activeSection = null;
        let maxVisibleArea = 0;
        
        sectionsCache.forEach(section => {
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
        
        if (!activeSection) {
            const scrollPosition = scrollY + headerHeight + 50;
            
            sectionsCache.forEach(section => {
                  const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            });
        }
        
        if (activeSection) {
            // Actualizar enlaces desktop
            const activeLink = document.querySelector(`.nav__link[href="#${activeSection}"]`);
            const currentActiveLink = document.querySelector('.nav__link.active');
            
            if (activeLink && activeLink !== currentActiveLink) {
                updateActiveNavLink(activeLink);
            }
            
            // Actualizar enlaces del drawer móvil
            const activeDrawerLink = document.querySelector(`.nav__drawer-link[href="#${activeSection}"]`);
            const currentActiveDrawerLink = document.querySelector('.nav__drawer-link.active');
            
            if (activeDrawerLink && activeDrawerLink !== currentActiveDrawerLink) {
                updateActiveDrawerLink(activeDrawerLink);
            }
        }
    };
})();

const updateHeaderOnScroll = (() => {
    let headerCache = null;
    let threshold = null;
    
    return function() {
        if (!headerCache) {
            headerCache = document.getElementById('header');
            threshold = isMobile ? 50 : 100;
        }
        
        const scrollY = window.scrollY;
        
        if (headerCache) {
            if (scrollY > threshold) {
                headerCache.classList.add('scrolled');
            } else {
                headerCache.classList.remove('scrolled');
            }
            
            // Auto-hide navbar móvil optimizado
            if (isMobile && scrollY > lastScrollY && scrollY > threshold && !isMobileMenuOpen) {
                if (isNavbarVisible) {
                    headerCache.style.transform = 'translateY(-100%)';
                    isNavbarVisible = false;
                }
            } else if (isMobile) {
                if (!isNavbarVisible) {
                    headerCache.style.transform = 'translateY(0)';
                    isNavbarVisible = true;
                }
            }
        }
    };
})();

// ===== REPRODUCTOR DE VIDEO ULTRA-OPTIMIZADO =====
const initializeVideoPlayer = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const video = document.getElementById('main-video');
        const playOverlay = document.getElementById('play-overlay');
        const progressBar = document.querySelector('.videos__progress-bar');
        const progressFill = document.querySelector('.videos__progress-fill');
        const currentTimeDisplay = document.querySelector('.videos__current-time');
        const durationDisplay = document.querySelector('.videos__duration');
        const progressIndicators = document.querySelector('.videos__progress-indicators');
        
        if (!video || !playOverlay) return;
        
        video.controls = false;
        video.preload = isMobile ? 'none' : 'metadata';
        
        const handleLoadedMetadata = () => {
            if (durationDisplay) {
                durationDisplay.textContent = formatTime(video.duration);
            }
        };
        
        const handlePlayClick = () => {
            if (video.paused) {
                video.play();
                playOverlay.classList.add('hidden');
                if (progressIndicators) {
                    progressIndicators.classList.add('visible');
                }
            }
        };
        
        const handleVideoClick = () => {
            if (!video.paused) {
                video.pause();
                playOverlay.classList.remove('hidden');
                if (progressIndicators) {
                    progressIndicators.classList.remove('visible');
                }
            }
        };
        
        const handleTimeUpdate = () => {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }
                if (currentTimeDisplay) {
                    currentTimeDisplay.textContent = formatTime(video.currentTime);
                }
            }
        };
        
        const handleProgressBarClick = (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickTime = (clickX / width) * video.duration;
            video.currentTime = clickTime;
        };
        
        const handleVideoEnded = () => {
            playOverlay.classList.remove('hidden');
            if (progressIndicators) {
                progressIndicators.classList.remove('visible');
            }
            if (progressFill) {
                progressFill.style.width = '0%';
            }
            if (currentTimeDisplay) {
                currentTimeDisplay.textContent = '0:00';
            }
        };
        
        const handleVideoError = () => {
            showVideoError();
        };
        
        // Event listeners
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        playOverlay.addEventListener('click', handlePlayClick);
        video.addEventListener('click', handleVideoClick);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleVideoEnded);
        video.addEventListener('error', handleVideoError);
        
        if (progressBar) {
            progressBar.addEventListener('click', handleProgressBarClick);
        }
        
        if (isMobile) {
            playOverlay.addEventListener('touchstart', () => {
                playOverlay.style.transform = 'scale(0.98)';
            }, { passive: true });
            playOverlay.addEventListener('touchend', () => {
                playOverlay.style.transform = '';
            }, { passive: true });
        }
    };
})();

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showVideoError() {
    const playOverlay = document.getElementById('play-overlay');
    if (playOverlay) {
        playOverlay.innerHTML = `
            <div class="videos__error">
                <div class="videos__error-icon">⚠️</div>
                <div class="videos__error-text">Error al cargar el video</div>
                <div class="videos__error-subtitle">Por favor, intenta recargar la página</div>
            </div>
        `;
    }
}

// ===== FAQ ULTRA-OPTIMIZADO =====
const initializeFAQ = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const faqItems = document.querySelectorAll('.faq__item');
        const searchInput = document.getElementById('faq-search');
        const noResults = document.getElementById('faq-no-results');
        
        // Optimizar manejo de FAQ items
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');
            
            if (question && answer) {
                const handleQuestionClick = () => {
                    const isActive = item.classList.contains('active');
                    
                    // Cerrar otros items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq__answer');
                            const otherQuestion = otherItem.querySelector('.faq__question');
                            if (otherAnswer) otherAnswer.classList.remove('active');
                            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Toggle item actual
                    if (isActive) {
                        item.classList.remove('active');
                        answer.classList.remove('active');
                        question.setAttribute('aria-expanded', 'false');
                    } else {
                        item.classList.add('active');
                        answer.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                };
                
                question.addEventListener('click', handleQuestionClick);

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
        
        // Búsqueda optimizada con debounce
        if (searchInput) {
            const debouncedSearch = debounce((e) => {
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
            }, isMobile ? 400 : 300);
            
            searchInput.addEventListener('input', debouncedSearch);
        }
    };
})();

// ===== INTERSECTION OBSERVER ULTRA-OPTIMIZADO =====
const initializeIntersectionObserver = (() => {
    let initialized = false;
    let observer = null;
    
    return function() {
        if (initialized || performanceMode) return;
        initialized = true;
        
        const observerOptions = {
            threshold: isMobile ? 0.1 : 0.15,
            rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
        };
        
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    if (entry.target.classList.contains('feature')) {
                        animateFeature(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const elementsToObserve = document.querySelectorAll('.feature, .faq__item, .contact__channel');
        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    };
})();

const animateFeature = (() => {
    const animatedFeatures = new Set();
    
    return function(feature) {
        if (performanceMode || animatedFeatures.has(feature)) return;
        animatedFeatures.add(feature);
        
        const content = feature.querySelector('.feature__content');
        
        if (content) {
            const listItems = content.querySelectorAll('.feature__list-item');
            listItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 200 + (index * (isMobile ? 50 : 100)));
            });
        }
    };
})();

// ===== CONFIGURACIÓN DE LAZY LOADING ULTRA-OPTIMIZADA =====
const setupImageLazyLoading = (() => {
    let setupComplete = false;
    
    return function() {
        if (setupComplete) return;
        setupComplete = true;
        
        const waitForOptimizer = () => {
            if (!imageOptimizer) {
                setTimeout(waitForOptimizer, 100);
                return;
            }
            
            // Logo del navbar desktop
            const navLogo = document.querySelector('.nav__logo');
            if (navLogo) {
                imageOptimizer.loadImageImmediately(navLogo, 'logo');
            }
            
            // Logo del drawer móvil
            const drawerLogo = document.querySelector('.nav__drawer-logo');
            if (drawerLogo) {
                imageOptimizer.loadImageImmediately(drawerLogo, 'logo');
            }
            
            // Imagen del hero (crítica)
            const heroImage = document.querySelector('.hero__phone-app-image');
            if (heroImage) {
                imageOptimizer.loadImageImmediately(heroImage, 'videoPoster');
            }
            
            // Imágenes de características
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
                        imageOptimizer.loadImageImmediately(img, imageKeys[index]);
                    } else {
                        imageOptimizer.observeImage(img, imageKeys[index]);
                    }
                }
            });
            
            // Botones de descarga
            const appleBtn = document.querySelector('.download-btn--app-store .download-btn__image');
            const googleBtn = document.querySelector('.download-btn--google .download-btn__image');
            
            if (appleBtn) {
                imageOptimizer.loadImageImmediately(appleBtn, 'downloads.apple');
            }
            if (googleBtn) {
                imageOptimizer.loadImageImmediately(googleBtn, 'downloads.google');
            }
        };
        
        waitForOptimizer();
    };
})();

// ===== VIDEO HERO ULTRA-OPTIMIZADO =====
const initializeHeroVideoFallback = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        const heroVideo = document.getElementById('hero-video');
        const heroFallbackImage = document.querySelector('.hero__phone-app-image');
        const heroMobileVideo = document.getElementById('hero-mobile-video');
        
        // Video móvil
        if (heroMobileVideo && isMobile) {
            heroMobileVideo.muted = true;
            heroMobileVideo.autoplay = true;
            heroMobileVideo.loop = true;
            heroMobileVideo.playsInline = true;
            heroMobileVideo.preload = 'auto';
            
            heroMobileVideo.addEventListener('loadeddata', () => {
                console.log('Video móvil del hero cargado correctamente');
            });
            
            heroMobileVideo.addEventListener('error', (e) => {
                console.error('Error cargando video móvil del hero:', e);
                const mobileVideoContainer = document.querySelector('.hero__mobile-video');
                if (mobileVideoContainer) {
                    mobileVideoContainer.style.display = 'none';
                }
            });
        }
        
        if (!heroVideo || !heroFallbackImage) return;
        
        // En móvil o modo rendimiento, usar imagen
        if (isMobile || performanceMode) {
            heroVideo.style.display = 'none';
            heroFallbackImage.style.display = 'block';
            heroFallbackImage.style.zIndex = '2';
            return;
        }
        
        // Video desktop
        heroVideo.muted = true;
        heroVideo.autoplay = true;
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        heroVideo.preload = 'auto';
        
        const showVideoFallback = () => {
            heroVideo.style.display = 'none';
            heroFallbackImage.style.display = 'block';
            heroFallbackImage.style.zIndex = '2';
        };
        
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.classList.remove('loading');
            heroVideo.classList.add('loaded');
        });
        
        heroVideo.addEventListener('error', showVideoFallback);
        heroVideo.addEventListener('stalled', showVideoFallback);
        
        // Timeout fallback
        setTimeout(() => {
            if (heroVideo.readyState < 2) {
                showVideoFallback();
            }
        }, 2000);
    };
})();
     // ===== UTILIDADES ULTRA-OPTIMIZADAS =====
const debounce = (() => {
    const timeouts = new Map();
    
    return function(func, wait, immediate = false) {
        return function executedFunction(...args) {
            const key = func.toString();
            const later = () => {
                timeouts.delete(key);
                if (!immediate) func(...args);
            };
            
            const callNow = immediate && !timeouts.has(key);
            
            if (timeouts.has(key)) {
                clearTimeout(timeouts.get(key));
            }
            
            timeouts.set(key, setTimeout(later, wait));
            
            if (callNow) func(...args);
        };
    };
})();

const throttle = (() => {
    const throttled = new Map();
    
    return function(func, limit) {
        const key = func.toString();
        
        return function(...args) {
            if (!throttled.has(key)) {
                func.apply(this, args);
                throttled.set(key, true);
                
                setTimeout(() => {
                    throttled.delete(key);
                }, limit);
            }
        };
    };
})();

// ===== OPTIMIZACIONES DE RENDIMIENTO ULTRA-AGRESIVAS =====
const initializePerformanceOptimizations = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        // Preload crítico solo si no es modo rendimiento
        if (!performanceMode) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    preloadCriticalResources();
                }, { timeout: 5000 });
            } else {
                setTimeout(preloadCriticalResources, 5000);
            }
        }
        
        // Optimizaciones móviles
        if (isMobile) {
            const elementsToOptimize = document.querySelectorAll('.hero__phone, .nav__logo, .nav__drawer-logo, .floating-widget__main-btn');
            elementsToOptimize.forEach(element => {
                element.style.willChange = 'transform';
            });
            
            const featureElements = document.querySelectorAll('.feature__phone, .phone');
            featureElements.forEach(element => {
                element.style.willChange = 'auto';
            });
        }
        
        // Manejo de resize optimizado
        let resizeTimeout;
        const handleResize = throttle(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleResizeComplete();
            }, isMobile ? 1000 : 500);
        }, 250);
        
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Optimización de memoria
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'measure' && entry.duration > 100) {
                            console.warn(`Operación lenta detectada: ${entry.name} - ${entry.duration}ms`);
                        }
                    });
                });
                observer.observe({ entryTypes: ['measure'] });
            } catch (e) {
                // PerformanceObserver no soportado
            }
        }
    };
})();

const preloadCriticalResources = (() => {
    let preloaded = false;
    
    return function() {
        if (preloaded) return;
        preloaded = true;
        
        const criticalResources = [
            './assets/logo.webp',
            './assets/video-poster.webp'
        ];
        
        const fragment = document.createDocumentFragment();
        
        criticalResources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            fragment.appendChild(link);
        });
        
        document.head.appendChild(fragment);
    };
})();

const handleResizeComplete = (() => {
    let lastWidth = window.innerWidth;
    
    return function() {
        const newWidth = window.innerWidth;
        const newIsMobile = newWidth <= 1023;
        
        // Solo procesar si hay cambio significativo
        if (Math.abs(newWidth - lastWidth) < 50 && newIsMobile === isMobile) {
            return;
        }
        
        lastWidth = newWidth;
        
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            detectDeviceCapabilities();
            
            // Cerrar menús abiertos al cambiar de dispositivo
            if (isMenuOpen) {
                closeMobileMenu();
            }
            if (isMobileMenuOpen) {
                closeMobileMenu();
            }
            
            // Manejar visibilidad del botón flotante según el dispositivo
            const floatingWidget = document.getElementById('floating-widget');
            if (floatingWidget) {
                if (!isMobile) {
                    floatingWidget.classList.remove('hidden-by-drawer');
                } else if (isMobileMenuOpen) {
                    floatingWidget.classList.add('hidden-by-drawer');
                }
            }
            
            // Reinicializar navegación
            setTimeout(() => {
                initializeNavigation();
                updateActiveNavOnScroll();
            }, 100);
        }
        
        // Cerrar menús flotantes
        if (isFloatingMenuOpen) {
            closeFloatingMenu();
        }
        
        if (isLanguageSwitcherOpen) {
            closeLanguageSwitcher();
        }
        
        // Limpiar cache de posiciones
        if (smoothScrollToSection.cache) {
            smoothScrollToSection.cache.clear();
        }
    };
})();

// ===== ACCESIBILIDAD ULTRA-OPTIMIZADA =====
const initializeAccessibility = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        // Manejo de tecla Escape optimizado
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                let handled = false;
                
                if (isMenuOpen) {
                    closeMobileMenu();
                    handled = true;
                }
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                    handled = true;
                }
                if (isFloatingMenuOpen) {
                    closeFloatingMenu();
                    handled = true;
                }
                if (isLanguageSwitcherOpen) {
                    closeLanguageSwitcher();
                    handled = true;
                }
                
                if (handled) {
                    e.preventDefault();
                }
            }
        };
        
        // Detección de navegación por teclado
        const handleKeyboardNavigation = (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        };
        
        const handleMouseNavigation = () => {
            document.body.classList.remove('keyboard-navigation');
        };
        
        const handleTouchNavigation = () => {
            if (isMobile) {
                document.body.classList.add('touch-navigation');
            }
        };
        
        // Event listeners optimizados
        document.addEventListener('keydown', handleEscapeKey);
        document.addEventListener('keydown', handleKeyboardNavigation);
        document.addEventListener('mousedown', handleMouseNavigation);
        
        if (isMobile) {
            document.addEventListener('touchstart', handleTouchNavigation, { passive: true });
        }
        
        // Configurar atributos ARIA iniciales
        const setupInitialARIA = () => {
            const navToggle = document.getElementById('nav-toggle');
            const navDrawer = document.getElementById('nav-drawer');
            const floatingMainBtn = document.getElementById('floating-main-btn');
            
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-controls', 'nav-drawer');
            }
            
            if (navDrawer) {
                navDrawer.setAttribute('aria-hidden', 'true');
            }
            
            if (floatingMainBtn) {
                floatingMainBtn.setAttribute('aria-expanded', 'false');
                floatingMainBtn.setAttribute('aria-controls', 'floating-menu');
            }
        };
        
        setupInitialARIA();
    };
})();

// ===== MANEJO DE ERRORES ULTRA-OPTIMIZADO =====
const initializeErrorHandling = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        window.addEventListener('error', (e) => {
            console.error('Error en la aplicación:', e.error);
            
            // Manejo específico de errores de video en móvil
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
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rechazada:', e.reason);
        });
        
        // Limpieza al salir
        window.addEventListener('beforeunload', () => {
            if (imageOptimizer && imageOptimizer.intersectionObserver) {
                imageOptimizer.intersectionObserver.disconnect();
            }
        });
    };
})();

// ===== SOPORTE PARA PWA OPTIMIZADO =====
const initializePWASupport = (() => {
    let initialized = false;
    
    return function() {
        if (initialized || isMobile || performanceMode) return;
        initialized = true;
        
        if ('serviceWorker' in navigator) {
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
    };
})();

// ===== INICIALIZACIÓN PRINCIPAL ULTRA-OPTIMIZADA =====
const initializeApp = (() => {
    let initialized = false;
    
    return function() {
        if (initialized) return;
        initialized = true;
        
        console.log('🚀 Iniciando StarFlex Ultra-Optimizado...');
        
        // Detección inicial de capacidades
        detectDeviceCapabilities();
        
        // Inicialización del optimizador de imágenes
        imageOptimizer = new UltraOptimizedImageLoader();
        
        // Sistemas core
        initializeLanguageSystem();
        initializeLanguageSwitcher();
        initializeNavigation();
        initializeAccessibility();
        initializeErrorHandling();
        
        // Funcionalidades principales
        initializeScrollEffects();
        initializeVideoPlayer();
        initializeFAQ();
        initializeHeroVideoFallback();
        initializeFloatingWidget();
        
        // Configuración de imágenes
        setupImageLazyLoading();
        
        // Optimizaciones de rendimiento
        if (!performanceMode) {
            initializeIntersectionObserver();
        }
        
        initializePerformanceOptimizations();
        initializePWASupport();
        
        // Log final
        console.log(`✅ StarFlex Ultra-Optimizado iniciado - Móvil: ${isMobile}, Modo rendimiento: ${performanceMode}, Drawer móvil: ${isMobile ? 'Activo' : 'Inactivo'}`);
        
        // Marcar como cargado
        document.body.classList.add('app-loaded');
        
        // Evento personalizado para indicar que la app está lista
        const appReadyEvent = new CustomEvent('starflexReady', {
            detail: {
                isMobile,
                performanceMode,
                currentLanguage
            }
        });
        document.dispatchEvent(appReadyEvent);
    };
})();

// ===== INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM ya está listo
    initializeApp();
}

// ===== INICIALIZACIÓN ADICIONAL CUANDO LA VENTANA ESTÁ COMPLETAMENTE CARGADA =====
window.addEventListener('load', () => {
    // Optimizaciones post-carga
    if (!performanceMode) {
        requestIdleCallback(() => {
            // Precargar recursos adicionales
            const additionalResources = [
                './assets/phones/Schedule.webp',
                './assets/phones/Stations.webp'
            ];
            
            additionalResources.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }, { timeout: 3000 });
    }
    
    // Remover clases de carga
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    console.log('🎉 StarFlex completamente cargado y optimizado');
});

// ===== EXPORTAR FUNCIONES PARA DEBUGGING (SOLO EN DESARROLLO) =====
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.StarFlexDebug = {
        isMobile,
        performanceMode,
        currentLanguage,
        switchLanguage,
        toggleMobileMenu,
        toggleFloatingMenu,
        detectDeviceCapabilities,
        imageOptimizer: () => imageOptimizer
    };
}

// ===== POLYFILLS PARA COMPATIBILIDAD =====
// Polyfill para requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback, options = {}) {
        const timeout = options.timeout || 0;
        const startTime = performance.now();
        
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining() {
                    return Math.max(0, 50 - (performance.now() - startTime));
                }
            });
        }, timeout);
    };
}

// Polyfill para cancelIdleCallback
if (!window.cancelIdleCallback) {
    window.cancelIdleCallback = function(id) {
        clearTimeout(id);
    };
}

// ===== CONFIGURACIÓN DE MÉTRICAS DE RENDIMIENTO =====
if ('performance' in window && 'mark' in performance) {
    performance.mark('starflex-init-start');
    
    window.addEventListener('load', () => {
        performance.mark('starflex-init-end');
        performance.measure('starflex-init', 'starflex-init-start', 'starflex-init-end');
        
        const measure = performance.getEntriesByName('starflex-init')[0];
        if (measure) {
            console.log(`⚡ Tiempo de inicialización de StarFlex: ${measure.duration.toFixed(2)}ms`);
        }
    });
}
         

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
let imageOptimizer;

// ===== CONFIGURACIÓN GLOBAL OPTIMIZADA =====
const CONFIG = {
    ANIMATION_DURATION: isMobile ? 200 : 400,
    SCROLL_THRESHOLD: isMobile ? 30 : 50,
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
            horario: { avif: './assets/phones/Horario.avif' },
            estaciones: { avif: './assets/phones/Estaciones.avif' },
            calendario: { avif: './assets/phones/Calendario.avif' },
            registro: { avif: './assets/phones/Registro.avif' },
            notificaciones: { avif: './assets/phones/Notificaciones.avif' },
            referidos: { avif: './assets/phones/Referidos.avif' }
        },
        downloads: {
            apple: { png: './assets/AppleStore.png' },
            google: { png: './assets/GooglePlay.png' }
        }
    }
};

// ===== SISTEMA DE TRADUCCIONES OPTIMIZADO =====
// Importar traducciones desde un archivo externo para reducir tamaño
const translationData = (function() {
    // Cargar traducciones bajo demanda
    return {
        es: {
            // Meta tags
            'page-title': 'StarFlex - Automatiza tus Bloques de Amazon Flex | Prueba Gratis',
            'page-description': 'Starflex revoluciona Amazon Flex. Automatización inteligente de bloques, optimización de horarios y máximas ganancias. Únete a +15,000 conductores exitosos.',
            'og-title': 'Starflex - La Revolución de Amazon Flex',
            'og-description': 'Automatización inteligente que multiplica tus ganancias. La herramienta que todo conductor profesional necesita.',
            // Navegación
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
            // Videos Section
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
            // Navegación
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
            // Videos Section
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
    };
})();

// ===== DETECCIÓN DE DISPOSITIVO Y CAPACIDADES OPTIMIZADA =====
function detectDeviceCapabilities() {
    isMobile = window.innerWidth <= 1023;
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detección optimizada de dispositivos de baja potencia
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' || 
        connection.effectiveType === '3g'
    );
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
    
    performanceMode = isMobile && (isSlowConnection || isLowEndDevice || isReducedMotion || isLowMemory);
    
    if (performanceMode) {
        document.body.classList.add('performance-mode');
        // Deshabilitar animaciones CSS para mejorar rendimiento
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
}

// ===== DETECCIÓN DE SOPORTE DE FORMATOS DE IMAGEN OPTIMIZADA =====
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
        
        // Test AVIF
        const avifImg = new Image();
        avifImg.onload = avifImg.onerror = function() {
            formats.avif = avifImg.height === 2;
            checkComplete();
        };
        avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        
        // Test WebP
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
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        this.supportedFormats = { avif: false, webp: false };
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
                            this.loadImage(entry.target);
                            this.intersectionObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: isMobile ? '50px 0px' : '100px 0px',
                    threshold: 0.01
                }
            );
        }
    }
    
    getBestImageUrl(imageConfig) {
        if (!imageConfig) return null;
        
        if (this.supportedFormats.avif && imageConfig.avif) {
            return imageConfig.avif;
        }
        
        if (this.supportedFormats.webp && imageConfig.webp) {
            return imageConfig.webp;
        }
        
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
        if (!key) return null;
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
        
        const criticalImages = ['hero', 'logo'];
        const preloadPromises = criticalImages.map(async (key) => {
            const config = this.getImageConfig(key);
            if (config) {
                const url = this.getBestImageUrl(config);
                if (url) {
                    try {
                        await this.preloadImage(url);
                    } catch (error) {
                        // Silently fail for preloads
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
            this.loadImage(element);
        }
    }
    
    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

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
    // Botones de idioma para desktop y móvil
    const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option');
    const mobileLanguageButtons = document.querySelectorAll('.mobile-language-btn, .mobile-nav__language-option');
    
    // Configurar eventos para botones desktop
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
            }
        });

        // Mejorar feedback táctil en móvil
        if (isMobile) {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            }, { passive: true });
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            }, { passive: true });
        }
    });
    
    // Configurar eventos para botones móvil
    mobileLanguageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
            }
        });

        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.98)';
        }, { passive: true });
        button.addEventListener('touchend', () => {
            button.style.transform = '';
        }, { passive: true });
    });
}

function switchLanguage(newLanguage) {
    if (!translationData[newLanguage]) return;
    
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    applyTranslations();
    updateLanguageButtons();
    
    document.documentElement.lang = newLanguage;
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    if (!currentTranslations) return;
    
    requestAnimationFrame(() => {
        // Optimización: Usar selectores específicos para cada tipo de elemento
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
        
        // Optimización: Procesar otros atributos de traducción
        const attributeSelectors = [
            { selector: '[data-translate-placeholder]', attribute: 'placeholder' },
            { selector: '[data-translate-aria]', attribute: 'aria-label' },
            { selector: '[data-translate-alt]', attribute: 'alt' }
        ];
        
        attributeSelectors.forEach(({ selector, attribute }) => {
            document.querySelectorAll(selector).forEach(element => {
                const key = element.getAttribute(selector.slice(1, -1));
                const translation = currentTranslations[key];
                if (translation) {
                    element.setAttribute(attribute, translation);
                }
            });
        });
    });
}

function updateLanguageButtons() {
    // Actualizar botones desktop y móvil
    document.querySelectorAll('.language-btn, .nav__language-option, .mobile-language-btn, .mobile-nav__language-option').forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        button.classList.toggle('active', buttonLang === currentLanguage);
    });
    
    updateLanguageSwitcher();
}

// ===== SELECTOR DE IDIOMA FLOTANTE OPTIMIZADO =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcher = document.getElementById('language-switcher');
    
    if (!languageSwitcherBtn || !languageSwitcher || isMobile) return;
    
    languageSwitcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLanguageSwitcher();
    });
    
    const languageOptions = languageSwitcher.querySelectorAll('.language-switcher__option');
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
    
    // Cerrar al hacer clic fuera o presionar Escape
    document.addEventListener('click', (e) => {
        if (isLanguageSwitcherOpen && !languageSwitcher.contains(e.target)) {
            closeLanguageSwitcher();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isLanguageSwitcherOpen) {
            closeLanguageSwitcher();
        }
    });
}

function toggleLanguageSwitcher() {
    isLanguageSwitcherOpen ? closeLanguageSwitcher() : openLanguageSwitcher();
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
    
    document.querySelectorAll('.language-switcher__option').forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        option.classList.toggle('active', optionLang === currentLanguage);
    });
}

// ===== FUNCIONES DEL BOTÓN FLOTANTE OPTIMIZADAS =====
function initializeFloatingWidget() {
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
    
    // Cerrar al hacer clic fuera o presionar Escape
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
    isFloatingMenuOpen ? closeFloatingMenu() : openFloatingMenu();
}

function openFloatingMenu() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    isFloatingMenuOpen = true;
    floatingMainBtn.classList.add('active');
    floatingMenu.classList.add('active');
    floatingMainBtn.setAttribute('aria-expanded', 'true');
    
    // Animar elementos del menú
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.opacity = '1';
        }, index * (isMobile ? 60 : 100));
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
    
    // Restablecer estilos de los elementos del menú
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach(item => {
        item.style.transform = '';
        item.style.opacity = '';
    });
}

// ===== NAVEGACIÓN OPTIMIZADA =====
function initializeNavigation() {
    // Inicializar navegación según el dispositivo
    isMobile ? initializeMobileNavigation() : initializeDesktopNavigation();
    initializeActiveSection();
}

function initializeDesktopNavigation() {
    // Logo como enlace (solo desktop)
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
    
    // Enlaces de navegación desktop
    document.querySelectorAll('.nav__link').forEach(link => {
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
    
    initializeKeyboardNavigation();
}

function initializeMobileNavigation() {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    
    if (!mobileNavToggle || !mobileNavMenu) return;
    
    // Logo móvil como enlace
    const mobileNavLogo = document.querySelector('.mobile-nav__logo');
    if (mobileNavLogo) {
        mobileNavLogo.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (isMobileMenuOpen) closeMobileNavMenu();
            
            const homeSection = document.querySelector('#home');
            if (homeSection) {
                smoothScrollToSection(homeSection);
                
                const homeLink = document.querySelector('.mobile-nav__link[href="#home"]');
                if (homeLink) updateActiveMobileNavLink(homeLink);
            }
        });
        
        mobileNavLogo.style.cursor = 'pointer';
        mobileNavLogo.setAttribute('tabindex', '0');
        mobileNavLogo.setAttribute('role', 'button');
        mobileNavLogo.setAttribute('aria-label', 'Ir al inicio');
    }
    
    // Toggle hamburguesa móvil
    mobileNavToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileNavMenu();
    });

    // Optimización: Usar eventos pasivos para mejorar rendimiento táctil
    mobileNavToggle.addEventListener('touchstart', () => {
        mobileNavToggle.style.transform = 'scale(0.95)';
    }, { passive: true });
    mobileNavToggle.addEventListener('touchend', () => {
        mobileNavToggle.style.transform = '';
    }, { passive: true });
    
    // Botón cerrar móvil
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileNavMenu();
        });

        mobileNavClose.addEventListener('touchstart', () => {
            mobileNavClose.style.transform = 'scale(0.95)';
        }, { passive: true });
        mobileNavClose.addEventListener('touchend', () => {
            mobileNavClose.style.transform = '';
        }, { passive: true });
    }
    
    // Overlay para cerrar
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNavMenu);
    }
    
    // Enlaces de navegación móvil
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMobileMenuOpen) closeMobileNavMenu();
            
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollToSection(targetSection);
                updateActiveMobileNavLink(link);
            }
        });

        // Optimización: Usar eventos pasivos para mejorar rendimiento táctil
        link.addEventListener('touchstart', () => {
            link.style.transform = 'scale(0.98)';
        }, { passive: true });
        link.addEventListener('touchend', () => {
            link.style.transform = '';
        }, { passive: true });
    });
    
    // Cerrar menú tocando fuera - Optimizado con eventos pasivos
    document.addEventListener('touchstart', (e) => {
        if (isMobileMenuOpen && mobileNavMenu && !mobileNavMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            closeMobileNavMenu();
        }
    }, { passive: true });
    
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen && mobileNavMenu && !mobileNavMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            closeMobileNavMenu();
        }
    });
}

function toggleMobileNavMenu() {
    isMobileMenuOpen ? closeMobileNavMenu() : openMobileNavMenu();
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
    mobileNavMenu.setAttribute('aria-hidden', 'false');
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
    mobileNavMenu.setAttribute('aria-hidden', 'true');
}

function updateActiveMobileNavLink(activeLink) {
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

function smoothScrollToSection(targetSection) {
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
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

function initializeActiveSection() {
    setTimeout(updateActiveNavOnScroll, 100);
}

// ===== FUNCIONES LEGACY PARA COMPATIBILIDAD =====
function toggleMobileMenu() {
    if (isMobile) toggleMobileNavMenu();
}

function openMobileMenu() {
    if (isMobile) openMobileNavMenu();
}

function closeMobileMenu() {
    if (isMobile) closeMobileNavMenu();
}

// ===== NAVEGACIÓN POR TECLADO OPTIMIZADA =====
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape para cerrar menús
        if (e.key === 'Escape') {
            if (isMenuOpen) {
                e.preventDefault();
                closeMobileMenu();
                return;
            }
            if (isMobileMenuOpen) {
                e.preventDefault();
                closeMobileNavMenu();
                return;
            }
        }
        
        // Tab trap para menú móvil
        if (e.key === 'Tab' && isMobileMenuOpen) {
            const mobileNavMenu = document.getElementById('mobile-nav-menu');
            if (mobileNavMenu) handleTabTrap(e, mobileNavMenu);
        }
        
        // Enter/Space para toggles
        if ((e.key === 'Enter' || e.key === ' ')) {
            const navToggle = document.getElementById('nav-toggle');
            const mobileNavToggle = document.getElementById('mobile-nav-toggle');
            
            if (e.target === navToggle) {
                e.preventDefault();
                toggleMobileMenu();
            }
            if (e.target === mobileNavToggle) {
                e.preventDefault();
                toggleMobileNavMenu();
            }
        }
    });
}

function handleTabTrap(e, menuElement) {
    const focusableElements = menuElement.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
    }
}

// ===== EFECTOS DE SCROLL OPTIMIZADOS =====
function initializeScrollEffects() {
    let scrollTimeout;
    
    // Optimización: Usar evento pasivo para mejorar rendimiento de scroll
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
        }, isMobile ? 50 : 25);
    }, { passive: true });
}

function handleScrollDirection() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > (isMobile ? 50 : 100)) {
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
    const windowHeight = window.innerHeight;
    
    let activeSection = null;
    let maxVisibleArea = 0;
    
    // Optimización: Calcular sección más visible
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
    
    // Fallback si no se encontró sección visible
    if (!activeSection) {
        const scrollPosition = scrollY + headerHeight + 50;
        
        sections.forEach(section => {
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
        
        // Actualizar enlaces móvil
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
    const threshold = isMobile ? 50 : 100;
    
    // Actualizar header desktop
    if (header && !isMobile) {
        header.classList.toggle('scrolled', scrollY > threshold);
    }
    
    // Actualizar header móvil
    if (mobileHeader && isMobile) {
        mobileHeader.classList.toggle('scrolled', scrollY > threshold);
        
        // Auto-hide navbar móvil optimizado
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
    const currentTimeDisplay = document.querySelector('.videos__current-time');
    const durationDisplay = document.querySelector('.videos__duration');
    const progressIndicators = document.querySelector('.videos__progress-indicators');
    
    if (!video || !playOverlay) return;
    
    video.controls = false;
    video.preload = isMobile ? 'none' : 'metadata';
    
    // Optimización: Cargar metadatos solo cuando sea necesario
    video.addEventListener('loadedmetadata', () => {
        if (durationDisplay) {
            durationDisplay.textContent = formatTime(video.duration);
        }
    });
    
    // Reproducir video al hacer clic en overlay
    playOverlay.addEventListener('click', () => {
        if (video.paused) {
            // Optimización: Cargar video solo cuando se reproduce
            if (video.preload === 'none') {
                video.preload = 'auto';
            }
            
            video.play().catch(() => {
                // Fallback si la reproducción falla
                showVideoError();
            });
            
            playOverlay.classList.add('hidden');
            if (progressIndicators) {
                progressIndicators.classList.add('visible');
            }
        }
    });
    
    // Optimización: Mejorar feedback táctil
    if (isMobile) {
        playOverlay.addEventListener('touchstart', () => {
            playOverlay.style.transform = 'scale(0.98)';
        }, { passive: true });
        playOverlay.addEventListener('touchend', () => {
            playOverlay.style.transform = '';
        }, { passive: true });
    }
    
    // Pausar video al hacer clic
    video.addEventListener('click', () => {
        if (!video.paused) {
            video.pause();
            playOverlay.classList.remove('hidden');
            if (progressIndicators) {
                progressIndicators.classList.remove('visible');
            }
        }
    });
    
    // Optimización: Actualizar progreso solo cuando sea necesario
    video.addEventListener('timeupdate', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (video.duration) {
                    const progress = (video.currentTime / video.duration) * 100;
                    if (progressFill) {
                        progressFill.style.width = `${progress}%`;
                    }
                    if (currentTimeDisplay) {
                        currentTimeDisplay.textContent = formatTime(video.currentTime);
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Optimización: Buscar en el video al hacer clic en la barra de progreso
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickTime = (clickX / width) * video.duration;
            video.currentTime = clickTime;
        });
    }
    
    // Manejar fin del video
    video.addEventListener('ended', () => {
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
    });
    
    // Manejar errores
    video.addEventListener('error', showVideoError);
}

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

// ===== FAQ OPTIMIZADO =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    const searchInput = document.getElementById('faq-search');
    const noResults = document.getElementById('faq-no-results');
    
    // Optimización: Configurar eventos de clic para preguntas
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Cerrar otras preguntas
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq__answer');
                        const otherQuestion = otherItem.querySelector('.faq__question');
                        if (otherAnswer) otherAnswer.classList.remove('active');
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Alternar estado actual
                item.classList.toggle('active', !isActive);
                answer.classList.toggle('active', !isActive);
                question.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
            });

            // Optimización: Mejorar feedback táctil
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
    
    // Optimización: Búsqueda en FAQ con debounce
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
                    
                    const isMatch = searchTerm === '' || 
                                   questionContent.includes(searchTerm) || 
                                   answerContent.includes(searchTerm);
                    
                    // Optimización: Mostrar/ocultar elementos
                    item.style.display = isMatch ? 'block' : 'none';
                    
                    if (isMatch) {
                        visibleItems++;
                    } else {
                        // Cerrar elementos ocultos
                        item.classList.remove('active');
                        const answer = item.querySelector('.faq__answer');
                        const question = item.querySelector('.faq__question');
                        if (answer) answer.classList.remove('active');
                        if (question) question.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Mostrar mensaje de no resultados si es necesario
            if (noResults) {
                noResults.classList.toggle('show', visibleItems === 0 && searchTerm !== '');
            }
        }, isMobile ? 400 : 300));
    }
}

// ===== INTERSECTION OBSERVER OPTIMIZADO =====
function initializeIntersectionObserver() {
    if (performanceMode) return;
    
    const observerOptions = {
        threshold: isMobile ? 0.1 : 0.15,
        rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('feature')) {
                    animateFeature(entry.target);
                }
                // Desconectar el elemento una vez que se ha animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Optimización: Observar solo elementos necesarios
    document.querySelectorAll('.feature, .faq__item, .contact__channel').forEach(element => {
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
            }, 200 + (index * (isMobile ? 50 : 100)));
        });
    }
}

// ===== CONFIGURACIÓN DE LAZY LOADING OPTIMIZADA =====
function setupImageLazyLoading() {
    if (!imageOptimizer) {
        imageOptimizer = new OptimizedImageLoader();
    }
    
    // Cargar logos inmediatamente
    const criticalImages = [
        { selector: '.nav__logo', key: 'logo' },
        { selector: '.mobile-nav__logo', key: 'logo' },
        { selector: '.mobile-nav__logo-menu', key: 'logo' },
        { selector: '.hero__phone-app-image', key: 'hero' }
    ];
    
    criticalImages.forEach(({ selector, key }) => {
        const element = document.querySelector(selector);
        if (element) {
            imageOptimizer.loadImageImmediately(element, key);
        }
    });
    
    // Cargar imágenes de características con lazy loading
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
    
    // Cargar botones de descarga
    const downloadButtons = [
        { selector: '.download-btn--app-store .download-btn__image', key: 'downloads.apple' },
        { selector: '.download-btn--google .download-btn__image', key: 'downloads.google' }
    ];
    
    downloadButtons.forEach(({ selector, key }) => {
        const element = document.querySelector(selector);
        if (element) {
            imageOptimizer.loadImageImmediately(element, key);
        }
    });
}

// ===== VIDEO HERO OPTIMIZADO =====
function initializeHeroVideoFallback() {
    const heroVideo = document.getElementById('hero-video');
    const heroFallbackImage = document.querySelector('.hero__phone-app-image');
    const heroMobileVideo = document.getElementById('hero-mobile-video');
    
    // Optimización: Configurar video móvil
    if (heroMobileVideo && isMobile) {
        heroMobileVideo.muted = true;
        heroMobileVideo.autoplay = true;
        heroMobileVideo.loop = true;
        heroMobileVideo.playsInline = true;
        heroMobileVideo.preload = 'auto';
        
        heroMobileVideo.addEventListener('error', () => {
            const mobileVideoContainer = document.querySelector('.hero__mobile-video');
            if (mobileVideoContainer) {
                mobileVideoContainer.style.display = 'none';
            }
        });
    }
    
    if (!heroVideo || !heroFallbackImage) return;
    
    // Optimización: Usar imagen en lugar de video en móvil o modo rendimiento
    if (isMobile || performanceMode) {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
        return;
    }
    
    // Configurar video desktop
    heroVideo.muted = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'auto';
    
    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('loaded');
    });
    
    // Manejar errores y fallbacks
    const showVideoFallback = () => {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
    };
    
    heroVideo.addEventListener('error', showVideoFallback);
    heroVideo.addEventListener('stalled', showVideoFallback);
    
    // Timeout para fallback si el video no carga
    setTimeout(() => {
        if (heroVideo.readyState < 2) {
            showVideoFallback();
        }
    }, 2000);
}

// ===== UTILIDADES OPTIMIZADAS =====
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
function initializePerformanceOptimizations() {
    // Precargar recursos críticos en dispositivos potentes
    if (!performanceMode) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(preloadCriticalResources);
        } else {
            setTimeout(preloadCriticalResources, 5000);
        }
    }
    
    // Optimización: Usar will-change solo en elementos que lo necesitan
    if (isMobile) {
        const elementsToOptimize = [
            '.hero__phone', 
            '.nav__logo', 
            '.mobile-nav__logo', 
            '.floating-widget__main-btn'
        ].map(selector => document.querySelectorAll(selector))
         .flat()
         .forEach(el => {
             if (el) el.style.willChange = 'transform';
         });
    }
    
    // Optimización: Manejar resize con throttle
    window.addEventListener('resize', debounce(handleResize, isMobile ? 250 : 150));
}

function preloadCriticalResources() {
    const criticalResources = [
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

function handleResize() {
    const newIsMobile = window.innerWidth <= 1023;
    
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        detectDeviceCapabilities();
        
        // Cerrar menús abiertos al cambiar de dispositivo
        if (isMenuOpen) closeMobileMenu();
        if (isMobileMenuOpen) closeMobileNavMenu();
        
        // Reinicializar navegación
        setTimeout(() => {
            initializeNavigation();
            updateActiveNavOnScroll();
        }, 100);
    }
    
    // Cerrar menús flotantes
    if (isFloatingMenuOpen) closeFloatingMenu();
    if (isLanguageSwitcherOpen) closeLanguageSwitcher();
}

// ===== ACCESIBILIDAD OPTIMIZADA =====
function initializeAccessibility() {
    // Manejar escape para cerrar menús
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isMenuOpen) closeMobileMenu();
            if (isMobileMenuOpen) closeMobileNavMenu();
            if (isFloatingMenuOpen) closeFloatingMenu();
            if (isLanguageSwitcherOpen) closeLanguageSwitcher();
        }
    });
    
    // Detectar navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Detectar navegación táctil
    if (isMobile) {
        document.addEventListener('touchstart', () => {
            document.body.classList.add('touch-navigation');
        }, { passive: true });
    }
}

// ===== INICIALIZACIÓN PRINCIPAL OPTIMIZADA =====
document.addEventListener('DOMContentLoaded', () => {
    // Detección de capacidades
    detectDeviceCapabilities();
    
    // Inicialización de componentes críticos
    imageOptimizer = new OptimizedImageLoader();
    
    // Inicialización de componentes principales
    const initComponents = [
        initializeLanguageSystem,
        initializeLanguageSwitcher,
        initializeNavigation,
        initializeScrollEffects,
        initializeVideoPlayer,
        initializeFAQ,
        initializeHeroVideoFallback,
        initializeAccessibility,
        initializeFloatingWidget,
        setupImageLazyLoading
    ];
    
    // Ejecutar inicializaciones críticas inmediatamente
    initComponents.forEach(init => init());
    
    // Inicializar componentes no críticos después
    if (!performanceMode) {
        requestAnimationFrame(() => {
            initializeIntersectionObserver();
            initializePerformanceOptimizations();
        });
    }
});

// ===== MANEJO DE ERRORES OPTIMIZADO =====
window.addEventListener('error', (e) => {
    // Manejar errores de video específicamente
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
            .catch(error => {
                // Silently fail
            });
    });
}

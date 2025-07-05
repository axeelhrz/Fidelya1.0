// ===== VARIABLES GLOBALES OPTIMIZADAS PARA MÓVIL =====
let isMenuOpen = false;
let currentFeature = 0;
const features = document.querySelectorAll('.feature');
// Variables para el sistema de idiomas
let currentLanguage = 'es';
const translations = {};
// Variables para el botón flotante
let isFloatingMenuOpen = false;
// Variables para el selector de idioma flotante
let isLanguageSwitcherOpen = false;
// Variables para el control del navbar
let lastScrollY = 0;
let isScrollingDown = false;
let ticking = false;
// Variables para el navbar responsive
let isNavbarVisible = true;
// Variables para optimización móvil
let isMobile = window.innerWidth <= 1023;
let isReducedMotion = false;
let performanceMode = false;

// ===== CONFIGURACIÓN GLOBAL OPTIMIZADA =====
const CONFIG = {
    // Configuración de animaciones optimizada para móvil - MÁS RÁPIDA Y FLUIDA
    ANIMATION_DURATION: isMobile ? 300 : 600,
    SCROLL_THRESHOLD: isMobile ? 50 : 100,
    
    // Configuración de imágenes optimizadas para móvil
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
        WEBP: 'image/webp',
        JPEG: 'image/jpeg',
        PNG: 'image/png'
    },
    
    // Rutas de imágenes optimizadas - SOLO AVIF (archivos que realmente existen)
    IMAGE_PATHS: {
        hero: {
            avif: './assets/phones/Hero.avif'
        },
        logo: {
            avif: './assets/logo.avif'
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
                avif: './assets/AppleStore.avif'
            },
            google: {
                avif: './assets/GooglePlay.avif'
            }
        }
    }
};

// ===== SISTEMA DE TRADUCCIONES OPTIMIZADO =====
const translationData = {
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
        'hero-title-main': 'MASTER THE',
        'hero-title-highlight': 'AMAZON FLEX',
        'hero-title-amazon': 'BLOCKS',
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

// ===== RESTO DEL CÓDIGO JAVASCRIPT IGUAL =====
// [El resto del código JavaScript permanece exactamente igual que el original]

// ===== DETECCIÓN DE DISPOSITIVO Y CAPACIDADES =====
function detectDeviceCapabilities() {
    isMobile = window.innerWidth <= 1023;
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detectar dispositivos de baja potencia
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    
    performanceMode = isMobile && (isSlowConnection || isLowEndDevice || isReducedMotion);
    
    if (performanceMode) {
        document.body.classList.add('performance-mode');
        console.log('Modo de rendimiento activado para dispositivo de baja potencia');
    }
}



// ===== DETECCIÓN DE SOPORTE DE FORMATOS DE IMAGEN =====
function detectImageFormats() {
    return new Promise((resolve) => {
        const formats = {
            avif: false,
            webp: false
        };
        
        let testsCompleted = 0;
        const totalTests = 2;
        
        function checkComplete() {
            testsCompleted++;
            if (testsCompleted === totalTests) {
                // Aplicar clases al documento
                if (formats.avif) {
                    document.documentElement.classList.add('avif');
                }
                if (formats.webp) {
                    document.documentElement.classList.add('webp');
                }
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

// ===== CLASE OPTIMIZADA PARA IMÁGENES MÓVILES =====
class MobileImageOptimizer {
    constructor() {
        this.imageCache = new Map();
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        this.supportedFormats = { avif: false, webp: false };
        this.init();
    }
    
    async init() {
        // Detectar formatos soportados
        this.supportedFormats = await detectImageFormats();
        this.setupLazyLoading();
        this.preloadCriticalImages();
    }
    
    // Configurar lazy loading optimizado para móvil
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
                    rootMargin: isMobile ? '25px 0px' : '50px 0px',
                    threshold: 0.01
                }
            );
        }
    }
    
    // Obtener la mejor URL de imagen según el soporte del navegador
    getBestImageUrl(imageConfig) {
        if (!imageConfig) return null;
        
        // Priorizar AVIF si está soportado (y es el único formato disponible)
        if (this.supportedFormats.avif && imageConfig.avif) {
            return imageConfig.avif;
        }
        
        // Luego WebP si está soportado
        if (this.supportedFormats.webp && imageConfig.webp) {
            return imageConfig.webp;
        }
        
        // Fallback a JPG o PNG
        return imageConfig.jpg || imageConfig.png || imageConfig.avif;
    }
    
    // Cargar imagen optimizada para móvil
    async loadImage(element) {
        const imageKey = element.dataset.imageKey;
        const imageConfig = this.getImageConfig(imageKey);
        
        if (!imageConfig) {
            console.warn(`Configuración de imagen no encontrada para: ${imageKey}`);
            return;
        }
        
        const imageUrl = this.getBestImageUrl(imageConfig);
        
        if (!imageUrl) {
            console.warn(`No se encontró URL válida para: ${imageKey}`);
            return;
        }
        
        try {
            element.classList.add('loading');
            
            // Precargar la imagen
            await this.preloadImage(imageUrl);
            
            // Aplicar la imagen
            if (element.tagName === 'IMG') {
                element.src = imageUrl;
                element.alt = element.dataset.alt || '';
            } else {
                element.style.backgroundImage = `url('${imageUrl}')`;
            }
            
            element.classList.remove('loading');
            element.classList.add('loaded');
            
        } catch (error) {
            console.error(`Error cargando imagen ${imageKey}:`, error);
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }
    
    // Precargar imagen
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
    
    // Obtener configuración de imagen por clave
    getImageConfig(key) {
        const parts = key.split('.');
        let config = CONFIG.IMAGE_PATHS;
        
        for (const part of parts) {
            config = config[part];
            if (!config) return null;
        }
        
        return config;
    }
    
    // Precargar imágenes críticas solo en desktop
    async preloadCriticalImages() {
        if (isMobile || performanceMode) return;
        
        const criticalImages = [
            'hero',
            'logo',
            'downloads.apple',
            'downloads.google'
        ];
        
        const preloadPromises = criticalImages.map(async (key) => {
            const config = this.getImageConfig(key);
            if (config) {
                const url = this.getBestImageUrl(config);
                if (url) {
                    try {
                        await this.preloadImage(url);
                    } catch (error) {
                        console.warn(`Error precargando imagen crítica ${key}:`, error);
                    }
                }
            }
        });
        
        await Promise.all(preloadPromises);
    }
    
    // Registrar imagen para lazy loading
    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.lazyImages.add(element);
        
        if (this.intersectionObserver && !performanceMode) {
            this.intersectionObserver.observe(element);
        } else {
            // Cargar inmediatamente en modo de rendimiento
            this.loadImage(element);
        }
    }
    
    // Cargar imagen inmediatamente
    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

// ===== INICIALIZACIÓN GLOBAL OPTIMIZADA =====
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
    const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option');
    
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
    
    // Animación más suave en móvil
    if (!isMobile) {
        document.body.style.opacity = '0.95';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    }
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    
    if (!currentTranslations) {
        console.warn(`Translations for ${currentLanguage} not found`);
        return;
    }
    
    // Optimización: usar requestAnimationFrame para evitar bloqueos
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
    });
}

function updateLanguageButtons() {
    const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option');
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

// ===== SELECTOR DE IDIOMA FLOTANTE (SOLO DESKTOP) =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcherDropdown = document.getElementById('language-switcher-dropdown');
    const languageSwitcher = document.getElementById('language-switcher');
    const languageOptions = languageSwitcher?.querySelectorAll('.language-switcher__option');
    
    if (!languageSwitcherBtn || !languageSwitcherDropdown || !languageSwitcher) return;
    
    // Solo funcionar en desktop
    if (isMobile) return;
    
    // Toggle del dropdown
    languageSwitcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLanguageSwitcher();
    });
    
    // Opciones de idioma
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
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (isLanguageSwitcherOpen && languageSwitcher && !languageSwitcher.contains(e.target)) {
            closeLanguageSwitcher();
        }
    });
    
    // Cerrar con Escape
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
    // Actualizar texto del botón
    const languageSwitcherText = document.getElementById('language-switcher-text');
    
    if (languageSwitcherText) {
        languageSwitcherText.textContent = currentLanguage.toUpperCase();
    }
    
    // Actualizar opciones activas
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
    
    // Mejor manejo táctil en móvil
    if (isMobile) {
        floatingMainBtn.addEventListener('touchstart', () => {
            floatingMainBtn.style.transform = 'scale(0.95)';
        });
        floatingMainBtn.addEventListener('touchend', () => {
            floatingMainBtn.style.transform = '';
        });
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
    
    // Animación optimizada para móvil - MÁS RÁPIDA
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.opacity = '1';
        }, index * (isMobile ? 80 : 120));
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

// ===== NAVEGACIÓN RESPONSIVE ULTRA-OPTIMIZADA - SIN GESTOS DE DESLIZAMIENTO =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');
    
    // Funcionalidad del logo como enlace
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
        
        // Soporte para teclado
        navLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLogo.click();
            }
        });

        // Mejor feedback táctil en móvil
        if (isMobile) {
            navLogo.addEventListener('touchstart', () => {
                navLogo.style.transform = 'scale(0.95)';
            });
            navLogo.addEventListener('touchend', () => {
                navLogo.style.transform = '';
            });
        }
    }
    
    // Toggle del menú móvil optimizado
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Mejor feedback táctil para el botón hamburguesa
        if (isMobile) {
            navToggle.addEventListener('touchstart', () => {
                navToggle.style.transform = 'scale(0.95)';
            });
            navToggle.addEventListener('touchend', () => {
                navToggle.style.transform = '';
            });
        }
    }
    
    // Botón de cerrar móvil - SOLO ESTE MÉTODO DE CIERRE
    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });

        // Mejor feedback táctil para el botón de cerrar
        if (isMobile) {
            navClose.addEventListener('touchstart', () => {
                navClose.style.transform = 'scale(0.95)';
            });
            navClose.addEventListener('touchend', () => {
                navClose.style.transform = '';
            });
        }
    }
    
    // Cerrar menú al hacer click en un enlace
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

        // Mejor feedback táctil para enlaces en móvil
        if (isMobile) {
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(0.98)';
            });
            link.addEventListener('touchend', () => {
                link.style.transform = '';
            });
        }
    });
    
    // Cerrar menú con click fuera - SOLO EN DESKTOP
    if (!isMobile) {
        document.addEventListener('click', (e) => {
            if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    // Navegación por teclado optimizada
    initializeKeyboardNavigation();
    
    // Inicializar la sección activa al cargar la página
    initializeActiveSection();
}

// ===== FUNCIÓN PARA INICIALIZAR LA SECCIÓN ACTIVA AL CARGAR =====
function initializeActiveSection() {
    // Esperar un poco para que la página se cargue completamente
    setTimeout(() => {
        updateActiveNavOnScroll();
    }, 100);
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
    
    // Animaciones ultra optimizadas para móvil - MÁS RÁPIDAS Y FLUIDAS
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    body.classList.add('no-scroll');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    // Animar elementos del menú con mejor rendimiento - MÁS RÁPIDO
    const navLanguageMobile = navMenu.querySelector('.nav__language-mobile');
    const navLinks = navMenu.querySelectorAll('.nav__link');
    const navCtaMobile = navMenu.querySelector('.nav__cta-mobile');
    
    // Animar selector de idioma móvil - MÁS RÁPIDO
    if (navLanguageMobile) {
        navLanguageMobile.style.opacity = '0';
        navLanguageMobile.style.transform = 'translateY(15px)';
        setTimeout(() => {
            navLanguageMobile.style.transition = `all ${isMobile ? '0.3s' : '0.5s'} ease`;
            navLanguageMobile.style.opacity = '1';
            navLanguageMobile.style.transform = 'translateY(0)';
        }, isMobile ? 50 : 100);
    }
    
    // Animar enlaces del menú - MÁS RÁPIDO
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(15px)';
        setTimeout(() => {
            link.style.transition = `all ${isMobile ? '0.3s' : '0.5s'} ease`;
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, (index + 1) * (isMobile ? 60 : 100) + (isMobile ? 100 : 200));
    });
    
    // Animar CTA móvil - MÁS RÁPIDO
    if (navCtaMobile) {
        navCtaMobile.style.opacity = '0';
        navCtaMobile.style.transform = 'translateY(15px)';
        setTimeout(() => {
            navCtaMobile.style.transition = `all ${isMobile ? '0.3s' : '0.5s'} ease`;
            navCtaMobile.style.opacity = '1';
            navCtaMobile.style.transform = 'translateY(0)';
        }, (navLinks.length + 2) * (isMobile ? 60 : 100) + (isMobile ? 100 : 200));
    }
    
    // Focus optimizado para móvil
    if (!isMobile) {
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav__link');
            if (firstLink) {
                firstLink.focus();
            }
        }, 400);
    }
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = false;
    
    // Animaciones de cierre ultra optimizadas - MÁS RÁPIDAS
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('no-scroll');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Resetear estilos de los elementos del menú - MÁS RÁPIDO
    const elementsToReset = navMenu.querySelectorAll('.nav__language-mobile, .nav__link, .nav__cta-mobile');
    elementsToReset.forEach(element => {
        element.style.transition = '';
        element.style.opacity = '';
        element.style.transform = '';
    });
    
    // Devolver focus al botón toggle
    if (!isMobile) {
        navToggle.focus();
    }
}

function smoothScrollToSection(targetSection) {
    const headerHeight = isMobile ? 70 : 80;
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    // Scroll optimizado para móvil
    if ('scrollBehavior' in document.documentElement.style && !performanceMode) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback más rápido para dispositivos de baja potencia
        window.scrollTo(0, targetPosition);
    }
}

function updateActiveNavLink(activeLink) {
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    // Agregar clase active al enlace actual
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

// ===== NAVEGACIÓN POR TECLADO OPTIMIZADA =====
function initializeKeyboardNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    if (!navMenu || !navToggle) return;
    
    // Manejo de teclas especiales
    document.addEventListener('keydown', (e) => {
        // Escape para cerrar menú
        if (e.key === 'Escape' && isMenuOpen) {
            e.preventDefault();
            closeMobileMenu();
            return;
        }
        
        // Tab trap cuando el menú está abierto (solo en desktop)
        if (e.key === 'Tab' && isMenuOpen && !isMobile) {
            handleTabTrap(e);
        }
        
        // Enter o Space en el toggle
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
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        // Tab
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

// ===== EFECTOS DE SCROLL OPTIMIZADOS =====
function initializeScrollEffects() {
    // Scroll listener optimizado con throttling - MÁS RÁPIDO
    window.addEventListener('scroll', throttle(() => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                handleScrollDirection();
                updateHeaderOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, isMobile ? 32 : 16), { passive: true });
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

// ===== FUNCIÓN MEJORADA PARA ACTUALIZAR NAVEGACIÓN ACTIVA =====
function updateActiveNavOnScroll() {
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
        
        // Calcular qué parte de la sección está visible
        const viewportTop = scrollY + headerHeight;
        const viewportBottom = scrollY + windowHeight;
        
        // Determinar el área visible de la sección
        const visibleTop = Math.max(viewportTop, sectionTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        
        // Si esta sección tiene más área visible que la anterior, marcarla como activa
        if (visibleArea > maxVisibleArea && visibleArea > 50) { // Mínimo 50px visibles
            maxVisibleArea = visibleArea;
            activeSection = sectionId;
        }
    });
    
    // Si no hay sección con suficiente área visible, usar la lógica tradicional
    if (!activeSection) {
        const scrollPosition = scrollY + headerHeight + 50; // Offset adicional
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
    }
    
    // Actualizar el enlace activo si hay una sección activa
    if (activeSection) {
        const activeLink = document.querySelector(`.nav__link[href="#${activeSection}"]`);
        const currentActiveLink = document.querySelector('.nav__link.active');
        
        // Solo actualizar si el enlace activo ha cambiado
        if (activeLink && activeLink !== currentActiveLink) {
            updateActiveNavLink(activeLink);
        }
    }
}

// ===== FUNCIÓN PARA ACTUALIZAR EL HEADER EN SCROLL =====
function updateHeaderOnScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const scrollY = window.scrollY;
    const threshold = isMobile ? 50 : 100;
    
    if (scrollY > threshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
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
    
    video.addEventListener('loadedmetadata', () => {
        if (durationDisplay) {
            durationDisplay.textContent = formatTime(video.duration);
        }
    });
    
    playOverlay.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playOverlay.classList.add('hidden');
            if (progressIndicators) {
                progressIndicators.classList.add('visible');
            }
        }
    });
    
    // Mejor manejo táctil en móvil
    if (isMobile) {
        playOverlay.addEventListener('touchstart', () => {
            playOverlay.style.transform = 'scale(0.98)';
        });
        playOverlay.addEventListener('touchend', () => {
            playOverlay.style.transform = '';
        });
    }
    
    video.addEventListener('click', () => {
        if (!video.paused) {
            video.pause();
            playOverlay.classList.remove('hidden');
            if (progressIndicators) {
                progressIndicators.classList.remove('visible');
            }
        }
    });
    
    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            if (currentTimeDisplay) {
                currentTimeDisplay.textContent = formatTime(video.currentTime);
            }
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
    
    video.addEventListener('error', () => {
        showVideoError();
    });
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
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
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

            // Mejor feedback táctil en móvil
            if (isMobile) {
                question.addEventListener('touchstart', () => {
                    question.style.transform = 'scale(0.98)';
                });
                question.addEventListener('touchend', () => {
                    question.style.transform = '';
                });
            }
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
        }, isMobile ? 600 : 400));
    }
}

// ===== INTERSECTION OBSERVER OPTIMIZADO =====
function initializeIntersectionObserver() {
    if (performanceMode) return; // Deshabilitar en modo de rendimiento
    
    const observerOptions = {
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? '0px 0px -25px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('feature')) {
                    animateFeature(entry.target);
                }
            }
        });
    }, observerOptions);
    
    const elementsToObserve = document.querySelectorAll('.feature, .faq__item, .contact__channel');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

function animateFeature(feature) {
    if (performanceMode) return;
    
    const phone = feature.querySelector('.feature__phone');
    const content = feature.querySelector('.feature__content');
    
    // ELIMINAR ANIMACIONES DE HOVER EN MÓVIL
    if (phone && !isMobile) {
        setTimeout(() => {
            phone.style.transform = 'perspective(1000px) rotateY(1deg) rotateX(0deg) scale(1.02)';
        }, 600);
        setTimeout(() => {
            phone.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-1deg) scale(1)';
        }, 1200);
    }
    
    if (content) {
        const listItems = content.querySelectorAll('.feature__list-item');
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 400 + (index * (isMobile ? 80 : 150)));
        });
    }
}

// ===== CONFIGURACIÓN DE LAZY LOADING OPTIMIZADA =====
function setupImageLazyLoading() {
    const waitForOptimizer = () => {
        if (!imageOptimizer) {
            setTimeout(waitForOptimizer, 100);
            return;
        }
        
        // Logo del navbar (crítico - cargar inmediatamente)
        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) {
            imageOptimizer.loadImageImmediately(navLogo, 'logo');
        }
        
        // Imagen del hero (crítica - cargar inmediatamente)
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroImage) {
            imageOptimizer.loadImageImmediately(heroImage, 'hero');
        }
        
        // Imágenes de características (lazy loading)
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
                if (isMobile || performanceMode) {
                    // Cargar inmediatamente en móvil para evitar problemas
                    imageOptimizer.loadImageImmediately(img, imageKeys[index]);
                } else {
                    imageOptimizer.observeImage(img, imageKeys[index]);
                }
            }
        });
        
        // Botones de descarga - CORREGIDOS PARA MISMO TAMAÑO
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
}

// ===== CORRECCIÓN DEL VIDEO HERO PARA MÓVIL - SIN IMAGEN HERO.JPG =====
function initializeHeroVideoFallback() {
    const heroVideo = document.getElementById('hero-video');
    const heroFallbackImage = document.querySelector('.hero__phone-app-image');
    const heroMobileVideo = document.getElementById('hero-mobile-video');
    
    // Configurar video móvil - MÁS COMPACTO
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
            // Ocultar el contenedor del video si hay error
            const mobileVideoContainer = document.querySelector('.hero__mobile-video');
            if (mobileVideoContainer) {
                mobileVideoContainer.style.display = 'none';
            }
        });
    }
    
    if (!heroVideo || !heroFallbackImage) return;
    
    // En móvil, usar siempre imagen estática para el video del teléfono
    if (isMobile) {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
        console.log('Video del teléfono deshabilitado en móvil, usando imagen estática');
        return;
    }
    
    // En desktop, intentar cargar video del teléfono
    heroVideo.muted = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'auto';
    
    heroVideo.addEventListener('loadeddata', () => {
        heroVideo.classList.remove('loading');
        heroVideo.classList.add('loaded');
        console.log('Video del hero cargado correctamente');
    });
    
    heroVideo.addEventListener('error', (e) => {
        console.error('Error cargando video del hero:', e);
        showVideoFallback();
    });
    
    heroVideo.addEventListener('stalled', () => {
        console.warn('Video del hero interrumpido, mostrando fallback');
        showVideoFallback();
    });
    
    function showVideoFallback() {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
        console.log('Mostrando imagen de fallback para el video del hero');
    }
    
    // Timeout para fallback si el video no carga en 3 segundos
    setTimeout(() => {
        if (heroVideo.readyState < 2) {
            showVideoFallback();
        }
    }, 3000);
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
    // Precargar recursos críticos solo en desktop
    if (!isMobile && !performanceMode) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                preloadCriticalResources();
            });
        } else {
            setTimeout(preloadCriticalResources, 3000);
        }
    }
    
    // Optimizar will-change para móvil
    if (isMobile) {
        const elementsToOptimize = document.querySelectorAll('.hero__phone, .feature__phone, .nav__logo, .floating-widget__main-btn');
        elementsToOptimize.forEach(element => {
            element.style.willChange = 'transform';
        });
    }
    
    // Limpiar listeners en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, isMobile ? 600 : 300);
    });
}

function preloadCriticalResources() {
    const criticalResources = [
        './assets/phones/Hero.avif',
        './assets/phones/Horario.avif',
        './assets/logo.avif',
        './assets/AppleStore.avif',
        './assets/GooglePlay.avif'
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
    
    // Actualizar estado móvil
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        detectDeviceCapabilities();
        
        // Reinicializar la detección de sección activa después del resize
        setTimeout(() => {
            updateActiveNavOnScroll();
        }, 100);
    }
    
    // Cerrar menús abiertos
    if (isMenuOpen && !isMobile) {
        closeMobileMenu();
    }
    
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    }
    
    if (isLanguageSwitcherOpen) {
        closeLanguageSwitcher();
    }
}

// ===== ACCESIBILIDAD OPTIMIZADA =====
function initializeAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            if (isFloatingMenuOpen) {
                closeFloatingMenu();
            }
            if (isLanguageSwitcherOpen) {
                closeLanguageSwitcher();
            }
        }
    });
    
    // Indicadores visuales de focus mejorados para móvil
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Mejorar accesibilidad táctil
    if (isMobile) {
        document.addEventListener('touchstart', () => {
            document.body.classList.add('touch-navigation');
        });
    }
}

// ===== INICIALIZACIÓN PRINCIPAL OPTIMIZADA =====
document.addEventListener('DOMContentLoaded', () => {
    // Detectar capacidades del dispositivo primero
    detectDeviceCapabilities();
    
    // Inicializar optimizador de imágenes
    imageOptimizer = new MobileImageOptimizer();
    
    // Inicializar sistema de idiomas
    initializeLanguageSystem();
    
    // Inicializar selector de idioma flotante (solo desktop)
    initializeLanguageSwitcher();
    
    // Inicializar funcionalidades principales
    initializeNavigation();
    initializeScrollEffects();
    initializeVideoPlayer();
    initializeFAQ();
    
    // Inicializar video del hero con fallback
    initializeHeroVideoFallback();
    
    // Inicializar funcionalidades adicionales
    initializeAccessibility();
    initializeFloatingWidget();
    
    // Configurar lazy loading para imágenes
    setupImageLazyLoading();
    
    // Inicializar intersection observer solo si no es modo de rendimiento
    if (!performanceMode) {
        initializeIntersectionObserver();
    }
    
    // Optimizaciones adicionales
    initializePerformanceOptimizations();
    
    console.log(`StarFlex inicializado - Móvil: ${isMobile}, Modo rendimiento: ${performanceMode}`);
});

// ===== MANEJO DE ERRORES OPTIMIZADO =====
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
    
    // En móvil, intentar recuperación automática
    if (isMobile && e.error && e.error.message.includes('video')) {
        console.log('Error de video detectado, forzando fallback de imagen');
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

// ===== LIMPIEZA AL SALIR =====
window.addEventListener('beforeunload', () => {
    // Limpiar recursos si es necesario
    if (imageOptimizer && imageOptimizer.intersectionObserver) {
        imageOptimizer.intersectionObserver.disconnect();
    }
});

// ===== SOPORTE PARA PWA OPTIMIZADO =====
if ('serviceWorker' in navigator && !isMobile) {
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

// ===== FUNCIONES ADICIONALES PARA NAVEGACIÓN MEJORADA =====

// Función para manejar clics en enlaces del navbar (tanto desktop como móvil)
function handleNavLinkClick(link, targetId) {
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        // Cerrar menú móvil si está abierto
        if (isMenuOpen) {
            closeMobileMenu();
        }
        
        // Hacer scroll suave a la sección
        smoothScrollToSection(targetSection);
        
        // Actualizar enlace activo inmediatamente
        updateActiveNavLink(link);
        
        // Actualizar URL sin recargar la página
        if (history.pushState) {
            history.pushState(null, null, targetId);
        }
    }
}

// Función para manejar el botón "atrás" del navegador
window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        const targetLink = document.querySelector(`.nav__link[href="${hash}"]`);
        
        if (targetSection && targetLink) {
            smoothScrollToSection(targetSection);
            updateActiveNavLink(targetLink);
        }
    } else {
        // Si no hay hash, ir al inicio
        const homeSection = document.querySelector('#home');
        const homeLink = document.querySelector('.nav__link[href="#home"]');
        
        if (homeSection && homeLink) {
            smoothScrollToSection(homeSection);
            updateActiveNavLink(homeLink);
        }
    }
});

// Función para inicializar la navegación basada en la URL actual
function initializeNavigationFromURL() {
    const hash = window.location.hash;
    
    if (hash) {
        const targetSection = document.querySelector(hash);
        const targetLink = document.querySelector(`.nav__link[href="${hash}"]`);
        
        if (targetSection && targetLink) {
            // Esperar un poco para que la página se cargue
            setTimeout(() => {
                smoothScrollToSection(targetSection);
                updateActiveNavLink(targetLink);
            }, 500);
        }
    } else {
        // Si no hay hash, marcar "Inicio" como activo por defecto
        const homeLink = document.querySelector('.nav__link[href="#home"]');
        if (homeLink) {
            updateActiveNavLink(homeLink);
        }
    }
}

// Función mejorada para detectar intersección de secciones
function createAdvancedSectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        root: null,
        rootMargin: `-${isMobile ? 80 : 100}px 0px -50% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                // Marcar esta sección como visible
                entry.target.setAttribute('data-visible', 'true');
                
                // Si esta sección tiene más del 25% visible, activar su enlace
                if (entry.intersectionRatio > 0.25 && navLink) {
                    const currentActive = document.querySelector('.nav__link.active');
                    if (currentActive !== navLink) {
                        updateActiveNavLink(navLink);
                    }
                }
            } else {
                // Marcar esta sección como no visible
                entry.target.setAttribute('data-visible', 'false');
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    return sectionObserver;
}

// Función para debug (solo en desarrollo)
function debugActiveSection() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('=== DEBUG: Secciones y navegación ===');
        
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;
        const headerHeight = isMobile ? 80 : 100;
        
        console.log(`Scroll Y: ${scrollY}, Header Height: ${headerHeight}`);
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const isVisible = section.getAttribute('data-visible') === 'true';
            
            console.log(`Sección: ${sectionId}`);
            console.log(`  Top: ${sectionTop}, Height: ${sectionHeight}`);
            console.log(`  Visible: ${isVisible}`);
            console.log(`  ---`);
        });
        
        const activeLink = document.querySelector('.nav__link.active');
        if (activeLink) {
            console.log(`Enlace activo: ${activeLink.getAttribute('href')}`);
        }
        
        console.log('=====================================');
    }
}

// Agregar función de debug al scroll (solo en desarrollo)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let debugTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(debugTimeout);
        debugTimeout = setTimeout(debugActiveSection, 1000);
    });
}

// ===== CORRECCIÓN PARA EL DRAWER MÓVIL Y OVERLAY =====

// Función para abrir el menú móvil con overlay
function openMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = true;
    
    // Animaciones ultra optimizadas para móvil
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    body.classList.add('no-scroll'); // Prevenir scroll
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    // Animar elementos del menú con mejor rendimiento
    const navLanguageMobile = navMenu.querySelector('.nav__language-mobile');
    const navLinks = navMenu.querySelectorAll('.nav__link');
    const navCtaMobile = navMenu.querySelector('.nav__cta-mobile');
    
    // Animar selector de idioma móvil
    if (navLanguageMobile) {
        navLanguageMobile.style.opacity = '0';
        navLanguageMobile.style.transform = 'translateY(15px)';
        setTimeout(() => {
            navLanguageMobile.style.transition = `all ${isMobile ? '0.3s' : '0.5s'} ease`;
            navLanguageMobile.style.opacity = '1';
            navLanguageMobile.style.transform = 'translateY(0)';
        }, isMobile ? 50 : 100);
    }
    
    // Animar enlaces del menú
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(15px)';
        setTimeout(() => {
            link.style.transition = `all ${isMobile ? '0.3s' : '0.5s'} ease`;
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, (index + 1) * (isMobile ? 60 : 100) + (isMobile ? 100 : 200));
    });
    
    // Animar CTA móvil
    if (navCtaMobile) {
        navCtaMobile.style.opacity = '0';
        navCtaMobile.style.transform = 'translateY(15px)';
        setTimeout(() => {
            navCtaMobile.style.transition = `all ${isMobile ? '0.3s' : '0.5s'} ease`;
            navCtaMobile.style.opacity = '1';
            navCtaMobile.style.transform = 'translateY(0)';
        }, (navLinks.length + 2) * (isMobile ? 60 : 100) + (isMobile ? 100 : 200));
    }
    
    // Focus optimizado para móvil
    if (!isMobile) {
        setTimeout(() => {
            const firstLink = navMenu.querySelector('.nav__link');
            if (firstLink) {
                firstLink.focus();
            }
        }, 400);
    }
}

// Función para cerrar el menú móvil
function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = false;
    
    // Animaciones de cierre ultra optimizadas
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('no-scroll'); // Permitir scroll nuevamente
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Resetear estilos de los elementos del menú
    const elementsToReset = navMenu.querySelectorAll('.nav__language-mobile, .nav__link, .nav__cta-mobile');
    elementsToReset.forEach(element => {
        element.style.transition = '';
        element.style.opacity = '';
        element.style.transform = '';
    });
    
    // Devolver focus al botón toggle
    if (!isMobile) {
        navToggle.focus();
    }
}

// Inicializar navegación avanzada cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegación basada en URL
    setTimeout(() => {
        initializeNavigationFromURL();
    }, 200);
    
    // Crear observador avanzado de secciones (opcional, como alternativa)
    if (!performanceMode) {
        setTimeout(() => {
            createAdvancedSectionObserver();
        }, 1000);
    }
    
    console.log('Sistema de navegación activa mejorado inicializado');
});

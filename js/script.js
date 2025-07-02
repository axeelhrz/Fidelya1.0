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

// Variables globales para el drawer mejorado
let currentScrollPosition = 0;
let currentActiveSection = '';

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
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcherText = document.getElementById('language-switcher-text');
    
    if (languageSwitcherBtn && languageSwitcherText) {
        const languageNames = {
            'es': 'Español',
            'en': 'English'
        };
        languageSwitcherText.textContent = languageNames[currentLanguage] || 'Español';
    }
    
    // Actualizar opciones activas
    const languageOptions = document.querySelectorAll('.language-switcher__option');
    languageOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// ===== FUNCIÓN PARA DETECTAR LA SECCIÓN ACTUAL =====
function detectCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const offset = windowHeight * 0.3; // 30% del viewport para activar la sección
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Verificar si la sección está visible en el viewport
        if (scrollY >= (sectionTop - offset) && scrollY < (sectionTop + sectionHeight - offset)) {
            currentSection = sectionId;
        }
    });
    
    // Si estamos en la parte superior de la página, activar "home"
    if (scrollY < 100) {
        currentSection = 'home';
    }
    
    return currentSection;
}

// ===== FUNCIÓN PARA ACTUALIZAR EL ENLACE ACTIVO EN EL DRAWER =====
function updateActiveNavLink(activeSection = null) {
    const navLinks = document.querySelectorAll('.nav__link');
    const section = activeSection || detectCurrentSection();
    
    // Remover clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    // Agregar clase active al enlace correspondiente
    if (section) {
        const activeLink = document.querySelector(`.nav__link[href="#${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
            currentActiveSection = section;
        }
    }
}

// ===== FUNCIÓN MEJORADA PARA ABRIR EL MENÚ MÓVIL =====
function openMobileMenuImproved() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // PRESERVAR LA POSICIÓN DE SCROLL ACTUAL
    currentScrollPosition = window.scrollY;
    
    // Detectar y actualizar la sección activa antes de abrir el menú
    updateActiveNavLink();
    
    isMenuOpen = true;
    
    // Aplicar estilos para prevenir scroll pero mantener posición
    body.style.position = 'fixed';
    body.style.top = `-${currentScrollPosition}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    
    // Activar el menú con animaciones mejoradas
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    
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
        navLanguageMobile.style.transform = 'translateY(20px)';
        setTimeout(() => {
            navLanguageMobile.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            navLanguageMobile.style.opacity = '1';
            navLanguageMobile.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animar enlaces del menú con delays progresivos
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
            link.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 150 + (index * 80));
    });
    
    // Animar CTA móvil
    if (navCtaMobile) {
        navCtaMobile.style.opacity = '0';
        navCtaMobile.style.transform = 'translateY(20px)';
        setTimeout(() => {
            navCtaMobile.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            navCtaMobile.style.opacity = '1';
            navCtaMobile.style.transform = 'translateY(0)';
        }, 150 + (navLinks.length * 80) + 100);
    }
    
    console.log(`Drawer abierto - Sección actual: ${currentActiveSection}, Scroll preservado: ${currentScrollPosition}px`);
}

// ===== FUNCIÓN MEJORADA PARA CERRAR EL MENÚ MÓVIL =====
function closeMobileMenuImproved() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = false;
    
    // Animaciones de cierre
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    
    // RESTAURAR LA POSICIÓN DE SCROLL EXACTA
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = '';
    
    // Restaurar scroll a la posición exacta donde estaba
    window.scrollTo(0, currentScrollPosition);
    
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
    
    // Actualizar la sección activa después de cerrar
    setTimeout(() => {
        updateActiveNavLink();
    }, 100);
    
    console.log(`Drawer cerrado - Scroll restaurado a: ${currentScrollPosition}px`);
}

// ===== FUNCIÓN PARA MANEJAR CLICS EN ENLACES DE NAVEGACIÓN =====
function handleNavLinkClick(event, targetSection) {
    event.preventDefault();
    
    // Cerrar el menú primero
    closeMobileMenuImproved();
    
    // Esperar a que se cierre el menú y luego hacer scroll
    setTimeout(() => {
        const targetElement = document.querySelector(targetSection);
        if (targetElement) {
            const headerHeight = window.innerWidth <= 1023 ? 70 : 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            // Scroll suave a la sección
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Actualizar enlace activo
            setTimeout(() => {
                updateActiveNavLink(targetSection.replace('#', ''));
            }, 500);
        }
    }, 300);
}

// ===== LISTENER PARA DETECTAR CAMBIOS DE SECCIÓN DURANTE EL SCROLL =====
function initScrollSectionDetection() {
    let ticking = false;
    
    function updateOnScroll() {
        if (!isMenuOpen) { // Solo actualizar si el menú no está abierto
            updateActiveNavLink();
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });
}

// ===== FUNCIÓN PARA MEJORAR EL OVERLAY DEL DRAWER =====
function enhanceDrawerOverlay() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    // Crear overlay mejorado si no existe
    let overlay = navMenu.querySelector('.nav__menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav__menu-overlay';
        navMenu.appendChild(overlay);
    }
    
    // Agregar estilos CSS dinámicamente para el overlay mejorado
    const style = document.createElement('style');
    style.textContent = `
        @media screen and (max-width: 1023px) {
            .nav__menu-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, 
                    rgba(255, 45, 85, 0.05) 0%,
                    rgba(255, 45, 85, 0.02) 25%,
                    rgba(139, 92, 246, 0.03) 50%,
                    rgba(255, 45, 85, 0.02) 75%,
                    rgba(255, 45, 85, 0.05) 100%
                );
                opacity: 0;
                transition: opacity 0.6s ease;
                pointer-events: none;
                z-index: -1;
            }
            
            .nav__menu.active .nav__menu-overlay {
                opacity: 1;
                animation: overlay-pulse 8s ease-in-out infinite;
            }
            
            @keyframes overlay-pulse {
                0%, 100% { 
                    opacity: 0.8;
                    transform: scale(1);
                }
                50% { 
                    opacity: 1;
                    transform: scale(1.02);
                }
            }
            
            /* Mejorar el fondo del drawer */
            .nav__menu {
                background: linear-gradient(135deg, 
                    rgba(10, 13, 20, 0.98) 0%, 
                    rgba(21, 25, 34, 0.96) 30%,
                    rgba(30, 35, 48, 0.94) 70%,
                    rgba(21, 25, 34, 0.96) 100%
                ) !important;
                backdrop-filter: blur(30px) !important;
                -webkit-backdrop-filter: blur(30px) !important;
            }
            
            /* Mejorar el overlay de fondo */
            .nav__menu::before {
                background: rgba(0, 0, 0, 0.8) !important;
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
            }
            
            /* Resaltar enlace activo */
            .nav__link.active {
                background: linear-gradient(90deg, 
                    rgba(255, 45, 85, 0.15) 0%, 
                    rgba(255, 45, 85, 0.08) 100%
                ) !important;
                border-left-color: var(--starflex-red) !important;
                color: rgba(255, 255, 255, 1) !important;
                font-weight: 600 !important;
            }
            
            .nav__link.active::before {
                opacity: 1 !important;
                transform: translateX(0) !important;
            }
        }
    `;
    
    if (!document.querySelector('#drawer-overlay-styles')) {
        style.id = 'drawer-overlay-styles';
        document.head.appendChild(style);
    }
}

// ===== INICIALIZACIÓN DE LAS MEJORAS DEL DRAWER =====
function initDrawerImprovements() {
    // Detectar si estamos en móvil
    const isMobile = window.innerWidth <= 1023;
    if (!isMobile) return;
    
    // Mejorar el overlay
    enhanceDrawerOverlay();
    
    // Inicializar detección de secciones
    initScrollSectionDetection();
    
    // Actualizar sección activa inicial
    updateActiveNavLink();
    
    // Reemplazar funciones del menú móvil
    window.openMobileMenu = openMobileMenuImproved;
    window.closeMobileMenu = closeMobileMenuImproved;
    
    // Agregar listeners mejorados a los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', (e) => handleNavLinkClick(e, href));
        }
    });
    
    // Listener para cerrar el menú al hacer clic en el overlay
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            // Solo cerrar si se hace clic en el overlay, no en el contenido
            if (e.target === navMenu || e.target.classList.contains('nav__menu-overlay')) {
                closeMobileMenuImproved();
            }
        });
    }
    
    console.log('Mejoras del drawer móvil inicializadas correctamente');
}

// ===== FUNCIÓN PARA MANEJAR CAMBIOS DE TAMAÑO DE VENTANA =====
function handleDrawerResize() {
    const isMobile = window.innerWidth <= 1023;
    
    if (!isMobile && isMenuOpen) {
        // Si cambiamos a desktop y el menú está abierto, cerrarlo
        closeMobileMenuImproved();
    } else if (isMobile) {
        // Si estamos en móvil, asegurar que las mejoras estén activas
        initDrawerImprovements();
    }
}

// ===== NAVEGACIÓN RESPONSIVE OPTIMIZADA =====
function initializeResponsiveNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // Toggle del menú móvil
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Botón de cerrar
    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }
    
    // Enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Cerrar menú móvil si está abierto
                if (isMenuOpen) {
                    closeMobileMenu();
                }
                
                // Scroll suave a la sección
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = isMobile ? 70 : 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Prevenir scroll del body cuando el menú está abierto
    navMenu.addEventListener('touchmove', (e) => {
        if (isMenuOpen) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ===== FUNCIONES ORIGINALES DEL MENÚ MÓVIL =====
function openMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = true;
    
    // Activar clases
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    body.classList.add('no-scroll');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    // Animaciones de entrada
    const navLanguageMobile = navMenu.querySelector('.nav__language-mobile');
    const navLinks = navMenu.querySelectorAll('.nav__link');
    const navCtaMobile = navMenu.querySelector('.nav__cta-mobile');
    
    // Animar selector de idioma móvil
    if (navLanguageMobile) {
        navLanguageMobile.style.opacity = '0';
        navLanguageMobile.style.transform = 'translateY(20px)';
        setTimeout(() => {
            navLanguageMobile.style.transition = `all ${isMobile ? '0.3s' : '0.4s'} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            navLanguageMobile.style.opacity = '1';
            navLanguageMobile.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animar enlaces del menú
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        setTimeout(() => {
            link.style.transition = `all ${isMobile ? '0.3s' : '0.4s'} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 150 + (index * (isMobile ? 60 : 80)));
    });
    
    // Animar CTA móvil
    if (navCtaMobile) {
        navCtaMobile.style.opacity = '0';
        navCtaMobile.style.transform = 'translateY(20px)';
        setTimeout(() => {
            navCtaMobile.style.transition = `all ${isMobile ? '0.3s' : '0.4s'} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            navCtaMobile.style.opacity = '1';
            navCtaMobile.style.transform = 'translateY(0)';
        }, 150 + (navLinks.length * (isMobile ? 60 : 80)) + 100);
    }
    
    // Focus en el primer enlace (solo en desktop)
    if (!isMobile && navLinks.length > 0) {
        setTimeout(() => {
            navLinks[0].focus();
        }, 300);
    }
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    isMenuOpen = false;
    
    // Remover clases
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('no-scroll');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Resetear estilos de animación
    const elementsToReset = navMenu.querySelectorAll('.nav__language-mobile, .nav__link, .nav__cta-mobile');
    elementsToReset.forEach(element => {
        element.style.transition = '';
        element.style.opacity = '';
        element.style.transform = '';
    });
    
    // Devolver focus al botón toggle (solo en desktop)
    if (!isMobile) {
        navToggle.focus();
    }
}

// ===== SCROLL EFFECTS OPTIMIZADOS =====
function initializeScrollEffects() {
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    let ticking = false;
    
    const navbar = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav__link');
    
    function updateScrollEffects() {
        const currentScrollY = window.scrollY;
        isScrollingDown = currentScrollY > lastScrollY;
        
        // Navbar hide/show en móvil
        if (isMobile && navbar) {
            if (isScrollingDown && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        // Actualizar enlace activo
        updateActiveNavLink();
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    const throttledScrollHandler = throttle(updateScrollEffects, isMobile ? 10 : 16);
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(throttledScrollHandler);
            ticking = true;
        }
    }, { passive: true });
}

// ===== LOGO FUNCTIONALITY =====
function initializeLogo() {
    const logo = document.querySelector('.nav__logo');
    if (!logo) return;
    
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Cerrar menú móvil si está abierto
        if (isMenuOpen) {
            closeMobileMenu();
        }
        
        // Scroll suave al inicio
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Actualizar enlace activo
        setTimeout(() => {
            updateActiveNavLink('home');
        }, 500);
    });
}

// ===== FLOATING WIDGET OPTIMIZADO =====
function initializeFloatingWidget() {
    const floatingWidget = document.getElementById('floating-widget');
    const floatingToggle = document.getElementById('floating-toggle');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingWidget || !floatingToggle || !floatingMenu) return;
    
    // Solo mostrar en desktop
    if (isMobile) {
        floatingWidget.style.display = 'none';
        return;
    }
    
    // Toggle del menú flotante
    floatingToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isFloatingMenuOpen) {
            closeFloatingMenu();
        } else {
            openFloatingMenu();
        }
    });
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (isFloatingMenuOpen && !floatingWidget.contains(e.target)) {
            closeFloatingMenu();
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFloatingMenuOpen) {
            closeFloatingMenu();
        }
    });
    
    function openFloatingMenu() {
        isFloatingMenuOpen = true;
        floatingWidget.classList.add('active');
        floatingToggle.setAttribute('aria-expanded', 'true');
        floatingMenu.setAttribute('aria-hidden', 'false');
    }
    
    function closeFloatingMenu() {
        isFloatingMenuOpen = false;
        floatingWidget.classList.remove('active');
        floatingToggle.setAttribute('aria-expanded', 'false');
        floatingMenu.setAttribute('aria-hidden', 'true');
    }
}

// ===== VIDEO PLAYER OPTIMIZADO =====
function initializeVideoPlayer() {
    const videoContainer = document.querySelector('.videos__player-container');
    const video = document.querySelector('.videos__player-video');
    const playButton = document.querySelector('.videos__player-play');
    const overlay = document.querySelector('.videos__player-overlay');
    const progressBar = document.querySelector('.videos__player-progress-bar');
    const progressFill = document.querySelector('.videos__player-progress-fill');
    const timeDisplay = document.querySelector('.videos__player-time');
    
    if (!video || !playButton || !overlay) return;
    
    let isPlaying = false;
    let isDragging = false;
    
    // Play/Pause functionality
    function togglePlay() {
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
    }
    
    // Event listeners
    playButton.addEventListener('click', togglePlay);
    overlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    
    video.addEventListener('play', () => {
        isPlaying = true;
        videoContainer.classList.add('playing');
        overlay.style.opacity = '0';
        playButton.style.opacity = '0';
    });
    
    video.addEventListener('pause', () => {
        isPlaying = false;
        videoContainer.classList.remove('playing');
        overlay.style.opacity = '1';
        playButton.style.opacity = '1';
    });
    
    video.addEventListener('ended', () => {
        isPlaying = false;
        videoContainer.classList.remove('playing');
        overlay.style.opacity = '1';
        playButton.style.opacity = '1';
        video.currentTime = 0;
    });
    
    // Progress bar functionality
    if (progressBar && progressFill && timeDisplay) {
        video.addEventListener('timeupdate', () => {
            if (!isDragging) {
                const progress = (video.currentTime / video.duration) * 100;
                progressFill.style.width = `${progress}%`;
                
                const currentMinutes = Math.floor(video.currentTime / 60);
                const currentSeconds = Math.floor(video.currentTime % 60);
                const durationMinutes = Math.floor(video.duration / 60);
                const durationSeconds = Math.floor(video.duration % 60);
                
                timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
            }
        });
        
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            video.currentTime = progress * video.duration;
        });
        
        // Touch/drag support for progress bar
        let startX = 0;
        
        progressBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
        });
        
        progressBar.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const rect = progressBar.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                progressFill.style.width = `${progress * 100}%`;
                video.currentTime = progress * video.duration;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const rect = progressBar.getBoundingClientRect();
                const progress = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                progressFill.style.width = `${progress * 100}%`;
                video.currentTime = progress * video.duration;
            }
        }, { passive: true });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (videoContainer.matches(':hover') || document.activeElement === video) {
            switch (e.key) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration, video.currentTime + 10);
                    break;
                case 'm':
                    e.preventDefault();
                    video.muted = !video.muted;
                    break;
            }
        }
    });
    
    // Optimización para móvil
    if (isMobile) {
        // Reducir calidad en móvil si es necesario
        video.addEventListener('loadstart', () => {
            if (performanceMode) {
                video.preload = 'metadata';
            }
        });
        
        // Pausar video cuando no está visible
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && isPlaying) {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(video);
    }
}

// ===== HERO VIDEO OPTIMIZADO =====
function initializeHeroVideo() {
    const heroVideo = document.querySelector('.hero__mobile-video-player');
    const heroFallbackImage = document.querySelector('.hero__phone-app-image');
    
    if (!heroVideo) return;
    
    // Configuración optimizada para móvil
    if (isMobile || performanceMode) {
        heroVideo.preload = 'metadata';
        heroVideo.muted = true;
        heroVideo.playsInline = true;
    }
    
    // Event listeners
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
function optimizePerformance() {
    // Precargar recursos críticos solo en desktop
    if (!isMobile && !performanceMode) {
        const criticalResources = [
            './assets/logo.avif',
            './assets/phones/Hero.avif'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
    
    // Optimizar will-change para móvil
    if (isMobile) {
        const elementsToOptimize = document.querySelectorAll('.nav__menu, .phone, .hero__mobile-video-player');
        elementsToOptimize.forEach(element => {
            element.style.willChange = 'transform';
        });
        
        // Limpiar will-change después de las animaciones
        setTimeout(() => {
            elementsToOptimize.forEach(element => {
                element.style.willChange = 'auto';
            });
        }, 3000);
    }
    
    // Lazy loading para imágenes no críticas
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== FAQ SECTION OPTIMIZADA =====
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq__question');
    const faqSearch = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq__item');
    const faqNoResults = document.querySelector('.faq__no-results');
    
    // Toggle FAQ items
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq__item');
            const isActive = faqItem.classList.contains('active');
            
            // Cerrar todas las preguntas
            faqItems.forEach(item => {
                item.classList.remove('active');
            });
            
            // Abrir la pregunta clickeada si no estaba activa
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Search functionality
    if (faqSearch) {
        const searchHandler = debounce((searchTerm) => {
            const term = searchTerm.toLowerCase().trim();
            let visibleCount = 0;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq__question-text').textContent.toLowerCase();
                const answer = item.querySelector('.faq__answer').textContent.toLowerCase();
                
                if (term === '' || question.includes(term) || answer.includes(term)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }
            });
            
            // Mostrar/ocultar mensaje de "no results"
            if (faqNoResults) {
                faqNoResults.style.display = visibleCount === 0 && term !== '' ? 'block' : 'none';
            }
        }, 300);
        
        faqSearch.addEventListener('input', (e) => {
            searchHandler(e.target.value);
        });
    }
    
    // Keyboard navigation
    faqQuestions.forEach((question, index) => {
        question.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    question.click();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    const nextQuestion = faqQuestions[index + 1];
                    if (nextQuestion) nextQuestion.focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevQuestion = faqQuestions[index - 1];
                    if (prevQuestion) prevQuestion.focus();
                    break;
            }
        });
    });
}

// ===== INTERSECTION OBSERVER PARA ANIMACIONES =====
function initializeIntersectionObserver() {
    if (!('IntersectionObserver' in window) || performanceMode) return;
    
    const observerOptions = {
        threshold: isMobile ? 0.1 : 0.2,
        rootMargin: isMobile ? '50px 0px' : '100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const elementsToAnimate = document.querySelectorAll('.feature, .faq__item, .contact__channel');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ===== INICIALIZACIÓN PRINCIPAL =====
function initializeApp() {
    console.log('Inicializando StarFlex App...');
    
    // Detectar capacidades del dispositivo
    detectDeviceCapabilities();
    
    // Inicializar optimizador de imágenes
    imageOptimizer = new MobileImageOptimizer();
    
    // Inicializar sistemas principales
    initializeLanguageSystem();
    initializeLanguageSwitcher();
    initializeResponsiveNavigation();
    initializeLogo();
    initializeFloatingWidget();
    
    // Inicializar reproductores de video
    initializeVideoPlayer();
    initializeHeroVideo();
    
    // Inicializar secciones
    initializeFAQ();
    
    // Inicializar efectos y animaciones
    initializeScrollEffects();
    initializeIntersectionObserver();
    
    // Optimizaciones de rendimiento
    optimizePerformance();
    
    // Inicializar mejoras del drawer
    initDrawerImprovements();
    
    console.log('StarFlex App inicializada correctamente');
}

// ===== EVENT LISTENERS PRINCIPALES =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    
    // Listener para cambios de tamaño de ventana
    window.addEventListener('resize', debounce(() => {
        const wasMobile = isMobile;
        detectDeviceCapabilities();
        
        if (wasMobile !== isMobile) {
            // Reinicializar componentes que dependen del tamaño de pantalla
            initializeFloatingWidget();
            handleDrawerResize();
        }
    }, 250));
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Error en StarFlex:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada en StarFlex:', e.reason);
});

// ===== CLEANUP AL SALIR =====
window.addEventListener('beforeunload', () => {
    // Limpiar recursos si es necesario
    if (imageOptimizer && imageOptimizer.intersectionObserver) {
        imageOptimizer.intersectionObserver.disconnect();
    }
});

// ===== PWA SUPPORT =====
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

// ===== FUNCIÓN PARA DEBUGGING (OPCIONAL) =====
function debugDrawerState() {
    console.log({
        isMenuOpen,
        currentScrollPosition,
        currentActiveSection,
        windowWidth: window.innerWidth,
        scrollY: window.scrollY,
        detectedSection: detectCurrentSection()
    });
}

// Hacer disponible globalmente para debugging
window.debugDrawerState = debugDrawerState;

console.log('StarFlex Script cargado completamente');


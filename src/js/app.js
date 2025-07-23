// ===== VARIABLES GLOBALES ULTRA-OPTIMIZADAS =====
let isMenuOpen = false;
let isMobileMenuOpen = false; // Variable para el drawer móvil
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
// Variables para el sistema de routing
let currentRoute = '';

// ===== CONFIGURACIÓN GLOBAL ULTRA-OPTIMIZADA =====
const CONFIG = {
    // Configuración de animaciones ultra-optimizada
    ANIMATION_DURATION: isMobile ? 200 : 400,
    SCROLL_THRESHOLD: isMobile ? 30 : 50,
    
    // Configuración de imágenes optimizadas
    IMAGE_FORMATS: {
        WEBP: 'image/webp',
        PNG: 'image/png',
        JPEG: 'image/jpeg'
    },
    
    // Rutas de imágenes optimizadas - CORREGIDAS PARA COINCIDIR CON ARCHIVOS REALES
    IMAGE_PATHS: {
        hero: {
            webp: './assets/phones/Hero.webp'
        },
        logo: {
            webp: './assets/logo.webp'
        },
        phones: {
            schedule: {
                webp: './assets/phones/Schedule.webp'
            },
            stations: {
                webp: './assets/phones/Stations.webp'
            },
            calendar: {
                webp: './assets/phones/Calendar.webp'
            },
            log: {
                webp: './assets/phones/Log.webp'
            },
            notifications: {
                webp: './assets/phones/Notifications.webp'
            },
            referrals: {
                webp: './assets/phones/Referrals.webp'
            }
        },
        downloads: {
            apple: {
                png: './assets/AppleStore.png'
            },
            google: {
                png: './assets/GooglePlay.png'
            }
        },
        videoPoster: {
            webp: './assets/video-poster.webp'
        }
    }
};

// ===== SISTEMA DE TRADUCCIÓN OPTIMIZADO =====
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
        'footer-privacy-link': 'Política de Privacidad',
        'footer-terms-link': 'Términos y Condiciones',
        'footer-copyright': '© StarFlex • Todos los derechos reservados',
        'footer-cta-main': 'COMENZAR AHORA',
        'footer-cta-trial': '3 días gratis',
        // Legal Pages
        'privacy-policy-title': 'POLÍTICA DE PRIVACIDAD DE STARFLEX',
        'terms-conditions-title': 'Términos y Condiciones',
        'back-to-home': 'Volver al Inicio',
        'last-updated': 'Última actualización: 15 de diciembre de 2024',
        // Privacy Policy Content - ACTUALIZADO CON EL CONTENIDO ESPECÍFICO
        'privacy-intro': 'En StarFlex, valoramos su privacidad y nos comprometemos a protegerla en todo momento. Nuestra política de privacidad garantiza la confidencialidad y seguridad de cualquier información que nos proporcione a través de nuestro sitio web y otros servicios que ofrecemos.',
        'privacy-section-1-title': '1. RECOPILACIÓN DE INFORMACIÓN',
        'privacy-section-1-content': 'Recopilamos información personal solo cuando es absolutamente necesaria para brindarle nuestros servicios. Esta recopilación se realiza de manera justa, legal y con su conocimiento y consentimiento. Le informamos claramente sobre el propósito de dicha recopilación y cómo se utilizará.',
        'privacy-section-2-title': '2. USO DE LA INFORMACIÓN',
        'privacy-section-2-content': 'La información personal se utiliza exclusivamente para:',
        'privacy-section-2-item-1': 'Ofrecer y mejorar nuestros servicios',
        'privacy-section-2-item-2': 'Personalizar su experiencia en la plataforma',
        'privacy-section-2-item-3': 'Comunicarnos con usted sobre actualizaciones, notificaciones o soporte',
        'privacy-section-2-item-4': '• Cumplir con los requisitos legales si es aplicable',
        'privacy-section-3-title': '3. RETENCIÓN DE DATOS',
        'privacy-section-3-content': 'Conservamos su información solo durante el tiempo necesario para cumplir los propósitos para los que fue recopilada. Posteriormente, será eliminada de forma segura.',
        'privacy-section-4-title': '4. SEGURIDAD DE LA INFORMACIÓN',
        'privacy-section-4-content': 'Implementamos medidas de seguridad razonables y comercialmente aceptables técnicas y organizacionales para proteger su información personal contra acceso no autorizado, pérdida, mal uso o divulgación.',
        'privacy-section-5-title': '5. DIVULGACIÓN A TERCEROS',
        'privacy-section-5-content': 'No compartimos su información personal con terceros, a menos que:',
        'privacy-section-5-item-1': 'Sea requerido por ley',
        'privacy-section-5-item-2': 'Sea estrictamente necesario para brindarle nuestros servicios (ej. servicios de email, procesamiento de pagos, etc.)',
        'privacy-section-6-title': '6. ENLACES A SITIOS DE TERCEROS',
        'privacy-section-6-content': 'Nuestro sitio puede contener enlaces a sitios web externos. No somos responsables de sus prácticas de privacidad o su contenido. Le recomendamos revisar las políticas de privacidad de esos sitios antes de interactuar con ellos.',
        'privacy-section-7-title': '7. SUS DERECHOS',
        'privacy-section-7-content': 'Usted tiene derecho a:',
        'privacy-section-7-item-1': 'Acceder, corregir o eliminar su información personal',
        'privacy-section-7-item-2': 'Retirar su consentimiento para el uso de sus datos',
        'privacy-section-7-item-3': 'Negarse a proporcionar información personal (aunque esto puede limitar el acceso a ciertas funciones)',
        'privacy-section-8-title': '8. ACEPTACIÓN DE ESTA POLÍTICA',
        'privacy-section-8-content': 'Al continuar usando nuestro sitio web, se considera que acepta nuestra política de privacidad y el manejo de su información de acuerdo con ella.',
        'privacy-section-9-title': '9. CONTACTO',
        'privacy-section-9-content': 'Si tiene alguna pregunta, solicitud o inquietud con respecto a esta política de privacidad, puede contactarnos en: support@starflexapp.com',
        // Terms and Conditions Content
        'terms-section-1-title': '1. Aceptación de los Términos',
        'terms-section-1-content': 'Al acceder y utilizar StarFlex, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.',
        'terms-section-2-title': '2. Descripción del Servicio',
        'terms-section-2-content': 'StarFlex es una aplicación de automatización diseñada para ayudar a los conductores de Amazon Flex a optimizar su experiencia de trabajo mediante la automatización inteligente de la selección de bloques de entrega.',
        'terms-section-3-title': '3. Uso Aceptable',
        'terms-section-3-content': 'Usted se compromete a utilizar StarFlex de manera responsable y de acuerdo con todas las leyes aplicables. No debe usar el servicio para actividades ilegales, dañinas o que violen los términos de servicio de Amazon Flex.',
        'terms-section-4-title': '4. Cuenta de Usuario',
        'terms-section-4-content': 'Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado.',
        'terms-section-5-title': '5. Pagos y Suscripciones',
        'terms-section-5-content': 'Los pagos por suscripciones son procesados de forma segura. Las suscripciones se renuevan automáticamente a menos que se cancelen antes del período de renovación. Ofrecemos un período de prueba gratuito para nuevos usuarios.',
        'terms-section-6-title': '6. Limitación de Responsabilidad',
        'terms-section-6-content': 'StarFlex se proporciona "tal como está" sin garantías de ningún tipo. No seremos responsables por daños indirectos, incidentales, especiales o consecuentes que resulten del uso de nuestro servicio.',
        'terms-section-7-title': '7. Modificaciones',
        'terms-section-7-content': 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestra aplicación.',
        'terms-section-8-title': '8. Contacto',
        'terms-section-8-content': 'Para preguntas sobre estos Términos y Condiciones, puede contactarnos en support@starflexapp.com.'
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
        'footer-privacy-link': 'Privacy Policy',
        'footer-terms-link': 'Terms and Conditions',
        'footer-copyright': '© StarFlex • All rights reserved',
        'footer-cta-main': 'START NOW',
        'footer-cta-trial': '3 days free',
        // Legal Pages
        'privacy-policy-title': 'STARFLEX PRIVACY POLICY',
        'terms-conditions-title': 'Terms and Conditions',
        'back-to-home': 'Back to Home',
        'last-updated': 'Last updated: December 15, 2024',
        // Privacy Policy Content - ENGLISH VERSION
        'privacy-intro': 'At StarFlex, we value your privacy and are committed to protecting it at all times. Our privacy policy ensures the confidentiality and security of any information you provide to us through our website and other services we offer.',
        'privacy-section-1-title': '1. INFORMATION COLLECTION',
        'privacy-section-1-content': 'We collect personal information only when it is absolutely necessary to provide you with our services. This collection is carried out fairly, legally and with your knowledge and consent. We clearly inform you about the purpose of such collection and how it will be used.',
        'privacy-section-2-title': '2. USE OF INFORMATION',
        'privacy-section-2-content': 'Personal information is used exclusively to:',
        'privacy-section-2-item-1': 'Offer and improve our services',
        'privacy-section-2-item-2': 'Personalize your experience on the platform',
        'privacy-section-2-item-3': 'Communicate with you about updates, notifications or support',
        'privacy-section-2-item-4': 'Comply with legal requirements if applicable',
        'privacy-section-3-title': '3. DATA RETENTION',
        'privacy-section-3-content': 'We retain your information only for as long as necessary to fulfill the purposes for which it was collected. Afterwards, it will be securely deleted.',
        'privacy-section-4-title': '4. INFORMATION SECURITY',
        'privacy-section-4-content': 'We implement reasonable and commercially acceptable technical and organizational security measures to protect your personal information against unauthorized access, loss, misuse or disclosure.',
        'privacy-section-5-title': '5. DISCLOSURE TO THIRD PARTIES',
        'privacy-section-5-content': 'We do not share your personal information with third parties, unless:',
        'privacy-section-5-item-1': 'It is required by law',
        'privacy-section-5-item-2': 'It is strictly necessary to provide you with our services (e.g. email services, payment processing, etc.)',
        'privacy-section-6-title': '6. LINKS TO THIRD-PARTY SITES',
        'privacy-section-6-content': 'Our site may contain links to external websites. We are not responsible for their privacy practices or their content. We recommend reviewing the privacy policies of those sites before interacting with them.',
        'privacy-section-7-title': '7. YOUR RIGHTS',
        'privacy-section-7-content': 'You have the right to:',
        'privacy-section-7-item-1': 'Access, correct or delete your personal information',
        'privacy-section-7-item-2': 'Withdraw your consent for the use of your data',
        'privacy-section-7-item-3': 'Refuse to provide personal information (although this may limit access to certain features)',
        'privacy-section-8-title': '8. ACCEPTANCE OF THIS POLICY',
        'privacy-section-8-content': 'By continuing to use our website, you are deemed to accept our privacy policy and the handling of your information in accordance with it.',
        'privacy-section-9-title': '9. CONTACT',
        'privacy-section-9-content': 'If you have any questions, requests or concerns regarding this privacy policy, you can contact us at: support@starflexapp.com',
        // Terms and Conditions Content
        'terms-section-1-title': '1. Acceptance of Terms',
        'terms-section-1-content': 'By accessing and using StarFlex, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our service.',
        'terms-section-2-title': '2. Service Description',
        'terms-section-2-content': 'StarFlex is an automation application designed to help Amazon Flex drivers optimize their work experience through intelligent automation of delivery block selection.',
        'terms-section-3-title': '3. Acceptable Use',
        'terms-section-3-content': 'You agree to use StarFlex responsibly and in accordance with all applicable laws. You must not use the service for illegal, harmful activities or that violate Amazon Flex terms of service.',
        'terms-section-4-title': '4. User Account',
        'terms-section-4-content': 'You are responsible for maintaining the confidentiality of your account and password, and for all activities that occur under your account. You must notify us immediately of any unauthorized use.',
        'terms-section-5-title': '5. Payments and Subscriptions',
        'terms-section-5-content': 'Subscription payments are processed securely. Subscriptions renew automatically unless canceled before the renewal period. We offer a free trial period for new users.',
        'terms-section-6-title': '6. Limitation of Liability',
        'terms-section-6-content': 'StarFlex is provided "as is" without warranties of any kind. We will not be liable for indirect, incidental, special or consequential damages resulting from the use of our service.',
        'terms-section-7-title': '7. Modifications',
        'terms-section-7-content': 'We reserve the right to modify these terms at any time. Changes will take effect immediately after posting in our application.',
        'terms-section-8-title': '8. Contact',
        'terms-section-8-content': 'For questions about these Terms and Conditions, you can contact us at support@starflexapp.com.'
    }
};

// ===== SISTEMA DE ROUTING PARA PÁGINAS LEGALES =====
function initializeRouting() {
    console.log('🔗 Inicializando sistema de routing...');
    
    // Manejar cambios en el hash de la URL
    window.addEventListener('hashchange', handleRouteChange);
    
    // Manejar la ruta inicial
    handleRouteChange();
    
    // Configurar enlaces de páginas legales
    setupLegalLinks();
    
    console.log('✅ Sistema de routing inicializado');
}

function handleRouteChange() {
    const hash = window.location.hash;
    console.log(`🔗 Cambio de ruta detectado: ${hash}`);
    
    // Ocultar todas las páginas
    hideAllPages();
    
    switch (hash) {
        case '#/privacypolicy':
            showPrivacyPolicy();
            break;
        case '#/terms':
            showTermsConditions();
            break;
        default:
            showMainContent();
            break;
    }
}

function hideAllPages() {
    const mainContent = document.getElementById('main-content');
    const privacyPage = document.getElementById('privacy-policy-page');
    const termsPage = document.getElementById('terms-conditions-page');
    
    if (mainContent) mainContent.style.display = 'none';
    if (privacyPage) privacyPage.style.display = 'none';
    if (termsPage) termsPage.style.display = 'none';
}

function showMainContent() {
    console.log('🏠 Mostrando contenido principal');
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    
    // Actualizar título de la página
    document.title = translationData[currentLanguage]['page-title'];
    
    // Cerrar menús si están abiertos
    if (isMobileMenuOpen) {
        closeMobileMenu();
    }
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    }
}

function showPrivacyPolicy() {
    console.log('📋 Mostrando Política de Privacidad');
    const privacyPage = document.getElementById('privacy-policy-page');
    if (privacyPage) {
        privacyPage.style.display = 'block';
        
        // Scroll al inicio de la página
        window.scrollTo(0, 0);
        
        // Actualizar título de la página
        document.title = `${translationData[currentLanguage]['privacy-policy-title']} - StarFlex`;
        
        // Cerrar menús si están abiertos
        if (isMobileMenuOpen) {
            closeMobileMenu();
        }
        if (isFloatingMenuOpen) {
            closeFloatingMenu();
        }
    }
}

function showTermsConditions() {
    console.log('📋 Mostrando Términos y Condiciones');
    const termsPage = document.getElementById('terms-conditions-page');
    if (termsPage) {
        termsPage.style.display = 'block';
        
        // Scroll al inicio de la página
        window.scrollTo(0, 0);
        
        // Actualizar título de la página
        document.title = `${translationData[currentLanguage]['terms-conditions-title']} - StarFlex`;
        
        // Cerrar menús si están abiertos
        if (isMobileMenuOpen) {
            closeMobileMenu();
        }
        if (isFloatingMenuOpen) {
            closeFloatingMenu();
        }
    }
}

function setupLegalLinks() {
    console.log('🔗 Configurando enlaces legales...');
    
    // Enlaces del footer
    const privacyLinks = document.querySelectorAll('a[href="#/privacypolicy"]');
    const termsLinks = document.querySelectorAll('a[href="#/terms"]');
    
    // Botones de regreso
    const privacyBackBtn = document.getElementById('privacy-back-btn');
    const termsBackBtn = document.getElementById('terms-back-btn');
    
    // Configurar eventos para enlaces de privacidad
    privacyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔗 Click en enlace de Política de Privacidad');
            window.location.hash = '#/privacypolicy';
        });
        
        // Efectos táctiles para móvil
        if (isMobile) {
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(0.98)';
            }, { passive: true });
            link.addEventListener('touchend', () => {
                link.style.transform = '';
            }, { passive: true });
        }
    });
    
    // Configurar eventos para enlaces de términos
    termsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔗 Click en enlace de Términos y Condiciones');
            window.location.hash = '#/terms';
        });
        
        // Efectos táctiles para móvil
        if (isMobile) {
            link.addEventListener('touchstart', () => {
                link.style.transform = 'scale(0.98)';
            }, { passive: true });
            link.addEventListener('touchend', () => {
                link.style.transform = '';
            }, { passive: true });
        }
    });
    
    // Configurar botones de regreso
    if (privacyBackBtn) {
        privacyBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🏠 Regresando al inicio desde Política de Privacidad');
            window.location.hash = '';
        });
        
        if (isMobile) {
            privacyBackBtn.addEventListener('touchstart', () => {
                privacyBackBtn.style.transform = 'scale(0.98)';
            }, { passive: true });
            privacyBackBtn.addEventListener('touchend', () => {
                privacyBackBtn.style.transform = '';
            }, { passive: true });
        }
    }
    
    if (termsBackBtn) {
        termsBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🏠 Regresando al inicio desde Términos y Condiciones');
            window.location.hash = '';
        });
        
        if (isMobile) {
            termsBackBtn.addEventListener('touchstart', () => {
                termsBackBtn.style.transform = 'scale(0.98)';
            }, { passive: true });
            termsBackBtn.addEventListener('touchend', () => {
                termsBackBtn.style.transform = '';
            }, { passive: true });
        }
    }
    
    console.log(`✅ Enlaces legales configurados: ${privacyLinks.length} enlaces de privacidad, ${termsLinks.length} enlaces de términos`);
}

// ===== RESTO DEL CÓDIGO EXISTENTE (sin cambios) =====
// ... (todo el código existente permanece igual)

// ===== DETECCIÓN DE DISPOSITIVO Y CAPACIDADES ULTRA-OPTIMIZADA =====
function detectDeviceCapabilities() {
    isMobile = window.innerWidth <= 1023;
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detectar dispositivos de baja potencia más agresivamente
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
        // Deshabilitar animaciones CSS
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
        console.log('Modo de rendimiento activado para dispositivo de baja potencia');
    }
}

// ===== DETECCIÓN DE SOPORTE DE FORMATOS DE IMAGEN OPTIMIZADA =====
function detectImageFormats() {
    return new Promise((resolve) => {
        const formats = {
            webp: false
        };
        
        // Test WebP
        const webpImg = new Image();
        webpImg.onload = webpImg.onerror = function() {
            formats.webp = webpImg.height === 2;
            if (formats.webp) {
                document.documentElement.classList.add('webp');
            }
            resolve(formats);
        };
        webpImg.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// ===== CLASE ULTRA-OPTIMIZADA PARA IMÁGENES =====
class UltraOptimizedImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.lazyImages = new Set();
        this.intersectionObserver = null;
        this.supportedFormats = { webp: false };
        this.init();
    }
    
    async init() {
        this.supportedFormats = await detectImageFormats();
        this.setupLazyLoading();
        this.preloadCriticalImages();
        this.forceLoadFeatureImages(); // Nueva función para forzar carga de imágenes de características
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
        
        // Priorizar WebP si está soportado
        if (this.supportedFormats.webp && imageConfig.webp) {
            return imageConfig.webp;
        }
        
        // Fallback a PNG o JPG
        return imageConfig.png || imageConfig.jpg || imageConfig.jpeg || imageConfig.webp;
    }
    
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
        if (performanceMode) return;
        
        const criticalImages = [
            'logo'
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
    
    // Nueva función para forzar la carga de imágenes de características
    forceLoadFeatureImages() {
        console.log('🖼️ Forzando carga de imágenes de características...');
        
        // Mapeo de data-feature a imagen
        const featureImageMap = {
            'schedule': 'phones.schedule',
            'stations': 'phones.stations',
            'calendar': 'phones.calendar',
            'log': 'phones.log',
            'notifications': 'phones.notifications',
            'referrals': 'phones.referrals'
        };
        
        // Buscar todas las características y cargar sus imágenes inmediatamente
        const features = document.querySelectorAll('.feature[data-feature]');
        features.forEach((feature, index) => {
            const featureType = feature.getAttribute('data-feature');
            const phoneImage = feature.querySelector('.phone__app-image');
            
            if (phoneImage && featureImageMap[featureType]) {
                const imageKey = featureImageMap[featureType];
                console.log(`📱 Cargando imagen para característica ${featureType}: ${imageKey}`);
                
                // Cargar imagen inmediatamente
                this.loadImageImmediately(phoneImage, imageKey);
                
                // También establecer la imagen de fondo directamente como fallback
                const imageConfig = this.getImageConfig(imageKey);
                if (imageConfig) {
                    const imageUrl = this.getBestImageUrl(imageConfig);
                    if (imageUrl) {
                        phoneImage.style.backgroundImage = `url('${imageUrl}')`;
                        phoneImage.style.backgroundSize = 'cover';
                        phoneImage.style.backgroundPosition = 'center';
                        phoneImage.style.backgroundRepeat = 'no-repeat';
                        console.log(`✅ Imagen establecida para ${featureType}: ${imageUrl}`);
                    }
                }
            }
        });
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

// ===== INICIALIZACIÓN GLOBAL OPTIMIZADA =====
let imageOptimizer;

// ===== FUNCIONES DE TRADUCCIÓN ULTRA-OPTIMIZADAS =====
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
    // Botones de idioma para desktop
    const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option');
    
    // Botones de idioma para drawer móvil
    const drawerLanguageButtons = document.querySelectorAll('.nav__drawer-language-option');
    
    // Configurar eventos para botones desktop
    languageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                switchLanguage(selectedLanguage);
                
                // Cerrar el selector de idioma después de seleccionar
                if (isLanguageSwitcherOpen) {
                    closeLanguageSwitcher();
                }
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
    
    // Configurar eventos para botones del drawer móvil - CORREGIDO PARA CERRAR DRAWER
    drawerLanguageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = button.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                console.log(`🌐 Cambiando idioma a: ${selectedLanguage} desde drawer móvil`);
                
                // Cambiar idioma
                switchLanguage(selectedLanguage);
                
                // Cerrar el drawer móvil después de seleccionar idioma
                if (isMobileMenuOpen) {
                    console.log('📱 Cerrando drawer móvil después de cambio de idioma');
                    setTimeout(() => {
                        closeMobileMenu();
                    }, 100); // Pequeño delay para que se vea el cambio
                }
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
    if (!translationData[newLanguage]) {
        console.warn(`Language ${newLanguage} not supported`);
        return;
    }
    
    currentLanguage = newLanguage;
    localStorage.setItem('starflex-language', newLanguage);
    
    applyTranslations();
    updateLanguageButtons();
    
    document.documentElement.lang = newLanguage;
    
    // Actualizar título según la página actual
    const hash = window.location.hash;
    if (hash === '#/privacypolicy') {
        document.title = `${translationData[currentLanguage]['privacy-policy-title']} - StarFlex`;
    } else if (hash === '#/terms') {
        document.title = `${translationData[currentLanguage]['terms-conditions-title']} - StarFlex`;
    } else {
        document.title = translationData[currentLanguage]['page-title'];
    }
    
    if (!isMobile && !performanceMode) {
        document.body.style.opacity = '0.95';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    
    if (!currentTranslations) {
        console.warn(`Translations for ${currentLanguage} not found`);
        return;
    }
    
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
    // Actualizar botones desktop
    const languageButtons = document.querySelectorAll('.language-btn, .nav__language-option');
    languageButtons.forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        if (buttonLang === currentLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Actualizar botones del drawer móvil
    const drawerLanguageButtons = document.querySelectorAll('.nav__drawer-language-option');
    drawerLanguageButtons.forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        if (buttonLang === currentLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    updateLanguageSwitcher();
}

// ===== SELECTOR DE IDIOMA FLOTANTE OPTIMIZADO (SOLO DESKTOP) =====
function initializeLanguageSwitcher() {
    const languageSwitcherBtn = document.getElementById('language-switcher-btn');
    const languageSwitcherDropdown = document.getElementById('language-switcher-dropdown');
    const languageSwitcher = document.getElementById('language-switcher');
    // CORREGIDO: Usar el selector correcto que existe en el HTML
    const languageOptions = languageSwitcher?.querySelectorAll('.nav__language-option');
    
    if (!languageSwitcherBtn || !languageSwitcherDropdown || !languageSwitcher) return;
    
    if (isMobile) return;
    
    languageSwitcherBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLanguageSwitcher();
    });
    
    // CORREGIDO: Configurar eventos para las opciones de idioma del dropdown
    languageOptions?.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const selectedLanguage = option.getAttribute('data-lang');
            if (selectedLanguage && selectedLanguage !== currentLanguage) {
                console.log(`🌐 Cambiando idioma a: ${selectedLanguage} desde selector desktop`);
                switchLanguage(selectedLanguage);
                // Cerrar el selector automáticamente después de seleccionar
                closeLanguageSwitcher();
            }
        });

        // Mejorar feedback visual en hover y click
        option.addEventListener('mouseenter', () => {
            if (!option.classList.contains('active')) {
                option.style.transform = 'translateX(3px)';
            }
        });
        
        option.addEventListener('mouseleave', () => {
            option.style.transform = '';
        });
    });
    
    // Cerrar cuando se hace clic fuera del selector
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
    
    // CORREGIDO: Usar el selector correcto para las opciones
    const allOptions = document.querySelectorAll('.nav__language-option');
    allOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// ===== FUNCIONES DEL BOTÓN FLOTANTE ULTRA-OPTIMIZADAS =====
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
    
    const menuItems = floatingMenu.querySelectorAll('.floating-widget__menu-item');
    menuItems.forEach(item => {
        item.style.transform = '';
        item.style.opacity = '';
    });
}

// ===== NAVEGACIÓN DESKTOP RESPONSIVE ULTRA-OPTIMIZADA =====
function initializeDesktopNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');
    
    // ===== FUNCIONALIDAD DEL LOGO COMO ENLACE (DESKTOP Y MÓVIL) =====
    const navLogo = document.querySelector('.nav__logo');
    if (navLogo) {
        // CORREGIDO: Funciona en todos los dispositivos sin restricciones
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevenir propagación del evento
            
            console.log(`🏠 Click en logo del header - Dispositivo: ${isMobile ? 'móvil' : 'desktop'}`);
            
            // Cerrar menús abiertos si están activos
            if (isMenuOpen) {
                closeMobileMenu();
            }
            if (isMobileMenuOpen) {
                closeMobileMenu();
            }
            if (isFloatingMenuOpen) {
                closeFloatingMenu();
            }
            if (isLanguageSwitcherOpen) {
                closeLanguageSwitcher();
            }
            
            // Navegar al inicio
            window.location.hash = '';
        });
        
        // MEJORADO: Soporte táctil específico para móviles
        navLogo.addEventListener('touchstart', (e) => {
            e.preventDefault();
            navLogo.style.transform = 'scale(0.95)';
            navLogo.style.transition = 'transform 0.1s ease';
            console.log('👆 Touch start en logo del header');
        }, { passive: false });
        
        navLogo.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Resetear transform
            setTimeout(() => {
                navLogo.style.transform = '';
            }, 150);
            
            // Ejecutar la navegación
            console.log('👆 Touch end en logo del header - ejecutando navegación');
            navLogo.click();
        }, { passive: false });
        
        navLogo.addEventListener('touchcancel', () => {
            navLogo.style.transform = '';
        }, { passive: true });
        
        // Configurar estilos y accesibilidad para ambos dispositivos
        navLogo.style.cursor = 'pointer';
        navLogo.style.userSelect = 'none';
        navLogo.style.webkitUserSelect = 'none';
        navLogo.style.webkitTouchCallout = 'none';
        navLogo.setAttribute('tabindex', '0');
        navLogo.setAttribute('role', 'button');
        navLogo.setAttribute('aria-label', 'Ir al inicio');
        
        // Soporte para navegación por teclado
        navLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navLogo.click();
            }
        });
        
        console.log(`✅ Logo del header configurado para navegación - Dispositivo: ${isMobile ? 'móvil' : 'desktop'}`);
    }
    
    // Enlaces de navegación desktop
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Si es un enlace a una sección, navegar normalmente
            if (targetId.startsWith('#') && !targetId.includes('/')) {
                // Asegurar que estamos en la página principal
                if (window.location.hash.includes('/')) {
                    window.location.hash = '';
                    setTimeout(() => {
                        const targetSection = document.querySelector(targetId);
                        if (targetSection) {
                            smoothScrollToSection(targetSection);
                            updateActiveNavLink(link);
                        }
                    }, 100);
                } else {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        smoothScrollToSection(targetSection);
                        updateActiveNavLink(link);
                    }
                }
            }
        });
    });
    
    initializeKeyboardNavigation();
    initializeActiveSection();
}

// ===== NAVEGACIÓN MÓVIL CON DRAWER - ACTUALIZADA PARA PREVENIR SCROLL =====
function initializeMobileNavigation() {
    console.log('🔧 Inicializando navegación móvil con drawer...');
    
    const navToggle = document.getElementById('nav-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const navDrawerClose = document.getElementById('nav-drawer-close');
    const navDrawerOverlay = document.getElementById('nav-drawer-overlay');
    
    // Enlaces del drawer móvil
    const drawerLinks = document.querySelectorAll('.nav__drawer-link');
    
    console.log(`📱 Enlaces del drawer encontrados: ${drawerLinks.length}`);
    
    if (!navToggle || !navDrawer) {
        console.error('❌ Elementos del drawer móvil no encontrados');
        return;
    }
    
    if (drawerLinks.length === 0) {
        console.error('❌ No se encontraron enlaces del drawer móvil');
        return;
    }
    
    // ===== FUNCIONALIDAD DEL LOGO DEL DRAWER COMO ENLACE (MÓVIL) =====
    const drawerLogo = document.querySelector('.nav__drawer-logo');
    if (drawerLogo) {
        drawerLogo.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🏠 Click en logo del drawer móvil');
            
            if (isMobileMenuOpen) {
                closeMobileMenu();
            }
            
            // Navegar al inicio
            window.location.hash = '';
        });
        
        drawerLogo.style.cursor = 'pointer';
        drawerLogo.setAttribute('tabindex', '0');
        drawerLogo.setAttribute('role', 'button');
        drawerLogo.setAttribute('aria-label', 'Ir al inicio');
        
        // Efectos táctiles para el logo del drawer
        drawerLogo.addEventListener('touchstart', () => {
            drawerLogo.style.transform = 'scale(0.95)';
            drawerLogo.style.transition = 'transform 0.1s ease';
        }, { passive: true });
        
        drawerLogo.addEventListener('touchend', () => {
            setTimeout(() => {
                drawerLogo.style.transform = '';
            }, 150);
        }, { passive: true });
        
        drawerLogo.addEventListener('touchcancel', () => {
            drawerLogo.style.transform = '';
        }, { passive: true });
        
        console.log('✅ Logo del drawer móvil configurado para navegación');
    }
    
    // Toggle hamburguesa móvil
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🍔 Toggle hamburguesa móvil');
        toggleMobileMenu();
    });

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
            console.log('❌ Botón cerrar drawer');
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
        navDrawerOverlay.addEventListener('click', () => {
            console.log('🔄 Click en overlay del drawer');
            closeMobileMenu();
        });
    }
    
    // ===== ENLACES DEL DRAWER MÓVIL - LÓGICA CORREGIDA =====
    drawerLinks.forEach((link, index) => {
        console.log(`🔗 Configurando enlace del drawer ${index + 1}: ${link.getAttribute('href')}`);
        
        // Función principal de navegación
        const handleNavigation = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = link.getAttribute('href');
            console.log(`🎯 Navegando a: ${targetId}`);
            
            // Cerrar el drawer inmediatamente
            if (isMobileMenuOpen) {
                console.log('📱 Cerrando drawer móvil...');
                closeMobileMenu();
            }
            
            // Si es un enlace a una sección, navegar normalmente
            if (targetId.startsWith('#') && !targetId.includes('/')) {
                // Asegurar que estamos en la página principal
                if (window.location.hash.includes('/')) {
                    window.location.hash = '';
                    setTimeout(() => {
                        const targetSection = document.querySelector(targetId);
                        if (targetSection) {
                            smoothScrollToSection(targetSection);
                            updateActiveDrawerLink(link);
                            
                            // También actualizar el enlace desktop correspondiente
                            const desktopLink = document.querySelector(`.nav__link[href="${targetId}"]`);
                            if (desktopLink) {
                                updateActiveNavLink(desktopLink);
                            }
                        }
                    }, 300);
                } else {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        setTimeout(() => {
                            smoothScrollToSection(targetSection);
                            updateActiveDrawerLink(link);
                            
                            // También actualizar el enlace desktop correspondiente
                            const desktopLink = document.querySelector(`.nav__link[href="${targetId}"]`);
                            if (desktopLink) {
                                updateActiveNavLink(desktopLink);
                            }
                        }, 100);
                    }
                }
            }
        };
        
        // Agregar event listeners para máxima compatibilidad
        link.addEventListener('click', handleNavigation);
        link.addEventListener('touchend', (e) => {
            // Prevenir doble activación
            if (e.cancelable) {
                e.preventDefault();
            }
            handleNavigation(e);
        });
        
        // Efectos táctiles mejorados
        link.addEventListener('touchstart', (e) => {
            link.style.transform = 'scale(0.98)';
            link.style.transition = 'transform 0.1s ease';
            console.log(`👆 Touch start en: ${link.getAttribute('href')}`);
        }, { passive: true });
        
        link.addEventListener('touchcancel', () => {
            link.style.transform = '';
        }, { passive: true });
        
        // Resetear transform después del touch
        setTimeout(() => {
            link.addEventListener('touchend', () => {
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);
            }, { passive: true });
        }, 100);
    });
    
    // Cerrar drawer tocando fuera - mejorado
    document.addEventListener('touchstart', (e) => {
        if (isMobileMenuOpen && navDrawer && !navDrawer.contains(e.target) && !navToggle.contains(e.target)) {
            console.log('🔄 Touch fuera del drawer móvil');
            closeMobileMenu();
        }
    }, { passive: true });
    
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen && navDrawer && !navDrawer.contains(e.target) && !navToggle.contains(e.target)) {
            console.log('🔄 Click fuera del drawer móvil');
            closeMobileMenu();
        }
    });
    
    console.log('✅ Navegación móvil con drawer inicializada correctamente');
}

function toggleMobileMenu() {
    console.log(`🔄 Toggle drawer móvil - Estado actual: ${isMobileMenuOpen ? 'abierto' : 'cerrado'}`);
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    console.log('📱 Abriendo drawer móvil...');
    const navToggle = document.getElementById('nav-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const navDrawerOverlay = document.getElementById('nav-drawer-overlay');
    const floatingWidget = document.getElementById('floating-widget');
    const body = document.body;
    
    if (!navToggle || !navDrawer) {
        console.error('❌ Elementos del drawer móvil no encontrados');
        return;
    }
    
    isMobileMenuOpen = true;
    
    navToggle.classList.add('active');
    navDrawer.classList.add('active');
    if (navDrawerOverlay) navDrawerOverlay.classList.add('active');
    
    // ===== PREVENIR SCROLL DE LA PÁGINA SIN MOVER LA POSICIÓN =====
    // Guardar la posición actual del scroll ANTES de hacer cambios
    const scrollPosition = window.scrollY;
    body.dataset.scrollPosition = scrollPosition.toString();
    
    // Aplicar estilos para prevenir scroll sin cambiar la posición visual
    body.classList.add('drawer-open');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = `-${scrollPosition}px`;
    
    // Ocultar botón flotante cuando se abre el drawer móvil
    if (floatingWidget && isMobile) {
        floatingWidget.classList.add('hidden-by-drawer');
        console.log('🔄 Botón flotante ocultado por drawer móvil');
    }
    
    navToggle.setAttribute('aria-expanded', 'true');
    navDrawer.setAttribute('aria-hidden', 'false');
    
    // ===== USAR LA MISMA LÓGICA QUE EL DESKTOP =====
    setTimeout(() => {
        console.log('🎯 Actualizando sección activa del drawer usando lógica del desktop...');
        // Ejecutar la misma función que usa el desktop pero forzando la actualización del drawer
        updateActiveNavOnScroll();
    }, 50);
    
    console.log('✅ Drawer móvil abierto - Scroll de página bloqueado en posición:', scrollPosition);
}

function closeMobileMenu() {
    console.log('📱 Cerrando drawer móvil...');
    const navToggle = document.getElementById('nav-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const navDrawerOverlay = document.getElementById('nav-drawer-overlay');
    const floatingWidget = document.getElementById('floating-widget');
    const body = document.body;
    
    if (!navToggle || !navDrawer) {
        console.error('❌ Elementos del drawer móvil no encontrados');
        return;
    }
    
    isMobileMenuOpen = false;
    
    navToggle.classList.remove('active');
    navDrawer.classList.remove('active');
    if (navDrawerOverlay) navDrawerOverlay.classList.remove('active');
    
    // ===== RESTAURAR SCROLL DE LA PÁGINA A LA POSICIÓN ORIGINAL =====
    const scrollPosition = parseInt(body.dataset.scrollPosition || '0');
    
    // Remover estilos que previenen el scroll
    body.classList.remove('drawer-open');
    body.style.overflow = '';
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    
    // Restaurar la posición del scroll exactamente donde estaba
    window.scrollTo(0, scrollPosition);
    
    // Limpiar el dataset
    delete body.dataset.scrollPosition;
    
    // Mostrar botón flotante cuando se cierra el drawer móvil
    if (floatingWidget && isMobile) {
        floatingWidget.classList.remove('hidden-by-drawer');
        console.log('🔄 Botón flotante mostrado al cerrar drawer móvil');
    }
    
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    
    console.log('✅ Drawer móvil cerrado - Scroll de página restaurado a posición:', scrollPosition);
}

function updateActiveDrawerLink(activeLink) {
    console.log(`🎯 Actualizando enlace activo del drawer: ${activeLink ? activeLink.getAttribute('href') : 'ninguno'}`);
    
    document.querySelectorAll('.nav__drawer-link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

// ===== NAVEGACIÓN GENERAL (FUNCIONES COMPARTIDAS) =====
function initializeNavigation() {
    console.log(`🚀 Inicializando navegación - Dispositivo: ${isMobile ? 'móvil' : 'desktop'}`);
    
    // Inicializar navegación según el dispositivo
    if (isMobile) {
        initializeMobileNavigation();
    } else {
        initializeDesktopNavigation();
    }
    
    initializeActiveSection();
}

function smoothScrollToSection(targetSection) {
    if (!targetSection) {
        console.error('❌ Sección objetivo no válida para scroll');
        return;
    }
    
    const headerHeight = isMobile ? 70 : 80;
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    console.log(`🚀 Scroll suave a: ${targetSection.id}, posición: ${targetPosition}`);
    
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
    setTimeout(() => {
        updateActiveNavOnScroll();
    }, 100);
}

// ===== NAVEGACIÓN POR TECLADO OPTIMIZADA =====
function initializeKeyboardNavigation() {
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
}

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
    // Solo actualizar si estamos en la página principal
    if (window.location.hash.includes('/')) {
        return;
    }
    
    const sections = document.querySelectorAll('section[id]');
    // Usar la posición guardada si el drawer está abierto, sino usar la posición actual
    const scrollY = isMobileMenuOpen && document.body.dataset.scrollPosition ? 
                   parseInt(document.body.dataset.scrollPosition) : 
                   window.scrollY;
    const headerHeight = isMobile ? 80 : 100;
    const windowHeight = window.innerHeight;
    
    let activeSection = null;
    let maxVisibleArea = 0;
    
    // Método mejorado para detectar la sección activa (MISMA LÓGICA QUE DESKTOP)
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
        
        // Considerar una sección como activa si tiene suficiente área visible
        if (visibleArea > maxVisibleArea && visibleArea > 50) {
            maxVisibleArea = visibleArea;
            activeSection = sectionId;
        }
    });
    
    // Fallback: si no hay sección con suficiente área visible, usar posición del scroll
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
    
    // Si aún no hay sección activa, determinar por proximidad
    if (!activeSection && sections.length > 0) {
        let closestSection = null;
        let minDistance = Infinity;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            const distance = Math.abs(scrollY + headerHeight - sectionTop);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestSection = sectionId;
            }
        });
        
        activeSection = closestSection;
    }
    
    if (activeSection) {
        // Actualizar enlaces desktop (LÓGICA ORIGINAL)
        const activeLink = document.querySelector(`.nav__link[href="#${activeSection}"]`);
        const currentActiveLink = document.querySelector('.nav__link.active');
        
        if (activeLink && activeLink !== currentActiveLink) {
            updateActiveNavLink(activeLink);
        }
        
        // Actualizar enlaces del drawer móvil (MISMA LÓGICA QUE DESKTOP)
        const activeDrawerLink = document.querySelector(`.nav__drawer-link[href="#${activeSection}"]`);
        const currentActiveDrawerLink = document.querySelector('.nav__drawer-link.active');
        
        if (activeDrawerLink && activeDrawerLink !== currentActiveDrawerLink) {
            updateActiveDrawerLink(activeDrawerLink);
        }
    }
}

function updateHeaderOnScroll() {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    const threshold = isMobile ? 50 : 100;
    
    // Actualizar header
    if (header) {
        if (scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-hide navbar móvil optimizado
        if (isMobile && scrollY > lastScrollY && scrollY > threshold && !isMobileMenuOpen) {
            if (isNavbarVisible) {
                header.style.transform = 'translateY(-100%)';
                isNavbarVisible = false;
            }
        } else if (isMobile) {
            if (!isNavbarVisible) {
                header.style.transform = 'translateY(0)';
                isNavbarVisible = true;
            }
        }
    }
}

// ===== REPRODUCTOR DE VIDEO ULTRA-OPTIMIZADO =====
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
    
    if (isMobile) {
        playOverlay.addEventListener('touchstart', () => {
            playOverlay.style.transform = 'scale(0.98)';
        }, { passive: true });
        playOverlay.addEventListener('touchend', () => {
            playOverlay.style.transform = '';
        }, { passive: true });
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

// ===== REPRODUCTOR DE YOUTUBE ULTRA-OPTIMIZADO =====
function initializeYouTubePlayer() {
    const youtubeContainer = document.getElementById('youtube-video-container');
    const youtubePlaceholder = document.getElementById('youtube-video-placeholder');
    
    if (!youtubeContainer || !youtubePlaceholder) {
        console.log('🎥 Elementos del reproductor de YouTube no encontrados');
        return;
    }
    
    console.log('🎥 Inicializando reproductor de YouTube...');
    
    // ID del video de YouTube extraído de la URL
    const videoId = '8NpUvQFdDZE';
    
    youtubePlaceholder.addEventListener('click', () => {
        console.log('▶️ Click en placeholder de YouTube');
        loadYouTubeVideo(videoId, youtubeContainer);
    });

    if (isMobile) {
        youtubePlaceholder.addEventListener('touchstart', () => {
            youtubePlaceholder.style.transform = 'scale(0.98)';
        }, { passive: true });
        youtubePlaceholder.addEventListener('touchend', () => {
            youtubePlaceholder.style.transform = '';
        }, { passive: true });
    }
    
    console.log('✅ Reproductor de YouTube inicializado correctamente');
}

function loadYouTubeVideo(videoId, container) {
    console.log(`🎬 Cargando video de YouTube: ${videoId}`);
    
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-video-iframe';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.title = 'StarFlex Demo Video';
    
    // Limpiar el contenedor y agregar el iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    
    console.log('✅ Video de YouTube cargado:', videoId);
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

// ===== FAQ ULTRA-OPTIMIZADO =====
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
        }, isMobile ? 400 : 300));
    }
}

// ===== INTERSECTION OBSERVER ULTRA-OPTIMIZADO =====
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
    
    const elementsToObserve = document.querySelectorAll('.feature, .faq__item, .contact__channel, .videos');
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
            }, 200 + (index * (isMobile ? 50 : 100)));
        });
    }
}

// ===== CONFIGURACIÓN DE LAZY LOADING ULTRA-OPTIMIZADA =====
function setupImageLazyLoading() {
    const waitForOptimizer = () => {
        if (!imageOptimizer) {
            setTimeout(waitForOptimizer, 100);
            return;
        }
        
        console.log('🖼️ Configurando lazy loading de imágenes...');
        
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
        
        // Imagen del hero (crítica) - Nota: Hero usa video, no imagen estática
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroImage) {
            // Usar video-poster como fallback para hero
            imageOptimizer.loadImageImmediately(heroImage, 'videoPoster');
        }
        
        // Imágenes de características - CORREGIDAS
        const featureImages = document.querySelectorAll('.phone__app-image');
        console.log(`📱 Encontradas ${featureImages.length} imágenes de características`);
        
        featureImages.forEach((img, index) => {
            const imageKeys = [
                'phones.schedule',
                'phones.stations',
                'phones.calendar',
                'phones.log',
                'phones.notifications',
                'phones.referrals'
            ];
            
            if (imageKeys[index]) {
                console.log(`🔄 Cargando imagen ${index + 1}: ${imageKeys[index]}`);
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
        
        console.log('✅ Lazy loading configurado correctamente');
    };
    
    waitForOptimizer();
}

// ===== VIDEO HERO ULTRA-OPTIMIZADO =====
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
    
    if (isMobile || performanceMode) {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
        console.log('Video del teléfono deshabilitado enmóvil/modo rendimiento');
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
    
    setTimeout(() => {
        if (heroVideo.readyState < 2) {
            showVideoFallback();
        }
    }, 2000);
}

// ===== UTILIDADES ULTRA-OPTIMIZADAS =====
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

// ===== OPTIMIZACIONES DE RENDIMIENTO ULTRA-AGRESIVAS =====
function initializePerformanceOptimizations() {
    if (!performanceMode) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                preloadCriticalResources();
            });
        } else {
            setTimeout(preloadCriticalResources, 5000);
        }
    }
    
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
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, isMobile ? 1000 : 500);
    });
}

function preloadCriticalResources() {
    const criticalResources = [
        './assets/logo.webp',
        './assets/video-poster.webp'
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
                // En desktop, siempre mostrar el botón flotante
                floatingWidget.classList.remove('hidden-by-drawer');
            } else if (isMobileMenuOpen) {
                // En móvil, ocultar si el drawer está abierto
                floatingWidget.classList.add('hidden-by-drawer');
            }
        }
        
        // Reinicializar navegación
        setTimeout(() => {
            initializeNavigation();
            updateActiveNavOnScroll();
        }, 100);
    }
    
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    }
    
    if (isLanguageSwitcherOpen) {
        closeLanguageSwitcher();
    }
}

// ===== ACCESIBILIDAD ULTRA-OPTIMIZADA =====
function initializeAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            if (isMobileMenuOpen) {
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

// ===== INICIALIZACIÓN PRINCIPAL ULTRA-OPTIMIZADA =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando StarFlex...');
    
    detectDeviceCapabilities();
    
    imageOptimizer = new UltraOptimizedImageLoader();
    
    initializeLanguageSystem();
    initializeLanguageSwitcher();
    initializeRouting(); // Nueva función para el sistema de routing
    initializeNavigation();
    initializeScrollEffects();
    initializeVideoPlayer();
    initializeYouTubePlayer();
    initializeFAQ();
    initializeHeroVideoFallback();
    initializeAccessibility();
    initializeFloatingWidget();
    
    setupImageLazyLoading();
    
    if (!performanceMode) {
        initializeIntersectionObserver();
    }
    
    initializePerformanceOptimizations();
    
    console.log(`✅ StarFlex Ultra-Optimizado - Móvil: ${isMobile}, Modo rendimiento: ${performanceMode}, Drawer móvil: ${isMobile ? 'Activo' : 'Inactivo'}, Routing: Activo`);
});

// ===== MANEJO DE ERRORES ULTRA-OPTIMIZADO =====
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
    
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

// ===== FUNCIONES ADICIONALES PARA DEBUGGING Y MONITOREO =====
function debugImageLoading() {
    console.log('🔍 Estado del cargador de imágenes:');
    console.log('- Formatos soportados:', imageOptimizer?.supportedFormats);
    console.log('- Imágenes en caché:', imageOptimizer?.imageCache.size);
    console.log('- Imágenes lazy:', imageOptimizer?.lazyImages.size);
    
    // Verificar imágenes de características
    const featureImages = document.querySelectorAll('.phone__app-image');
    console.log(`📱 Imágenes de características encontradas: ${featureImages.length}`);
    
    featureImages.forEach((img, index) => {
        const feature = img.closest('.feature');
        const featureType = feature?.getAttribute('data-feature');
        const backgroundImage = window.getComputedStyle(img).backgroundImage;
        const hasBackground = backgroundImage && backgroundImage !== 'none';
        
        console.log(`  ${index + 1}. ${featureType}: ${hasBackground ? '✅ Cargada' : '❌ Sin cargar'}`);
        if (hasBackground) {
            console.log(`     URL: ${backgroundImage}`);
        }
    });
}

// Exponer función de debug globalmente para testing
window.debugImageLoading = debugImageLoading;

// ===== FUNCIÓN PARA FORZAR RECARGA DE IMÁGENES =====
function forceReloadImages() {
    console.log('🔄 Forzando recarga de todas las imágenes...');
    
    if (imageOptimizer) {
        // Limpiar caché
        imageOptimizer.imageCache.clear();
        
        // Recargar imágenes de características
        imageOptimizer.forceLoadFeatureImages();
        
        // Recargar logos
        const navLogo = document.querySelector('.nav__logo');
        const drawerLogo = document.querySelector('.nav__drawer-logo');
        
        if (navLogo) {
            imageOptimizer.loadImageImmediately(navLogo, 'logo');
        }
        if (drawerLogo) {
            imageOptimizer.loadImageImmediately(drawerLogo, 'logo');
        }
        
        console.log('✅ Recarga de imágenes completada');
    }
}

// Exponer función de recarga globalmente
window.forceReloadImages = forceReloadImages;

// ===== EXPOSICIÓN DE API PARA DEBUGGING =====
window.StarFlex = {
    version: '2.0.0',
    isMobile,
    performanceMode,
    imageOptimizer,
    debugImageLoading,
    forceReloadImages,
    // Funciones de navegación
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    // Funciones de idioma
    switchLanguage,
    currentLanguage,
    // Funciones de video
    initializeYouTubePlayer,
    loadYouTubeVideo,
    // Funciones de routing
    initializeRouting,
    handleRouteChange,
    showMainContent,
    showPrivacyPolicy,
    showTermsConditions,
    // Utilidades
    detectDeviceCapabilities
};


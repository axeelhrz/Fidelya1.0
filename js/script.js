// ===== VARIABLES GLOBALES =====
let isMenuOpen = false;
let currentFeature = 0;
const features = document.querySelectorAll('.feature');
// Variables para el sistema de partículas flotantes
let particleSystems = [];
let animationId = null;
let isReducedMotion = false;
// Variables para el sistema de idiomas
let currentLanguage = 'es';
const translations = {};
// Variables para el botón flotante
let isFloatingMenuOpen = false;
// Variables para el control del navbar
let lastScrollY = 0;
let isScrollingDown = false;
let ticking = false;
// Variables para el navbar responsive
let touchStartY = 0;
let touchEndY = 0;
let isNavbarVisible = true;
// Variables para el video hero
let heroVideo = null;
let heroVideoLoaded = false;

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    // Configuración de animaciones
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    
    // Configuración de imágenes optimizadas
    IMAGE_FORMATS: {
        AVIF: 'image/avif',
    },
    
    // Rutas de imágenes optimizadas
    IMAGE_PATHS: {
        hero: {
            avif: './assets/phones/Hero.avif',
        },
        logo: {
            avif: './assets/logo.avif',
        },
        phones: {
            horario: {
                avif: './assets/phones/Horario.avif',
            },
            estaciones: {
                avif: './assets/phones/Estaciones.avif',
            },
            calendario: {
                avif: './assets/phones/Calendario.avif',
            },
            registro: {
                avif: './assets/phones/Registro.avif',
            },
            notificaciones: {
                avif: './assets/phones/Notificaciones.avif',
            },
            referidos: {
                avif: './assets/phones/Referidos.avif',
            }
        },
        downloads: {
            apple: {
                avif: './assets/AppleStore.avif',
            },
            google: {
                avif: './assets/GooglePlay.avif',
            }
        }
    },
    
    // Configuración del video hero
    VIDEO_CONFIG: {
        heroVideoPath: './assets/Hero.mp4',
        autoplay: true,
        muted: true,
        loop: true,
        playsinline: true,
        preload: 'auto'
    }
};

// ===== SISTEMA DE TRADUCCIONES =====
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
        'nav-contact': 'Contactos',
        'nav-cta': 'Comienza tu prueba gratuita',
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
        'features-subtitle': 'Aquí puedes ver lo que te ofrece StarFlex.',
        // Feature 1: Horario
        'feature-schedule-title': 'HORARIO',
        'feature-schedule-description': 'Elige los días y horarios que prefieras para tus bloques de entrega.',
        'feature-schedule-item-1': 'Configuración personalizada por día',
        'feature-schedule-item-2': 'Horarios flexibles de trabajo',
        'feature-schedule-item-3': 'Optimización automática de turnos',
        'feature-schedule-item-4': 'Sincronización con tu calendario',
        // Feature 2: Estaciones
        'feature-stations-title': 'ESTACIONES',
        'feature-stations-description': 'Selecciona tus estaciones preferidas y precios para que nuestra app pueda ofrecerte los bloques que se ajusten a tus preferencias.',
        'feature-stations-item-1': 'Selección personalizada de estaciones favoritas',
        'feature-stations-item-2': 'Configuración de precios mínimos por estación',
        'feature-stations-item-3': 'Análisis de rentabilidad por ubicación',
        'feature-stations-item-4': 'Notificaciones instantáneas de bloques disponibles',
        'feature-stations-item-5': 'Mapa interactivo con todas las estaciones',
        // Feature 3: Calendario
        'feature-calendar-title': 'CALENDARIO',
        'feature-calendar-description': 'En el calendario podrás ver tus bloques aceptados y encontrar las opciones para identificarte desde cualquier ubicación, así como la posibilidad de saltarte la selfie y cancelar bloques, todo en un solo lugar para tu máxima comodidad.',
        'feature-calendar-item-1': 'Identificación desde cualquier ubicación',
        'feature-calendar-item-2': 'Opción de saltar selfie',
        'feature-calendar-item-3': 'Cancelación rápida de bloques',
        // Feature 4: Registro
        'feature-log-title': 'REGISTRO',
        'feature-log-description': 'En el registro, podrá ver todos los bloques disponibles y el motivo detallado por el cual se ignoraron algunos. Esto le ayudará a ajustar sus filtros de preferencias según sea necesario para optimizar sus opciones.',
        'feature-log-item-1': 'Historial completo de bloques',
        'feature-log-item-2': 'Motivos detallados de rechazo',
        'feature-log-item-3': 'Optimización de filtros',
        'feature-log-item-4': 'Análisis de patrones',
        // Feature 5: Notificaciones
        'feature-notifications-title': 'NOTIFICACIONES',
        'feature-notifications-description': 'StarFlex te mantiene informado con múltiples tipos de notificaciones para que nunca te pierdas los mejores bloques disponibles. Configura tus alertas según tus preferencias.',
        'feature-notifications-item-1': 'Notificaciones Push instantáneas',
        'feature-notifications-item-2': 'Alertas por correo electrónico',
        'feature-notifications-item-3': 'Llamadas telefónicas automáticas',
        'feature-notifications-item-4': 'Mensajes SMS directos',
        'feature-notifications-item-5': 'Alertas personalizables por tipo de bloque',
        'feature-notifications-item-6': 'Notificaciones en tiempo real',
        'feature-notifications-item-7': 'Filtros avanzados de notificación',
        // Feature 6: Referidos
        'feature-referrals-title': 'REFERIDOS',
        'feature-referrals-description': 'Comparte StarFlex con otros conductores y ambos ganan. Nuestro sistema de referidos te permite obtener beneficios por cada nuevo usuario que invites a la plataforma.',
        'feature-referrals-item-1': 'Enlace único de referido',
        'feature-referrals-item-2': 'Recompensas por referidos',
        'feature-referrals-item-3': 'Código QR de referido',
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
        'features-subtitle': 'Here you can see what StarFlex offers you.',
        // Feature 1: Schedule
        'feature-schedule-title': 'SCHEDULE',
        'feature-schedule-description': 'Choose the days and times you prefer for your delivery blocks.',
        'feature-schedule-item-1': 'Personalized configuration per day',
        'feature-schedule-item-2': 'Flexible work schedules',
        'feature-schedule-item-3': 'Automatic shift optimization',
        'feature-schedule-item-4': 'Synchronization with your calendar',
        // Feature 2: Stations
        'feature-stations-title': 'STATIONS',
        'feature-stations-description': 'Select your preferred stations and prices so our app can offer you blocks that fit your preferences.',
        'feature-stations-item-1': 'Personalized selection of favorite stations',
        'feature-stations-item-2': 'Minimum price configuration per station',
        'feature-stations-item-3': 'Profitability analysis by location',
        'feature-stations-item-4': 'Instant notifications of available blocks',
        'feature-stations-item-5': 'Interactive map with all stations',
        // Feature 3: Calendar
        'feature-calendar-title': 'CALENDAR',
        'feature-calendar-description': 'In the calendar you can see your accepted blocks and find options to identify yourself from any location, as well as the possibility to skip the selfie and cancel blocks, all in one place for your maximum convenience.',
        'feature-calendar-item-1': 'Identification from any location',
        'feature-calendar-item-2': 'Option to skip selfie',
        'feature-calendar-item-3': 'Quick block cancellation',
        // Feature 4: Log
        'feature-log-title': 'LOG',
        'feature-log-description': 'In the log, you can see all available blocks and the detailed reason why some were ignored. This will help you adjust your preference filters as needed to optimize your options.',
        'feature-log-item-1': 'Complete block history',
        'feature-log-item-2': 'Detailed rejection reasons',
        'feature-log-item-3': 'Filter optimization',
        'feature-log-item-4': 'Pattern analysis',
        // Feature 5: Notifications
        'feature-notifications-title': 'NOTIFICATIONS',
        'feature-notifications-description': 'StarFlex keeps you informed with multiple types of notifications so you never miss the best available blocks. Configure your alerts according to your preferences.',
        'feature-notifications-item-1': 'Instant Push notifications',
        'feature-notifications-item-2': 'Email alerts',
        'feature-notifications-item-3': 'Automatic phone calls',
        'feature-notifications-item-4': 'Direct SMS messages',
        'feature-notifications-item-5': 'Customizable alerts by block type',
        'feature-notifications-item-6': 'Real-time notifications',
        'feature-notifications-item-7': 'Advanced notification filters',
        // Feature 6: Referrals
        'feature-referrals-title': 'REFERRALS',
        'feature-referrals-description': 'Share StarFlex with other drivers and both earn. Our referral system allows you to get benefits for each new user you invite to the platform.',
        'feature-referrals-item-1': 'Unique referral link',
        'feature-referrals-item-2': 'Referral rewards',
        'feature-referrals-item-3': 'Referral QR code',
        'feature-referrals-item-4': 'Earn 1 week free for each referral',
        'feature-referrals-item-5': 'Track your referrals in real time',
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
        'contact-whatsapp-description': 'Join our WhatsApp channel to receive the latest updates and best available blocks',
        'contact-whatsapp-btn': 'Join Channel',
        'contact-instagram-title': 'Instagram',
        'contact-instagram-description': 'Follow us for visual content, tips and daily updates on the best blocks',
        'contact-instagram-btn': 'Follow',
        'contact-facebook-title': 'Facebook',
        'contact-facebook-description': 'Join our Facebook community to interact with other drivers and share experiences',
        'contact-facebook-btn': 'Follow',
        'contact-tiktok-title': 'TikTok',
        'contact-tiktok-description': 'Discover viral content, quick tips and the latest Amazon Flex trends',
        'contact-tiktok-btn': 'Follow',
        'contact-telegram-title': 'Telegram news channels',
        'contact-telegram-description': 'Receive instant notifications of the best blocks and important updates',
        'contact-telegram-btn': 'Join Channel',
        'contact-email-title': 'support@starflexapp.com',
        'contact-email-description': 'Contact directly with our specialized technical support team',
        'contact-email-btn': 'Send Email',
        // Footer
        'footer-legal': 'Privacy Policy • Terms and Conditions',
        'footer-copyright': '© StarFlex • All rights reserved',
        'footer-cta-main': 'START NOW',
        'footer-cta-trial': '3 days free'
    }
};

// ===== CLASE PARA OPTIMIZACIÓN DE IMÁGENES =====
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
    
    // Detectar soporte de formatos de imagen
    async detectFormatSupport() {
        const formats = [
            { type: 'avif', data: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=' },
        ];
        
        const promises = formats.map(format => 
            this.canUseFormat(format.data).then(supported => {
                if (supported) {
                    this.supportedFormats.add(format.type);
                }
            })
        );
        
        await Promise.all(promises);
        
        // Siempre agregar JPEG y PNG como fallbacks
        
        console.log('Formatos soportados:', Array.from(this.supportedFormats));
    }
    
    // Verificar si el navegador puede usar un formato específico
    canUseFormat(dataUrl) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img.width > 0 && img.height > 0);
            img.onerror = () => resolve(false);
            img.src = dataUrl;
        });
    }
    
    // Obtener la mejor URL de imagen disponible
    getBestImageUrl(imageConfig) {
        if (this.supportedFormats.has('avif') && imageConfig.avif) {
            return imageConfig.avif;
        }
    }
    
    // Configurar lazy loading con Intersection Observer
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
    
    // Cargar imagen optimizada
    async loadImage(element) {
        const imageKey = element.dataset.imageKey;
        const imageConfig = this.getImageConfig(imageKey);
        
        if (!imageConfig) {
            console.warn(`Configuración de imagen no encontrada para: ${imageKey}`);
            return;
        }
        
        const bestUrl = this.getBestImageUrl(imageConfig);
        
        try {
            // Mostrar estado de carga
            element.classList.add('loading');
            
            // Precargar la imagen
            await this.preloadImage(bestUrl);
            
            // Aplicar la imagen
            if (element.tagName === 'IMG') {
                element.src = bestUrl;
            } else {
                element.style.backgroundImage = `url('${bestUrl}')`;
            }
            
            // Remover estado de carga
            element.classList.remove('loading');
            element.classList.add('loaded');
            
            console.log(`Imagen cargada: ${imageKey} -> ${bestUrl}`);
            
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
    
    // Precargar imágenes críticas
    async preloadCriticalImages() {
        const criticalImages = [
            'hero',
            'logo',
            'phones.horario'
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
    
    // Registrar imagen para lazy loading
    observeImage(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.lazyImages.add(element);
        
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(element);
        } else {
            // Fallback para navegadores sin Intersection Observer
            this.loadImage(element);
        }
    }
    
    // Cargar imagen inmediatamente (para imágenes críticas)
    loadImageImmediately(element, imageKey) {
        element.dataset.imageKey = imageKey;
        this.loadImage(element);
    }
}

// ===== CLASE PARA MANEJO DEL VIDEO HERO =====
class HeroVideoManager {
    constructor() {
        this.video = null;
        this.fallbackElement = null;
        this.isLoaded = false;
        this.isPlaying = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.init();
    }
    
    init() {
        this.video = document.getElementById('hero-video');
        this.fallbackElement = document.querySelector('.hero__phone-video-fallback');
        
        if (!this.video) {
            console.warn('Video hero no encontrado');
            return;
        }
        
        this.setupVideoEvents();
        this.setupVideoAttributes();
        this.attemptVideoLoad();
    }
    
    setupVideoAttributes() {
        if (!this.video) return;
        
        // Configurar atributos del video
        this.video.autoplay = CONFIG.VIDEO_CONFIG.autoplay;
        this.video.muted = CONFIG.VIDEO_CONFIG.muted;
        this.video.loop = CONFIG.VIDEO_CONFIG.loop;
        this.video.playsInline = CONFIG.VIDEO_CONFIG.playsinline;
        this.video.preload = CONFIG.VIDEO_CONFIG.preload;
        
        // Asegurar que el video esté silenciado para autoplay
        this.video.muted = true;
        this.video.volume = 0;
        
        // Configurar poster como fallback
        if (!this.video.poster) {
            this.video.poster = './assets/phones/Hero.jpg';
        }
    }
    
    setupVideoEvents() {
        if (!this.video) return;
        
        // Evento cuando el video puede empezar a reproducirse
        this.video.addEventListener('canplay', () => {
            console.log('Video hero: Puede reproducirse');
            this.handleVideoReady();
        });
        
        // Evento cuando el video está completamente cargado
        this.video.addEventListener('canplaythrough', () => {
            console.log('Video hero: Completamente cargado');
            this.isLoaded = true;
            this.hideLoadingState();
        });
        
        // Evento cuando el video empieza a reproducirse
        this.video.addEventListener('play', () => {
            console.log('Video hero: Reproduciendo');
            this.isPlaying = true;
            this.hideLoadingState();
            this.hideFallback();
        });
        
        // Evento cuando el video se pausa
        this.video.addEventListener('pause', () => {
            console.log('Video hero: Pausado');
            this.isPlaying = false;
        });
        
        // Evento de error
        this.video.addEventListener('error', (e) => {
            console.error('Error en video hero:', e);
            this.handleVideoError();
        });
        
        // Evento cuando el video se carga
        this.video.addEventListener('loadstart', () => {
            console.log('Video hero: Iniciando carga');
            this.showLoadingState();
        });
        
        // Evento cuando hay datos suficientes para reproducir
        this.video.addEventListener('loadeddata', () => {
            console.log('Video hero: Datos cargados');
            this.attemptAutoplay();
        });
        
        // Evento cuando el video está listo para reproducir sin interrupciones
        this.video.addEventListener('loadedmetadata', () => {
            console.log('Video hero: Metadatos cargados');
        });
        
        // Evento cuando el video se detiene por falta de datos
        this.video.addEventListener('waiting', () => {
            console.log('Video hero: Esperando datos');
            this.showLoadingState();
        });
        
        // Evento cuando el video puede continuar después de waiting
        this.video.addEventListener('playing', () => {
            console.log('Video hero: Continuando reproducción');
            this.hideLoadingState();
        });
    }
    
    attemptVideoLoad() {
        if (!this.video) return;
        
        // Mostrar estado de carga
        this.showLoadingState();
        
        // Intentar cargar el video
        try {
            this.video.load();
        } catch (error) {
            console.error('Error al cargar video hero:', error);
            this.handleVideoError();
        }
    }
    
    handleVideoReady() {
        if (!this.video) return;
        
        // Intentar reproducir automáticamente
        this.attemptAutoplay();
    }
    
    async attemptAutoplay() {
        if (!this.video || this.isPlaying) return;
        
        try {
            // Asegurar que esté silenciado para autoplay
            this.video.muted = true;
            this.video.volume = 0;
            
            // Intentar reproducir
            const playPromise = this.video.play();
            
            if (playPromise !== undefined) {
                await playPromise;
                console.log('Video hero: Autoplay exitoso');
                this.isPlaying = true;
                this.hideLoadingState();
                this.hideFallback();
            }
        } catch (error) {
            console.warn('Video hero: Autoplay falló:', error);
            this.handleAutoplayFailure();
        }
    }
    
    handleAutoplayFailure() {
        console.log('Video hero: Autoplay no permitido, mostrando fallback');
        this.showFallback();
        this.hideLoadingState();
        
        // Intentar reproducir cuando el usuario interactúe
        this.setupUserInteractionHandler();
    }
    
    setupUserInteractionHandler() {
        const handleUserInteraction = async () => {
            try {
                if (this.video && !this.isPlaying) {
                    await this.video.play();
                    this.hideFallback();
                    console.log('Video hero: Reproduciendo después de interacción del usuario');
                }
            } catch (error) {
                console.warn('Video hero: Error al reproducir después de interacción:', error);
            }
            
            // Remover listeners después del primer intento
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
        };
        
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
    }
    
    handleVideoError() {
        console.error('Video hero: Error crítico, mostrando fallback permanente');
        this.showFallback();
        this.hideLoadingState();
        
        // Marcar el video como error
        if (this.video) {
            this.video.classList.add('error');
        }
        
        // Intentar recargar si no hemos excedido los reintentos
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`Video hero: Reintentando carga (${this.retryCount}/${this.maxRetries})`);
            setTimeout(() => {
                this.attemptVideoLoad();
            }, 2000 * this.retryCount); // Delay incremental
        }
    }
    
    showLoadingState() {
        if (this.video) {
            this.video.classList.add('loading');
        }
        
        const phoneContainer = document.querySelector('.hero__phone');
        if (phoneContainer) {
            phoneContainer.setAttribute('data-loading', 'true');
        }
    }
    
    hideLoadingState() {
        if (this.video) {
            this.video.classList.remove('loading');
        }
        
        const phoneContainer = document.querySelector('.hero__phone');
        if (phoneContainer) {
            phoneContainer.removeAttribute('data-loading');
        }
    }
    
    showFallback() {
        if (this.fallbackElement) {
            this.fallbackElement.style.display = 'block';
            this.fallbackElement.style.zIndex = '2';
        }
        
        if (this.video) {
            this.video.style.zIndex = '0';
        }
    }
    
    hideFallback() {
        if (this.fallbackElement) {
            this.fallbackElement.style.display = 'none';
            this.fallbackElement.style.zIndex = '0';
        }
        
        if (this.video) {
            this.video.style.zIndex = '1';
        }
    }
    
    // Método público para pausar el video
    pause() {
        if (this.video && this.isPlaying) {
            this.video.pause();
        }
    }
    
    // Método público para reproducir el video
    async play() {
        if (this.video && !this.isPlaying) {
            try {
                await this.video.play();
            } catch (error) {
                console.warn('Error al reproducir video hero:', error);
            }
        }
    }
    
    // Método público para verificar si el video está reproduciéndose
    isVideoPlaying() {
        return this.isPlaying;
    }
    
    // Método para limpiar recursos
    destroy() {
        if (this.video) {
            this.video.pause();
            this.video.removeAttribute('src');
            this.video.load();
        }
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
let imageOptimizer;
let heroVideoManager;

// ===== FUNCIONES DE TRADUCCIÓN =====
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
    const languageBtn = document.getElementById('language-toggle-btn');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageBtn) {
        // Manejar hover para mostrar dropdown
        const languageToggle = document.querySelector('.language-toggle');
        const languageDropdown = document.querySelector('.language-dropdown');
        
        let hoverTimeout;
        
        if (languageToggle && languageDropdown) {
            languageToggle.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                languageDropdown.style.opacity = '1';
                languageDropdown.style.visibility = 'visible';
                languageDropdown.style.transform = 'translateY(0)';
                languageBtn.classList.add('active');
            });
            
            languageToggle.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    languageDropdown.style.opacity = '0';
                    languageDropdown.style.visibility = 'hidden';
                    languageDropdown.style.transform = 'translateY(-10px)';
                    languageBtn.classList.remove('active');
                }, 150);
            });
            
            // Mantener dropdown abierto cuando se hace hover sobre él
            languageDropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
            });
            
            languageDropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    languageDropdown.style.opacity = '0';
                    languageDropdown.style.visibility = 'hidden';
                    languageDropdown.style.transform = 'translateY(-10px)';
                    languageBtn.classList.remove('active');
                }, 150);
            });
        }
    }
    
    // Manejar clicks en opciones de idioma
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLanguage = option.getAttribute('data-lang');
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
    
    // Efecto visual suave al cambiar idioma
    document.body.style.opacity = '0.95';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 150);
    
    // Cerrar dropdown después del cambio
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageBtn = document.getElementById('language-toggle-btn');
    if (languageDropdown && languageBtn) {
        languageDropdown.style.opacity = '0';
        languageDropdown.style.visibility = 'hidden';
        languageDropdown.style.transform = 'translateY(-10px)';
        languageBtn.classList.remove('active');
    }
}

function applyTranslations() {
    const currentTranslations = translationData[currentLanguage];
    
    if (!currentTranslations) {
        console.warn(`Translations for ${currentLanguage} not found`);
        return;
    }
    
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
}

function updateLanguageButtons() {
    const languageText = document.getElementById('language-text');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageText) {
        languageText.textContent = currentLanguage.toUpperCase();
    }
    
    // Actualizar estado activo de las opciones
    languageOptions.forEach(option => {
        const optionLang = option.getAttribute('data-lang');
        if (optionLang === currentLanguage) {
            option.style.background = 'var(--glass-bg-medium)';
            option.style.color = 'var(--starflex-crimson-bright)';
        } else {
            option.style.background = 'transparent';
            option.style.color = 'var(--text-secondary)';
        }
    });
}

// ===== FUNCIONES DEL BOTÓN FLOTANTE =====
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
        
        // Pausar video hero si está en movimiento reducido
        if (heroVideoManager) {
            heroVideoManager.pause();
        }
    }
}

// ===== SISTEMA DE PARTÍCULAS FLOTANTES DELICADAS =====
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        
        this.config = {
            particleCount: options.particleCount || 15,
            particleSize: options.particleSize || 2,
            particleSpeed: options.particleSpeed || 0.5,
            particleColor: options.particleColor || 'rgba(255, 69, 105, 0.3)',
            connectionDistance: options.connectionDistance || 100,
            connectionOpacity: options.connectionOpacity || 0.1,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (isReducedMotion) return;
        
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.setupResize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        let particlesContainer = this.container.querySelector('.particles-container');
        if (!particlesContainer) {
            particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles-container';
            this.container.appendChild(particlesContainer);
        }
        
        particlesContainer.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.canvas || !this.container) return;
        
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        if (isReducedMotion) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.particleColor.replace('0.3', particle.opacity.toString());
            this.ctx.fill();
        });
        
        this.drawConnections();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(255, 69, 105, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    setupResize() {
        const resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas();
            this.createParticles();
        });
        resizeObserver.observe(this.container);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// ===== INICIALIZACIÓN DE SISTEMAS DE PARTÍCULAS =====
function initializeParticleSystems() {
    if (isReducedMotion) return;
    
    const heroPhone = document.querySelector('.hero__phone');
    if (heroPhone) {
        const heroParticleSystem = new ParticleSystem(heroPhone, {
            particleCount: 12,
            particleSize: 1.5,
            particleSpeed: 0.3,
            particleColor: 'rgba(255, 69, 105, 0.25)',
            connectionDistance: 80,
            connectionOpacity: 0.08
        });
        particleSystems.push(heroParticleSystem);
    }
    
    const featurePhones = document.querySelectorAll('.feature__phone .phone');
    featurePhones.forEach((phone, index) => {
        const colors = [
            'rgba(255, 69, 105, 0.2)',
            'rgba(255, 23, 68, 0.2)',
            'rgba(255, 45, 107, 0.2)',
            'rgba(184, 0, 46, 0.2)',
            'rgba(255, 69, 105, 0.2)',
            'rgba(255, 215, 0, 0.25)'
        ];
        
        const particleSystem = new ParticleSystem(phone, {
            particleCount: 8,
            particleSize: 1,
            particleSpeed: 0.2,
            particleColor: colors[index % colors.length],
            connectionDistance: 60,
            connectionOpacity: 0.06
        });
        particleSystems.push(particleSystem);
    });
}

// ===== NAVEGACIÓN RESPONSIVE MEJORADA =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');
    
    // ===== FUNCIONALIDAD DEL LOGO COMO ENLACE =====
    const navLogo = document.querySelector('.nav__logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Cerrar menú móvil si está abierto
            if (isMenuOpen) {
                closeMobileMenu();
            }
            
            // Scroll suave a la sección inicio
            const inicioSection = document.querySelector('#inicio');
            if (inicioSection) {
                smoothScrollToSection(inicioSection);
                
                // Actualizar enlace activo
                const homeLink = document.querySelector('.nav__link[href="#inicio"]');
                if (homeLink) {
                    updateActiveNavLink(homeLink);
                }
            }
        });
        
        // Agregar cursor pointer y accesibilidad
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
    }
    
    // Toggle del menú móvil con animaciones mejoradas
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            
            // Navegación suave mejorada
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollToSection(targetSection);
                updateActiveNavLink(link);
            }
        });
    });
    
    // Cerrar menú con click fuera
    document.addEventListener('click', (e) => {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Soporte para gestos táctiles
    initializeTouchGestures();
    
    // Mejorar accesibilidad del teclado
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
    
    // Pausar video hero cuando se abre el menú para mejor rendimiento
    if (heroVideoManager && heroVideoManager.isVideoPlaying()) {
        heroVideoManager.pause();
    }
    
    // Animaciones de apertura
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    body.classList.add('no-scroll');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    // Animar enlaces del menú
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
    
    // Focus en el primer enlace para accesibilidad
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
    
    // Reanudar video hero cuando se cierra el menú
    if (heroVideoManager && !heroVideoManager.isVideoPlaying() && !isReducedMotion) {
        heroVideoManager.play();
    }
    
    // Animaciones de cierre
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('no-scroll');
    
    // Actualizar atributos de accesibilidad
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Resetear estilos de los enlaces
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.style.transition = '';
        link.style.opacity = '';
        link.style.transform = '';
    });
    
    // Devolver focus al botón toggle
    navToggle.focus();
}

function smoothScrollToSection(targetSection) {
    const headerHeight = window.innerWidth <= 768 ? 70 : 80;
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    // Usar scroll suave nativo si está disponible
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Fallback para navegadores antiguos
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

// ===== GESTOS TÁCTILES PARA MÓVIL =====
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
        
        // Solo permitir deslizar hacia arriba para cerrar
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
        
        // Si se deslizó más de 100px hacia arriba, cerrar el menú
        if (deltaY < -100) {
            closeMobileMenu();
        } else {
            // Restaurar posición original
            navMenu.style.transform = '';
            navMenu.style.opacity = '';
        }
    }, { passive: true });
}

// ===== NAVEGACIÓN POR TECLADO MEJORADA =====
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
        
        // Tab trap cuando el menú está abierto
        if (e.key === 'Tab' && isMenuOpen) {
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
    // Scroll listener optimizado con throttling para navegación activa
    window.addEventListener('scroll', throttle(() => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                handleScrollDirection();
                handleVideoVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }, 16), { passive: true });
}

function handleScrollDirection() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling hacia abajo
        isScrollingDown = true;
    } else {
        // Scrolling hacia arriba
        isScrollingDown = false;
    }
    
    lastScrollY = currentScrollY;
}

function handleVideoVisibility() {
    if (!heroVideoManager) return;
    
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    
    // Pausar video cuando no está visible para ahorrar recursos
    if (!isVisible && heroVideoManager.isVideoPlaying()) {
        heroVideoManager.pause();
    } else if (isVisible && !heroVideoManager.isVideoPlaying() && !isReducedMotion) {
        heroVideoManager.play();
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

// ===== REPRODUCTOR DE VIDEO =====
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
    video.preload = 'metadata';
    
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

// ===== FAQ =====
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

// ===== ANIMACIONES =====
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            element.classList.add(`animate-${animationType}`);
        }, delay);
    });
}

// ===== INTERSECTION OBSERVER =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
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
    const phone = feature.querySelector('.feature__phone');
    const content = feature.querySelector('.feature__content');
    
    if (phone) {
        setTimeout(() => {
            phone.style.transform = 'perspective(1000px) rotateY(1deg) rotateX(0deg) scale(1.02)';
        }, 300);
        setTimeout(() => {
            phone.style.transform = 'perspective(1000px) rotateY(2deg) rotateX(-1deg) scale(1)';
        }, 600);
    }
    
    if (content) {
        const listItems = content.querySelectorAll('.feature__list-item');
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + (index * 100));
        });
    }
}

// ===== CONFIGURACIÓN DE LAZY LOADING PARA IMÁGENES =====
function setupImageLazyLoading() {
    // Esperar a que el optimizador esté listo
    const waitForOptimizer = () => {
        if (!imageOptimizer || !imageOptimizer.supportedFormats.size) {
            setTimeout(waitForOptimizer, 100);
            return;
        }
        
        // Configurar logo del navbar (crítico - cargar inmediatamente)
        const navLogo = document.querySelector('.nav__logo');
        if (navLogo) {
            imageOptimizer.loadImageImmediately(navLogo, 'logo');
        }
        
        // Configurar imagen del hero fallback (crítica - cargar inmediatamente)
        const heroFallbackImage = document.querySelector('.hero__phone-video-fallback .hero__phone-app-image');
        if (heroFallbackImage) {
            imageOptimizer.loadImageImmediately(heroFallbackImage, 'hero');
        }
        
        // Configurar imágenes de características (lazy loading)
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
        
        // Configurar botones de descarga
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

// ===== UTILIDADES =====
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
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
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
    
    images.forEach(img => imageObserver.observe(img));
}

function preloadCriticalResources() {
    const criticalImages = [
        './assets/phones/Hero.jpg',
        './assets/phones/Horario.jpg',
        './assets/phones/Estaciones.jpg',
        './assets/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Precargar video hero
    const videoLink = document.createElement('link');
    videoLink.rel = 'preload';
    videoLink.as = 'video';
    videoLink.href = CONFIG.VIDEO_CONFIG.heroVideoPath;
    document.head.appendChild(videoLink);
}

// ===== ACCESIBILIDAD =====
function initializeAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isMenuOpen) {
                closeMobileMenu();
            }
            if (isFloatingMenuOpen) {
                closeFloatingMenu();
            }
        }
    });
    
    // Mejorar navegación por teclado
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Indicadores visuales de focus mejorados
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== OPTIMIZACIONES DE RENDIMIENTO ADICIONALES =====
function initializePerformanceOptimizations() {
    // Precargar recursos críticos
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            preloadCriticalResources();
        });
    } else {
        setTimeout(preloadCriticalResources, 2000);
    }
    
    // Optimizar imágenes de fondo
    const phoneImages = document.querySelectorAll('.phone__app-image, .hero__phone-video-fallback .hero__phone-app-image');
    phoneImages.forEach(img => {
        img.style.willChange = 'transform';
    });
    
    // Optimizar video hero
    if (heroVideoManager && heroVideoManager.video) {
        heroVideoManager.video.style.willChange = 'transform';
    }
    
    // Limpiar listeners en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });
}

function handleResize() {
    // Cerrar menú móvil si se cambia a desktop
    if (isMenuOpen && window.innerWidth > 1024) {
        closeMobileMenu();
    }
    
    // Cerrar menú flotante en resize
    if (isFloatingMenuOpen) {
        closeFloatingMenu();
    }
    
    // Redimensionar canvas de partículas
    particleSystems.forEach(system => {
        if (system.resizeCanvas) {
            system.resizeCanvas();
        }
    });
    
    // Reinicializar video hero si es necesario
    if (heroVideoManager && window.innerWidth <= 768) {
        // En móvil, asegurar que el video esté optimizado
        heroVideoManager.setupVideoAttributes();
    }
}

// ===== MANEJO DE VISIBILIDAD DE PÁGINA =====
function initializePageVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Página oculta - pausar video para ahorrar recursos
            if (heroVideoManager && heroVideoManager.isVideoPlaying()) {
                heroVideoManager.pause();
            }
        } else {
            // Página visible - reanudar video si no está en movimiento reducido
            if (heroVideoManager && !heroVideoManager.isVideoPlaying() && !isReducedMotion) {
                heroVideoManager.play();
            }
        }
    });
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar optimizador de imágenes
    imageOptimizer = new ImageOptimizer();
    
    // Inicializar video hero
    heroVideoManager = new HeroVideoManager();
    
    // Inicializar sistema de idiomas
    initializeLanguageSystem();
    
    // Inicializar funcionalidades principales
    initializeNavigation();
    initializeScrollEffects();
    initializeVideoPlayer();
    initializeFAQ();
    initializeAnimations();
    initializeIntersectionObserver();
    
    // Inicializar funcionalidades adicionales
    initializeParticleSystems();
    initializeLazyLoading();
    preloadCriticalResources();
    initializeAccessibility();
    initializeFloatingWidget();
    initializePageVisibilityHandling();
    
    // Configurar lazy loading para imágenes
    setupImageLazyLoading();
    
    // Detectar cambios en preferencias de movimiento
    checkReducedMotion();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addListener(checkReducedMotion);
    
    // Optimizaciones adicionales
    initializePerformanceOptimizations();
    
    console.log('StarFlex Landing Page inicializada con botón de idioma mejorado');
});

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
    
    // Si hay error con el video, mostrar fallback
    if (e.error && e.error.message && e.error.message.includes('video')) {
        if (heroVideoManager) {
            heroVideoManager.handleVideoError();
        }
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada:', e.reason);
});

// ===== LIMPIEZA AL SALIR =====
window.addEventListener('beforeunload', () => {
    // Limpiar sistemas de partículas
    particleSystems.forEach(system => system.destroy());
    particleSystems = [];
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Limpiar video hero
    if (heroVideoManager) {
        heroVideoManager.destroy();
    }
});

// ===== SOPORTE PARA PWA =====
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

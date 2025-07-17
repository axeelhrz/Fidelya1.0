// ===== MOBILE IMAGE FIX FOR PIXEL 6 PRO AND SIMILAR DEVICES =====

// Función para detectar si estamos en un dispositivo móvil problemático
const isMobileDevice = () => {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Función para forzar la carga de imágenes en móviles
const forceLoadMobileImages = () => {
    // Configuración de imágenes con fallbacks seguros
    const imageConfig = {
        logo: './assets/logo.webp',
        googlePlay: './assets/GooglePlay.png',
        appStore: './assets/AppleStore.png',
        phones: {
            schedule: './assets/phones/Schedule.webp',
            stations: './assets/phones/Stations.webp',
            calendar: './assets/phones/Calendar.webp',
            log: './assets/phones/Log.webp',
            notifications: './assets/phones/Notifications.webp',
            referrals: './assets/phones/Referrals.webp'
        }
    };

    // Función para cargar imagen con fallback
    const loadImageWithFallback = (element, imagePath, fallbackPath = null) => {
        if (!element || !imagePath) return;

        const img = new Image();
        img.onload = () => {
            if (element.tagName === 'IMG') {
                element.src = imagePath;
            } else {
                element.style.backgroundImage = `url('${imagePath}')`;
            }
            element.classList.add('loaded');
            element.style.opacity = '1';
        };
        
        img.onerror = () => {
            if (fallbackPath) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                    if (element.tagName === 'IMG') {
                        element.src = fallbackPath;
                    } else {
                        element.style.backgroundImage = `url('${fallbackPath}')`;
                    }
                    element.classList.add('loaded');
                    element.style.opacity = '1';
                };
                fallbackImg.src = fallbackPath;
            }
        };
        
        img.src = imagePath;
    };

    // Cargar logo en navegación
    const logoElements = document.querySelectorAll('.nav__logo, .nav__drawer-logo');
    logoElements.forEach(logo => {
        loadImageWithFallback(logo, imageConfig.logo);
    });

    // Cargar botones de descarga
    const googlePlayBtn = document.querySelector('.download-btn--google .download-btn__image');
    const appStoreBtn = document.querySelector('.download-btn--app-store .download-btn__image');
    
    if (googlePlayBtn) {
        // Forzar el uso de src en lugar de background-image para móviles
        googlePlayBtn.src = imageConfig.googlePlay;
        googlePlayBtn.style.backgroundImage = 'none';
        googlePlayBtn.style.opacity = '1';
    }
    
    if (appStoreBtn) {
        // Forzar el uso de src en lugar de background-image para móviles
        appStoreBtn.src = imageConfig.appStore;
        appStoreBtn.style.backgroundImage = 'none';
        appStoreBtn.style.opacity = '1';
    }

    // Cargar imágenes de características (phones)
    const phoneImages = document.querySelectorAll('.phone__app-image');
    const phoneImageKeys = ['schedule', 'stations', 'calendar', 'log', 'notifications', 'referrals'];
    
    phoneImages.forEach((img, index) => {
        const key = phoneImageKeys[index];
        if (key && imageConfig.phones[key]) {
            loadImageWithFallback(img, imageConfig.phones[key]);
        }
    });

    // Cargar imagen del hero phone
    const heroPhoneImage = document.querySelector('.hero__phone-app-image');
    if (heroPhoneImage) {
        loadImageWithFallback(heroPhoneImage, imageConfig.phones.schedule);
    }
};

// Función para aplicar estilos CSS específicos para móviles
const applyMobileImageStyles = () => {
    const style = document.createElement('style');
    style.id = 'mobile-image-fix';
    style.textContent = `
        /* Forzar visualización de imágenes en móviles */
        @media (max-width: 768px) {
            .download-btn__image {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: auto !important;
                height: 60px !important;
                max-width: 200px !important;
                object-fit: contain !important;
                object-position: center !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
            
            .nav__logo, .nav__drawer-logo {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 40px !important;
                height: 40px !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
            
            .phone__app-image {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                height: 100% !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
            
            .hero__phone-app-image {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                width: 100% !important;
                height: 100% !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
            
            /* Asegurar que las imágenes no se oculten por performance mode */
            .performance-mode .download-btn__image,
            .performance-mode .nav__logo,
            .performance-mode .nav__drawer-logo,
            .performance-mode .phone__app-image,
            .performance-mode .hero__phone-app-image {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        }
        
        /* Específico para dispositivos Android */
        @media (max-width: 768px) and (-webkit-min-device-pixel-ratio: 2) {
            .download-btn__image {
                image-rendering: -webkit-optimize-contrast !important;
                image-rendering: optimize-contrast !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// Función para reinicializar el sistema de imágenes
const reinitializeImageSystem = () => {
    // Deshabilitar el sistema de lazy loading en móviles para estas imágenes críticas
    const criticalImages = document.querySelectorAll('.download-btn__image, .nav__logo, .nav__drawer-logo');
    criticalImages.forEach(img => {
        img.loading = 'eager';
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.display = 'block';
    });
};

// Función principal de inicialización
const initMobileImageFix = () => {
    if (!isMobileDevice()) return;
    
    console.log('Aplicando fix de imágenes para móviles...');
    
    // Aplicar estilos CSS
    applyMobileImageStyles();
    
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                forceLoadMobileImages();
                reinitializeImageSystem();
            }, 100);
        });
    } else {
        setTimeout(() => {
            forceLoadMobileImages();
            reinitializeImageSystem();
        }, 100);
    }
    
    // Reintentar después de que el sistema principal se haya cargado
    setTimeout(() => {
        forceLoadMobileImages();
        reinitializeImageSystem();
    }, 1000);
    
    // Reintentar una vez más para asegurar la carga
    setTimeout(() => {
        forceLoadMobileImages();
        reinitializeImageSystem();
    }, 3000);
};

// Inicializar el fix
initMobileImageFix();

// Exportar funciones para uso externo si es necesario
window.mobileImageFix = {
    forceLoadMobileImages,
    reinitializeImageSystem,
    initMobileImageFix
};
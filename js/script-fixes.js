// ===== CORRECCIONES CRÍTICAS PARA PROBLEMAS DE CARGA =====

// Simplificar detección de dispositivo
let isMobile = window.innerWidth <= 1023;
let isMenuOpen = false;
let isFloatingMenuOpen = false;

// Función simplificada para inicializar la página
function initializeSimplified() {
    console.log('Inicializando versión simplificada...');
    
    // Inicializar navegación básica
    initializeBasicNavigation();
    
    // Inicializar FAQ básico
    initializeBasicFAQ();
    
    // Inicializar video básico
    initializeBasicVideo();
    
    // Inicializar botón flotante básico
    initializeBasicFloatingWidget();
    
    // Corregir imágenes rotas
    fixBrokenImages();
    
    console.log('Inicialización completada');
}

// Navegación básica y funcional
function initializeBasicNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenuBasic();
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenuBasic();
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (isMenuOpen) {
                closeMobileMenuBasic();
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = isMobile ? 70 : 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenuBasic();
        }
    });
}

function toggleMobileMenuBasic() {
    if (isMenuOpen) {
        closeMobileMenuBasic();
    } else {
        openMobileMenuBasic();
    }
}

function openMobileMenuBasic() {
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
}

function closeMobileMenuBasic() {
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
}

// FAQ básico y funcional
function initializeBasicFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
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
        }
    });
}

// Video básico y funcional
function initializeBasicVideo() {
    const video = document.getElementById('main-video');
    const playOverlay = document.getElementById('play-overlay');
    
    if (!video || !playOverlay) return;
    
    video.controls = false;
    video.preload = 'metadata';
    
    playOverlay.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playOverlay.classList.add('hidden');
        }
    });
    
    video.addEventListener('click', function() {
        if (!video.paused) {
            video.pause();
            playOverlay.classList.remove('hidden');
        }
    });
    
    video.addEventListener('ended', function() {
        playOverlay.classList.remove('hidden');
    });
    
    video.addEventListener('error', function() {
        console.warn('Error cargando video principal');
        playOverlay.innerHTML = '<div style="color: white; text-align: center;"><p>Error al cargar el video</p><p>Por favor, recarga la página</p></div>';
    });
}

// Botón flotante básico
function initializeBasicFloatingWidget() {
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    if (!floatingMainBtn || !floatingMenu) return;
    
    floatingMainBtn.addEventListener('click', function() {
        if (isFloatingMenuOpen) {
            isFloatingMenuOpen = false;
            floatingMainBtn.classList.remove('active');
            floatingMenu.classList.remove('active');
            floatingMainBtn.setAttribute('aria-expanded', 'false');
        } else {
            isFloatingMenuOpen = true;
            floatingMainBtn.classList.add('active');
            floatingMenu.classList.add('active');
            floatingMainBtn.setAttribute('aria-expanded', 'true');
        }
    });
    
    document.addEventListener('click', function(e) {
        const floatingWidget = document.getElementById('floating-widget');
        if (isFloatingMenuOpen && floatingWidget && !floatingWidget.contains(e.target)) {
            isFloatingMenuOpen = false;
            floatingMainBtn.classList.remove('active');
            floatingMenu.classList.remove('active');
            floatingMainBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Corregir imágenes rotas
function fixBrokenImages() {
    // Corregir logo
    const logo = document.querySelector('.nav__logo');
    if (logo) {
        logo.style.backgroundImage = 'url("./assets/logo.png")';
    }
    
    // Corregir botones de descarga
    const googleBtn = document.querySelector('.download-btn--google .download-btn__image');
    const appleBtn = document.querySelector('.download-btn--app-store .download-btn__image');
    
    if (googleBtn) {
        googleBtn.style.backgroundImage = 'url("./assets/GooglePlay.png")';
    }
    
    if (appleBtn) {
        appleBtn.style.backgroundImage = 'url("./assets/AppleStore.png")';
    }
    
    // Corregir imágenes de características
    const featureImages = [
        { selector: '.feature[data-feature="schedule"] .phone__app-image', image: './assets/phones/Horario.png' },
        { selector: '.feature[data-feature="stations"] .phone__app-image', image: './assets/phones/Estaciones.png' },
        { selector: '.feature[data-feature="calendar"] .phone__app-image', image: './assets/phones/Calendario.png' },
        { selector: '.feature[data-feature="log"] .phone__app-image', image: './assets/phones/Registro.png' },
        { selector: '.feature[data-feature="notifications"] .phone__app-image', image: './assets/phones/Notificaciones.png' },
        { selector: '.feature[data-feature="referrals"] .phone__app-image', image: './assets/phones/Referidos.png' }
    ];
    
    featureImages.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.style.backgroundImage = `url("${item.image}")`;
        }
    });
    
    // Corregir imagen del hero
    const heroImage = document.querySelector('.hero__phone-app-image');
    if (heroImage) {
        heroImage.style.backgroundImage = 'url("./assets/phones/Hero.png")';
    }
}

// Manejar errores de video del hero
function initializeHeroVideoFallback() {
    const heroVideo = document.getElementById('hero-video');
    const heroFallbackImage = document.querySelector('.hero__phone-app-image');
    const heroMobileVideo = document.getElementById('hero-mobile-video');
    
    // En móvil, usar siempre imagen estática
    if (isMobile && heroVideo && heroFallbackImage) {
        heroVideo.style.display = 'none';
        heroFallbackImage.style.display = 'block';
        heroFallbackImage.style.zIndex = '2';
        return;
    }
    
    if (heroVideo && heroFallbackImage) {
        heroVideo.addEventListener('error', function() {
            console.warn('Error cargando video del hero, usando imagen de fallback');
            heroVideo.style.display = 'none';
            heroFallbackImage.style.display = 'block';
            heroFallbackImage.style.zIndex = '2';
        });
        
        // Timeout para fallback
        setTimeout(function() {
            if (heroVideo.readyState < 2) {
                heroVideo.style.display = 'none';
                heroFallbackImage.style.display = 'block';
                heroFallbackImage.style.zIndex = '2';
            }
        }, 3000);
    }
    
    // Video móvil
    if (heroMobileVideo && isMobile) {
        heroMobileVideo.addEventListener('error', function() {
            console.warn('Error cargando video móvil del hero');
            const mobileVideoContainer = document.querySelector('.hero__mobile-video');
            if (mobileVideoContainer) {
                mobileVideoContainer.style.display = 'none';
            }
        });
    }
}

// Manejar resize de ventana
function handleResize() {
    const newIsMobile = window.innerWidth <= 1023;
    
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        
        // Cerrar menús abiertos
        if (isMenuOpen && !isMobile) {
            closeMobileMenuBasic();
        }
        
        if (isFloatingMenuOpen) {
            const floatingMainBtn = document.getElementById('floating-main-btn');
            const floatingMenu = document.getElementById('floating-menu');
            if (floatingMainBtn && floatingMenu) {
                isFloatingMenuOpen = false;
                floatingMainBtn.classList.remove('active');
                floatingMenu.classList.remove('active');
                floatingMainBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando correcciones...');
    
    // Inicializar versión simplificada
    initializeSimplified();
    
    // Inicializar fallback de video del hero
    initializeHeroVideoFallback();
    
    // Manejar resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 300);
    });
    
    console.log('Correcciones aplicadas exitosamente');
});

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.error);
    
    // Intentar recuperación automática para errores de video
    if (e.error && e.error.message && e.error.message.includes('video')) {
        const heroVideo = document.getElementById('hero-video');
        const heroImage = document.querySelector('.hero__phone-app-image');
        if (heroVideo && heroImage) {
            heroVideo.style.display = 'none';
            heroImage.style.display = 'block';
            heroImage.style.zIndex = '2';
        }
    }
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rechazada:', e.reason);
});

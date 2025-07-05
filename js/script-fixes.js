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

// Reemplazar las funciones originales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Guardar referencias a las funciones originales
    const originalOpenMobileMenu = window.openMobileMenu;
    const originalCloseMobileMenu = window.closeMobileMenu;
    
    // Reemplazar con nuestras versiones mejoradas
    window.openMobileMenu = openMobileMenu;
    window.closeMobileMenu = closeMobileMenu;
    
    console.log('Funciones de drawer móvil mejoradas aplicadas');
});

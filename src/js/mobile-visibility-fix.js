// ===== CORRECCIÓN DE VISIBILIDAD MÓVIL PARA FOOTER =====
(function() {
    'use strict';
    
    // Función para forzar visibilidad del footer en móvil
    function ensureFooterVisibility() {
        const footer = document.querySelector('.contact__footer');
        const footerContent = document.querySelector('.contact__footer-content');
        const footerText = document.querySelector('.contact__footer-text');
        const footerCta = document.querySelector('.contact__footer-cta');
        const footerBtn = document.querySelector('.btn--footer');
        
        if (footer) {
            // Forzar estilos de visibilidad
            footer.style.display = 'block';
            footer.style.visibility = 'visible';
            footer.style.opacity = '1';
            footer.style.transform = 'none';
            footer.style.animation = 'none';
            footer.style.position = 'relative';
            footer.style.zIndex = '10';
            
            // Asegurar padding mínimo
            if (window.innerWidth <= 1024) {
                footer.style.padding = '2rem 1rem';
                footer.style.marginTop = '1.5rem';
                footer.style.minHeight = '120px';
            }
        }
        
        if (footerContent) {
            footerContent.style.display = 'flex';
            footerContent.style.visibility = 'visible';
            footerContent.style.opacity = '1';
            footerContent.style.transform = 'none';
            footerContent.style.animation = 'none';
            
            if (window.innerWidth <= 1024) {
                footerContent.style.flexDirection = 'column';
                footerContent.style.gap = '1.5rem';
                footerContent.style.textAlign = 'center';
            }
        }
        
        if (footerText) {
            footerText.style.display = 'block';
            footerText.style.visibility = 'visible';
            footerText.style.opacity = '1';
            
            const h3 = footerText.querySelector('h3');
            const p = footerText.querySelector('p');
            
            if (h3) {
                h3.style.display = 'block';
                h3.style.visibility = 'visible';
                h3.style.opacity = '1';
            }
            
            if (p) {
                p.style.display = 'block';
                p.style.visibility = 'visible';
                p.style.opacity = '1';
            }
        }
        
        if (footerCta) {
            footerCta.style.display = 'block';
            footerCta.style.visibility = 'visible';
            footerCta.style.opacity = '1';
        }
        
        if (footerBtn) {
            footerBtn.style.display = 'flex';
            footerBtn.style.visibility = 'visible';
            footerBtn.style.opacity = '1';
            footerBtn.style.transform = 'none';
            footerBtn.style.animation = 'none';
            
            if (window.innerWidth <= 1024) {
                footerBtn.style.width = '100%';
                footerBtn.style.maxWidth = '280px';
                footerBtn.style.margin = '0 auto';
            }
        }
    }
    
    // Función para detectar si es dispositivo móvil
    function isMobileDevice() {
        return window.innerWidth <= 1024 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Aplicar correcciones si es móvil
    function applyMobileFixes() {
        if (isMobileDevice()) {
            ensureFooterVisibility();
            
            // Forzar visibilidad de todas las secciones principales
            const sections = document.querySelectorAll('.features, .videos, .faq, .contact');
            sections.forEach(section => {
                section.style.display = 'block';
                section.style.visibility = 'visible';
                section.style.opacity = '1';
            });
            
            // Forzar visibilidad de elementos del contacto
            const contactElements = document.querySelectorAll('.contact__header, .contact__grid, .contact__channel');
            contactElements.forEach(element => {
                element.style.display = element.classList.contains('contact__grid') ? 'grid' : 
                                       element.classList.contains('contact__channel') ? 'flex' : 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            });
        }
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMobileFixes);
    } else {
        applyMobileFixes();
    }
    
    // Ejecutar en resize para manejar cambios de orientación
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(applyMobileFixes, 250);
    });
    
    // Ejecutar después de que todas las animaciones hayan tenido tiempo de cargar
    setTimeout(applyMobileFixes, 2000);
    
    // Observer para detectar cambios en el DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                if (isMobileDevice()) {
                    setTimeout(ensureFooterVisibility, 100);
                }
            }
        });
    });
    
    // Observar cambios en el footer
    const footer = document.querySelector('.contact__footer');
    if (footer) {
        observer.observe(footer, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    // Limpiar observer cuando se cierre la página
    window.addEventListener('beforeunload', function() {
        observer.disconnect();
    });
    
})();

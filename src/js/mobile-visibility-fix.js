// ===== CORRECCIÓN DE VISIBILIDAD MÓVIL =====

// Función para forzar la visibilidad de todas las secciones en móvil
function forceVisibilityOnMobile() {
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
        // Seleccionar todas las secciones principales
        const sections = document.querySelectorAll('.features, .videos, .faq, .contact');
        
        sections.forEach(section => {
            // Forzar estilos de visibilidad
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
            section.style.position = 'relative';
            section.style.zIndex = '1';
            
            // Remover cualquier clase que pueda estar ocultando la sección
            section.classList.remove('hidden', 'invisible');
            
            // Asegurar que los contenedores internos también sean visibles
            const containers = section.querySelectorAll('.features__grid, .videos__main-container, .faq__container, .contact__grid');
            containers.forEach(container => {
                container.style.display = container.classList.contains('features__grid') || container.classList.contains('contact__grid') ? 'grid' : 'block';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
            });
            
            // Forzar visibilidad de elementos individuales
            const elements = section.querySelectorAll('.feature, .contact__channel, .faq__item, .videos__header, .videos__player-container');
            elements.forEach(element => {
                element.style.display = element.classList.contains('feature') || element.classList.contains('contact__channel') ? 'flex' : 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                element.style.transform = 'none';
                
                // Para elementos flex, asegurar la dirección correcta
                if (element.classList.contains('feature') || element.classList.contains('contact__channel')) {
                    element.style.flexDirection = 'column';
                    element.style.alignItems = 'center';
                    element.style.textAlign = 'center';
                }
            });
        });
        
        // Forzar visibilidad específica para características
        const features = document.querySelectorAll('.feature');
        features.forEach(feature => {
            const phone = feature.querySelector('.feature__phone');
            const content = feature.querySelector('.feature__content');
            
            if (phone) {
                phone.style.order = '1';
                phone.style.display = 'block';
                phone.style.visibility = 'visible';
                phone.style.opacity = '1';
                phone.style.width = 'clamp(200px, 60vw, 280px)';
                phone.style.height = 'clamp(400px, 120vw, 560px)';
                phone.style.margin = '0 auto var(--space-lg) auto';
            }
            
            if (content) {
                content.style.order = '2';
                content.style.display = 'block';
                content.style.visibility = 'visible';
                content.style.opacity = '1';
                content.style.padding = 'var(--space-lg)';
            }
        });
        
        // Asegurar que los elementos de la app del teléfono sean visibles
        const phoneImages = document.querySelectorAll('.phone__app-image');
        phoneImages.forEach(img => {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
        });
        
        // Forzar visibilidad de elementos de FAQ
        const faqItems = document.querySelectorAll('.faq__item');
        faqItems.forEach(item => {
            item.style.display = 'block';
            item.style.visibility = 'visible';
            item.style.opacity = '1';
            
            const question = item.querySelector('.faq__question');
            if (question) {
                question.style.display = 'flex';
                question.style.visibility = 'visible';
                question.style.opacity = '1';
                question.style.pointerEvents = 'auto';
                question.style.cursor = 'pointer';
            }
        });
        
        // Forzar visibilidad de elementos de contacto
        const contactChannels = document.querySelectorAll('.contact__channel');
        contactChannels.forEach(channel => {
            channel.style.display = 'flex';
            channel.style.flexDirection = 'column';
            channel.style.alignItems = 'center';
            channel.style.visibility = 'visible';
            channel.style.opacity = '1';
            
            const btn = channel.querySelector('.contact__channel-btn');
            if (btn) {
                btn.style.display = 'inline-flex';
                btn.style.visibility = 'visible';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                btn.style.cursor = 'pointer';
            }
        });
        
        // Asegurar que los headers de sección sean visibles
        const headers = document.querySelectorAll('.features__header, .videos__header, .faq__header, .contact__header');
        headers.forEach(header => {
            header.style.display = 'block';
            header.style.visibility = 'visible';
            header.style.opacity = '1';
            header.style.marginBottom = 'var(--space-4xl)';
            header.style.textAlign = 'center';
        });
        
        console.log('Visibilidad móvil forzada para todas las secciones');
    }
}

// Función para verificar y corregir la visibilidad
function checkAndFixVisibility() {
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
        const sections = ['features', 'videos', 'faq', 'contact'];
        
        for (let i = 0; i < sections.length; i++) {
            const sectionName = sections[i];
            const section = document.querySelector(`.${sectionName}`);
            if (section) {
                const computedStyle = window.getComputedStyle(section);
                const isHidden = computedStyle.display === 'none' || 
                               computedStyle.visibility === 'hidden' || 
                               computedStyle.opacity === '0';
                
                if (isHidden) {
                    console.warn(`Sección ${sectionName} estaba oculta en móvil, forzando visibilidad`);
                    forceVisibilityOnMobile();
                    break;
                }
            }
        }
    }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    forceVisibilityOnMobile();
    
    // Verificar después de un breve delay para asegurar que todos los estilos se han aplicado
    setTimeout(() => {
        checkAndFixVisibility();
    }, 500);
});

// Ejecutar en resize para manejar cambios de orientación
window.addEventListener('resize', () => {
    setTimeout(() => {
        forceVisibilityOnMobile();
        checkAndFixVisibility();
    }, 100);
});

// Ejecutar cuando se detecte que el dispositivo es móvil
if (window.innerWidth <= 1023) {
    // Aplicar inmediatamente si ya estamos en móvil
    forceVisibilityOnMobile();
}

// Observador de mutaciones para detectar cambios dinámicos que puedan ocultar secciones
const observer = new MutationObserver((mutations) => {
    const isMobile = window.innerWidth <= 1023;
    if (isMobile) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                const target = mutation.target;
                if (target.classList.contains('features') || 
                    target.classList.contains('videos') || 
                    target.classList.contains('faq') || 
                    target.classList.contains('contact')) {
                    
                    const computedStyle = window.getComputedStyle(target);
                    const isHidden = computedStyle.display === 'none' || 
                                   computedStyle.visibility === 'hidden' || 
                                   computedStyle.opacity === '0';
                    
                    if (isHidden) {
                        console.warn('Sección ocultada dinámicamente, restaurando visibilidad');
                        forceVisibilityOnMobile();
                    }
                }
            }
        });
    }
});

// Observar cambios en el body
observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['style', 'class']
});

// Exportar funciones para uso global
window.forceVisibilityOnMobile = forceVisibilityOnMobile;
window.checkAndFixVisibility = checkAndFixVisibility;

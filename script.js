// Registro de GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Variables globales
let isLoading = true;
let particles = [];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    // Simular carga
    simulateLoading();
    
    // Inicializar componentes después de la carga
    setTimeout(() => {
        initializeNavigation();
        initializeAnimations();
        initializeParticles();
        initializeScrollEffects();
        initializeForms();
        initializeInteractions();
        hideLoadingScreen();
    }, 2500);
}

// Simulación de carga
function simulateLoading() {
    const progressBar = document.querySelector('.loading-progress');
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(loadingInterval);
        }
        progressBar.style.width = progress + '%';
    }, 200);
}

// Ocultar pantalla de carga
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        isLoading = false;
        startHeroAnimations();
    }, 500);
}

// Navegación
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect en navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Toggle menu móvil
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        animateHamburger(navToggle);
    });
    
    // Smooth scroll y active links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetSection,
                        offsetY: 80
                    },
                    ease: "power2.inOut"
                });
                
                // Cerrar menu móvil
                navMenu.classList.remove('active');
                resetHamburger(navToggle);
                
                // Update active link
                updateActiveLink(link);
            }
        });
    });
}

// Animación del hamburger menu
function animateHamburger(toggle) {
    const spans = toggle.querySelectorAll('span');
    
    gsap.to(spans[0], {
        duration: 0.3,
        rotation: 45,
        y: 6,
        ease: "power2.inOut"
    });
    
    gsap.to(spans[1], {
        duration: 0.3,
        opacity: 0,
        ease: "power2.inOut"
    });
    
    gsap.to(spans[2], {
        duration: 0.3,
        rotation: -45,
        y: -6,
        ease: "power2.inOut"
    });
}

function resetHamburger(toggle) {
    const spans = toggle.querySelectorAll('span');
    
    gsap.to(spans, {
        duration: 0.3,
        rotation: 0,
        y: 0,
        opacity: 1,
        ease: "power2.inOut"
    });
}

// Actualizar link activo
function updateActiveLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Animaciones del Hero
function startHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCtas = document.querySelector('.hero-ctas');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    // Timeline principal del hero
    const heroTl = gsap.timeline();
    
    heroTl
        .from('.title-line', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: "power3.out"
        })
        .from(heroSubtitle, {
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.3")
        .from(heroCtas.children, {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.2")
        .from(scrollIndicator, {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.3");
}

// Sistema de partículas
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    animateParticles();
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        pointer-events: none;
    `;
    
    // Posición inicial aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    container.appendChild(particle);
    particles.push(particle);
    
    // Animación individual de la partícula
    gsap.to(particle, {
        duration: Math.random() * 20 + 10,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        repeat: -1,
        yoyo: true,
        ease: "none"
    });
}

function animateParticles() {
    particles.forEach(particle => {
        gsap.to(particle, {
            duration: Math.random() * 3 + 2,
            opacity: Math.random() * 0.5 + 0.2,
            scale: Math.random() * 0.5 + 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    });
}

// Efectos de scroll
function initializeScrollEffects() {
    // Animaciones generales de scroll
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: "power2.out"
        });
    });
    
    // Animaciones específicas por sección
    initializeWhatIsAnimations();
    initializeBenefitsAnimations();
    initializeStepsAnimations();
    initializeRoadmapAnimations();
    initializeMVPAnimations();
}

// Animaciones de la sección "Qué es"
function initializeWhatIsAnimations() {
    const locker3D = document.querySelector('.locker-3d');
    const floatingIcons = document.querySelectorAll('.floating-icon');
    const featureItems = document.querySelectorAll('.feature-item');
    
    // Animación del locker 3D
    gsap.from('.locker-model', {
        scrollTrigger: {
            trigger: locker3D,
            start: "top 70%",
            end: "bottom 30%"
        },
        duration: 1.5,
        scale: 0.5,
        rotation: -180,
        opacity: 0,
        ease: "back.out(1.7)"
    });
    
    // Animación de iconos flotantes
    floatingIcons.forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: locker3D,
                start: "top 60%"
            },
            duration: 1,
            scale: 0,
            rotation: 180,
            opacity: 0,
            delay: index * 0.2,
            ease: "back.out(2)"
        });
    });
    
    // Animación de características
    featureItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%"
            },
            duration: 0.8,
            x: -50,
            opacity: 0,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });
}

// Animaciones de beneficios
function initializeBenefitsAnimations() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    benefitCards.forEach((card, index) => {
        // Animación de entrada
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%"
            },
            duration: 1,
            y: 100,
            opacity: 0,
            delay: index * 0.2,
            ease: "power3.out"
        });
        
        // Animación de estadísticas
        const stats = card.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            stat.textContent = '0';
            
            gsap.to(stat, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 60%"
                },
                duration: 2,
                textContent: finalValue,
                ease: "power2.out",
                snap: { textContent: 1 },
                delay: 0.5
            });
        });
        
        // Hover effects avanzados
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                y: -12,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(14, 77, 146, 0.15)",
                ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.card-icon'), {
                duration: 0.3,
                rotation: 5,
                scale: 1.1,
                ease: "back.out(2)"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                y: 0,
                scale: 1,
                boxShadow: "0 4px 16px rgba(14, 77, 146, 0.12)",
                ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.card-icon'), {
                duration: 0.3,
                rotation: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// Animaciones de pasos
function initializeStepsAnimations() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        const isEven = index % 2 === 1;
        
        // Animación del contenido
        gsap.from(step.querySelector('.step-content'), {
            scrollTrigger: {
                trigger: step,
                start: "top 70%"
            },
            duration: 1,
            x: isEven ? 100 : -100,
            opacity: 0,
            ease: "power2.out"
        });
        
        // Animación de la ilustración
        gsap.from(step.querySelector('.step-illustration'), {
            scrollTrigger: {
                trigger: step,
                start: "top 70%"
            },
            duration: 1,
            x: isEven ? -100 : 100,
            opacity: 0,
            delay: 0.2,
            ease: "power2.out"
        });
        
        // Animación del número
        gsap.from(step.querySelector('.step-number'), {
            scrollTrigger: {
                trigger: step,
                start: "top 70%"
            },
            duration: 1.5,
            scale: 0,
            rotation: 180,
            opacity: 0,
            delay: 0.4,
            ease: "back.out(2)"
        });
    });
}

// ... existing code ...

// Animaciones del roadmap
function initializeRoadmapAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Animación de la línea de tiempo
    gsap.from('.timeline::before', {
        scrollTrigger: {
            trigger: '.timeline',
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1
        },
        scaleY: 0,
        transformOrigin: "top center"
    });
    
    timelineItems.forEach((item, index) => {
        const marker = item.querySelector('.timeline-marker');
        const content = item.querySelector('.timeline-content');
        const isEven = index % 2 === 1;
        
        // Animación del marcador
        gsap.from(marker, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%"
            },
            duration: 1,
            scale: 0,
            rotation: 180,
            opacity: 0,
            ease: "back.out(2)"
        });
        
        // Animación del contenido
        gsap.from(content, {
            scrollTrigger: {
                trigger: item,
                start: "top 80%"
            },
            duration: 1,
            x: isEven ? 100 : -100,
            opacity: 0,
            delay: 0.3,
            ease: "power2.out"
        });
        
        // Efectos especiales para items actuales
        if (item.classList.contains('current')) {
            gsap.to(marker, {
                duration: 2,
                boxShadow: "0 0 30px rgba(255, 209, 102, 0.6)",
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        }
    });
}

// Animaciones del MVP
function initializeMVPAnimations() {
    const mvpFeatures = document.querySelectorAll('.mvp-feature');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Animación de características
    mvpFeatures.forEach((feature, index) => {
        gsap.from(feature, {
            scrollTrigger: {
                trigger: feature,
                start: "top 80%"
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: index * 0.1,
            ease: "power2.out"
        });
        
        // Hover effect
        feature.addEventListener('mouseenter', () => {
            gsap.to(feature, {
                duration: 0.3,
                scale: 1.05,
                backgroundColor: "rgba(14, 77, 146, 0.05)",
                ease: "power2.out"
            });
        });
        
        feature.addEventListener('mouseleave', () => {
            gsap.to(feature, {
                duration: 0.3,
                scale: 1,
                backgroundColor: "var(--background)",
                ease: "power2.out"
            });
        });
    });
    
    // Animación del formulario
    gsap.from('.mvp-form-container', {
        scrollTrigger: {
            trigger: '.mvp-form-container',
            start: "top 80%"
        },
        duration: 1,
        x: 100,
        opacity: 0,
        ease: "power2.out"
    });
    
    formGroups.forEach((group, index) => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: '.mvp-form',
                start: "top 70%"
            },
            duration: 0.6,
            y: 30,
            opacity: 0,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });
}

// Inicializar formularios
function initializeForms() {
    const mvpForm = document.getElementById('mvpForm');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    // Efectos de focus en inputs
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement, {
                duration: 0.3,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input.parentElement, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
        
        // Animación de escritura
        input.addEventListener('input', () => {
            if (input.value.length === 1) {
                gsap.from(input, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: "back.out(2)"
                });
            }
        });
    });
    
    // Manejo del envío del formulario
    mvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(mvpForm);
    });
}

// Manejo del envío del formulario
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    // Animación de carga
    gsap.to(submitBtn, {
        duration: 0.3,
        scale: 0.95,
        ease: "power2.out"
    });
    
    gsap.to(btnText, {
        duration: 0.3,
        opacity: 0,
        x: -20,
        ease: "power2.out"
    });
    
    gsap.to(btnIcon, {
        duration: 0.3,
        rotation: 180,
        scale: 1.2,
        ease: "power2.out"
    });
    
    // Simular envío
    setTimeout(() => {
        showSuccessMessage();
        resetForm(form);
    }, 2000);
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #00BFA6 0%, #0E4D92 100%);
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 191, 166, 0.3);
            z-index: 10000;
            text-align: center;
            backdrop-filter: blur(20px);
        ">
            <i class="ph ph-check-circle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <h3 style="margin-bottom: 0.5rem; font-family: var(--font-primary);">¡Solicitud enviada!</h3>
            <p style="margin: 0; opacity: 0.9;">Te contactaremos pronto para ser parte del MVP.</p>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Animación de entrada
    gsap.from(successMessage.firstElementChild, {
        duration: 0.8,
        scale: 0,
        rotation: 180,
        opacity: 0,
        ease: "back.out(2)"
    });
    
    // Remover después de 3 segundos
    setTimeout(() => {
        gsap.to(successMessage.firstElementChild, {
            duration: 0.5,
            scale: 0,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                document.body.removeChild(successMessage);
            }
        });
    }, 3000);
}

// Resetear formulario
function resetForm(form) {
    const submitBtn = form.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    // Resetear botón
    gsap.to(submitBtn, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out"
    });
    
    gsap.to(btnText, {
        duration: 0.3,
        opacity: 1,
        x: 0,
        ease: "power2.out"
    });
    
    gsap.to(btnIcon, {
        duration: 0.3,
        rotation: 0,
        scale: 1,
        ease: "power2.out"
    });
    
    // Limpiar campos
    form.reset();
}

// Inicializar interacciones
function initializeInteractions() {
    initializeButtonEffects();
    initializeHoverEffects();
    initializeScrollIndicator();
    initializeCTAButtons();
}

// Efectos de botones
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        // Efecto de ripple
        button.addEventListener('click', (e) => {
            createRippleEffect(e, button);
        });
        
        // Hover effects
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                duration: 0.3,
                scale: 1.05,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// Crear efecto ripple
function createRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    gsap.to(ripple, {
        duration: 0.6,
        scale: 2,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => {
            ripple.remove();
        }
    });
}

// Efectos hover generales
function initializeHoverEffects() {
    // Cards hover
    const cards = document.querySelectorAll('.benefit-card, .feature-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.4,
                y: -8,
                boxShadow: "0 20px 40px rgba(14, 77, 146, 0.15)",
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.4,
                y: 0,
                boxShadow: "0 4px 16px rgba(14, 77, 146, 0.12)",
                ease: "power2.out"
            });
        });
    });
    
    // Social links hover
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                duration: 0.3,
                scale: 1.1,
                rotation: 5,
                ease: "back.out(2)"
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                duration: 0.3,
                scale: 1,
                rotation: 0,
                ease: "power2.out"
            });
        });
    });
}

// Indicador de scroll
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: "#que-es",
                    offsetY: 80
                },
                ease: "power2.inOut"
            });
        });
        
        // Ocultar cuando se hace scroll
        ScrollTrigger.create({
            trigger: "#que-es",
            start: "top 80%",
            onEnter: () => {
                gsap.to(scrollIndicator, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(scrollIndicator, {
                    duration: 0.5,
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                });
            }
        });
    }
}

// CTAs principales
function initializeCTAButtons() {
    const downloadBtn = document.getElementById('downloadBtn');
    const waitlistBtn = document.getElementById('waitlistBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Simular descarga
            showDownloadAnimation();
        });
    }
    
    if (waitlistBtn) {
        waitlistBtn.addEventListener('click', () => {
            // Scroll al formulario
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: ".mvp-section",
                    offsetY: 80
                },
                ease: "power2.inOut"
            });
        });
    }
}

// Animación de descarga
function showDownloadAnimation() {
    const downloadNotification = document.createElement('div');
    downloadNotification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00BFA6 0%, #0E4D92 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 191, 166, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        ">
            <i class="ph ph-download-simple" style="font-size: 1.2rem;"></i>
            <span>Descargando presentación...</span>
        </div>
    `;
    
    document.body.appendChild(downloadNotification);
    
    // Animación de entrada
    gsap.from(downloadNotification.firstElementChild, {
        duration: 0.5,
        x: 100,
        opacity: 0,
        ease: "power2.out"
    });
    
    // Simular progreso de descarga
    setTimeout(() => {
        const text = downloadNotification.querySelector('span');
        text.textContent = '¡Descarga completada!';
        
        const icon = downloadNotification.querySelector('i');
        icon.className = 'ph ph-check-circle';
        
        gsap.to(downloadNotification.firstElementChild, {
            duration: 0.3,
            scale: 1.05,
            ease: "back.out(2)"
        });
    }, 2000);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        gsap.to(downloadNotification.firstElementChild, {
            duration: 0.5,
            x: 100,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                document.body.removeChild(downloadNotification);
            }
        });
    }, 4000);
}

// Parallax effects
function initializeParallax() {
    // Parallax en hero
    gsap.to('.hero-video', {
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: -100,
        ease: "none"
    });
    
    // Parallax en floating icons
    document.querySelectorAll('.floating-icon').forEach((icon, index) => {
        gsap.to(icon, {
            scrollTrigger: {
                trigger: '.what-is',
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -50 * (index + 1),
            rotation: 360,
            ease: "none"
        });
    });
}

// Inicializar parallax después de que todo esté cargado
window.addEventListener('load', () => {
    initializeParallax();
});

// Optimización de rendimiento
function optimizePerformance() {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
    
    // Throttle scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        // Actualizar efectos basados en scroll
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Inicializar optimizaciones
optimizePerformance();

// Manejo de errores
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

// Manejo de resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Preloader para recursos críticos
function preloadCriticalResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:ital@1&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Inicializar preload
preloadCriticalResources();

// Accessibility improvements
function initializeAccessibility() {
    // Focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            gsap.to(element, {
                duration: 0.2,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        element.addEventListener('blur', () => {
            gsap.to(element, {
                duration: 0.2,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Cerrar modales o menús abiertos
            const navMenu = document.getElementById('navMenu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                resetHamburger(document.getElementById('navToggle'));
            }
        }
    });
}

// Inicializar accessibility
initializeAccessibility();

// Smooth scroll polyfill para navegadores antiguos
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Implementar tracking de analytics aquí
    console.log('Event tracked:', eventName, properties);
}

// Track important interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary, .btn-secondary')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            section: e.target.closest('section')?.id || 'unknown'
        });
    }
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
            console.log(`${entry.name}: ${entry.duration}ms`);
        }
    }
});

perfObserver.observe({ entryTypes: ['measure'] });

// Mark critical performance points
performance.mark('app-start');
window.addEventListener('load', () => {
    performance.mark('app-loaded');
    performance.measure('app-load-time', 'app-start', 'app-loaded');
});


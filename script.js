// Registro de GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Variables globales
let isLoading = true;
let particles = [];
let animationFrameId = null;
let scrollTimeout = null;
let resizeTimeout = null;

// Cache de elementos DOM
const domCache = {
    loadingScreen: null,
    navbar: null,
    navMenu: null,
    navToggle: null,
    heroElements: {},
    forms: {},
    buttons: {}
};

// Configuración de performance
const PERFORMANCE_CONFIG = {
    particleCount: window.innerWidth < 768 ? 15 : 30,
    animationDuration: {
        fast: 0.2,
        normal: 0.3,
        slow: 0.5
    },
    debounceDelay: 16, // ~60fps
    loadingTimeout: 3000
};

// Utilidades de performance
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Cache DOM elements
    cacheDOM() {
        domCache.loadingScreen = document.getElementById('loadingScreen');
        domCache.navbar = document.getElementById('navbar');
        domCache.navMenu = document.getElementById('navMenu');
        domCache.navToggle = document.getElementById('navToggle');
        domCache.heroElements = {
            title: document.querySelector('.hero-title'),
            subtitle: document.querySelector('.hero-subtitle'),
            ctas: document.querySelector('.hero-ctas'),
            scrollIndicator: document.querySelector('.hero-scroll-indicator'),
            particles: document.getElementById('particles')
        };
        domCache.forms = {
            mvp: document.getElementById('mvpForm')
        };
        domCache.buttons = {
            download: document.getElementById('downloadBtn'),
            waitlist: document.getElementById('waitlistBtn')
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 + threshold) &&
            rect.bottom >= -windowHeight * threshold &&
            rect.left <= windowWidth * (1 + threshold) &&
            rect.right >= -windowWidth * threshold
        );
    },

    // Preload critical resources
    preloadResources() {
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:ital@1&display=swap'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            link.onload = () => console.log(`Preloaded: ${resource}`);
            document.head.appendChild(link);
        });
    },

    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    Utils.measurePerformance('App Initialization', () => {
        Utils.cacheDOM();
        Utils.preloadResources();
        initializeApp();
    });
});

// Función principal de inicialización optimizada
function initializeApp() {
    // Verificar disponibilidad de GSAP
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    
    if (!hasGSAP) {
        console.warn('GSAP no disponible, usando fallbacks optimizados');
    }

    // Iniciar carga simulada
    simulateLoading();
    
    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
        if (isLoading) {
            console.warn('Timeout de carga alcanzado, forzando inicialización');
            forceInitialization();
        }
    }, PERFORMANCE_CONFIG.loadingTimeout);

    // Inicialización progresiva
    const initPromises = [
        initializeNavigation(),
        initializeForms(),
        initializeInteractions()
    ];

    Promise.allSettled(initPromises).then(() => {
        clearTimeout(safetyTimeout);
        
        if (hasGSAP && hasScrollTrigger) {
            initializeAdvancedFeatures();
        } else {
            initializeBasicFeatures();
        }
        
        hideLoadingScreen();
    });
}

// Simulación de carga optimizada
function simulateLoading() {
    const progressBar = document.querySelector('.loading-progress');
    if (!progressBar) {
        hideLoadingScreen();
        return;
    }
    
    let progress = 0;
    const targetProgress = 100;
    const duration = 1500; // 1.5 segundos
    const startTime = performance.now();
    
    function updateProgress(currentTime) {
        const elapsed = currentTime - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        // Easing function para suavizar la animación
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
        progress = easedProgress * targetProgress;
        
        progressBar.style.width = progress + '%';
        
        if (progress < targetProgress) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

// Ocultar pantalla de carga optimizada
function hideLoadingScreen() {
    const loadingScreen = domCache.loadingScreen;
    if (!loadingScreen) return;
    
    // Asegurar progreso completo
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    // Animación de salida optimizada
    loadingScreen.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
    loadingScreen.classList.add('hidden');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        isLoading = false;
        document.body.classList.add('loaded');
        startHeroAnimations();
    }, 500);
}

// Forzar inicialización en caso de timeout
function forceInitialization() {
    hideLoadingScreen();
    initializeBasicFeatures();
}

// Navegación optimizada
function initializeNavigation() {
    return new Promise((resolve) => {
        const navbar = domCache.navbar;
        const navToggle = domCache.navToggle;
        const navMenu = domCache.navMenu;
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!navbar || !navToggle || !navMenu) {
            resolve();
            return;
        }

        // Scroll effect optimizado con throttle
        const handleScroll = Utils.throttle(() => {
            const scrollY = window.pageYOffset;
            navbar.classList.toggle('scrolled', scrollY > 100);
        }, PERFORMANCE_CONFIG.debounceDelay);

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Toggle menu móvil
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            
            if (typeof gsap !== 'undefined') {
                animateHamburger(navToggle, !isActive);
            } else {
                toggleHamburgerBasic(navToggle, !isActive);
            }
        });

        // Smooth scroll optimizado
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    smoothScrollTo(targetSection);
                    navMenu.classList.remove('active');
                    
                    if (typeof gsap !== 'undefined') {
                        animateHamburger(navToggle, false);
                    } else {
                        toggleHamburgerBasic(navToggle, false);
                    }
                    
                    updateActiveLink(link);
                }
            });
        });

        resolve();
    });
}

// Smooth scroll optimizado
function smoothScrollTo(target) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: targetPosition },
            ease: "power2.inOut"
        });
    } else {
        // Fallback nativo optimizado
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function
            const ease = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
}

// Animación hamburger con GSAP
function animateHamburger(toggle, isOpen) {
    const spans = toggle.querySelectorAll('span');
    
    if (isOpen) {
        gsap.to(spans[0], { duration: 0.2, rotation: 45, y: 6, ease: "power2.inOut" });
        gsap.to(spans[1], { duration: 0.2, opacity: 0, ease: "power2.inOut" });
        gsap.to(spans[2], { duration: 0.2, rotation: -45, y: -6, ease: "power2.inOut" });
    } else {
        gsap.to(spans, { duration: 0.2, rotation: 0, y: 0, opacity: 1, ease: "power2.inOut" });
    }
}

// Hamburger básico sin GSAP
function toggleHamburgerBasic(toggle, isOpen) {
    const spans = toggle.querySelectorAll('span');
    
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translateY(6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-6px)';
    } else {
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
}

// Actualizar link activo
function updateActiveLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Animaciones del Hero optimizadas
function startHeroAnimations() {
    const heroElements = domCache.heroElements;
    
    if (typeof gsap !== 'undefined') {
        startAdvancedHeroAnimations(heroElements);
    } else {
        startBasicHeroAnimations(heroElements);
    }
}

// Hero animations con GSAP
function startAdvancedHeroAnimations(elements) {
    const tl = gsap.timeline();
    
    tl.from('.title-line', {
        duration: 0.8,
        y: 60,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
    })
    .from(elements.subtitle, {
        duration: 0.6,
        y: 30,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.3")
    .from(elements.ctas?.children || [], {
        duration: 0.4,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.2")
    .from(elements.scrollIndicator, {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.2");
}

// Hero animations básicas
function startBasicHeroAnimations(elements) {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    setTimeout(() => {
        if (elements.subtitle) {
            elements.subtitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            elements.subtitle.style.opacity = '1';
            elements.subtitle.style.transform = 'translateY(0)';
        }
    }, 500);
    
    setTimeout(() => {
        if (elements.ctas) {
            elements.ctas.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            elements.ctas.style.opacity = '1';
            elements.ctas.style.transform = 'translateY(0)';
        }
    }, 700);
    
    setTimeout(() => {
        if (elements.scrollIndicator) {
            elements.scrollIndicator.style.transition = 'opacity 0.6s ease';
            elements.scrollIndicator.style.opacity = '1';
        }
    }, 900);
}

// Características avanzadas con GSAP
function initializeAdvancedFeatures() {
    initializeParticles();
    initializeScrollEffects();
    initializeAdvancedAnimations();
    initializeParallax();
}

// Características básicas sin GSAP
function initializeBasicFeatures() {
    initializeBasicScrollEffects();
    initializeBasicAnimations();
}

// Sistema de partículas optimizado
function initializeParticles() {
    const particlesContainer = domCache.heroElements.particles;
    if (!particlesContainer || typeof gsap === 'undefined') return;
    
    const particleCount = PERFORMANCE_CONFIG.particleCount;
    
    // Crear partículas con object pooling
    for (let i = 0; i < particleCount; i++) {
        createOptimizedParticle(particlesContainer, i);
    }
}

function createOptimizedParticle(container, index) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        pointer-events: none;
        will-change: transform, opacity;
    `;
    
    // Posición inicial
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    container.appendChild(particle);
    particles.push(particle);
    
    // Animación optimizada
    gsap.set(particle, { 
        x: 0, 
        y: 0, 
        rotation: 0,
        scale: 1,
        opacity: Math.random() * 0.5 + 0.2
    });
    
    gsap.to(particle, {
        duration: Math.random() * 15 + 10,
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150,
        rotation: Math.random() * 360,
        repeat: -1,
        yoyo: true,
        ease: "none",
        delay: index * 0.1
    });
    
    gsap.to(particle, {
        duration: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        scale: Math.random() * 0.3 + 0.7,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: Math.random() * 2
    });
}

// Efectos de scroll optimizados con GSAP
function initializeScrollEffects() {
    if (typeof ScrollTrigger === 'undefined') return;
    
    // Configuración global de ScrollTrigger
    ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true
    });
    
    // Animaciones generales optimizadas
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse",
                once: true // Ejecutar solo una vez para mejor performance
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        });
    });
    
    // Animaciones específicas por sección
    initializeSectionAnimations();
}

// Animaciones de secciones optimizadas
function initializeSectionAnimations() {
    // What is section
    const whatIsSection = document.querySelector('.what-is');
    if (whatIsSection) {
        ScrollTrigger.create({
            trigger: whatIsSection,
            start: "top 70%",
            onEnter: () => animateWhatIsSection(),
            once: true
        });
    }
    
    // Benefits section
    const benefitsSection = document.querySelector('.benefits');
    if (benefitsSection) {
        ScrollTrigger.create({
            trigger: benefitsSection,
            start: "top 70%",
            onEnter: () => animateBenefitsSection(),
            once: true
        });
    }
    
    // Steps section
    const stepsSection = document.querySelector('.how-it-works');
    if (stepsSection) {
        ScrollTrigger.create({
            trigger: stepsSection,
            start: "top 70%",
            onEnter: () => animateStepsSection(),
            once: true
        });
    }
    
    // Roadmap section
    const roadmapSection = document.querySelector('.roadmap');
    if (roadmapSection) {
        ScrollTrigger.create({
            trigger: roadmapSection,
            start: "top 70%",
            onEnter: () => animateRoadmapSection(),
            once: true
        });
    }
}

// Animaciones específicas optimizadas
function animateWhatIsSection() {
    const tl = gsap.timeline();
    
    tl.from('.locker-3d', {
        duration: 1,
        scale: 0.5,
        rotation: -90,
        opacity: 0,
        ease: "back.out(1.7)"
    })
    .from('.floating-icon', {
        duration: 0.6,
        scale: 0,
        rotation: 180,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(2)"
    }, "-=0.5")
    .from('.feature-item', {
        duration: 0.5,
        x: -30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.3");
}

function animateBenefitsSection() {
    const cards = document.querySelectorAll('.benefit-card');
    
    gsap.from(cards, {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
    });
    
    // Animar estadísticas
    cards.forEach(card => {
        const stats = card.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            if (!isNaN(finalValue)) {
                gsap.from({ value: 0 }, {
                    duration: 1.5,
                    value: finalValue,
                    ease: "power2.out",
                    delay: 0.5,
                    onUpdate: function() {
                        stat.textContent = Math.round(this.targets()[0].value) + (stat.textContent.includes('%') ? '%' : '');
                    }
                });
            }
        });
    });
}

function animateStepsSection() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        const isEven = index % 2 === 1;
        
        gsap.from(step.querySelector('.step-content'), {
            duration: 0.8,
            x: isEven ? 50 : -50,
            opacity: 0,
            delay: index * 0.2,
            ease: "power2.out"
        });
        
        gsap.from(step.querySelector('.step-illustration'), {
            duration: 0.8,
            x: isEven ? -50 : 50,
            opacity: 0,
            delay: index * 0.2 + 0.1,
            ease: "power2.out"
        });
    });
}

function animateRoadmapSection() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Animar línea de tiempo
    gsap.from('.timeline::before', {
        duration: 1.5,
        scaleY: 0,
        transformOrigin: "top center",
        ease: "power2.out"
    });
    
    // Animar items
    timelineItems.forEach((item, index) => {
        gsap.from(item.querySelector('.timeline-marker'), {
            duration: 0.6,
            scale: 0,
            rotation: 180,
            opacity: 0,
            delay: index * 0.2,
            ease: "back.out(2)"
        });
        
        gsap.from(item.querySelector('.timeline-content'), {
            duration: 0.8,
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            delay: index * 0.2 + 0.2,
            ease: "power2.out"
        });
    });
}

// Efectos de scroll básicos optimizados
function initializeBasicScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar para mejor performance
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elementsToAnimate = document.querySelectorAll(
        '.fade-in, .benefit-card, .step, .timeline-item, .feature-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animaciones básicas sin GSAP
function initializeBasicAnimations() {
    // Hover effects básicos
    const cards = document.querySelectorAll('.benefit-card, .feature-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 10px 30px rgba(14, 77, 146, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 16px rgba(14, 77, 146, 0.12)';
        });
    });
}

// Parallax optimizado
function initializeParallax() {
    if (typeof gsap === 'undefined') return;
    
    // Parallax del hero
    gsap.to('.hero-video', {
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: -50,
        ease: "none"
    });
    
    // Parallax de iconos flotantes
    gsap.utils.toArray('.floating-icon').forEach((icon, index) => {
        gsap.to(icon, {
            scrollTrigger: {
                trigger: '.what-is',
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -30 * (index + 1),
            rotation: 180,
            ease: "none"
        });
    });
}

// Formularios optimizados
function initializeForms() {
    return new Promise((resolve) => {
        const mvpForm = domCache.forms.mvp;
        if (!mvpForm) {
            resolve();
            return;
        }
        
        const formInputs = mvpForm.querySelectorAll('input, textarea');
        
        // Efectos de focus optimizados
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.01)';
                input.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
            });
            
            // Validación en tiempo real
            input.addEventListener('input', Utils.debounce(() => {
                validateField(input);
            }, 300));
        });
        
        // Manejo del envío
        mvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleOptimizedFormSubmission(mvpForm);
        });
        
        resolve();
    });
}

// Validación de campos optimizada
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    
    // Validaciones básicas
    if (field.required && !value) {
        isValid = false;
    } else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Feedback visual
    field.parentElement.classList.toggle('error', !isValid);
    field.parentElement.classList.toggle('valid', isValid && value);
    
    return isValid;
}

// Envío de formulario optimizado
function handleOptimizedFormSubmission(form) {
    const submitBtn = form.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    // Validar todos los campos
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showFormError('Por favor, completa todos los campos requeridos correctamente.');
        return;
    }
    
    // Estado de carga
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    btnIcon.className = 'ph ph-spinner';
    
    if (typeof gsap !== 'undefined') {
        gsap.to(btnIcon, {
            duration: 0.5,
            rotation: 360,
            repeat: -1,
            ease: "none"
        });
    }
    
    // Simular envío
    setTimeout(() => {
        showSuccessMessage();
        resetForm(form);
    }, 2000);
}

// Mostrar error del formulario
function showFormError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: rgba(231, 76, 60, 0.1);
        border-radius: 8px;
        border-left: 3px solid #e74c3c;
    `;
    
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const form = domCache.forms.mvp;
    form.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Mostrar mensaje de éxito optimizado
function showSuccessMessage() {
    const notification = createNotification({
        type: 'success',
        title: '¡Solicitud enviada!',
        message: 'Te contactaremos pronto para ser parte del MVP.',
        duration: 4000
    });
    
    document.body.appendChild(notification);
}

// Sistema de notificaciones optimizado
function createNotification({ type = 'info', title, message, duration = 3000 }) {
    const notification = document.createElement('div');
    const colors = {
        success: { bg: '#00BFA6', icon: 'ph-check-circle' },
        error: { bg: '#e74c3c', icon: 'ph-x-circle' },
        info: { bg: '#0E4D92', icon: 'ph-info' }
    };
    
    const config = colors[type];
    
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${config.bg};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        ">
            <i class="ph ${config.icon}" style="font-size: 1.25rem;"></i>
            <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    // Animación de entrada
    setTimeout(() => {
        notification.firstElementChild.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove
    setTimeout(() => {
        notification.firstElementChild.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    return notification;
}

// Resetear formulario optimizado
function resetForm(form) {
    const submitBtn = form.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    // Resetear botón
    submitBtn.disabled = false;
    btnText.textContent = 'Enviar solicitud';
    btnIcon.className = 'ph ph-arrow-right';
    
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(btnIcon);
        gsap.set(btnIcon, { rotation: 0 });
    }
    
    // Limpiar campos y estados
    form.reset();
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'valid');
    });
    
    // Remover errores
    const errorDiv = form.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Interacciones optimizadas
function initializeInteractions() {
    return new Promise((resolve) => {
        initializeButtonEffects();
        initializeCTAButtons();
        initializeScrollIndicator();
        initializeHoverEffects();
        resolve();
    });
}

// Efectos de botones optimizados
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        // Ripple effect optimizado
        button.addEventListener('click', (e) => {
            createOptimizedRipple(e, button);
        });
        
        // Hover effects
        button.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1.02,
                    ease: "power2.out"
                });
            } else {
                button.style.transform = 'scale(1.02) translateY(-1px)';
                button.style.transition = 'transform 0.2s ease';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1,
                    ease: "power2.out"
                });
            } else {
                button.style.transform = 'scale(1) translateY(0)';
            }
        });
    });
}

// Efecto ripple optimizado
function createOptimizedRipple(e, button) {
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
        will-change: transform, opacity;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(ripple, {
            duration: 0.4,
            scale: 2,
            opacity: 0,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    } else {
        ripple.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
        setTimeout(() => ripple.remove(), 400);
    }
}

// CTAs principales optimizados
function initializeCTAButtons() {
    const downloadBtn = domCache.buttons.download;
    const waitlistBtn = domCache.buttons.waitlist;
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            showDownloadAnimation();
            // Analytics tracking
            trackEvent('download_presentation', { source: 'hero_cta' });
        });
    }
    
    if (waitlistBtn) {
        waitlistBtn.addEventListener('click', () => {
            const mvpSection = document.querySelector('.mvp-section');
            if (mvpSection) {
                smoothScrollTo(mvpSection);
                // Analytics tracking
                trackEvent('join_waitlist_click', { source: 'hero_cta' });
            }
        });
    }
}

// Animación de descarga optimizada
function showDownloadAnimation() {
    const notification = createNotification({
        type: 'info',
        title: 'Descargando presentación...',
        message: 'El archivo se descargará en breve.',
        duration: 2000
    });
    
    document.body.appendChild(notification);
    
    // Simular descarga
    setTimeout(() => {
        const successNotification = createNotification({
            type: 'success',
            title: '¡Descarga completada!',
            message: 'Revisa tu carpeta de descargas.',
            duration: 3000
        });
        
        document.body.appendChild(successNotification);
    }, 2000);
}

// Indicador de scroll optimizado
function initializeScrollIndicator() {
    const scrollIndicator = domCache.heroElements.scrollIndicator;
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', () => {
        const whatIsSection = document.querySelector('#que-es');
        if (whatIsSection) {
            smoothScrollTo(whatIsSection);
        }
    });
    
    // Ocultar/mostrar basado en scroll
    const handleScroll = Utils.throttle(() => {
        const scrollY = window.pageYOffset;
        const shouldHide = scrollY > window.innerHeight * 0.3;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(scrollIndicator, {
                duration: 0.3,
                opacity: shouldHide ? 0 : 1,
                y: shouldHide ? 10 : 0,
                ease: "power2.out"
            });
        } else {
            scrollIndicator.style.opacity = shouldHide ? '0' : '1';
            scrollIndicator.style.transform = shouldHide ? 'translateY(10px)' : 'translateY(0)';
            scrollIndicator.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Hover effects optimizados
function initializeHoverEffects() {
    // Cards hover
    const cards = document.querySelectorAll('.benefit-card, .feature-item, .timeline-content');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    duration: 0.3,
                    y: -6,
                    boxShadow: "0 15px 35px rgba(14, 77, 146, 0.15)",
                    ease: "power2.out"
                });
            } else {
                card.style.transform = 'translateY(-6px)';
                card.style.boxShadow = '0 15px 35px rgba(14, 77, 146, 0.15)';
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: "0 4px 16px rgba(14, 77, 146, 0.12)",
                    ease: "power2.out"
                });
            } else {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 16px rgba(14, 77, 146, 0.12)';
            }
        });
    });
    
    // Social links hover
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(link, {
                    duration: 0.2,
                    scale: 1.1,
                    rotation: 5,
                    ease: "back.out(2)"
                });
            } else {
                link.style.transform = 'scale(1.1) rotate(5deg)';
                link.style.transition = 'transform 0.2s ease';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(link, {
                    duration: 0.2,
                    scale: 1,
                    rotation: 0,
                    ease: "power2.out"
                });
            } else {
                link.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Optimización de performance
function optimizePerformance() {
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload de recursos críticos
    const criticalImages = [
        // Agregar URLs de imágenes críticas aquí
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Analytics tracking optimizado
function trackEvent(eventName, properties = {}) {
    // Implementar tracking real aquí (Google Analytics, Mixpanel, etc.)
    console.log('Event tracked:', eventName, properties);
    
    // Ejemplo para Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

// Manejo de errores mejorado
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
    
    // Fallback en caso de error crítico
    if (isLoading) {
        forceInitialization();
    }
});

// Manejo de resize optimizado
const handleResize = Utils.debounce(() => {
    // Actualizar configuración de partículas
    PERFORMANCE_CONFIG.particleCount = window.innerWidth < 768 ? 15 : 30;
    
    // Refresh ScrollTrigger si está disponible
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
    
    trackEvent('window_resize', {
        width: window.innerWidth,
        height: window.innerHeight
    });
}, 250);

window.addEventListener('resize', handleResize);

// Inicializar optimizaciones cuando la página esté cargada
window.addEventListener('load', () => {
    optimizePerformance();
    
    // Marcar performance
    performance.mark('app-loaded');
    performance.measure('app-load-time', 'navigationStart', 'app-loaded');
    
    const loadTime = performance.getEntriesByName('app-load-time')[0];
    if (loadTime) {
        trackEvent('page_load_time', {
            duration: Math.round(loadTime.duration)
        });
    }
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator && 'production' === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
                trackEvent('service_worker_registered');
            })
            .catch(error => {
                console.log('SW registration failed:', error);
                trackEvent('service_worker_error', { error: error.message });
            });
    });
}
// ... código anterior ...

// Accessibility improvements optimizadas
function initializeAccessibility() {
    // Focus management mejorado
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // Trap focus en modales
    let focusedElementBeforeModal = null;
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', (e) => {
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    duration: 0.2,
                    scale: 1.02,
                    ease: "power2.out"
                });
            }
            
            // Añadir indicador visual de focus
            element.classList.add('focused');
        });
        
        element.addEventListener('blur', (e) => {
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    duration: 0.2,
                    scale: 1,
                    ease: "power2.out"
                });
            }
            
            element.classList.remove('focused');
        });
    });
    
    // Navegación por teclado mejorada
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'Escape':
                handleEscapeKey();
                break;
            case 'Tab':
                handleTabNavigation(e);
                break;
            case 'Enter':
            case ' ':
                handleActivation(e);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                handleArrowNavigation(e);
                break;
        }
    });
    
    // Anuncios para screen readers
    createAriaLiveRegion();
}

// Manejo de tecla Escape
function handleEscapeKey() {
    const navMenu = domCache.navMenu;
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (typeof gsap !== 'undefined') {
            animateHamburger(domCache.navToggle, false);
        } else {
            toggleHamburgerBasic(domCache.navToggle, false);
        }
        
        // Devolver focus al botón de menú
        domCache.navToggle.focus();
    }
    
    // Cerrar notificaciones
    const notifications = document.querySelectorAll('[data-notification]');
    notifications.forEach(notification => {
        notification.remove();
    });
}

// Manejo de navegación con Tab
function handleTabNavigation(e) {
    const focusableElements = Array.from(document.querySelectorAll(
        'a:not([disabled]), button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Si estamos en el último elemento y presionamos Tab, ir al primero
    if (e.target === lastElement && !e.shiftKey) {
        e.preventDefault();
        firstElement.focus();
    }
    
    // Si estamos en el primer elemento y presionamos Shift+Tab, ir al último
    if (e.target === firstElement && e.shiftKey) {
        e.preventDefault();
        lastElement.focus();
    }
}

// Manejo de activación con Enter/Space
function handleActivation(e) {
    const target = e.target;
    
    // Solo para elementos que no manejan Enter/Space nativamente
    if (target.tagName === 'DIV' && target.getAttribute('role') === 'button') {
        e.preventDefault();
        target.click();
    }
}

// Navegación con flechas
function handleArrowNavigation(e) {
    const target = e.target;
    const parent = target.closest('[role="menu"], [role="tablist"], .nav-menu');
    
    if (parent) {
        e.preventDefault();
        const items = Array.from(parent.querySelectorAll('[role="menuitem"], [role="tab"], .nav-link'));
        const currentIndex = items.indexOf(target);
        
        let nextIndex;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % items.length;
        } else {
            nextIndex = (currentIndex - 1 + items.length) % items.length;
        }
        
        items[nextIndex].focus();
    }
}

// Crear región ARIA Live para anuncios
function createAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    
    document.body.appendChild(liveRegion);
    
    // Función global para anunciar mensajes
    window.announceToScreenReader = function(message) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
}

// Animaciones avanzadas adicionales
function initializeAdvancedAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Animación de números contadores
    initializeCounterAnimations();
    
    // Animación de progreso
    initializeProgressAnimations();
    
    // Animación de elementos 3D
    initialize3DAnimations();
    
    // Animación de texto typewriter
    initializeTypewriterAnimations();
}

// Animaciones de contadores
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
        const finalValue = parseInt(counter.dataset.counter);
        const duration = parseFloat(counter.dataset.duration) || 2;
        const suffix = counter.dataset.suffix || '';
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => {
                gsap.from({ value: 0 }, {
                    duration: duration,
                    value: finalValue,
                    ease: "power2.out",
                    onUpdate: function() {
                        const currentValue = Math.round(this.targets()[0].value);
                        counter.textContent = currentValue + suffix;
                    },
                    onComplete: () => {
                        announceToScreenReader(`Contador completado: ${finalValue}${suffix}`);
                    }
                });
            },
            once: true
        });
    });
}

// Animaciones de progreso
function initializeProgressAnimations() {
    const progressBars = document.querySelectorAll('[data-progress]');
    
    progressBars.forEach(bar => {
        const progress = parseInt(bar.dataset.progress);
        const progressFill = bar.querySelector('.progress-fill');
        
        if (progressFill) {
            ScrollTrigger.create({
                trigger: bar,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(progressFill, {
                        duration: 1.5,
                        width: progress + '%',
                        ease: "power2.out"
                    });
                },
                once: true
            });
        }
    });
}

// Animaciones 3D
function initialize3DAnimations() {
    // Animación del locker 3D mejorada
    const locker3D = document.querySelector('.locker-3d');
    if (locker3D) {
        // Rotación continua
        gsap.to('.locker-model', {
            duration: 20,
            rotationY: 360,
            repeat: -1,
            ease: "none"
        });
        
        // Efecto de hover
        locker3D.addEventListener('mouseenter', () => {
            gsap.to('.locker-model', {
                duration: 0.5,
                scale: 1.1,
                rotationX: -10,
                ease: "power2.out"
            });
        });
        
        locker3D.addEventListener('mouseleave', () => {
            gsap.to('.locker-model', {
                duration: 0.5,
                scale: 1,
                rotationX: 0,
                ease: "power2.out"
            });
        });
    }
    
    // Animaciones de cards 3D
    const cards3D = document.querySelectorAll('[data-3d]');
    cards3D.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                duration: 0.3,
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                ease: "power2.out"
            });
        });
    });
}

// Animaciones typewriter
function initializeTypewriterAnimations() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
        const text = element.dataset.typewriter;
        const speed = parseInt(element.dataset.speed) || 50;
        
        ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            onEnter: () => {
                typewriterEffect(element, text, speed);
            },
            once: true
        });
    });
}

// Efecto typewriter
function typewriterEffect(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Añadir cursor parpadeante
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            cursor.textContent = '|';
            element.appendChild(cursor);
            
            gsap.to(cursor, {
                duration: 0.5,
                opacity: 0,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut"
            });
        }
    }
    
    type();
}

// Sistema de temas (modo oscuro/claro)
function initializeThemeSystem() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Detectar preferencia del sistema
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDark.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Animación de transición
            if (typeof gsap !== 'undefined') {
                gsap.to('body', {
                    duration: 0.3,
                    opacity: 0.8,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1
                });
            }
            
            trackEvent('theme_changed', { theme: newTheme });
            announceToScreenReader(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`);
        });
    }
    
    // Escuchar cambios en la preferencia del sistema
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
}

// Sistema de internacionalización básico
function initializeI18n() {
    const currentLang = document.documentElement.lang || 'es';
    const langToggle = document.querySelector('[data-lang-toggle]');
    
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'es' ? 'en' : 'es';
            switchLanguage(newLang);
        });
    }
}

// Cambiar idioma
function switchLanguage(lang) {
    const translations = {
        es: {
            'hero.title': 'Nodo Locker: tu red inteligente de lockers',
            'hero.subtitle': 'Revolucionamos la logística urbana con tecnología inteligente, sostenibilidad y conveniencia para todos.',
            'nav.inicio': 'Inicio',
            'nav.que-es': 'Qué es',
            'nav.beneficios': 'Beneficios',
            'nav.como-funciona': 'Cómo funciona',
            'nav.roadmap': 'Roadmap',
            'nav.contacto': 'Contacto'
        },
        en: {
            'hero.title': 'Nodo Locker: your smart locker network',
            'hero.subtitle': 'We revolutionize urban logistics with smart technology, sustainability and convenience for everyone.',
            'nav.inicio': 'Home',
            'nav.que-es': 'What is',
            'nav.beneficios': 'Benefits',
            'nav.como-funciona': 'How it works',
            'nav.roadmap': 'Roadmap',
            'nav.contacto': 'Contact'
        }
    };
    
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    trackEvent('language_changed', { language: lang });
}

// Sistema de cookies y GDPR
function initializeCookieConsent() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
        showCookieConsent();
    }
}

function showCookieConsent() {
    const consentBanner = document.createElement('div');
    consentBanner.className = 'cookie-consent';
    consentBanner.innerHTML = `
        <div class="cookie-consent-content">
            <div class="cookie-text">
                <h3>🍪 Uso de Cookies</h3>
                <p>Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. ¿Aceptas el uso de cookies?</p>
            </div>
            <div class="cookie-actions">
                <button class="btn-secondary" data-cookie-action="reject">Rechazar</button>
                <button class="btn-primary" data-cookie-action="accept">Aceptar</button>
            </div>
        </div>
    `;
    
    consentBanner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(14, 77, 146, 0.1);
        padding: 1rem;
        z-index: 10000;
        transform: translateY(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(consentBanner);
    
    // Mostrar banner
    setTimeout(() => {
        consentBanner.style.transform = 'translateY(0)';
    }, 1000);
    
    // Manejar acciones
    consentBanner.addEventListener('click', (e) => {
        const action = e.target.dataset.cookieAction;
        if (action) {
            localStorage.setItem('cookieConsent', action);
            
            // Ocultar banner
            consentBanner.style.transform = 'translateY(100%)';
            setTimeout(() => {
                consentBanner.remove();
            }, 300);
            
            trackEvent('cookie_consent', { action });
            
            if (action === 'accept') {
                initializeAnalytics();
            }
        }
    });
}

// Inicializar analytics solo si se aceptaron cookies
function initializeAnalytics() {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
    
    // Otros servicios de analytics
    console.log('Analytics initialized');
}

// Sistema de PWA
function initializePWA() {
    // Registrar service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
                
                // Manejar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
    
    // Prompt de instalación
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    window.addEventListener('appinstalled', () => {
        trackEvent('pwa_installed');
        announceToScreenReader('Aplicación instalada correctamente');
    });
}

// Mostrar prompt de instalación PWA
function showInstallPrompt() {
    const installButton = document.createElement('button');
    installButton.className = 'install-prompt btn-primary';
    installButton.innerHTML = '<i class="ph ph-download"></i> Instalar App';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 10000;
        transform: translateY(100px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(installButton);
    
    setTimeout(() => {
        installButton.style.transform = 'translateY(0)';
    }, 2000);
    
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            trackEvent('pwa_install_prompt', { outcome });
            
            if (outcome === 'accepted') {
                installButton.remove();
            }
            
            deferredPrompt = null;
        }
    });
}

// Mostrar notificación de actualización
function showUpdateNotification() {
    const updateNotification = createNotification({
        type: 'info',
        title: 'Actualización disponible',
        message: 'Hay una nueva versión disponible. Recarga la página para actualizar.',
        duration: 10000
    });
    
    // Añadir botón de recarga
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Recargar';
    reloadButton.className = 'btn-primary';
    reloadButton.style.marginTop = '0.5rem';
    
    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });
    
    updateNotification.querySelector('div').appendChild(reloadButton);
    document.body.appendChild(updateNotification);
}

// Monitoreo de performance avanzado
function initializePerformanceMonitoring() {
    // Web Vitals
    if ('web-vital' in window) {
        // Core Web Vitals
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
    }
    
    // Performance Observer
    if ('PerformanceObserver' in window) {
        // Long tasks
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                trackEvent('long_task', {
                    duration: entry.duration,
                    startTime: entry.startTime
                });
            }
        });
        
        try {
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.log('Long task observer not supported');
        }
        
        // Layout shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    trackEvent('layout_shift', {
                        value: entry.value,
                        sources: entry.sources?.length || 0
                    });
                }
            }
        });
        
        try {
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.log('Layout shift observer not supported');
        }
    }
    
    // Memory usage
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            trackEvent('memory_usage', {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
            });
        }, 30000); // Cada 30 segundos
    }
}

function onPerfEntry(metric) {
    trackEvent('web_vital', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating
    });
}

// Inicialización completa
function initializeCompleteApp() {
    // Funcionalidades básicas
    initializeAccessibility();
    
    // Funcionalidades avanzadas si GSAP está disponible
    if (typeof gsap !== 'undefined') {
        initializeAdvancedAnimations();
    }
    
    // Sistemas adicionales
    initializeThemeSystem();
    initializeI18n();
    initializeCookieConsent();
    initializePWA();
    initializePerformanceMonitoring();
    
    // Marcar como completamente inicializado
    document.body.classList.add('app-ready');
    trackEvent('app_fully_initialized');
}

// Ejecutar inicialización completa después de que todo esté listo
window.addEventListener('load', () => {
    setTimeout(() => {
        initializeCompleteApp();
    }, 1000);
});

// Cleanup al cerrar la página
window.addEventListener('beforeunload', () => {
    // Cancelar animaciones activas
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf('*');
    }
    
    // Cancelar animation frames
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Limpiar timeouts
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    // Track session end
    trackEvent('session_end', {
        duration: Date.now() - performance.timing.navigationStart
    });
});

// Manejo de visibilidad de la página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar animaciones cuando la página no es visible
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
        trackEvent('page_hidden');
    } else {
        // Reanudar animaciones cuando la página es visible
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
        trackEvent('page_visible');
    }
});

// Debug mode para desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugNodoLocker = {
        domCache,
        particles,
        PERFORMANCE_CONFIG,
        Utils,
        trackEvent,
        showNotification: createNotification,
        forceTheme: (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
        },
        refreshAnimations: () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }
    };
    
    console.log('🚀 Nodo Locker Debug Mode Enabled');
    console.log('Use window.debugNodoLocker for debugging tools');
}

// Exportar funciones principales para testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Utils,
        trackEvent,
        createNotification,
        validateField,
        smoothScrollTo
    };
}

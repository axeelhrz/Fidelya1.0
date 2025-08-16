// Registro de GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Variables globales
let isLoading = true;
let particles = [];
let animationFrameId = null;

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
    particleCount: window.innerWidth < 768 ? 20 : 40,
    animationDuration: {
        fast: 0.2,
        normal: 0.3,
        slow: 0.5
    },
    debounceDelay: 16,
    loadingTimeout: 3000
};

// Utilidades
const Utils = {
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

    cacheDOM() {
        domCache.loadingScreen = document.getElementById('loadingScreen');
        domCache.navbar = document.getElementById('navbar');
        domCache.navMenu = document.getElementById('navMenu');
        domCache.navToggle = document.getElementById('navToggle');
        domCache.heroElements = {
            particles: document.getElementById('particles')
        };
        domCache.forms = {
            mvp: document.getElementById('mvpForm')
        };
        domCache.buttons = {
            download: document.getElementById('downloadBtn'),
            waitlist: document.getElementById('waitlistBtn'),
            waitlistNav: document.getElementById('waitlistNavBtn')
        };
    },

    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return (
            rect.top <= windowHeight * (1 + threshold) &&
            rect.bottom >= -windowHeight * threshold
        );
    }
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    Utils.cacheDOM();
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    simulateLoading();
    
    const safetyTimeout = setTimeout(() => {
        if (isLoading) {
            forceInitialization();
        }
    }, PERFORMANCE_CONFIG.loadingTimeout);

    const initPromises = [
        initializeNavigation(),
        initializeForms(),
        initializeInteractions()
    ];

    Promise.allSettled(initPromises).then(() => {
        clearTimeout(safetyTimeout);
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initializeAdvancedFeatures();
        } else {
            initializeBasicFeatures();
        }
        
        hideLoadingScreen();
    });
}

// Simulación de carga
function simulateLoading() {
    const progressBar = document.querySelector('.loading-progress');
    if (!progressBar) {
        hideLoadingScreen();
        return;
    }
    
    let progress = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateProgress(currentTime) {
        const elapsed = currentTime - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
        progress = easedProgress * 100;
        
        progressBar.style.width = progress + '%';
        
        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

// Ocultar pantalla de carga
function hideLoadingScreen() {
    const loadingScreen = domCache.loadingScreen;
    if (!loadingScreen) return;
    
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    loadingScreen.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
    loadingScreen.classList.add('hidden');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        isLoading = false;
        document.body.classList.add('loaded');
        startHeroAnimations();
    }, 600);
}

// Forzar inicialización
function forceInitialization() {
    hideLoadingScreen();
    initializeBasicFeatures();
}

// Navegación
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

        // Scroll effect
        const handleScroll = Utils.throttle(() => {
            const scrollY = window.pageYOffset;
            navbar.classList.toggle('scrolled', scrollY > 100);
            
            // Update active nav link
            updateActiveNavLink();
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

        // Smooth scroll
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
                }
            });
        });

        resolve();
    });
}

// Actualizar link activo en navegación
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll
function smoothScrollTo(target) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: targetPosition },
            ease: "power2.inOut"
        });
    } else {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
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

// Hamburger básico
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

// Animaciones del Hero
function startHeroAnimations() {
    if (typeof gsap !== 'undefined') {
        startAdvancedHeroAnimations();
    } else {
        startBasicHeroAnimations();
    }
}

// Hero animations con GSAP
function startAdvancedHeroAnimations() {
    const tl = gsap.timeline();
    
    tl.from('.hero-badge', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    })
    .from('.title-line', {
        duration: 0.8,
        y: 60,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
    }, "-=0.5")
    .from('.hero-subtitle', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.3")
    .from('.hero-ctas .btn-primary, .hero-ctas .btn-secondary', {
        duration: 0.4,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.2")
    .from('.hero-stats .stat-item', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.1")
    .from('.hero-scroll-indicator', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.2");
    
    // Iniciar contadores
    initializeCounters();
}

// Hero animations básicas
function startBasicHeroAnimations() {
    const elements = [
        '.hero-badge',
        '.title-line',
        '.hero-subtitle',
        '.hero-ctas',
        '.hero-stats',
        '.hero-scroll-indicator'
    ];
    
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
    
    // Iniciar contadores básicos
    setTimeout(() => {
        initializeCounters();
    }, 1000);
}

// Inicializar contadores
function initializeCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(easeProgress * target);
            
            counter.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

// Características avanzadas con GSAP
function initializeAdvancedFeatures() {
    initializeParticles();
    initializeScrollEffects();
    initializeAdvancedAnimations();
}

// Características básicas
function initializeBasicFeatures() {
    initializeBasicScrollEffects();
    initializeBasicAnimations();
}

// Sistema de partículas
function initializeParticles() {
    const particlesContainer = domCache.heroElements.particles;
    if (!particlesContainer || typeof gsap === 'undefined') return;
    
    const particleCount = PERFORMANCE_CONFIG.particleCount;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        pointer-events: none;
        will-change: transform, opacity;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    container.appendChild(particle);
    particles.push(particle);
    
    gsap.set(particle, { 
        x: 0, 
        y: 0, 
        rotation: 0,
        scale: 1,
        opacity: Math.random() * 0.6 + 0.2
    });
    
    gsap.to(particle, {
        duration: Math.random() * 20 + 15,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        repeat: -1,
        yoyo: true,
        ease: "none",
        delay: index * 0.1
    });
    
    gsap.to(particle, {
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.1,
        scale: Math.random() * 0.5 + 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: Math.random() * 3
    });
}

// Efectos de scroll con GSAP
function initializeScrollEffects() {
    if (typeof ScrollTrigger === 'undefined') return;
    
    ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true
    });
    
    // Animaciones generales
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse",
                once: true
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        });
    });
    
    // Animaciones específicas
    initializeSectionAnimations();
}

// Animaciones de secciones
function initializeSectionAnimations() {
    // What is section
    ScrollTrigger.create({
        trigger: '.what-is',
        start: "top 70%",
        onEnter: () => animateWhatIsSection(),
        once: true
    });
    
    // Benefits section
    ScrollTrigger.create({
        trigger: '.benefits',
        start: "top 70%",
        onEnter: () => animateBenefitsSection(),
        once: true
    });
    
    // Steps section
    ScrollTrigger.create({
        trigger: '.how-it-works',
        start: "top 70%",
        onEnter: () => animateStepsSection(),
        once: true
    });
    
    // Roadmap section
    ScrollTrigger.create({
        trigger: '.roadmap',
        start: "top 70%",
        onEnter: () => animateRoadmapSection(),
        once: true
    });
}

// Animaciones específicas
function animateWhatIsSection() {
    const tl = gsap.timeline();
    
    tl.from('.locker-3d', {
        duration: 1.2,
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
        stagger: 0.15,
        ease: "back.out(2)"
    }, "-=0.8")
    .from('.feature-card', {
        duration: 0.6,
        x: -30,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.4");
}

function animateBenefitsSection() {
    const cards = document.querySelectorAll('.benefit-card');
    
    gsap.from(cards, {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
    });
    
    // Animar estadísticas
    cards.forEach(card => {
        const stats = card.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const finalValue = parseInt(stat.getAttribute('data-counter'));
            if (!isNaN(finalValue)) {
                gsap.from({ value: 0 }, {
                    duration: 2,
                    value: finalValue,
                    ease: "power2.out",
                    delay: 0.5,
                    onUpdate: function() {
                        stat.textContent = Math.round(this.targets()[0].value);
                    }
                });
            }
        });
    });
}

function animateStepsSection() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        gsap.from(step.querySelector('.step-number'), {
            duration: 0.8,
            scale: 0,
            rotation: 180,
            opacity: 0,
            delay: index * 0.2,
            ease: "back.out(2)"
        });
        
        gsap.from(step.querySelector('.step-visual'), {
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: index * 0.2 + 0.1,
            ease: "power2.out"
        });
        
        gsap.from(step.querySelector('.step-content'), {
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: index * 0.2 + 0.2,
            ease: "power2.out"
        });
    });
}

function animateRoadmapSection() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Animar línea de tiempo
    gsap.from('.timeline-line', {
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
            delay: index * 0.3,
            ease: "back.out(2)"
        });
        
        gsap.from(item.querySelector('.timeline-content'), {
            duration: 0.8,
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            delay: index * 0.3 + 0.2,
            ease: "power2.out"
        });
    });
}

// Efectos de scroll básicos
function initializeBasicScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll(
        '.fade-in, .benefit-card, .step, .timeline-item, .feature-card'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animaciones básicas
function initializeBasicAnimations() {
    const cards = document.querySelectorAll('.benefit-card, .feature-card, .timeline-content');
    
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

// Animaciones avanzadas adicionales
function initializeAdvancedAnimations() {
    // Parallax del hero
    gsap.to('.hero-pattern', {
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: -100,
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
            y: -50 * (index + 1),
            rotation: 360,
            ease: "none"
        });
    });
}

// Formularios
function initializeForms() {
    return new Promise((resolve) => {
        const mvpForm = domCache.forms.mvp;
        if (!mvpForm) {
            resolve();
            return;
        }
        
        const formInputs = mvpForm.querySelectorAll('input, textarea');
        
        // Efectos de focus
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
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
            handleFormSubmission(mvpForm);
        });
        
        resolve();
    });
}

// Validación de campos
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    
    if (field.required && !value) {
        isValid = false;
    } else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    field.parentElement.classList.toggle('error', !isValid);
    field.parentElement.classList.toggle('valid', isValid && value);
    
    return isValid;
}

// Envío de formulario
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    // Validar campos
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('error', 'Error', 'Por favor, completa todos los campos correctamente.');
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
        showNotification('success', '¡Solicitud enviada!', 'Te contactaremos pronto para ser parte del MVP.');
        resetForm(form);
    }, 2000);
}

// Sistema de notificaciones
function showNotification(type, title, message) {
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.firstElementChild.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.firstElementChild.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Resetear formulario
function resetForm(form) {
    const submitBtn = form.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('i');
    
    submitBtn.disabled = false;
    btnText.textContent = 'Enviar solicitud';
    btnIcon.className = 'ph ph-arrow-right';
    
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(btnIcon);
        gsap.set(btnIcon, { rotation: 0 });
    }
    
    form.reset();
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'valid');
    });
}

// Interacciones
function initializeInteractions() {
    return new Promise((resolve) => {
        initializeButtonEffects();
        initializeCTAButtons();
        initializeScrollIndicator();
        resolve();
    });
}

// Efectos de botones
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            createRipple(e, button);
        });
        
        button.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1.05,
                    ease: "power2.out"
                });
            } else {
                button.style.transform = 'scale(1.05) translateY(-2px)';
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

// Efecto ripple
function createRipple(e, button) {
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

// CTAs principales
function initializeCTAButtons() {
    const downloadBtn = domCache.buttons.download;
    const waitlistBtn = domCache.buttons.waitlist;
    const waitlistNavBtn = domCache.buttons.waitlistNav;
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            showDownloadAnimation();
        });
    }
    
    if (waitlistBtn || waitlistNavBtn) {
        [waitlistBtn, waitlistNavBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const mvpSection = document.querySelector('.mvp-section');
                    if (mvpSection) {
                        smoothScrollTo(mvpSection);
                    }
                });
            }
        });
    }
}

// Animación de descarga
function showDownloadAnimation() {
    showNotification('info', 'Descargando presentación...', 'El archivo se descargará en breve.');
    
    setTimeout(() => {
        showNotification('success', '¡Descarga completada!', 'Revisa tu carpeta de descargas.');
    }, 2000);
}

// Indicador de scroll
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', () => {
        const whatIsSection = document.querySelector('#que-es');
        if (whatIsSection) {
            smoothScrollTo(whatIsSection);
        }
    });
    
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

// Manejo de resize
const handleResize = Utils.debounce(() => {
    PERFORMANCE_CONFIG.particleCount = window.innerWidth < 768 ? 20 : 40;
    
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 250);

window.addEventListener('resize', handleResize);

// Cleanup
window.addEventListener('beforeunload', () => {
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf('*');
    }
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});

// Manejo de visibilidad
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    } else {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
    }
});

// ===== VARIABLES GLOBALES =====
let isMenuOpen = false;
let currentFeature = 0;
const features = document.querySelectorAll('.feature');

// Variables para el sistema de partículas
let particleSystems = [];
let animationId = null;
let isReducedMotion = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeVideoPlayer();
    initializeFAQ();
    initializeAnimations();
    initializeIntersectionObserver();
    initializeParticleSystem();
    checkReducedMotion();
});

// ===== SISTEMA DE PARTÍCULAS DELICADAS ===== 
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isActive = false;
        this.animationFrame = null;
        
        // Configuración optimizada
        this.config = {
            maxParticles: options.maxParticles || 15,
            particleSize: options.particleSize || { min: 1, max: 3 },
            speed: options.speed || { min: 0.2, max: 0.8 },
            opacity: options.opacity || { min: 0.3, max: 0.8 },
            colors: options.colors || [
                'rgba(255, 69, 105, ',
                'rgba(255, 23, 68, ',
                'rgba(184, 0, 46, ',
                'rgba(255, 107, 157, '
            ],
            spawnRate: options.spawnRate || 0.3,
            lifetime: options.lifetime || { min: 2000, max: 4000 },
            direction: options.direction || 'up'
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
    }
    
    createCanvas() {
        // Crear contenedor de partículas si no existe
        let particlesContainer = this.container.querySelector('.particles-container');
        if (!particlesContainer) {
            particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles-container';
            this.container.appendChild(particlesContainer);
        }
        
        // Crear canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        particlesContainer.appendChild(this.canvas);
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
    }
    
    setupEventListeners() {
        // Activar partículas en hover
        this.container.addEventListener('mouseenter', () => {
            if (!isReducedMotion) {
                this.start();
            }
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.stop();
        });
        
        // Redimensionar canvas
        window.addEventListener('resize', debounce(() => {
            this.resizeCanvas();
        }, 250));
    }
    
    createParticle() {
        const rect = this.container.getBoundingClientRect();
        const config = this.config;
        
        return {
            x: Math.random() * rect.width,
            y: rect.height + 10,
            size: Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -(Math.random() * (config.speed.max - config.speed.min) + config.speed.min),
            opacity: Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min,
            color: config.colors[Math.floor(Math.random() * config.colors.length)],
            life: Math.random() * (config.lifetime.max - config.lifetime.min) + config.lifetime.min,
            maxLife: 0,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        };
    }
    
    updateParticles() {
        const rect = this.container.getBoundingClientRect();
        
        // Crear nuevas partículas
        if (Math.random() < this.config.spawnRate && this.particles.length < this.config.maxParticles) {
            const particle = this.createParticle();
            particle.maxLife = particle.life;
            this.particles.push(particle);
        }
        
        // Actualizar partículas existentes
        this.particles = this.particles.filter(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 16; // ~60fps
            particle.rotation += particle.rotationSpeed;
            
            // Fade out al final de la vida
            const lifeRatio = particle.life / particle.maxLife;
            particle.currentOpacity = particle.opacity * Math.max(0, lifeRatio);
            
            // Remover partículas muertas o fuera de pantalla
            return particle.life > 0 && particle.y > -50 && particle.x > -50 && particle.x < rect.width + 50;
        });
    }
    
    renderParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Aplicar transformaciones
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            
            // Configurar estilo
            this.ctx.globalAlpha = particle.currentOpacity;
            this.ctx.fillStyle = particle.color + particle.currentOpacity + ')';
            
            // Dibujar partícula con efecto de brillo
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Efecto de brillo sutil
            this.ctx.globalAlpha = particle.currentOpacity * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, particle.size * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.updateParticles();
        this.renderParticles();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.animate();
    }
    
    stop() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Fade out gradual
        setTimeout(() => {
            if (!this.isActive) {
                this.particles = [];
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }, 1000);
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// ===== INICIALIZACIÓN DEL SISTEMA DE PARTÍCULAS =====
function initializeParticleSystem() {
    // Configuraciones específicas para diferentes secciones
    const configs = {
        hero: {
            maxParticles: 20,
            particleSize: { min: 1.5, max: 4 },
            speed: { min: 0.3, max: 1.0 },
            opacity: { min: 0.4, max: 0.9 },
            spawnRate: 0.4
        },
        feature: {
            maxParticles: 12,
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.2, max: 0.7 },
            opacity: { min: 0.3, max: 0.7 },
            spawnRate: 0.25
        }
    };
    
    // Inicializar partículas para el teléfono hero
    const heroPhone = document.querySelector('.hero__phone-container');
    if (heroPhone) {
        const heroParticles = new ParticleSystem(heroPhone, configs.hero);
        particleSystems.push(heroParticles);
    }
    
    // Inicializar partículas para teléfonos de características
    const featurePhones = document.querySelectorAll('.feature__phone');
    featurePhones.forEach((phone, index) => {
        // Configuración específica por feature
        const featureConfig = {
            ...configs.feature,
            colors: getFeatureColors(index)
        };
        
        const featureParticles = new ParticleSystem(phone, featureConfig);
        particleSystems.push(featureParticles);
    });
}

// ===== COLORES ESPECÍFICOS POR FEATURE =====
function getFeatureColors(index) {
    const colorSets = [
        // Feature 1: Horario
        ['rgba(255, 69, 105, ', 'rgba(255, 107, 157, '],
        // Feature 2: Estaciones  
        ['rgba(255, 23, 68, ', 'rgba(255, 69, 105, '],
        // Feature 3: Calendario
        ['rgba(255, 45, 107, ', 'rgba(255, 107, 157, '],
        // Feature 4: Registro
        ['rgba(184, 0, 46, ', 'rgba(255, 23, 68, '],
        // Feature 5: Notificaciones
        ['rgba(255, 69, 105, ', 'rgba(255, 107, 157, '],
        // Feature 6: Referidos (dorado)
        ['rgba(255, 215, 0, ', 'rgba(255, 193, 7, ']
    ];
    
    return colorSets[index] || colorSets[0];
}

// ===== DETECCIÓN DE MOVIMIENTO REDUCIDO =====
function checkReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isReducedMotion) {
        // Desactivar todas las partículas
        particleSystems.forEach(system => system.destroy());
        particleSystems = [];
    }
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Toggle del menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', isMenuOpen);
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                isMenuOpen = false;
            }
        });
    });
    
    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar enlace activo
                updateActiveNavLink(link);
            }
        });
    });
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Header transparente/sólido
        if (currentScrollY > 100) {
            header.style.background = 'rgba(10, 13, 20, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
        
        // Actualizar navegación activa basada en scroll
        updateActiveNavOnScroll();
        
        lastScrollY = currentScrollY;
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            if (activeLink) {
                document.querySelectorAll('.nav__link').forEach(link => {
                    link.classList.remove('active');
                });
                activeLink.classList.add('active');
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
    
    // Configurar video
    video.controls = false;
    video.preload = 'metadata';
    
    // Mostrar duración cuando los metadatos se cargan
    video.addEventListener('loadedmetadata', () => {
        if (durationDisplay) {
            durationDisplay.textContent = formatTime(video.duration);
        }
    });
    
    // Play/Pause
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
    
    // Actualizar progreso
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
    
    // Control de progreso
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickTime = (clickX / width) * video.duration;
            video.currentTime = clickTime;
        });
    }
    
    // Video terminado
    video.addEventListener('ended', () => {
        playOverlay.classList.remove('hidden');
        if (progressIndicators) {
            progressIndicators.classList.remove('visible');
        }
        if (progressFill) {
            progressFill.style.width = '0%';
        }
    });
    
    // Manejo de errores
    video.addEventListener('error', (e) => {
        console.error('Error al cargar el video:', e);
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
                <div class="videos__error-text">
                    <span class="videos__error-title">Error al cargar el video</span>
                    <span class="videos__error-subtitle">Por favor, intenta recargar la página</span>
                </div>
            </div>
        `;
    }
}

// ===== FAQ =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    const searchInput = document.getElementById('faq-search');
    const noResults = document.getElementById('faq-no-results');
    
    // Toggle FAQ items
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
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
                
                // Toggle item actual
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
    
    // Búsqueda en FAQ
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
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
            
            // Mostrar/ocultar mensaje de no resultados
            if (noResults) {
                if (visibleItems === 0 && searchTerm !== '') {
                    noResults.classList.add('show');
                } else {
                    noResults.classList.remove('show');
                }
            }
        });
    }
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    // Animación de elementos al hacer scroll
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('animate', animationType);
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
                
                // Animaciones específicas para features
                if (entry.target.classList.contains('feature')) {
                    animateFeature(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observar features
    features.forEach(feature => {
        observer.observe(feature);
    });
    
    // Observar otros elementos animados
    const animatedElements = document.querySelectorAll('.faq__item, .contact__channel');
    animatedElements.forEach(element => {
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

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

// ===== OPTIMIZACIONES DE RENDIMIENTO =====
// Lazy loading para imágenes
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

// Preload crítico
function preloadCriticalResources() {
    const criticalImages = [
        './assets/phones/Hero.jpg',
        './assets/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== ACCESIBILIDAD =====
function initializeAccessibility() {
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.getElementById('nav-menu');
            
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                isMenuOpen = false;
            }
        }
    });
    
    // Focus trap para menú móvil
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && isMenuOpen) {
            const navMenu = document.getElementById('nav-menu');
            if (navMenu) {
                const focusable = navMenu.querySelectorAll(focusableElements);
                const firstFocusable = focusable[0];
                const lastFocusable = focusable[focusable.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });
}

// ===== LIMPIEZA AL SALIR =====
window.addEventListener('beforeunload', () => {
    // Limpiar sistemas de partículas
    particleSystems.forEach(system => system.destroy());
    particleSystems = [];
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// ===== INICIALIZACIÓN FINAL =====
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    preloadCriticalResources();
    initializeAccessibility();
    
    // Detectar cambios en preferencias de movimiento
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addListener(checkReducedMotion);
});

// ===== MANEJO DE RESIZE =====
window.addEventListener('resize', debounce(() => {
    // Recalcular posiciones si es necesario
    if (isMenuOpen && window.innerWidth > 768) {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            isMenuOpen = false;
        }
    }
    
    // Redimensionar canvas de partículas
    particleSystems.forEach(system => {
        if (system.resizeCanvas) {
            system.resizeCanvas();
        }
    });
}, 250));

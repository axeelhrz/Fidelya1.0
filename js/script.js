// ===== UTILIDADES ===== 
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===== NAVEGACIÓN MÓVIL MEJORADA =====
class MobileNav {
    constructor() {
        this.toggle = $('#nav-toggle');
        this.menu = $('#nav-menu');
        this.links = $$('.nav__link');
        this.init();
    }

    init() {
        this.toggle?.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const target = $(targetId);
        
        if (target) {
            const targetPosition = target.offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ===== FAQ ACCORDION =====
class FAQAccordion {
    constructor() {
        this.faqItems = $$('.faq__item');
        this.searchInput = $('#faq-search');
        this.noResults = $('#faq-no-results');
        this.init();
    }

    init() {
        this.setupAccordion();
        this.setupSearch();
    }

    setupAccordion() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');
            
            question.addEventListener('click', () => {
                this.toggleItem(item, question, answer);
            });

            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(item, question, answer);
                }
            });
        });
    }

    toggleItem(item, question, answer) {
        const isActive = item.classList.contains('active');
        
        // Cerrar otros items
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq__answer').classList.remove('active');
                otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
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
    }

    setupSearch() {
        if (!this.searchInput) return;

        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value.toLowerCase());
            }, 300);
        });
    }

    performSearch(searchTerm) {
        let visibleCount = 0;

        this.faqItems.forEach(item => {
            const questionText = item.querySelector('.faq__question-text').textContent.toLowerCase();
            const answerText = item.querySelector('.faq__answer-text').textContent.toLowerCase();
            
            const matches = searchTerm === '' || 
                          questionText.includes(searchTerm) || 
                          answerText.includes(searchTerm);
            
            if (matches) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        // Mostrar/ocultar mensaje de no resultados
        if (visibleCount === 0 && searchTerm !== '') {
            this.noResults.classList.add('show');
        } else {
            this.noResults.classList.remove('show');
        }
    }
}

// ===== ANIMACIONES DE ENTRADA =====
class FeatureAnimations {
    constructor() {
        this.features = $$('.feature');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        this.features.forEach(feature => {
            observer.observe(feature);
        });
    }
}

// ===== EFECTOS INTERACTIVOS DEL IPHONE =====
class PhoneInteractions {
    constructor() {
        this.phoneContainer = $('.hero__phone-container');
        this.appAction = $('.hero__app-action');
        this.statCards = $$('.hero__stat-card');
        this.blockItems = $$('.hero__block-item');
        this.init();
    }

    init() {
        if (!this.phoneContainer) return;

        this.setupPhoneHover();
        this.setupAppInteractions();
        this.setupStatAnimations();
        this.setupBlockAnimations();
    }

    setupPhoneHover() {
        this.phoneContainer.addEventListener('mouseenter', () => {
            this.phoneContainer.style.transform = 'perspective(1200px) rotateY(-6deg) rotateX(1deg) scale(1.02)';
        });

        this.phoneContainer.addEventListener('mouseleave', () => {
            this.phoneContainer.style.transform = 'perspective(1200px) rotateY(-12deg) rotateX(3deg) scale(1)';
        });
    }

    setupAppInteractions() {
        if (this.appAction) {
            this.appAction.addEventListener('click', () => {
                this.appAction.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.appAction.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }

    setupStatAnimations() {
        this.statCards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.03)';
                card.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                card.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                card.style.boxShadow = '';
            });
        });
    }

    setupBlockAnimations() {
        this.blockItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(0, 212, 255, 0.1)';
                item.style.borderRadius = '10px';
                item.style.paddingLeft = '12px';
                item.style.paddingRight = '12px';
                item.style.transform = 'translateX(4px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
                item.style.paddingLeft = '0';
                item.style.paddingRight = '0';
                item.style.transform = 'translateX(0)';
            });
        });
    }
}

// ===== CONTADOR ANIMADO =====
class AnimatedCounters {
    constructor() {
        this.counters = $$('.hero__stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const isPrice = target.includes('$');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        
        let current = 0;
        const increment = numericValue / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            if (isPrice) {
                element.textContent = '$' + Math.floor(current);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===== EFECTOS DE PARTÍCULAS =====
class ParticleEffects {
    constructor() {
        this.particles = $$('.hero__particle');
        this.init();
    }

    init() {
        this.particles.forEach((particle) => {
            const size = Math.random() * 3 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            const opacity = Math.random() * 0.4 + 0.5;
            particle.style.opacity = opacity;
            
            const duration = Math.random() * 4 + 8;
            particle.style.animationDuration = duration + 's';
        });
    }
}

// ===== EFECTOS DE NAVEGACIÓN ACTIVA =====
class ActiveNavigation {
    constructor() {
        this.links = $$('.nav__link');
        this.sections = $$('section[id]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
    }

    updateActiveLink() {
        const scrollY = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = $(`.nav__link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.links.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    new MobileNav();
    new SmoothScroll();
    new FAQAccordion();
    new FeatureAnimations();
    new PhoneInteractions();
    new AnimatedCounters();
    new ParticleEffects();
    new ActiveNavigation();
    
    console.log('🚀 Starflex Ultra Futurista - Completo con iPhone 15 Pro, Navbar Flotante y Botones de Descarga Flotantes initialized');
});

// ===== OPTIMIZACIÓN DE SCROLL =====
let ticking = false;
function updateScrollEffects() {
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}, { passive: true });

// ===== PRELOAD DE RECURSOS =====
const preloadResources = () => {
    const criticalResources = [
        './assets/Google-Play.svg',
        './assets/App-Store.svg',
        './assets/logo.png'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
};

window.addEventListener('load', preloadResources);

// ===== EFECTOS DE PERFORMANCE =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    $$('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

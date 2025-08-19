// Configuración moderna mejorada
const CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    stagger: 100
  },
  ui: {
    notificationDuration: 4000,
    scrollOffset: 80,
    throttleDelay: 16,
    debounceDelay: 200
  },
  performance: {
    enableAnimations: true,
    enableParticles: true,
    enableBlur: true
  }
};

// Cache de elementos DOM optimizado
const elements = {
  navbar: null,
  navToggle: null,
  navMenu: null,
  navLinks: null,
  navBackdrop: null,
  heroSection: null,
  heroStats: null,
  heroImage: null,
  scrollIndicator: null,
  particles: null,
  floatingCards: null,
  ctaButtons: {},
  // ... resto de elementos existentes
};

// Estado de la aplicación mejorado
const state = {
  isMenuOpen: false,
  scrollY: 0,
  isLoaded: false,
  isScrolling: false,
  currentSection: 'inicio',
  animationsEnabled: true,
  reducedMotion: false,
  touchDevice: false,
  // ... resto del estado existente
};

// Detección de capacidades del dispositivo
function detectDeviceCapabilities() {
  // Detectar si es dispositivo táctil
  state.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Detectar preferencia de movimiento reducido
  state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Ajustar configuración según capacidades
  if (state.reducedMotion) {
    CONFIG.performance.enableAnimations = false;
    CONFIG.performance.enableParticles = false;
  }
  
  // Detectar soporte para backdrop-filter
  const testElement = document.createElement('div');
  testElement.style.backdropFilter = 'blur(10px)';
  CONFIG.performance.enableBlur = testElement.style.backdropFilter !== '';
  
  console.log('🔍 Capacidades detectadas:', {
    touch: state.touchDevice,
    reducedMotion: state.reducedMotion,
    backdropFilter: CONFIG.performance.enableBlur
  });
}

// Inicialización mejorada
document.addEventListener('DOMContentLoaded', function() {
  detectDeviceCapabilities();
  initializeApp();
});

// Función principal de inicialización mejorada
function initializeApp() {
  try {
    initializeElements();
    initializeModernNavigation();
    initializeHeroEffects();
    initializeScrollEffects();
    initializeAnimations();
    initializePerformanceOptimizations();
    initializeCTAButtons();
    
    state.isLoaded = true;
    console.log('✅ Nodo Locker - Aplicación moderna inicializada');
    
    // Trigger inicial de animaciones
    if (CONFIG.performance.enableAnimations) {
      triggerHeroAnimations();
    }
    
  } catch (error) {
    console.error('❌ Error al inicializar:', error);
    showNotification('Error al cargar la aplicación', 'error');
  }
}

// Inicializar elementos del DOM mejorado
function initializeElements() {
  elements.navbar = document.querySelector('.navbar');
  elements.navToggle = document.querySelector('.nav-toggle');
  elements.navMenu = document.querySelector('.nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  elements.navBackdrop = document.querySelector('.nav-backdrop');
  elements.heroSection = document.querySelector('.hero.modern');
  elements.heroStats = document.querySelectorAll('.stat.modern');
  elements.heroImage = document.querySelector('.hero-image.modern');
  elements.scrollIndicator = document.querySelector('.scroll-indicator');
  elements.particles = document.querySelectorAll('.particle');
  elements.floatingCards = document.querySelectorAll('.floating-card');
  
  // Botones CTA mejorados
  elements.ctaButtons = {
    download: document.getElementById('downloadBtn'),
    schedule: document.getElementById('scheduleBtn'),
    joinWaitlist: document.getElementById('joinWaitlistBtn')
  };
  
  // Verificar elementos críticos
  if (!elements.navbar || !elements.heroSection) {
    throw new Error('Elementos críticos no encontrados');
  }
}

// Sistema de navegación moderno
function initializeModernNavigation() {
  // Toggle del menú móvil mejorado
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenuModern);
  }

  // Enlaces de navegación con efectos mejorados
  elements.navLinks.forEach((link, index) => {
    link.addEventListener('click', handleNavClickModern);
    
    // Añadir efecto de ripple
    addRippleEffect(link);
    
    // Animación escalonada en carga
    if (CONFIG.performance.enableAnimations) {
      link.style.animationDelay = `${index * 50}ms`;
      link.classList.add('nav-link-animate');
    }
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', handleOutsideClickModern);
  
  // Navegación con teclado mejorada
  document.addEventListener('keydown', handleKeyNavigationModern);
  
  // Inicializar navegación activa
  initializeActiveNavigationModern();
}

// Toggle del menú móvil moderno
function toggleMobileMenuModern() {
  state.isMenuOpen = !state.isMenuOpen;
  
  // Actualizar clases y atributos
  elements.navToggle.classList.toggle('active', state.isMenuOpen);
  elements.navMenu.classList.toggle('active', state.isMenuOpen);
  
  // Prevenir scroll del body
  document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
  
  // Actualizar atributos de accesibilidad
  elements.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
  elements.navMenu.setAttribute('aria-hidden', !state.isMenuOpen);
  
  // Animación de los enlaces del menú
  if (state.isMenuOpen && CONFIG.performance.enableAnimations) {
    elements.navLinks.forEach((link, index) => {
      setTimeout(() => {
        link.style.transform = 'translateY(0)';
        link.style.opacity = '1';
      }, index * 50);
    });
  }
  
  // Feedback háptico en dispositivos compatibles
  if ('vibrate' in navigator && state.touchDevice) {
    navigator.vibrate(50);
  }
}

// Manejar clics en navegación moderno
function handleNavClickModern(e) {
  const href = e.target.closest('.nav-link').getAttribute('href');
  
  if (href && href.startsWith('#')) {
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Cerrar menú móvil si está abierto
      if (state.isMenuOpen) {
        toggleMobileMenuModern();
      }
      
      // Scroll suave mejorado
      smoothScrollToElement(targetElement);
      
      // Actualizar enlace activo
      updateActiveNavLinkModern(e.target.closest('.nav-link'));
      
      // Actualizar estado
      state.currentSection = targetId;
    }
  }
}

// Scroll suave mejorado
function smoothScrollToElement(element) {
  const offsetTop = element.offsetTop - CONFIG.ui.scrollOffset;
  const startPosition = window.pageYOffset;
  const distance = offsetTop - startPosition;
  const duration = Math.min(Math.abs(distance) / 2, 1000);
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// Función de easing
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Actualizar enlace activo moderno
function updateActiveNavLinkModern(activeLink) {
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
    const indicator = link.querySelector('.nav-link-indicator');
    if (indicator) {
      indicator.style.width = '0';
    }
  });
  
  activeLink.classList.add('active');
  const activeIndicator = activeLink.querySelector('.nav-link-indicator');
  if (activeIndicator) {
    activeIndicator.style.width = '100%';
  }
}

// Navegación activa automática mejorada
function initializeActiveNavigationModern() {
  const sections = document.querySelectorAll('section[id]');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (navLink && state.currentSection !== id) {
          updateActiveNavLinkModern(navLink);
          state.currentSection = id;
        }
      }
    });
  }, {
    threshold: [0.1, 0.3, 0.5],
    rootMargin: `-${CONFIG.ui.scrollOffset}px 0px -50% 0px`
  });
  
  sections.forEach(section => {
    navObserver.observe(section);
  });
}

// Efectos del Hero mejorados
function initializeHeroEffects() {
  if (!elements.heroSection) return;
  
  // Parallax suave para elementos del hero
  if (CONFIG.performance.enableAnimations) {
    initializeParallaxEffects();
  }
  
  // Efectos de hover en la imagen del hero
  if (elements.heroImage) {
    initializeHeroImageEffects();
  }
  
  // Animaciones de las tarjetas flotantes
  if (elements.floatingCards.length > 0 && CONFIG.performance.enableParticles) {
    initializeFloatingCards();
  }
  
  // Efectos de las partículas
  if (elements.particles.length > 0 && CONFIG.performance.enableParticles) {
    initializeParticleEffects();
  }
}

// Efectos de parallax
function initializeParallaxEffects() {
  const parallaxElements = [
    { element: elements.heroImage, speed: 0.5 },
    { element: document.querySelector('.hero-pattern'), speed: 0.3 },
    { element: document.querySelector('.hero-particles'), speed: 0.2 }
  ].filter(item => item.element);
  
  const handleParallax = throttle(() => {
    if (state.isScrolling) return;
    
    const scrolled = window.pageYOffset;
    const heroHeight = elements.heroSection.offsetHeight;
    
    if (scrolled < heroHeight) {
      parallaxElements.forEach(({ element, speed }) => {
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
  }, CONFIG.ui.throttleDelay);
  
  window.addEventListener('scroll', handleParallax, { passive: true });
}

// Efectos de la imagen del hero
function initializeHeroImageEffects() {
  const container = elements.heroImage.parentElement;
  
  container.addEventListener('mouseenter', () => {
    if (!state.touchDevice) {
      elements.heroImage.style.transform = 'scale(1.05) rotate(1deg)';
      
      const glow = container.querySelector('.image-glow');
      if (glow) {
        glow.style.opacity = '0.4';
      }
    }
  });
  
  container.addEventListener('mouseleave', () => {
    if (!state.touchDevice) {
      elements.heroImage.style.transform = 'scale(1) rotate(0deg)';
      
      const glow = container.querySelector('.image-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    }
  });
}

// Inicializar tarjetas flotantes
function initializeFloatingCards() {
  elements.floatingCards.forEach((card, index) => {
    // Animación inicial escalonada
    card.style.animationDelay = `${index * 0.5}s`;
    
    // Interacción con el mouse
    if (!state.touchDevice) {
      card.addEventListener('mouseenter', () => {
        card.style.animationPlayState = 'paused';
        card.style.transform = 'translateY(-5px) scale(1.1)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.animationPlayState = 'running';
        card.style.transform = '';
      });
    }
  });
}

// Efectos de partículas mejorados
function initializeParticleEffects() {
  elements.particles.forEach((particle, index) => {
    // Configuración aleatoria para cada partícula
    const size = Math.random() * 4 + 2;
    const opacity = Math.random() * 0.6 + 0.2;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    // Posición aleatoria
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
  });
}

// Trigger de animaciones del hero
function triggerHeroAnimations() {
  const animatedElements = [
    { selector: '.hero-badge.modern', delay: 0 },
    { selector: '.title-line', delay: 100, stagger: true },
    { selector: '.hero-description.modern', delay: 400 },
    { selector: '.hero-actions.modern', delay: 500 },
    { selector: '.hero-stats.modern', delay: 600 },
    { selector: '.hero-image-container.modern', delay: 300 },
    { selector: '.trust-indicators', delay: 800 },
    { selector: '.scroll-indicator', delay: 1000 }
  ];
  
  animatedElements.forEach(({ selector, delay, stagger }) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      const finalDelay = stagger ? delay + (index * CONFIG.animations.stagger) : delay;
      
      setTimeout(() => {
        element.classList.add('animate-in');
      }, finalDelay);
    });
  });
}

// Efectos de scroll mejorados
function initializeScrollEffects() {
  const throttledScrollHandler = throttle(updateScrollEffectsModern, CONFIG.ui.throttleDelay);
  
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
  
  // Indicador de scroll
  window.addEventListener('scroll', updateScrollIndicator, { passive: true });
}

// Actualizar efectos de scroll modernos
function updateScrollEffectsModern() {
  state.scrollY = window.scrollY;
  
  // Efecto del navbar
  if (elements.navbar) {
    const isScrolled = state.scrollY > 50;
    elements.navbar.classList.toggle('scrolled', isScrolled);
    
    if (elements.navBackdrop) {
      elements.navBackdrop.style.opacity = isScrolled ? '1' : '0';
    }
  }
  
  // Ocultar/mostrar indicador de scroll
  if (elements.scrollIndicator) {
    const heroHeight = elements.heroSection ? elements.heroSection.offsetHeight : 0;
    const shouldHide = state.scrollY > heroHeight * 0.3;
    elements.scrollIndicator.style.opacity = shouldHide ? '0' : '1';
  }
}

// Actualizar indicador de scroll
function updateScrollIndicator() {
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
  // Crear barra de progreso si no existe
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${scrollPercent}%;
      height: 3px;
      background: var(--primary-gradient);
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
  } else {
    progressBar.style.width = `${scrollPercent}%`;
  }
}

// Añadir efecto ripple a elementos
function addRippleEffect(element) {
  element.addEventListener('click', function(e) {
    if (state.touchDevice) return;
    
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
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
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;
    
    const rippleContainer = element.querySelector('.btn-ripple') || element;
    rippleContainer.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

// Animación ripple CSS
const rippleCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Añadir CSS de ripple
if (!document.querySelector('#ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = rippleCSS;
  document.head.appendChild(style);
}

// Optimizaciones de rendimiento
function initializePerformanceOptimizations() {
  // Lazy loading para imágenes
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Preload de recursos críticos
  preloadCriticalResources();
  
  // Monitoreo de rendimiento
  if ('performance' in window) {
    monitorPerformance();
  }
}

// Preload de recursos críticos
function preloadCriticalResources() {
  const criticalResources = [
    { href: 'Assets/NODO-LOCKER_ICONO.gif', as: 'image' },
    { href: 'Assets/NODO LOCKER.jpg', as: 'image' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
}

// Monitoreo de rendimiento
function monitorPerformance() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const metrics = {
        loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
        firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0),
        largestContentfulPaint: 0
      };
      
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.largestContentfulPaint = Math.round(lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      console.log('📊 Métricas de rendimiento:', metrics);
      
      // Alertar si el rendimiento es bajo
      if (metrics.loadTime > 3000) {
        console.warn('⚠️ Tiempo de carga alto detectado');
      }
    }, 0);
  });
}

// Sistema de botones CTA mejorado
function initializeCTAButtons() {
  Object.entries(elements.ctaButtons).forEach(([key, button]) => {
    if (button) {
      // Añadir efecto ripple
      addRippleEffect(button);
      
      // Manejar clics específicos
      button.addEventListener('click', (e) => {
        handleCTAClick(key, e);
      });
      
      // Efectos de hover mejorados
      if (!state.touchDevice) {
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translateY(0)';
        });
      }
    }
  });
}

// Manejar clics de CTA
function handleCTAClick(buttonType, event) {
  const button = event.currentTarget;
  
  // Añadir estado de carga
  button.classList.add('loading');
  
  switch (buttonType) {
    case 'download':
      handleDownloadModern(button);
      break;
    case 'schedule':
      handleScheduleMeetingModern(button);
      break;
    case 'joinWaitlist':
      handleJoinMVPModern(button);
      break;
  }
}

// Manejar descarga moderna
async function handleDownloadModern(button) {
  try {
    showNotification('Preparando descarga de la presentación...', 'info');
    
    // Simular preparación de descarga
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular descarga
    const link = document.createElement('a');
    link.href = '#'; // URL real del archivo
    link.download = 'Nodo-Locker-Presentacion.pdf';
    link.click();
    
    showNotification('¡Descarga iniciada exitosamente!', 'success');
    
  } catch (error) {
    console.error('Error en descarga:', error);
    showNotification('Error al iniciar la descarga', 'error');
  } finally {
    button.classList.remove('loading');
  }
}

// Manejar agendar reunión moderna
async function handleScheduleMeetingModern(button) {
  try {
    showNotification('Abriendo calendario...', 'info');
    
    // Simular apertura de calendario
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aquí iría la integración con Calendly u otro sistema
    window.open('https://calendly.com/nodo-locker', '_blank');
    
    showNotification('Calendario abierto en nueva pestaña', 'success');
    
  } catch (error) {
    console.error('Error al abrir calendario:', error);
    showNotification('Error al abrir el calendario', 'error');
  } finally {
    button.classList.remove('loading');
  }
}

// Manejar unirse al MVP moderno
async function handleJoinMVPModern(button) {
  try {
    showNotification('Agregándote a la lista de early adopters...', 'info');
    
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    showNotification('¡Te has unido exitosamente al MVP!', 'success');
    
    // Actualizar texto del botón
    const buttonText = button.querySelector('.btn-text');
    if (buttonText) {
      buttonText.textContent = '¡Ya estás en la lista!';
    }
    
    button.disabled = true;
    button.style.opacity = '0.7';
    
  } catch (error) {
    console.error('Error al unirse al MVP:', error);
    showNotification('Error al procesar la solicitud', 'error');
  } finally {
    button.classList.remove('loading');
  }
}

// Utilidades mejoradas
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

// Sistema de notificaciones mejorado (mantener el existente)
// ... código de notificaciones existente ...

// Manejo de errores mejorado
window.addEventListener('error', function(e) {
  console.error('❌ Error:', e.error);
  if (state.isLoaded) {
    showNotification('Se produjo un error inesperado', 'error');
  }
});

// Exportar para uso global
window.NodoLocker = {
  showNotification,
  state,
  config: CONFIG,
  elements,
  // Nuevas funciones públicas
  triggerHeroAnimations,
  updateScrollEffectsModern,
  toggleMobileMenuModern
};

console.log('🚀 Nodo Locker - Versión moderna cargada con éxito');
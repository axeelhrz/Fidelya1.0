// Configuración premium optimizada
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
  performance: {
    throttleDelay: 16, // 60fps
    debounceDelay: 200,
    intersectionThreshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  },
  ui: {
    notificationDuration: 5000,
    scrollOffset: 100,
    floatingCtaOffset: 0.3
  }
};

// Cache de elementos DOM optimizado
const elements = {
  // Navegación
  navbar: null,
  navToggle: null,
  navMenu: null,
  navLinks: null,
  
  // UI Elements
  floatingCta: null,
  
  // Tabs
  tabBtns: null,
  tabPanels: null,
  
  // Formulario
  contactForm: null,
  
  // Animaciones
  heroStats: null,
  featureCards: null,
  
  // Botones CTA
  ctaButtons: {}
};

// Estado de la aplicación optimizado
const state = {
  isMenuOpen: false,
  activeTab: 'couriers',
  scrollY: 0,
  isScrolling: false,
  animationsEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isLoaded: false,
  observers: {
    intersection: null,
    stats: null
  }
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Función principal de inicialización
async function initializeApp() {
  try {
    // Inicializar elementos
    initializeElements();
    
    // Inicializar módulos
    await Promise.all([
      initializeNavigation(),
      initializeTabs(),
      initializeScrollEffects(),
      initializeContactForm(),
      initializeAnimations(),
      initializeAccessibility(),
      initializePerformanceOptimizations(),
      initializeCTAButtons()
    ]);
    
    // Marcar como cargado
    state.isLoaded = true;
    document.body.classList.add('loaded');
    
    console.log('🚀 Nodo Locker - Aplicación inicializada correctamente');
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
      showNotification('¡Bienvenido a Nodo Locker! Explora el futuro de la logística urbana.', 'info');
    }, 1000);
    
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    showNotification('Error al cargar la aplicación. Por favor, recarga la página.', 'error');
  }
}

// Inicializar elementos del DOM
function initializeElements() {
  // Navegación
  elements.navbar = document.querySelector('.navbar');
  elements.navToggle = document.querySelector('.nav-toggle');
  elements.navMenu = document.querySelector('.nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  
  // UI Elements
  elements.floatingCta = document.querySelector('.floating-cta');
  
  // Tabs
  elements.tabBtns = document.querySelectorAll('.tab-btn');
  elements.tabPanels = document.querySelectorAll('.tab-panel');
  
  // Formulario
  elements.contactForm = document.querySelector('#contactForm');
  
  // Elementos para animaciones
  elements.heroStats = document.querySelectorAll('.stat');
  elements.featureCards = document.querySelectorAll('.feature-card');
  
  // Botones CTA
  elements.ctaButtons = {
    download: document.getElementById('downloadBtn'),
    learnMore: document.getElementById('learnMoreBtn'),
    joinWaitlist: document.getElementById('joinWaitlistBtn'),
    floatingCta: document.getElementById('floatingCtaBtn'),
    schedule: document.getElementById('scheduleBtn'),
    integrate: document.getElementById('integrateBtn'),
    ctaJoin: document.getElementById('ctaJoinBtn')
  };
}

// Sistema de navegación premium
function initializeNavigation() {
  return new Promise((resolve) => {
    // Toggle del menú móvil
    if (elements.navToggle) {
      elements.navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Enlaces de navegación con smooth scroll
    elements.navLinks.forEach((link, index) => {
      link.addEventListener('click', handleNavClick);
      
      // Animación escalonada de entrada
      if (state.animationsEnabled) {
        setTimeout(() => {
          link.classList.add('animate-fade-in');
        }, index * 100);
      }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', handleOutsideClick);

    // Navegación con teclado
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Actualizar navegación activa en scroll
    initializeActiveNavigation();
    
    resolve();
  });
}

// Toggle del menú móvil premium
function toggleMobileMenu() {
  state.isMenuOpen = !state.isMenuOpen;
  
  // Actualizar clases con animación
  elements.navToggle.classList.toggle('active', state.isMenuOpen);
  elements.navMenu.classList.toggle('active', state.isMenuOpen);
  
  // Prevenir scroll del body
  document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
  
  // Accesibilidad
  elements.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
  elements.navMenu.setAttribute('aria-hidden', !state.isMenuOpen);
  
  // Animación de los enlaces del menú
  if (state.isMenuOpen && state.animationsEnabled) {
    elements.navLinks.forEach((link, index) => {
      setTimeout(() => {
        link.classList.add('animate-slide-in-left');
      }, index * 50);
    });
  }
  
  // Feedback háptico en dispositivos compatibles
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Manejar clics en navegación con smooth scroll premium
function handleNavClick(e) {
  const href = e.target.getAttribute('href');
  
  if (href && href.startsWith('#')) {
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Cerrar menú móvil si está abierto
      if (state.isMenuOpen) {
        toggleMobileMenu();
      }
      
      // Smooth scroll premium con easing
      const offsetTop = targetElement.offsetTop - CONFIG.ui.scrollOffset;
      
      // Usar scroll nativo si está disponible
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        // Fallback para navegadores antiguos
        smoothScrollTo(offsetTop, 800);
      }
      
      // Actualizar estado activo
      updateActiveNavLink(e.target);
      
      // Analytics tracking (opcional)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'navigation_click', {
          'section': targetId
        });
      }
    }
  }
}

// Smooth scroll fallback
function smoothScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Actualizar enlace activo premium
function updateActiveNavLink(activeLink) {
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  activeLink.classList.add('active');
  
  // Animación del enlace activo
  if (state.animationsEnabled) {
    activeLink.classList.add('animate-scale-in');
    setTimeout(() => {
      activeLink.classList.remove('animate-scale-in');
    }, 500);
  }
}

// Navegación activa automática
function initializeActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (navLink) {
          updateActiveNavLink(navLink);
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -100px 0px'
  });
  
  sections.forEach(section => {
    navObserver.observe(section);
  });
}

// Cerrar menú al hacer clic fuera
function handleOutsideClick(e) {
  if (state.isMenuOpen && 
      !elements.navMenu.contains(e.target) && 
      !elements.navToggle.contains(e.target)) {
    toggleMobileMenu();
  }
}

// Navegación con teclado premium
function handleKeyNavigation(e) {
  switch(e.key) {
    case 'Escape':
      if (state.isMenuOpen) {
        toggleMobileMenu();
      }
      break;
    case 'Tab':
      // Mejorar navegación por teclado
      if (state.isMenuOpen) {
        const focusableElements = elements.navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      break;
  }
}

// Sistema de tabs premium
function initializeTabs() {
  return new Promise((resolve) => {
    elements.tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', handleTabClick);
      
      // Animación de entrada escalonada
      if (state.animationsEnabled) {
        setTimeout(() => {
          btn.classList.add('animate-fade-in');
        }, index * 100);
      }
    });
    
    // Activar primera tab por defecto
    if (elements.tabBtns.length > 0) {
      activateTab(state.activeTab);
    }
    
    resolve();
  });
}

// Manejar clic en tab premium
function handleTabClick(e) {
  const tabId = e.currentTarget.dataset.tab;
  if (tabId && tabId !== state.activeTab) {
    activateTab(tabId);
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'tab_click', {
        'tab_name': tabId
      });
    }
    
    // Feedback háptico
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
}

// Activar tab premium con animaciones
function activateTab(tabId) {
  state.activeTab = tabId;
  
  // Actualizar botones con animación
  elements.tabBtns.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
    
    if (isActive && state.animationsEnabled) {
      btn.classList.add('animate-scale-in');
      setTimeout(() => {
        btn.classList.remove('animate-scale-in');
      }, 300);
    }
  });
  
  // Actualizar paneles con animación suave
  elements.tabPanels.forEach(panel => {
    const isActive = panel.id === tabId;
    
    if (isActive) {
      panel.classList.add('active');
      panel.setAttribute('aria-hidden', 'false');
      
      if (state.animationsEnabled) {
        panel.classList.add('animate-fade-in');
        setTimeout(() => {
          panel.classList.remove('animate-fade-in');
        }, 600);
      }
    } else {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    }
  });
}

// Efectos de scroll premium optimizados
function initializeScrollEffects() {
  return new Promise((resolve) => {
    const throttledScrollHandler = throttle(updateScrollEffects, CONFIG.performance.throttleDelay);
    
    window.addEventListener('scroll', throttledScrollHandler, { 
      passive: true 
    });
    
    // Inicializar intersection observer para animaciones
    initializeIntersectionObserver();
    
    resolve();
  });
}

// Actualizar efectos de scroll premium
function updateScrollEffects() {
  state.scrollY = window.scrollY;
  
  // Navbar scroll effect premium
  if (elements.navbar) {
    const shouldAddScrolled = state.scrollY > 50;
    elements.navbar.classList.toggle('scrolled', shouldAddScrolled);
  }
  
  // Floating CTA premium
  if (elements.floatingCta) {
    const shouldShow = state.scrollY > window.innerHeight * CONFIG.ui.floatingCtaOffset;
    elements.floatingCta.classList.toggle('visible', shouldShow);
  }
  
  // Parallax effect para hero (opcional)
  const heroSection = document.querySelector('.hero');
  if (heroSection && state.scrollY < window.innerHeight) {
    const parallaxSpeed = 0.5;
    const yPos = -(state.scrollY * parallaxSpeed);
    heroSection.style.transform = `translateY(${yPos}px)`;
  }
}

// Intersection Observer premium para animaciones
function initializeIntersectionObserver() {
  if (!state.animationsEnabled) return;
  
  state.observers.intersection = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Animación escalonada
        setTimeout(() => {
          entry.target.classList.add('animate-fade-in-up');
        }, index * CONFIG.animations.stagger);
        
        // Dejar de observar el elemento
        state.observers.intersection.unobserve(entry.target);
      }
    });
  }, {
    threshold: CONFIG.performance.intersectionThreshold,
    rootMargin: CONFIG.performance.rootMargin
  });
  
  // Observar elementos animables
  const animatableElements = document.querySelectorAll(
    '.feature-card:not(.animate-fade-in-up), .benefit-content:not(.animate-fade-in-up), .timeline-item:not(.animate-fade-in-up), .next-step-item:not(.animate-fade-in-up), .step:not(.animate-fade-in-up), .logo-item:not(.animate-fade-in-up)'
  );
  
  animatableElements.forEach(el => {
    state.observers.intersection.observe(el);
  });
}

// Sistema de formulario premium
function initializeContactForm() {
  return new Promise((resolve) => {
    if (!elements.contactForm) {
      resolve();
      return;
    }
    
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real premium
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', debounce(validateField, CONFIG.performance.debounceDelay));
      input.addEventListener('input', clearFieldError);
      
      // Animación de focus
      input.addEventListener('focus', function() {
        if (state.animationsEnabled) {
          this.parentNode.classList.add('animate-scale-in');
          setTimeout(() => {
            this.parentNode.classList.remove('animate-scale-in');
          }, 300);
        }
      });
    });
    
    resolve();
  });
}

// Manejar envío del formulario premium
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(elements.contactForm);
  const data = Object.fromEntries(formData);
  
  // Validar formulario
  if (!validateForm(data)) {
    showNotification('Por favor, corrige los errores en el formulario.', 'error');
    return;
  }
  
  // Mostrar estado de carga premium
  const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  
  try {
    // Simular envío (reemplazar con tu endpoint real)
    await simulateFormSubmission(data);
    
    // Mostrar éxito con animación
    showNotification('¡Mensaje enviado correctamente! Te contactaremos en menos de 24 horas.', 'success');
    
    // Resetear formulario con animación
    elements.contactForm.reset();
    
    if (state.animationsEnabled) {
      elements.contactForm.classList.add('animate-scale-in');
      setTimeout(() => {
        elements.contactForm.classList.remove('animate-scale-in');
      }, 500);
    }
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        'form_name': 'contact'
      });
    }
    
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
    
    // Analytics tracking del error
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_error', {
        'error_message': error.message
      });
    }
  } finally {
    // Restaurar botón
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

// Simular envío del formulario premium
function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    // Simular tiempo de red variable
    const delay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      // Simular éxito/error (95% éxito)
      if (Math.random() > 0.05) {
        resolve(data);
      } else {
        reject(new Error('Error de conexión simulado'));
      }
    }, delay);
  });
}

// Validación de formulario premium
function validateForm(data) {
  let isValid = true;
  const errors = [];
  
  // Validar nombre
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
    errors.push('name');
    isValid = false;
  }
  
  // Validar empresa
  if (!data.company || data.company.trim().length < 2) {
    showFieldError('company', 'La empresa es requerida');
    errors.push('company');
    isValid = false;
  }
  
  // Validar email con regex más robusta
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Por favor, ingresa un email válido');
    errors.push('email');
    isValid = false;
  }
  
  // Validar mensaje
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
    errors.push('message');
    isValid = false;
  }
  
  // Analytics tracking de errores de validación
  if (!isValid && typeof gtag !== 'undefined') {
    gtag('event', 'form_validation_error', {
      'errors': errors.join(',')
    });
  }
  
  return isValid;
}

// Validar campo individual premium
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  const name = field.name;
  
  clearFieldError(name);
  
  switch (name) {
    case 'name':
      if (value.length > 0 && value.length < 2) {
        showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
      } else if (value.length > 50) {
        showFieldError('name', 'El nombre no puede exceder 50 caracteres');
      }
      break;
      
    case 'company':
      if (value.length > 0 && value.length < 2) {
        showFieldError('company', 'La empresa debe tener al menos 2 caracteres');
      } else if (value.length > 100) {
        showFieldError('company', 'El nombre de la empresa no puede exceder 100 caracteres');
      }
      break;
      
    case 'email':
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (value && !emailRegex.test(value)) {
        showFieldError('email', 'Por favor, ingresa un email válido');
      }
      break;
      
    case 'message':
      if (value.length > 0 && value.length < 10) {
        showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
      } else if (value.length > 1000) {
        showFieldError('message', 'El mensaje no puede exceder 1000 caracteres');
      }
      break;
  }
}

// Mostrar error en campo premium
function showFieldError(fieldName, message) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;
  
  field.classList.add('error');
  
  let errorElement = field.parentNode.querySelector('.field-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    field.parentNode.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  
  // Animación de error
  if (state.animationsEnabled) {
    errorElement.classList.add('animate-slide-in-left');
    setTimeout(() => {
      errorElement.classList.remove('animate-slide-in-left');
    }, 300);
  }
  
  // Feedback háptico para errores
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
}

// Limpiar error de campo premium
function clearFieldError(fieldName) {
  const name = typeof fieldName === 'string' ? fieldName : fieldName.target.name;
  const field = document.querySelector(`[name="${name}"]`);
  if (!field) return;
  
  field.classList.remove('error');
  
  const errorElement = field.parentNode.querySelector('.field-error');
  if (errorElement) {
    if (state.animationsEnabled) {
      errorElement.style.opacity = '0';
      errorElement.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        errorElement.remove();
      }, 200);
    } else {
      errorElement.remove();
    }
  }
}

// Sistema de notificaciones premium
function showNotification(message, type = 'info', duration = CONFIG.ui.notificationDuration) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Icono según el tipo
  const icons = {
    success: 'ph-check-circle',
    error: 'ph-x-circle',
    info: 'ph-info',
    warning: 'ph-warning'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="ph ${icons[type] || icons.info}"></i>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Cerrar notificación">
        <i class="ph ph-x"></i>
      </button>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(notification);
  
  // Mostrar con animación premium
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Manejar cierre
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    hideNotification(notification);
  });
  
  // Auto-ocultar
  const autoHideTimer = setTimeout(() => {
    if (document.body.contains(notification)) {
      hideNotification(notification);
    }
  }, duration);
  
  // Pausar auto-hide en hover
  notification.addEventListener('mouseenter', () => {
    clearTimeout(autoHideTimer);
  });
  
  notification.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (document.body.contains(notification)) {
        hideNotification(notification);
      }
    }, 2000);
  });
  
  return notification;
}

// Ocultar notificación premium
function hideNotification(notification) {
  notification.classList.remove('show');
  
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 300);
}

// Sistema de animaciones premium
function initializeAnimations() {
  return new Promise((resolve) => {
    if (!state.animationsEnabled) {
      resolve();
      return;
    }
    
    // Animación de contadores en hero stats
    if (elements.heroStats.length > 0) {
      initializeStatsAnimation();
    }
    
    // Animaciones de entrada para elementos principales
    initializeEntranceAnimations();
    
    // Animaciones de hover avanzadas
    initializeHoverAnimations();
    
    resolve();
  });
}

// Animación de contadores premium
function initializeStatsAnimation() {
  state.observers.stats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        state.observers.stats.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  });
  
  elements.heroStats.forEach(stat => {
    state.observers.stats.observe(stat);
  });
}

// Animar contador premium con easing
function animateCounter(statElement) {
  const numberElement = statElement.querySelector('.stat-number');
  if (!numberElement) return;
  
  const text = numberElement.textContent;
  const finalValue = parseInt(text);
  
  // Solo animar si es un número
  if (isNaN(finalValue)) return;
  
  const duration = 2000;
  const startTime = performance.now();
  const suffix = text.includes('%') ? '%' : '';
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function premium (easeOutExpo)
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = Math.floor(finalValue * easeOutExpo);
    
    numberElement.textContent = currentValue + suffix;
    
    // Efecto de brillo durante la animación
    const glowIntensity = Math.sin(progress * Math.PI);
    numberElement.style.textShadow = `0 0 ${glowIntensity * 20}px rgba(255, 107, 53, ${glowIntensity * 0.5})`;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      numberElement.textContent = text;
      numberElement.style.textShadow = '';
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Animaciones de entrada premium
function initializeEntranceAnimations() {
  // Animación del hero
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions');
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('animate-fade-in-up');
    }, index * 200);
  });
  
  // Animación de las tarjetas de características
  elements.featureCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-fade-in-up');
    }, index * 100);
  });
}

// Animaciones de hover avanzadas
function initializeHoverAnimations() {
  // Efecto de ondas en botones
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  buttons.forEach(button => {
    button.addEventListener('click', createRippleEffect);
  });
  
  // Efecto parallax en tarjetas
  const cards = document.querySelectorAll('.feature-card, .step, .next-step-item');
  cards.forEach(card => {
    card.addEventListener('mousemove', handleCardParallax);
    card.addEventListener('mouseleave', resetCardParallax);
  });
}

// Efecto de ondas en botones
function createRippleEffect(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  const ripple = document.createElement('span');
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
  `;
  
  // Agregar keyframes si no existen
  if (!document.querySelector('#ripple-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ripple-keyframes';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Efecto parallax en tarjetas
function handleCardParallax(e) {
  if (!state.animationsEnabled) return;
  
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
}

// Resetear parallax en tarjetas
function resetCardParallax(e) {
  if (!state.animationsEnabled) return;
  
  const card = e.currentTarget;
  card.style.transform = '';
}

// Sistema de accesibilidad premium
function initializeAccessibility() {
  return new Promise((resolve) => {
    // Agregar atributos ARIA premium
    elements.navLinks.forEach((link, index) => {
      link.setAttribute('role', 'menuitem');
      link.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    
    if (elements.navMenu) {
      elements.navMenu.setAttribute('role', 'menu');
      elements.navMenu.setAttribute('aria-hidden', 'true');
    }
    
    if (elements.navToggle) {
      elements.navToggle.setAttribute('aria-expanded', 'false');
      elements.navToggle.setAttribute('aria-controls', 'navMenu');
      elements.navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    }
    
    // Tabs accesibilidad premium
    elements.tabBtns.forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
    });
    
    elements.tabPanels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-hidden', 'true');
    });
    
    // Mejorar navegación por teclado
    initializeKeyboardNavigation();
    
    // Anuncios para lectores de pantalla
    initializeScreenReaderAnnouncements();
    
    resolve();
  });
}

// Navegación por teclado premium
function initializeKeyboardNavigation() {
  // Navegación en tabs con flechas
  elements.tabBtns.forEach((btn, index) => {
    btn.addEventListener('keydown', (e) => {
      let targetIndex;
      
      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          targetIndex = (index + 1) % elements.tabBtns.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          targetIndex = (index - 1 + elements.tabBtns.length) % elements.tabBtns.length;
          break;
        case 'Home':
          e.preventDefault();
          targetIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          targetIndex = elements.tabBtns.length - 1;
          break;
        default:
          return;
      }
      
      if (targetIndex !== undefined) {
        elements.tabBtns[targetIndex].focus();
        elements.tabBtns[targetIndex].click();
      }
    });
  });
}

// Anuncios para lectores de pantalla
function initializeScreenReaderAnnouncements() {
  // Crear región de anuncios
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
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
  document.body.appendChild(announcer);
  
  // Función para anunciar cambios
  window.announceToScreenReader = function(message) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  };
}

// Optimizaciones de rendimiento premium
function initializePerformanceOptimizations() {
  return new Promise((resolve) => {
    // Lazy loading para imágenes
    initializeLazyLoading();
    
    // Preload de recursos críticos
    preloadCriticalResources();
    
    // Optimización de fuentes
    optimizeFontLoading();
    
    // Service Worker (opcional)
    initializeServiceWorker();
    
    resolve();
  });
}

// Lazy loading premium para imágenes
function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Crear imagen temporal para precargar
          const tempImg = new Image();
          tempImg.onload = () => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
          };
          tempImg.src = img.dataset.src;
          
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Preload de recursos críticos
function preloadCriticalResources() {
  const criticalResources = [
    { href: 'Assets/NODO-LOCKER_ICONO.gif', as: 'image' },
    { href: 'Assets/NODO LOCKER.jpg', as: 'image' },
    { href: 'Assets/amazon-logo.svg', as: 'image' },
    { href: 'Assets/InPost_logo.svg.png', as: 'image' },
    { href: 'Assets/dhl-1.svg', as: 'image' },
    { href: 'Assets/hive.svg', as: 'image' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = resource.as;
    link.href = resource.href;
    document.head.appendChild(link);
  });
}

// Optimización de carga de fuentes
function optimizeFontLoading() {
  if ('fonts' in document) {
    // Precargar fuentes críticas
    const fonts = [
      new FontFace('Space Grotesk', 'url(https://fonts.gstatic.com/s/spacegrotesk/v13/V8mQQoyeyHLkTFD_SdVAFQpH_p83BHsGi4Mr.woff2)'),
      new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)')
    ];
    
    fonts.forEach(font => {
      font.load().then(loadedFont => {
        document.fonts.add(loadedFont);
      }).catch(error => {
        console.warn('Error cargando fuente:', error);
      });
    });
  }
}

// Service Worker para caché (opcional)
function initializeServiceWorker() {
  if ('serviceWorker' in navigator && 'production' === 'production') {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado:', registration);
      })
      .catch(error => {
        console.log('Error registrando Service Worker:', error);
      });
  }
}

// Sistema de botones CTA premium
function initializeCTAButtons() {
  return new Promise((resolve) => {
    // Botón de descarga
    if (elements.ctaButtons.download) {
      elements.ctaButtons.download.addEventListener('click', function() {
        handleDownload();
        trackEvent('download_presentation');
      });
    }
    
    // Botón de demo
    if (elements.ctaButtons.learnMore) {
      elements.ctaButtons.learnMore.addEventListener('click', function() {
        handleDemo();
        trackEvent('view_demo');
      });
    }
    
    // Botones de MVP
    const mvpButtons = [elements.ctaButtons.joinWaitlist, elements.ctaButtons.ctaJoin];
    mvpButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', function() {
          handleJoinMVP();
          trackEvent('join_mvp');
        });
      }
    });
    
    // Botones de reunión
    const scheduleButtons = [elements.ctaButtons.floatingCta, elements.ctaButtons.schedule];
    scheduleButtons.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', function() {
          handleScheduleMeeting();
          trackEvent('schedule_meeting');
        });
      }
    });
    
    // Botón de integración
    if (elements.ctaButtons.integrate) {
      elements.ctaButtons.integrate.addEventListener('click', function() {
        handleIntegration();
        trackEvent('integration_interest');
      });
    }
    
    resolve();
  });
}

// Manejar descarga de presentación
function handleDownload() {
  showNotification('Preparando descarga de la presentación...', 'info');
  
  // Simular descarga
  setTimeout(() => {
    // Crear enlace de descarga simulado
    const link = document.createElement('a');
    link.href = '#'; // Aquí iría la URL real del archivo
    link.download = 'Nodo_Locker_Presentacion.pdf';
    
    showNotification('Descarga iniciada. El archivo se guardará en tu carpeta de descargas.', 'success');
    
    // En producción, aquí harías la descarga real
    // link.click();
  }, 1000);
}

// Manejar demo
function handleDemo() {
  showNotification('Demo interactivo próximamente disponible. Te notificaremos cuando esté listo.', 'info');
  
  // Opcional: abrir modal con video o redirigir
  // window.open('https://demo.nodolocker.com', '_blank');
}

// Manejar unirse al MVP
function handleJoinMVP() {
  showNotification('¡Excelente! Te hemos agregado a nuestra lista de early adopters. Te contactaremos pronto con detalles exclusivos del MVP.', 'success');
  
  // Opcional: abrir modal de registro o redirigir
  // window.open('https://forms.nodolocker.com/mvp', '_blank');
}

// Manejar agendar reunión
function handleScheduleMeeting() {
  showNotification('Redirigiendo a nuestro calendario de reuniones...', 'info');
  
  setTimeout(() => {
    // En producción, redirigir a Calendly o similar
    // window.open('https://calendly.com/nodolocker/reunion-tecnica', '_blank');
    showNotification('Calendario abierto en nueva pestaña. Si no se abrió automáticamente, revisa el bloqueador de ventanas emergentes.', 'info');
  }, 1500);
}

// Manejar integración
function handleIntegration() {
  const contactSection = document.getElementById('contacto');
  if (contactSection) {
    // Scroll suave al formulario
    contactSection.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      showNotification('Completa el formulario para discutir la integración de tu operación con nuestro equipo técnico.', 'info');
      
      // Pre-llenar el mensaje del formulario
      const messageField = document.querySelector('#message');
      if (messageField && !messageField.value) {
        messageField.value = 'Estoy interesado en integrar Nodo Locker con mi operación actual. Me gustaría agendar una reunión técnica para discutir los detalles.';
        messageField.focus();
      }
    }, 1000);
  }
}

// Tracking de eventos (Analytics)
function trackEvent(eventName, parameters = {}) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'CTA',
      event_label: eventName,
      ...parameters
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', {
      content_name: eventName
    });
  }
  
  // Console log para desarrollo
  console.log('📊 Event tracked:', eventName, parameters);
}

// Utilidades premium
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

// Detección de dispositivo
function getDeviceType() {
  const width = window.innerWidth;
  if (width < CONFIG.breakpoints.mobile) return 'mobile';
  if (width < CONFIG.breakpoints.tablet) return 'tablet';
  return 'desktop';
}

// Detección de capacidades del navegador
function getBrowserCapabilities() {
  return {
    webp: checkWebPSupport(),
    intersectionObserver: 'IntersectionObserver' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webGL: checkWebGLSupport(),
    touchDevice: 'ontouchstart' in window
  };
}

function checkWebPSupport() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch (e) {
    return false;
  }
}

// Manejo de errores global premium
window.addEventListener('error', function(e) {
  console.error('Error global capturado:', e.error);
  
  // Tracking de errores
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: e.error?.message || 'Unknown error',
      fatal: false
    });
  }
  
  // Mostrar notificación amigable al usuario
  if (state.isLoaded) {
    showNotification('Se produjo un error inesperado. La página seguirá funcionando normalmente.', 'warning');
  }
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', function(e) {
  console.error('Promesa rechazada no manejada:', e.reason);
  
  // Tracking de errores de promesas
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: e.reason?.message || 'Unhandled promise rejection',
      fatal: false
    });
  }
});

// Performance monitoring premium
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
      const domReady = Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart);
      const firstPaint = Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0);
      
      console.log('⚡ Métricas de rendimiento:');
      console.log(`   • Tiempo de carga total: ${loadTime}ms`);
      console.log(`   • DOM listo: ${domReady}ms`);
      console.log(`   • First Paint: ${firstPaint}ms`);
      
      // Tracking de performance
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'load',
          value: loadTime
        });
        
        gtag('event', 'timing_complete', {
          name: 'dom_ready',
          value: domReady
        });
      }
      
      // Alertar si el rendimiento es pobre
      if (loadTime > 3000) {
        console.warn('⚠️ Tiempo de carga lento detectado');
      }
    }, 0);
  });
}

// Detectar cambios en preferencias de movimiento
if (window.matchMedia) {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  motionQuery.addListener(function(e) {
    state.animationsEnabled = !e.matches;
    
    if (!state.animationsEnabled) {
      // Desactivar animaciones existentes
      document.querySelectorAll('.animate-fade-in-up, .animate-fade-in, .animate-slide-in-left, .animate-slide-in-right, .animate-scale-in').forEach(el => {
        el.classList.remove('animate-fade-in-up', 'animate-fade-in', 'animate-slide-in-left', 'animate-slide-in-right', 'animate-scale-in');
      });
      
      // Limpiar observers de animación
      if (state.observers.intersection) {
        state.observers.intersection.disconnect();
      }
      if (state.observers.stats) {
        state.observers.stats.disconnect();
      }
    }
  });
}

// Detectar cambios de orientación
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    // Recalcular dimensiones después del cambio de orientación
    updateScrollEffects();
    
    // Reinicializar intersection observers si es necesario
    if (state.animationsEnabled && state.observers.intersection) {
      state.observers.intersection.disconnect();
      initializeIntersectionObserver();
    }
  }, 100);
});

// Detectar cambios de visibilidad de la página
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pausar animaciones cuando la página no es visible
    document.body.classList.add('page-hidden');
  } else {
    // Reanudar animaciones cuando la página vuelve a ser visible
    document.body.classList.remove('page-hidden');
  }
});

// Cleanup al descargar la página
window.addEventListener('beforeunload', function() {
  // Limpiar observers
  if (state.observers.intersection) {
    state.observers.intersection.disconnect();
  }
  if (state.observers.stats) {
    state.observers.stats.disconnect();
  }
  
  // Limpiar timers activos
  clearTimeout();
  clearInterval();
});

// Exportar funciones para uso global (opcional)
window.NodoLocker = {
  showNotification,
  trackEvent,
  getDeviceType,
  getBrowserCapabilities,
  state: state,
  config: CONFIG
};

// Mensaje de consola para desarrolladores
console.log(`
🚀 Nodo Locker - Sistema de Lockers Inteligentes
📧 Desarrollado con ❤️ para revolucionar la logística urbana
🔧 Versión: 1.0.0
⚡ Rendimiento optimizado y accesibilidad premium
`);

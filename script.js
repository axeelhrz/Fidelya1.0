// Configuración OPTIMIZADA para mejor rendimiento
const CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  animations: {
    duration: 200, // Más rápido
    easing: 'ease'
  },
  performance: {
    throttleDelay: 16, // 60fps
    debounceDelay: 150
  }
};

// Cache de elementos DOM OPTIMIZADO
const elements = {
  navbar: null,
  navToggle: null,
  navMenu: null,
  navLinks: null,
  floatingCta: null,
  tabBtns: null,
  tabPanels: null,
  contactForm: null,
  heroStats: null,
  featureCards: null
};

// Estado de la aplicación SIMPLIFICADO
const state = {
  isMenuOpen: false,
  activeTab: 'couriers',
  scrollY: 0,
  isScrolling: false,
  animationsEnabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// Inicialización OPTIMIZADA cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  initializeNavigation();
  initializeTabs();
  initializeScrollEffects();
  initializeContactForm();
  initializeAnimations();
  initializeAccessibility();
  initializePerformanceOptimizations();
  
  console.log('🚀 Nodo Locker - Aplicación inicializada correctamente');
});

// Inicializar elementos del DOM OPTIMIZADO
function initializeElements() {
  elements.navbar = document.querySelector('.navbar');
  elements.navToggle = document.querySelector('.nav-toggle');
  elements.navMenu = document.querySelector('.nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  elements.floatingCta = document.querySelector('.floating-cta');
  elements.tabBtns = document.querySelectorAll('.tab-btn');
  elements.tabPanels = document.querySelectorAll('.tab-panel');
  elements.contactForm = document.querySelector('#contactForm');
  elements.heroStats = document.querySelectorAll('.stat');
  elements.featureCards = document.querySelectorAll('.feature-card');
}

// Navegación OPTIMIZADA
function initializeNavigation() {
  // Toggle del menú móvil
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Enlaces de navegación
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', handleOutsideClick);

  // Navegación con teclado
  document.addEventListener('keydown', handleKeyNavigation);
}

// Toggle del menú móvil OPTIMIZADO
function toggleMobileMenu() {
  state.isMenuOpen = !state.isMenuOpen;
  
  elements.navToggle.classList.toggle('active', state.isMenuOpen);
  elements.navMenu.classList.toggle('active', state.isMenuOpen);
  
  // Prevenir scroll del body cuando el menú está abierto
  document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
  
  // Accesibilidad
  elements.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
  elements.navMenu.setAttribute('aria-hidden', !state.isMenuOpen);
}

// Manejar clics en navegación OPTIMIZADO
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
      
      // Scroll suave OPTIMIZADO
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Actualizar estado activo
      updateActiveNavLink(e.target);
    }
  }
}

// Actualizar enlace activo OPTIMIZADO
function updateActiveNavLink(activeLink) {
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
  });
  activeLink.classList.add('active');
}

// Cerrar menú al hacer clic fuera
function handleOutsideClick(e) {
  if (state.isMenuOpen && 
      !elements.navMenu.contains(e.target) && 
      !elements.navToggle.contains(e.target)) {
    toggleMobileMenu();
  }
}

// Navegación con teclado
function handleKeyNavigation(e) {
  if (e.key === 'Escape' && state.isMenuOpen) {
    toggleMobileMenu();
  }
}

// Sistema de tabs OPTIMIZADO
function initializeTabs() {
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', handleTabClick);
  });
  
  // Activar primera tab por defecto
  if (elements.tabBtns.length > 0) {
    activateTab(state.activeTab);
  }
}

// Manejar clic en tab OPTIMIZADO
function handleTabClick(e) {
  const tabId = e.currentTarget.dataset.tab;
  if (tabId) {
    activateTab(tabId);
  }
}

// Activar tab OPTIMIZADO
function activateTab(tabId) {
  state.activeTab = tabId;
  
  // Actualizar botones
  elements.tabBtns.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  
  // Actualizar paneles con animación más rápida
  elements.tabPanels.forEach(panel => {
    const isActive = panel.id === tabId;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', !isActive);
  });
}

// Efectos de scroll OPTIMIZADOS con throttling
function initializeScrollEffects() {
  const throttledScrollHandler = throttle(updateScrollEffects, CONFIG.performance.throttleDelay);
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
}

// Actualizar efectos de scroll OPTIMIZADO
function updateScrollEffects() {
  state.scrollY = window.scrollY;
  
  // Navbar scroll effect OPTIMIZADO
  if (elements.navbar) {
    elements.navbar.classList.toggle('scrolled', state.scrollY > 50);
  }
  
  // Floating CTA OPTIMIZADO
  if (elements.floatingCta) {
    const shouldShow = state.scrollY > window.innerHeight * 0.3;
    elements.floatingCta.classList.toggle('visible', shouldShow);
  }
  
  // Intersection Observer para animaciones
  if (state.animationsEnabled) {
    observeElements();
  }
}

// Observer para animaciones OPTIMIZADO
let observer;
let observedElements = new Set();

function observeElements() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && state.animationsEnabled) {
          // Animación más rápida y sutil
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
          observedElements.delete(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });
  }
  
  // Observar elementos animables OPTIMIZADO
  const animatableElements = document.querySelectorAll(
    '.feature-card:not(.animate-fade-in-up), .benefit-content:not(.animate-fade-in-up), .timeline-item:not(.animate-fade-in-up), .next-step-item:not(.animate-fade-in-up), .step:not(.animate-fade-in-up)'
  );
  
  animatableElements.forEach(el => {
    if (!observedElements.has(el)) {
      observer.observe(el);
      observedElements.add(el);
    }
  });
}

// Formulario de contacto OPTIMIZADO
function initializeContactForm() {
  if (elements.contactForm) {
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real OPTIMIZADA
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', debounce(validateField, CONFIG.performance.debounceDelay));
      input.addEventListener('input', clearFieldError);
    });
  }
}

// Manejar envío del formulario OPTIMIZADO
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(elements.contactForm);
  const data = Object.fromEntries(formData);
  
  // Validar formulario
  if (!validateForm(data)) {
    return;
  }
  
  // Mostrar estado de carga OPTIMIZADO
  const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  
  try {
    // Simular envío (reemplazar con tu endpoint)
    await simulateFormSubmission(data);
    
    // Mostrar éxito
    showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
    elements.contactForm.reset();
    
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    showNotification('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
  } finally {
    // Restaurar botón
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

// Simular envío del formulario OPTIMIZADO
function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular éxito/error aleatorio para demo
      Math.random() > 0.1 ? resolve(data) : reject(new Error('Error simulado'));
    }, 1500); // Más rápido
  });
}

// Validar formulario OPTIMIZADO
function validateForm(data) {
  let isValid = true;
  
  // Validar nombre
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
    isValid = false;
  }
  
  // Validar empresa
  if (!data.company || data.company.trim().length < 2) {
    showFieldError('company', 'La empresa es requerida');
    isValid = false;
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Por favor, ingresa un email válido');
    isValid = false;
  }
  
  // Validar mensaje
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
    isValid = false;
  }
  
  return isValid;
}

// Validar campo individual OPTIMIZADO
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  clearFieldError(field.name);
  
  switch (field.name) {
    case 'name':
      if (value.length > 0 && value.length < 2) {
        showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
      }
      break;
    case 'company':
      if (value.length > 0 && value.length < 2) {
        showFieldError('company', 'La empresa es requerida');
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        showFieldError('email', 'Por favor, ingresa un email válido');
      }
      break;
    case 'message':
      if (value.length > 0 && value.length < 10) {
        showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
      }
      break;
  }
}

// Mostrar error en campo OPTIMIZADO
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
}

// Limpiar error de campo OPTIMIZADO
function clearFieldError(fieldName) {
  const field = typeof fieldName === 'string' ? 
    document.querySelector(`[name="${fieldName}"]`) : fieldName.target;
  if (!field) return;
  
  const name = typeof fieldName === 'string' ? fieldName : field.name;
  const targetField = document.querySelector(`[name="${name}"]`);
  if (!targetField) return;
  
  targetField.classList.remove('error');
  
  const errorElement = targetField.parentNode.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}

// Mostrar notificación OPTIMIZADA
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Cerrar notificación">×</button>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(notification);
  
  // Mostrar con animación OPTIMIZADA
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Manejar cierre
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    hideNotification(notification);
  });
  
  // Auto-ocultar después de 4 segundos (más rápido)
  setTimeout(() => {
    if (document.body.contains(notification)) {
      hideNotification(notification);
    }
  }, 4000);
}

// Ocultar notificación OPTIMIZADA
function hideNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 200); // Más rápido
}

// Inicializar animaciones OPTIMIZADAS
function initializeAnimations() {
  // Solo si las animaciones están habilitadas
  if (!state.animationsEnabled) return;
  
  // Animación de contadores en hero stats OPTIMIZADA
  if (elements.heroStats.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    elements.heroStats.forEach(stat => {
      statsObserver.observe(stat);
    });
  }
}

// Animar contador OPTIMIZADO
function animateCounter(statElement) {
  const numberElement = statElement.querySelector('.stat-number');
  if (!numberElement) return;
  
  const text = numberElement.textContent;
  const finalValue = parseInt(text);
  
  // Solo animar si es un número
  if (isNaN(finalValue)) return;
  
  const duration = 1500; // Más rápido
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function OPTIMIZADA
    const easeOutQuart = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(finalValue * easeOutQuart);
    
    numberElement.textContent = currentValue + (text.includes('%') ? '%' : '');
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      numberElement.textContent = text;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Inicializar accesibilidad OPTIMIZADA
function initializeAccessibility() {
  // Agregar atributos ARIA
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
  }
  
  // Tabs accesibilidad
  elements.tabBtns.forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
  });
  
  elements.tabPanels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-hidden', 'true');
  });
}

// Inicializar optimizaciones de rendimiento
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
  const criticalResources = [
    'Assets/NODO-LOCKER_ICONO.gif',
    'Assets/NODO LOCKER.jpg'
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Event listeners para botones CTA OPTIMIZADOS
document.addEventListener('DOMContentLoaded', function() {
  // Botones de descarga y demo
  const downloadBtn = document.getElementById('downloadBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const joinWaitlistBtn = document.getElementById('joinWaitlistBtn');
  const floatingCtaBtn = document.getElementById('floatingCtaBtn');
  const scheduleBtn = document.getElementById('scheduleBtn');
  const integrateBtn = document.getElementById('integrateBtn');
  const ctaJoinBtn = document.getElementById('ctaJoinBtn');
  
  // Simular descarga de presentación
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      showNotification('Descarga iniciada. El archivo se guardará en tu carpeta de descargas.', 'success');
      // Aquí podrías agregar la lógica real de descarga
    });
  }
  
  // Simular demo
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function() {
      showNotification('Demo próximamente disponible. Te notificaremos cuando esté lista.', 'info');
    });
  }
  
  // Unirse al MVP
  const mvpButtons = [joinWaitlistBtn, ctaJoinBtn];
  mvpButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', function() {
        showNotification('¡Gracias por tu interés! Te contactaremos pronto para incluirte en el MVP.', 'success');
      });
    }
  });
  
  // Agendar reunión
  const scheduleButtons = [floatingCtaBtn, scheduleBtn];
  scheduleButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', function() {
        showNotification('Redirigiendo a calendario de reuniones...', 'info');
        // Aquí podrías redirigir a Calendly o similar
      });
    }
  });
  
  // Integrar operación
  if (integrateBtn) {
    integrateBtn.addEventListener('click', function() {
      // Scroll al formulario de contacto
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showNotification('Completa el formulario para discutir la integración de tu operación.', 'info');
      }
    });
  }
});

// Utilidades OPTIMIZADAS
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

// Manejo de errores global OPTIMIZADO
window.addEventListener('error', function(e) {
  console.error('Error global capturado:', e.error);
  // En producción, podrías enviar esto a un servicio de logging
});

// Performance monitoring OPTIMIZADO
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
      console.log('⚡ Tiempo de carga:', loadTime, 'ms');
      
      // Métricas adicionales
      if (perfData.domContentLoadedEventEnd) {
        const domReady = Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart);
        console.log('📄 DOM listo en:', domReady, 'ms');
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
      document.querySelectorAll('.animate-fade-in-up').forEach(el => {
        el.classList.remove('animate-fade-in-up');
      });
    }
  });
}
// Configuración y variables globales
const CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  animations: {
    duration: 300,
    easing: 'ease'
  }
};

// Cache de elementos DOM
const elements = {
  navbar: null,
  navToggle: null,
  navMenu: null,
  navLinks: null,
  floatingCta: null,
  tabBtns: null,
  tabPanels: null,
  contactForm: null,
  heroStats: null
};

// Estado de la aplicación
const state = {
  isMenuOpen: false,
  activeTab: 'couriers',
  scrollY: 0,
  isScrolling: false
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  initializeNavigation();
  initializeTabs();
  initializeScrollEffects();
  initializeContactForm();
  initializeAnimations();
  initializeAccessibility();
  
  console.log('🚀 Nodo Locker - Aplicación inicializada correctamente');
});

// Inicializar elementos del DOM
function initializeElements() {
  elements.navbar = document.querySelector('.navbar');
  elements.navToggle = document.querySelector('.nav-toggle');
  elements.navMenu = document.querySelector('.nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  elements.floatingCta = document.querySelector('.floating-cta');
  elements.tabBtns = document.querySelectorAll('.tab-btn');
  elements.tabPanels = document.querySelectorAll('.tab-panel');
  elements.contactForm = document.querySelector('#contact-form');
  elements.heroStats = document.querySelectorAll('.stat');
}

// Navegación
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

// Toggle del menú móvil
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

// Manejar clics en navegación
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
      
      // Scroll suave al elemento
      const offsetTop = targetElement.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Actualizar estado activo
      updateActiveNavLink(e.target);
    }
  }
}

// Actualizar enlace activo
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

// Sistema de tabs
function initializeTabs() {
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', handleTabClick);
  });
  
  // Activar primera tab por defecto
  if (elements.tabBtns.length > 0) {
    activateTab(state.activeTab);
  }
}

// Manejar clic en tab
function handleTabClick(e) {
  const tabId = e.currentTarget.dataset.tab;
  if (tabId) {
    activateTab(tabId);
  }
}

// Activar tab
function activateTab(tabId) {
  state.activeTab = tabId;
  
  // Actualizar botones
  elements.tabBtns.forEach(btn => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  
  // Actualizar paneles
  elements.tabPanels.forEach(panel => {
    const isActive = panel.id === `${tabId}-panel`;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', !isActive);
  });
}

// Efectos de scroll
function initializeScrollEffects() {
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
}

// Actualizar efectos de scroll
function updateScrollEffects() {
  state.scrollY = window.scrollY;
  
  // Navbar scroll effect
  if (elements.navbar) {
    elements.navbar.classList.toggle('scrolled', state.scrollY > 50);
  }
  
  // Floating CTA
  if (elements.floatingCta) {
    const shouldShow = state.scrollY > window.innerHeight * 0.5;
    elements.floatingCta.classList.toggle('visible', shouldShow);
  }
  
  // Intersection Observer para animaciones
  observeElements();
  
  ticking = false;
}

// Observer para animaciones
let observer;

function observeElements() {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }
  
  // Observar elementos animables
  const animatableElements = document.querySelectorAll(
    '.feature-card, .benefit-content, .timeline-item, .next-step-item, .logo-item'
  );
  
  animatableElements.forEach(el => {
    if (!el.classList.contains('animate-fade-in-up')) {
      observer.observe(el);
    }
  });
}

// Formulario de contacto
function initializeContactForm() {
  if (elements.contactForm) {
    elements.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real
    const inputs = elements.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });
  }
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(elements.contactForm);
  const data = Object.fromEntries(formData);
  
  // Validar formulario
  if (!validateForm(data)) {
    return;
  }
  
  // Mostrar estado de carga
  const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;
  
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
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Simular envío del formulario
function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular éxito/error aleatorio para demo
      Math.random() > 0.1 ? resolve(data) : reject(new Error('Error simulado'));
    }, 2000);
  });
}

// Validar formulario
function validateForm(data) {
  let isValid = true;
  
  // Validar nombre
  if (!data.nombre || data.nombre.trim().length < 2) {
    showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
    isValid = false;
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Por favor, ingresa un email válido');
    isValid = false;
  }
  
  // Validar mensaje
  if (!data.mensaje || data.mensaje.trim().length < 10) {
    showFieldError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
    isValid = false;
  }
  
  return isValid;
}

// Validar campo individual
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  clearFieldError(field.name);
  
  switch (field.name) {
    case 'nombre':
      if (value.length < 2) {
        showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        showFieldError('email', 'Por favor, ingresa un email válido');
      }
      break;
    case 'mensaje':
      if (value.length > 0 && value.length < 10) {
        showFieldError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
      }
      break;
  }
}

// Mostrar error en campo
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

// Limpiar error de campo
function clearFieldError(fieldName) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;
  
  field.classList.remove('error');
  
  const errorElement = field.parentNode.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}

// Mostrar notificación
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
  
  // Agregar estilos si no existen
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification {
        position: fixed;
        top: var(--space-6);
        right: var(--space-6);
        max-width: 400px;
        padding: var(--space-4);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 9999;
        transform: translateX(100%);
        transition: var(--transition-slow);
      }
      .notification.show {
        transform: translateX(0);
      }
      .notification-success {
        background: var(--success);
        color: white;
      }
      .notification-error {
        background: var(--error);
        color: white;
      }
      .notification-info {
        background: var(--primary);
        color: white;
      }
      .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: var(--text-xl);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .field-error {
        color: var(--error);
        font-size: var(--text-sm);
        margin-top: var(--space-1);
      }
      .error {
        border-color: var(--error) !important;
      }
    `;
    document.head.appendChild(styles);
  }
  
  // Agregar al DOM
  document.body.appendChild(notification);
  
  // Mostrar con animación
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Manejar cierre
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    hideNotification(notification);
  });
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      hideNotification(notification);
    }
  }, 5000);
}

// Ocultar notificación
function hideNotification(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 300);
}

// Inicializar animaciones
function initializeAnimations() {
  // Animación de contadores en hero stats
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

// Animar contador
function animateCounter(statElement) {
  const numberElement = statElement.querySelector('.stat-number');
  if (!numberElement) return;
  
  const finalValue = parseInt(numberElement.textContent);
  const duration = 2000;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = Math.floor(finalValue * easeOutQuart);
    
    numberElement.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      numberElement.textContent = finalValue;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Inicializar accesibilidad
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
    elements.navToggle.setAttribute('aria-controls', 'nav-menu');
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

// Utilidades
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

// Manejo de errores global
window.addEventListener('error', function(e) {
  console.error('Error global capturado:', e.error);
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(function() {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('⚡ Tiempo de carga:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
    }, 0);
  });
}
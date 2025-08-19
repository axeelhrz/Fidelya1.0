// Configuración Premium
const CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  },
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  ui: {
    scrollOffset: 72,
    throttleDelay: 16,
    notificationDuration: 4000
  }
};

// Estado de la aplicación
const state = {
  isMenuOpen: false,
  scrollY: 0,
  currentSection: 'inicio',
  reducedMotion: false,
  touchDevice: false
};

// Cache de elementos DOM
const elements = {};

// Inicialización
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  detectCapabilities();
  cacheElements();
  initializeNavigation();
  initializeScrollEffects();
  initializeCTAButtons();
  initializeFormHandling();
  initializeAnimations();
  initializeTabs();
  
  console.log('✅ Nodo Locker - Aplicación premium inicializada');
}

function detectCapabilities() {
  state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function cacheElements() {
  elements.navbar = document.querySelector('.navbar');
  elements.navToggle = document.querySelector('.nav-toggle');
  elements.navMenu = document.querySelector('.nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  elements.heroSection = document.querySelector('.hero');
  elements.ctaButtons = {
    download: document.getElementById('downloadBtn'),
    schedule: document.getElementById('scheduleBtn'),
    joinWaitlist: document.getElementById('joinWaitlistBtn')
  };
  elements.contactForm = document.getElementById('contactForm');
  elements.tabButtons = document.querySelectorAll('.tab-btn');
  elements.tabPanels = document.querySelectorAll('.tab-panel');
}

// Sistema de navegación refinado
function initializeNavigation() {
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }

  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  document.addEventListener('click', handleOutsideClick);
  initializeActiveNavigation();
}

function toggleMobileMenu() {
  state.isMenuOpen = !state.isMenuOpen;
  
  elements.navToggle.classList.toggle('active', state.isMenuOpen);
  elements.navMenu.classList.toggle('active', state.isMenuOpen);
  
  document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
  
  elements.navToggle.setAttribute('aria-expanded', state.isMenuOpen);
  elements.navMenu.setAttribute('aria-hidden', !state.isMenuOpen);
}

function handleNavClick(e) {
  const href = e.target.closest('.nav-link').getAttribute('href');
  
  if (href && href.startsWith('#')) {
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      if (state.isMenuOpen) {
        toggleMobileMenu();
      }
      
      smoothScrollTo(targetElement);
      updateActiveNavLink(e.target.closest('.nav-link'));
      state.currentSection = targetId;
    }
  }
}

function smoothScrollTo(element) {
  const offsetTop = element.offsetTop - CONFIG.ui.scrollOffset;
  
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
}

function updateActiveNavLink(activeLink) {
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  activeLink.classList.add('active');
}

function handleOutsideClick(e) {
  if (state.isMenuOpen && 
      !elements.navMenu.contains(e.target) && 
      !elements.navToggle.contains(e.target)) {
    toggleMobileMenu();
  }
}

function initializeActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (navLink && state.currentSection !== id) {
          updateActiveNavLink(navLink);
          state.currentSection = id;
        }
      }
    });
  }, {
    threshold: [0.3],
    rootMargin: `-${CONFIG.ui.scrollOffset}px 0px -50% 0px`
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Efectos de scroll optimizados
function initializeScrollEffects() {
  const throttledScrollHandler = throttle(updateScrollEffects, CONFIG.ui.throttleDelay);
  window.addEventListener('scroll', throttledScrollHandler, { passive: true });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
}

function updateScrollEffects() {
  state.scrollY = window.scrollY;
  
  if (elements.navbar) {
    const isScrolled = state.scrollY > 50;
    elements.navbar.classList.toggle('scrolled', isScrolled);
  }
}

function updateScrollProgress() {
  const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
  }
  
  progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
}

// Sistema de tabs
function initializeTabs() {
  if (elements.tabButtons.length === 0) return;
  
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', handleTabClick);
  });
}

function handleTabClick(e) {
  const targetTab = e.target.getAttribute('data-tab');
  
  // Actualizar botones
  elements.tabButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  
  // Actualizar paneles
  elements.tabPanels.forEach(panel => {
    panel.classList.remove('active');
  });
  
  const targetPanel = document.getElementById(targetTab);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }
}

// Sistema de botones CTA
function initializeCTAButtons() {
  Object.entries(elements.ctaButtons).forEach(([key, button]) => {
    if (button) {
      button.addEventListener('click', (e) => {
        handleCTAClick(key, e);
      });
    }
  });
}

function handleCTAClick(buttonType, event) {
  const button = event.currentTarget;
  
  button.classList.add('loading');
  
  switch (buttonType) {
    case 'download':
      handleDownload(button);
      break;
    case 'schedule':
      handleScheduleMeeting(button);
      break;
    case 'joinWaitlist':
      handleJoinWaitlist(button);
      break;
  }
}

async function handleDownload(button) {
  try {
    showNotification('Preparando descarga de la presentación...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular descarga
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Nodo Locker - Presentación Ejecutiva';
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

async function handleScheduleMeeting(button) {
  try {
    showNotification('Abriendo calendario...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular apertura de calendario
    showNotification('Redirigiendo al calendario de reuniones', 'success');
    
  } catch (error) {
    console.error('Error al abrir calendario:', error);
    showNotification('Error al abrir el calendario', 'error');
  } finally {
    button.classList.remove('loading');
  }
}

async function handleJoinWaitlist(button) {
  try {
    showNotification('Agregándote a la lista de early adopters...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    showNotification('¡Te has unido exitosamente al MVP!', 'success');
    
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

// Manejo de formularios
function initializeFormHandling() {
  if (elements.contactForm) {
    elements.contactForm.addEventListener('submit', handleFormSubmit);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Validación básica
  if (!data.name || !data.email || !data.company) {
    showNotification('Por favor completa todos los campos requeridos', 'error');
    return;
  }
  
  if (!isValidEmail(data.email)) {
    showNotification('Por favor ingresa un email válido', 'error');
    return;
  }
  
  const submitButton = e.target.querySelector('button[type="submit"]');
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  
  try {
    showNotification('Enviando mensaje...', 'info');
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
    e.target.reset();
    
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
  } finally {
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sistema de animaciones
function initializeAnimations() {
  if (state.reducedMotion) return;
  
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Estilos inline para las notificaciones
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-left: 4px solid ${getNotificationColor(type)};
    animation: slideInRight 0.3s ease-out;
    transform: translateX(100%);
    opacity: 0;
  `;
  
  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
  `;
  
  const icon = notification.querySelector('.notification-icon');
  icon.style.cssText = `
    color: ${getNotificationColor(type)};
    font-size: 18px;
    flex-shrink: 0;
  `;
  
  const messageEl = notification.querySelector('.notification-message');
  messageEl.style.cssText = `
    flex: 1;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
  `;
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: #9CA3AF;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  `;
  
  closeBtn.onmouseover = () => {
    closeBtn.style.background = '#F3F4F6';
    closeBtn.style.color = '#374151';
  };
  
  closeBtn.onmouseout = () => {
    closeBtn.style.background = 'none';
    closeBtn.style.color = '#9CA3AF';
  };
  
  document.body.appendChild(notification);
  
  // Animación de entrada
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  });
  
  // Auto-remove
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, CONFIG.ui.notificationDuration);
}

function getNotificationIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

function getNotificationColor(type) {
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  return colors[type] || colors.info;
}

// Utilidades
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

// Manejo de errores
window.addEventListener('error', function(e) {
  console.error('❌ Error:', e.error);
  showNotification('Se produjo un error inesperado', 'error');
});

// Añadir estilos de animación
const animationStyles = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
  }
  
  .loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  @keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

// Añadir estilos al documento
if (!document.querySelector('#animation-styles')) {
  const style = document.createElement('style');
  style.id = 'animation-styles';
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

// Exportar para uso global
window.NodoLocker = {
  showNotification,
  state,
  config: CONFIG,
  elements
};

console.log('🚀 Nodo Locker - Versión premium cargada');

// Configuración y variables globales
const CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  animations: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Cache de elementos DOM
const elements = {
  navbar: null,
  navMenu: null,
  navToggle: null,
  contactForm: null,
  floatingCta: null,
  buttons: {},
  tabs: {
    nav: null,
    panels: null,
    buttons: null
  }
};

// Utilidades
const utils = {
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

  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
      rect.top <= windowHeight * (1 - threshold) &&
      rect.bottom >= windowHeight * threshold
    );
  },

  smoothScrollTo(target, offset = 80) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
  cacheElements();
  initializeNavigation();
  initializeForms();
  initializeButtons();
  initializeScrollEffects();
  initializeAnimations();
  initializeTabs();
  initializeFloatingCta();
  initializeParticleEffects();
});

// Cache de elementos DOM
function cacheElements() {
  elements.navbar = document.getElementById('navbar');
  elements.navMenu = document.getElementById('navMenu');
  elements.navToggle = document.getElementById('navToggle');
  elements.contactForm = document.getElementById('contactForm');
  elements.floatingCta = document.getElementById('floatingCta');
  
  // Botones
  elements.buttons = {
    joinWaitlist: document.getElementById('joinWaitlistBtn'),
    download: document.getElementById('downloadBtn'),
    learnMore: document.getElementById('learnMoreBtn'),
    ctaJoin: document.getElementById('ctaJoinBtn'),
    floatingCta: document.getElementById('floatingCtaBtn'),
    schedule: document.getElementById('scheduleBtn'),
    integrate: document.getElementById('integrateBtn')
  };

  // Tabs
  elements.tabs = {
    buttons: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.tab-panel')
  };
}

// Navegación
function initializeNavigation() {
  if (!elements.navbar || !elements.navToggle || !elements.navMenu) return;

  // Efecto de scroll en navbar
  const handleScroll = utils.throttle(() => {
    const scrollY = window.pageYOffset;
    elements.navbar.classList.toggle('scrolled', scrollY > 50);
    updateActiveNavLink();
    updateFloatingCta();
  }, 16);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Toggle menú móvil
  elements.navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileMenu();
  });

  // Navegación suave
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        utils.smoothScrollTo(targetSection);
        closeMobileMenu();
      }
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!elements.navMenu.contains(e.target) && !elements.navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

// Toggle menú móvil
function toggleMobileMenu() {
  const isActive = elements.navMenu.classList.contains('active');
  
  if (isActive) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  elements.navMenu.classList.add('active');
  elements.navToggle.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Animar hamburger
  const spans = elements.navToggle.querySelectorAll('span');
  spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
  spans[1].style.opacity = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
}

function closeMobileMenu() {
  elements.navMenu.classList.remove('active');
  elements.navToggle.classList.remove('active');
  document.body.style.overflow = '';
  
  // Resetear hamburger
  const spans = elements.navToggle.querySelectorAll('span');
  spans.forEach(span => {
    span.style.transform = '';
    span.style.opacity = '';
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

// Floating CTA
function initializeFloatingCta() {
  if (!elements.floatingCta) return;

  // Manejar click del floating CTA
  if (elements.buttons.floatingCta) {
    elements.buttons.floatingCta.addEventListener('click', () => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        utils.smoothScrollTo(contactSection);
      }
    });
  }
}

function updateFloatingCta() {
  if (!elements.floatingCta) return;

  const scrollY = window.pageYOffset;
  const heroSection = document.getElementById('inicio');
  const contactSection = document.getElementById('contacto');
  
  if (!heroSection || !contactSection) return;

  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
  const contactTop = contactSection.offsetTop;
  
  // Mostrar el floating CTA después del hero y antes del contacto
  if (scrollY > heroBottom && scrollY < contactTop - 200) {
    elements.floatingCta.classList.add('visible');
  } else {
    elements.floatingCta.classList.remove('visible');
  }
}

// Sistema de tabs
function initializeTabs() {
  if (!elements.tabs.buttons.length) return;

  elements.tabs.buttons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(targetTab) {
  // Remover clase active de todos los botones y panels
  elements.tabs.buttons.forEach(btn => btn.classList.remove('active'));
  elements.tabs.panels.forEach(panel => panel.classList.remove('active'));

  // Agregar clase active al botón y panel correspondiente
  const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
  const activePanel = document.getElementById(targetTab);

  if (activeButton && activePanel) {
    activeButton.classList.add('active');
    activePanel.classList.add('active');
    
    // Efecto de animación
    activePanel.style.transform = 'translateY(20px)';
    activePanel.style.opacity = '0';
    
    setTimeout(() => {
      activePanel.style.transform = 'translateY(0)';
      activePanel.style.opacity = '1';
    }, 50);
  }
}

// Formularios
function initializeForms() {
  if (!elements.contactForm) return;

  const inputs = elements.contactForm.querySelectorAll('input, textarea');
  
  // Validación en tiempo real
  inputs.forEach(input => {
    input.addEventListener('input', utils.debounce(() => {
      validateField(input);
    }, 300));
    
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  // Envío del formulario
  elements.contactForm.addEventListener('submit', handleFormSubmit);
}

// Validación de campos
function validateField(field) {
  const value = field.value.trim();
  const fieldType = field.type;
  let isValid = true;
  let errorMessage = '';

  // Validaciones
  if (field.required && !value) {
    isValid = false;
    errorMessage = 'Este campo es requerido';
  } else if (fieldType === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Ingresa un email válido';
    }
  }

  // Aplicar estilos de validación
  field.style.borderColor = isValid ? '' : 'var(--error)';
  
  // Mostrar/ocultar mensaje de error
  let errorElement = field.parentElement.querySelector('.error-message');
  if (!isValid && errorMessage) {
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.style.cssText = `
        color: var(--error);
        font-size: var(--text-xs);
        margin-top: var(--space-1);
        display: block;
        font-weight: 500;
      `;
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = errorMessage;
  } else if (errorElement) {
    errorElement.remove();
  }

  return isValid;
}

// Manejo del envío del formulario
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  // Validar todos los campos
  let isFormValid = true;
  inputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    showNotification('error', 'Por favor, corrige los errores en el formulario');
    return;
  }

  // Estado de carga
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';

  // Simular envío
  setTimeout(() => {
    showNotification('success', '¡Mensaje enviado correctamente! Te contactaremos pronto.');
    form.reset();
    
    // Resetear botón
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Limpiar errores
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('input, textarea').forEach(field => {
      field.style.borderColor = '';
    });
  }, 2000);
}

// Botones y CTAs
function initializeButtons() {
  // Botón de descarga
  if (elements.buttons.download) {
    elements.buttons.download.addEventListener('click', handleDownload);
  }

  // Botones de unirse al MVP
  [elements.buttons.joinWaitlist, elements.buttons.ctaJoin].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          utils.smoothScrollTo(contactSection);
        }
      });
    }
  });

  // Botón de demo
  if (elements.buttons.learnMore) {
    elements.buttons.learnMore.addEventListener('click', () => {
      const whatIsSection = document.getElementById('que-es');
      if (whatIsSection) {
        utils.smoothScrollTo(whatIsSection);
      }
    });
  }

  // Botón de agendar reunión
  if (elements.buttons.schedule) {
    elements.buttons.schedule.addEventListener('click', () => {
      showNotification('info', 'Redirigiendo a calendario de reuniones...');
      // Aquí iría la integración con Calendly u otro sistema de citas
      setTimeout(() => {
        showNotification('success', 'Calendario abierto. Selecciona tu horario preferido.');
      }, 1500);
    });
  }

  // Botón de integrar operación
  if (elements.buttons.integrate) {
    elements.buttons.integrate.addEventListener('click', () => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        utils.smoothScrollTo(contactSection);
        // Pre-llenar el formulario con información específica
        setTimeout(() => {
          const messageField = document.getElementById('message');
          if (messageField) {
            messageField.value = 'Estoy interesado en integrar Nodo Locker a mi operación. Me gustaría agendar una reunión técnica para discutir las posibilidades.';
          }
        }, 500);
      }
    });
  }
}

// Manejo de descarga
function handleDownload() {
  showNotification('info', 'Preparando descarga de la presentación...');
  
  // Simular descarga
  setTimeout(() => {
    showNotification('success', '¡Descarga iniciada! Revisa tu carpeta de descargas.');
    
    // Aquí iría la lógica real de descarga
    // window.open('ruta-al-archivo.pdf', '_blank');
  }, 1500);
}

// Sistema de notificaciones futurista
function showNotification(type, message) {
  const notification = document.createElement('div');
  const icons = {
    success: 'ph-check-circle',
    error: 'ph-x-circle',
    info: 'ph-info',
    warning: 'ph-warning'
  };
  
  const colors = {
    success: 'var(--success)',
    error: 'var(--error)',
    info: 'var(--primary)',
    warning: 'var(--warning)'
  };

  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl), 0 0 20px ${colors[type]}40;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      font-size: var(--text-sm);
      font-weight: 500;
      backdrop-filter: blur(10px);
      border: 1px solid ${colors[type]}60;
    ">
      <i class="ph ${icons[type]}" style="font-size: 1.25rem; flex-shrink: 0;"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Mostrar notificación
  setTimeout(() => {
    notification.firstElementChild.style.transform = 'translateX(0)';
  }, 100);

  // Ocultar notificación
  setTimeout(() => {
    notification.firstElementChild.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Efectos de scroll
function initializeScrollEffects() {
  // Intersection Observer para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Efecto especial para elementos con glow
        if (entry.target.classList.contains('feature-card') || 
            entry.target.classList.contains('next-step-item') ||
            entry.target.classList.contains('logo-item')) {
          entry.target.style.boxShadow = 'var(--shadow-xl), var(--glow-orange)';
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos para animación
  const elementsToAnimate = document.querySelectorAll(
    '.feature-card, .step, .timeline-item, .next-step-item, .logo-item'
  );

  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
}

// Animaciones adicionales
function initializeAnimations() {
  // Efecto hover mejorado en tarjetas
  const cards = document.querySelectorAll('.feature-card, .next-step-item, .logo-item');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = 'var(--shadow-xl), var(--glow-orange)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });
  });

  // Efecto ripple mejorado en botones
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .tab-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', createRippleEffect);
  });

  // Animación de tabs mejorada
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Agregar efecto de pulso al cambiar tab
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    });
  });

  // Efecto parallax sutil en el hero
  window.addEventListener('scroll', utils.throttle(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  }, 16), { passive: true });
}

// Efecto ripple mejorado
function createRippleEffect(e) {
  const button = e.currentTarget;
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
    background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.6s linear;
  `;

  // Asegurar posición relativa
  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }
  button.style.overflow = 'hidden';

  button.appendChild(ripple);

  // Remover ripple después de la animación
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Efectos de partículas
function initializeParticleEffects() {
  // Crear partículas flotantes en el hero
  const hero = document.querySelector('.hero');
  if (hero) {
    createFloatingParticles(hero, 15);
  }

  // Crear partículas en secciones oscuras
  const darkSections = document.querySelectorAll('.validation-section, .next-steps-section');
  darkSections.forEach(section => {
    createFloatingParticles(section, 8);
  });
}

function createFloatingParticles(container, count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: rgba(255, 107, 53, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s linear infinite;
      z-index: 1;
    `;
    
    container.appendChild(particle);
  }
}

// Manejo de resize
const handleResize = utils.debounce(() => {
  // Cerrar menú móvil si se cambia a desktop
  if (window.innerWidth > CONFIG.breakpoints.mobile) {
    closeMobileMenu();
  }
  
  // Actualizar floating CTA
  updateFloatingCta();
}, 250);

window.addEventListener('resize', handleResize);

// Cleanup al salir
window.addEventListener('beforeunload', () => {
  // Limpiar event listeners si es necesario
  document.body.style.overflow = '';
});

// Manejo de errores globales
window.addEventListener('error', (e) => {
  console.error('Error en la aplicación:', e.error);
});

// Prevenir comportamientos por defecto en desarrollo
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Mejorar accesibilidad con teclado
document.addEventListener('keydown', (e) => {
  // Cerrar menú móvil con Escape
  if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
    closeMobileMenu();
  }
  
  // Navegación con Tab más fluida
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }

  // Navegación de tabs con flechas
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
      const tabs = Array.from(elements.tabs.buttons);
      const currentIndex = tabs.indexOf(activeTab);
      let nextIndex;

      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      }

      const nextTab = tabs[nextIndex];
      if (nextTab) {
        const targetTab = nextTab.getAttribute('data-tab');
        switchTab(targetTab);
        nextTab.focus();
      }
    }
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Lazy loading para imágenes
function initializeLazyLoading() {
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
}

// Inicializar lazy loading si hay imágenes con data-src
if (document.querySelectorAll('img[data-src]').length > 0) {
  initializeLazyLoading();
}

// Performance monitoring
function logPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Tiempo de carga:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
      }, 0);
    });
  }
}

// Solo en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  logPerformance();
}

// Inicialización adicional para elementos que requieren JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Agregar clases para animaciones CSS
  const animatedElements = document.querySelectorAll('.feature-card, .timeline-content, .next-step-item');
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
  });

  // Inicializar el primer tab como activo si no hay ninguno
  const activeTab = document.querySelector('.tab-btn.active');
  if (!activeTab && elements.tabs.buttons.length > 0) {
    const firstTab = elements.tabs.buttons[0];
    const targetTab = firstTab.getAttribute('data-tab');
    switchTab(targetTab);
  }
});

// Manejo de estados de conexión
window.addEventListener('online', () => {
  showNotification('success', 'Conexión restaurada');
});

window.addEventListener('offline', () => {
  showNotification('warning', 'Sin conexión a internet');
});

// Prevenir zoom en iOS en inputs
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// Smooth scroll para todos los enlaces internos
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      utils.smoothScrollTo(targetElement);
    }
  }
});

// Auto-hide floating CTA en mobile cuando se hace scroll hacia abajo
let lastScrollY = window.pageYOffset;
window.addEventListener('scroll', utils.throttle(() => {
  if (window.innerWidth <= CONFIG.breakpoints.mobile) {
    const currentScrollY = window.pageYOffset;
    if (elements.floatingCta) {
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        elements.floatingCta.style.transform = 'translateY(100px)';
      } else {
        // Scrolling up
        elements.floatingCta.style.transform = 'translateY(0)';
      }
    }
    lastScrollY = currentScrollY;
  }
}, 100), { passive: true });

// Agregar animación de float para partículas
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
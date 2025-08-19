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
  navMenu: null,
  navToggle: null,
  contactForm: null,
  floatingCta: null,
  buttons: {},
  tabs: {
    buttons: null,
    panels: null
  }
};

// Utilidades OPTIMIZADAS
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

// Navegación OPTIMIZADA
function initializeNavigation() {
  if (!elements.navbar || !elements.navToggle || !elements.navMenu) return;

  // Efecto de scroll en navbar - OPTIMIZADO
  const handleScroll = utils.throttle(() => {
    const scrollY = window.pageYOffset;
    elements.navbar.classList.toggle('scrolled', scrollY > 50);
    updateActiveNavLink();
    updateFloatingCta();
  }, 32); // Aumentado de 16ms a 32ms para mejor rendimiento

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

// Toggle menú móvil SIMPLIFICADO
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
}

function closeMobileMenu() {
  elements.navMenu.classList.remove('active');
  elements.navToggle.classList.remove('active');
  document.body.style.overflow = '';
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

// Floating CTA SIMPLIFICADO
function initializeFloatingCta() {
  if (!elements.floatingCta) return;

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
  
  if (scrollY > heroBottom && scrollY < contactTop - 200) {
    elements.floatingCta.classList.add('visible');
  } else {
    elements.floatingCta.classList.remove('visible');
  }
}

// Sistema de tabs SIMPLIFICADO
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
  elements.tabs.buttons.forEach(btn => btn.classList.remove('active'));
  elements.tabs.panels.forEach(panel => panel.classList.remove('active'));

  const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
  const activePanel = document.getElementById(targetTab);

  if (activeButton && activePanel) {
    activeButton.classList.add('active');
    activePanel.classList.add('active');
  }
}

// Formularios
function initializeForms() {
  if (!elements.contactForm) return;

  const inputs = elements.contactForm.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('input', utils.debounce(() => {
      validateField(input);
    }, 300));
    
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  elements.contactForm.addEventListener('submit', handleFormSubmit);
}

// Validación de campos
function validateField(field) {
  const value = field.value.trim();
  const fieldType = field.type;
  let isValid = true;
  let errorMessage = '';

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

  field.style.borderColor = isValid ? '' : 'var(--error)';
  
  let errorElement = field.parentElement.querySelector('.error-message');
  if (!isValid && errorMessage) {
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
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

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner"></i> Enviando...';

  setTimeout(() => {
    showNotification('success', '¡Mensaje enviado correctamente! Te contactaremos pronto.');
    form.reset();
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('input, textarea').forEach(field => {
      field.style.borderColor = '';
    });
  }, 2000);
}

// Botones y CTAs
function initializeButtons() {
  if (elements.buttons.download) {
    elements.buttons.download.addEventListener('click', handleDownload);
  }

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

  if (elements.buttons.learnMore) {
    elements.buttons.learnMore.addEventListener('click', () => {
      const whatIsSection = document.getElementById('que-es');
      if (whatIsSection) {
        utils.smoothScrollTo(whatIsSection);
      }
    });
  }

  if (elements.buttons.schedule) {
    elements.buttons.schedule.addEventListener('click', () => {
      showNotification('info', 'Redirigiendo a calendario de reuniones...');
      setTimeout(() => {
        showNotification('success', 'Calendario abierto. Selecciona tu horario preferido.');
      }, 1500);
    });
  }

  if (elements.buttons.integrate) {
    elements.buttons.integrate.addEventListener('click', () => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        utils.smoothScrollTo(contactSection);
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
  
  setTimeout(() => {
    showNotification('success', '¡Descarga iniciada! Revisa tu carpeta de descargas.');
  }, 1500);
}

// Sistema de notificaciones SIMPLIFICADO
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
      box-shadow: var(--shadow-xl);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-size: var(--text-sm);
      font-weight: 500;
    ">
      <i class="ph ${icons[type]}" style="font-size: 1.25rem; flex-shrink: 0;"></i>
      <span>${message}</span>
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

// Efectos de scroll SIMPLIFICADOS
function initializeScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    '.feature-card, .timeline-item, .next-step-item, .logo-item'
  );

  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
}

// Animaciones SIMPLIFICADAS
function initializeAnimations() {
  // Solo efectos hover básicos
  const cards = document.querySelectorAll('.feature-card, .next-step-item, .logo-item');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Efecto ripple SIMPLIFICADO
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .tab-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', createRippleEffect);
  });
}

// Efecto ripple SIMPLIFICADO
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
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.6s linear;
  `;

  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }
  button.style.overflow = 'hidden';

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Manejo de resize OPTIMIZADO
const handleResize = utils.debounce(() => {
  if (window.innerWidth > CONFIG.breakpoints.mobile) {
    closeMobileMenu();
  }
  updateFloatingCta();
}, 250);

window.addEventListener('resize', handleResize);

// Cleanup al salir
window.addEventListener('beforeunload', () => {
  document.body.style.overflow = '';
});

// Mejorar accesibilidad con teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
    closeMobileMenu();
  }
  
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }

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

// Inicialización adicional
document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('.tab-btn.active');
  if (!activeTab && elements.tabs.buttons.length > 0) {
    const firstTab = elements.tabs.buttons[0];
    const targetTab = firstTab.getAttribute('data-tab');
    switchTab(targetTab);
  }
});

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
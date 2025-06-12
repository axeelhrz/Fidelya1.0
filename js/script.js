// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
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
};

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
  constructor() {
    this.header = $('#header');
    this.navToggle = $('#nav-toggle');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav__link');
    this.isMenuOpen = false;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
  }
  
  bindEvents() {
    // Mobile menu toggle
    this.navToggle?.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Handle scroll for header styling and active links
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
    
    // Smooth scroll for anchor links
    this.navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => this.smoothScroll(e));
      }
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  handleScroll() {
    const scrollY = window.scrollY;
    
    // Add scrolled class to header
    if (scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    this.updateActiveLink();
  }
  
  updateActiveLink() {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = $(`.nav__link[href="#${sectionId}"]`);
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        navLink?.classList.add('active');
      }
    });
  }
  
  smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = $(targetId);
    
    if (targetSection) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// ===== FAQ FUNCTIONALITY =====
class FAQ {
  constructor() {
    this.faqItems = $$('.faq__item');
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      question.addEventListener('click', () => this.toggleFAQ(item));
    });
  }
  
  toggleFAQ(item) {
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items
    this.faqItems.forEach(faqItem => {
      faqItem.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  }
}

// ===== CONTACT FORM FUNCTIONALITY =====
class ContactForm {
  constructor() {
    this.form = $('#contact-form');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.bindEvents();
    }
  }
  
  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    
    // Basic validation
    if (!this.validateForm(data)) {
      return;
    }
    
    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm(data);
      this.showSuccess();
      this.form.reset();
    } catch (error) {
      this.showError('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
  
  validateForm(data) {
    const { name, email, message } = data;
    
    if (!name.trim()) {
      this.showError('Por favor, ingresa tu nombre.');
      return false;
    }
    
    if (!email.trim() || !this.isValidEmail(email)) {
      this.showError('Por favor, ingresa un email válido.');
      return false;
    }
    
    if (!message.trim()) {
      this.showError('Por favor, ingresa tu mensaje.');
      return false;
    }
    
    return true;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async submitForm(data) {
    // Simulate API call - replace with actual implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', data);
        resolve();
      }, 1000);
    });
  }
  
  showSuccess() {
    this.showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
  }
  
  showError(message) {
    this.showNotification(message, 'error');
  }
  
  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      backgroundColor: type === 'success' ? '#10b981' : '#ef4444'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }
}

// ===== LAZY LOADING FUNCTIONALITY =====
class LazyLoader {
  constructor() {
    this.images = $$('img[loading="lazy"]');
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }
  
  createObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    
    this.images.forEach(img => {
      this.observer.observe(img);
    });
  }
  
  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
  }
  
  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = $$('[data-animate]');
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
    }
  }
  
  createObserver() {
    const options = {
      root: null,
      rootMargin: '-10%',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    
    this.animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      this.measurePerformance();
    });
  }
  
  measurePerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Send to analytics if needed
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          event_category: 'Performance',
          event_label: 'Load Time',
          value: Math.round(loadTime)
        });
      }
    }
  }
}

// ===== PRICING ANIMATION =====
class PricingAnimations {
  constructor() {
    this.pricingCards = $$('.pricing__card');
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.pricingCards.forEach(card => {
      card.addEventListener('mouseenter', () => this.animateCard(card, true));
      card.addEventListener('mouseleave', () => this.animateCard(card, false));
    });
  }
  
  animateCard(card, isHover) {
    const price = card.querySelector('.pricing__amount');
    if (price && isHover) {
      price.style.transform = 'scale(1.1)';
      price.style.transition = 'transform 0.3s ease';
    } else if (price) {
      price.style.transform = 'scale(1)';
    }
  }
}

// ===== FEATURE CARDS INTERACTION =====
class FeatureInteractions {
  constructor() {
    this.featureCards = $$('.benefit__card, .trust__card');
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => this.handleHover(card, true));
      card.addEventListener('mouseleave', () => this.handleHover(card, false));
    });
  }
  
  handleHover(card, isHover) {
    const icon = card.querySelector('.benefit__icon, .trust__icon');
    if (icon) {
      if (isHover) {
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
      } else {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    }
  }
}

// ===== WHATSAPP FLOATING BUTTON =====
class WhatsAppButton {
  constructor() {
    this.button = $('.whatsapp-float');
    this.init();
  }
  
  init() {
    if (this.button) {
      this.bindEvents();
      this.showButton();
    }
  }
  
  bindEvents() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      if (scrollY > 300) {
        this.showButton();
      } else {
        this.hideButton();
      }
    }, 100));
    
    // Track clicks for analytics
    this.button.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'Contact',
          event_label: 'WhatsApp Float Button'
        });
      }
    });
  }
  
  showButton() {
    this.button.style.opacity = '1';
    this.button.style.visibility = 'visible';
  }
  
  hideButton() {
    this.button.style.opacity = '0';
    this.button.style.visibility = 'hidden';
  }
}

// ===== SCROLL TO TOP FUNCTIONALITY =====
class ScrollToTop {
  constructor() {
    this.createButton();
    this.init();
  }
  
  createButton() {
    this.button = document.createElement('button');
    this.button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18,15 12,9 6,15"/>
      </svg>
    `;
    this.button.className = 'scroll-to-top';
    this.button.setAttribute('aria-label', 'Volver arriba');
    
    // Add styles
    Object.assign(this.button.style, {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '50px',
      height: '50px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      opacity: '0',
      visibility: 'hidden',
      transition: 'all 0.3s ease',
      zIndex: '1000'
    });
    
    document.body.appendChild(this.button);
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.scrollY;
      if (scrollY > 500) {
        this.showButton();
      } else {
        this.hideButton();
      }
    }, 100));
    
    // Scroll to top on click
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Track for analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_to_top', {
          event_category: 'Navigation',
          event_label: 'Scroll to Top Button'
        });
      }
    });
    
    // Hover effects
    this.button.addEventListener('mouseenter', () => {
      this.button.style.transform = 'scale(1.1)';
      this.button.style.backgroundColor = '#0099cc';
    });
    
    this.button.addEventListener('mouseleave', () => {
      this.button.style.transform = 'scale(1)';
      this.button.style.backgroundColor = 'var(--primary-color)';
    });
  }
  
  showButton() {
    this.button.style.opacity = '1';
    this.button.style.visibility = 'visible';
  }
  
  hideButton() {
    this.button.style.opacity = '0';
    this.button.style.visibility = 'hidden';
  }
}

// ===== ANALYTICS TRACKING =====
class Analytics {
  constructor() {
    this.init();
  }
  
  init() {
    this.trackPageView();
    this.trackUserInteractions();
  }
  
  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }
  
  trackUserInteractions() {
    // Track CTA button clicks
    const ctaButtons = $$('.btn--primary');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        this.trackEvent('cta_click', 'Engagement', buttonText);
      });
    });
    
    // Track pricing plan selections
    const pricingButtons = $$('.pricing__card .btn');
    pricingButtons.forEach(button => {
      button.addEventListener('click', () => {
        const planName = button.closest('.pricing__card').querySelector('.pricing__title').textContent;
        this.trackEvent('pricing_plan_click', 'Conversion', planName);
      });
    });
    
    // Track social media clicks
    const socialLinks = $$('.social__link, .footer__social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', () => {
        const platform = this.getSocialPlatform(link);
        this.trackEvent('social_click', 'Social', platform);
      });
    });
    
    // Track download button clicks
    const downloadButtons = $$('.download-btn');
    downloadButtons.forEach(button => {
      button.addEventListener('click', () => {
        const platform = button.querySelector('img').alt.includes('Google') ? 'Google Play' : 'App Store';
        this.trackEvent('download_click', 'App Download', platform);
      });
    });
  }
  
  trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
  }
  
  getSocialPlatform(link) {
    const href = link.getAttribute('href') || '';
    const ariaLabel = link.getAttribute('aria-label') || '';
    
    if (href.includes('whatsapp') || ariaLabel.includes('WhatsApp')) return 'WhatsApp';
    if (href.includes('telegram') || ariaLabel.includes('Telegram')) return 'Telegram';
    if (href.includes('instagram') || ariaLabel.includes('Instagram')) return 'Instagram';
    if (href.includes('tiktok') || ariaLabel.includes('TikTok')) return 'TikTok';
    if (href.includes('facebook') || ariaLabel.includes('Facebook')) return 'Facebook';
    
    return 'Unknown';
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
  constructor() {
    this.init();
  }
  
  init() {
    this.addKeyboardNavigation();
    this.addFocusManagement();
    this.addAriaLabels();
  }
  
  addKeyboardNavigation() {
    // Add keyboard support for FAQ items
    const faqQuestions = $$('.faq__question');
    faqQuestions.forEach(question => {
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
    
    // Add keyboard support for mobile menu
    const navToggle = $('#nav-toggle');
    if (navToggle) {
      navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navToggle.click();
        }
      });
    }
  }
  
  addFocusManagement() {
    // Trap focus in mobile menu when open
    const navMenu = $('#nav-menu');
    const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
    
    if (navMenu) {
      navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && navMenu.classList.contains('active')) {
          const focusableContent = navMenu.querySelectorAll(focusableElements);
          const firstFocusableElement = focusableContent[0];
          const lastFocusableElement = focusableContent[focusableContent.length - 1];
          
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    }
  }
  
  addAriaLabels() {
    // Add aria-expanded to FAQ questions
    const faqQuestions = $$('.faq__question');
    faqQuestions.forEach(question => {
      question.setAttribute('aria-expanded', 'false');
      
      question.addEventListener('click', () => {
        const isExpanded = question.closest('.faq__item').classList.contains('active');
        question.setAttribute('aria-expanded', isExpanded.toString());
      });
    });
    
    // Add aria-label to mobile menu toggle
    const navToggle = $('#nav-toggle');
    if (navToggle) {
      navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      navToggle.setAttribute('aria-expanded', 'false');
      
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded.toString());
        navToggle.setAttribute('aria-label', isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      });
    }
  }
}

// ===== INITIALIZATION =====
class App {
  constructor() {
    this.init();
  }
  
  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      // Initialize all components
      new Navigation();
      new FAQ();
      new ContactForm();
      new LazyLoader();
      new ScrollAnimations();
      new PerformanceMonitor();
      new PricingAnimations();
      new FeatureInteractions();
      new WhatsAppButton();
      new ScrollToTop();
      new Analytics();
      new AccessibilityEnhancements();
      
      console.log('Starflex landing page initialized successfully');
    } catch (error) {
      console.error('Error initializing components:', error);
    }
  }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  
  // Track errors in analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: e.error.toString(),
      fatal: false
    });
  }
});

// ===== POLYFILLS FOR OLDER BROWSERS =====
// IntersectionObserver polyfill check
if (!window.IntersectionObserver) {
  console.warn('IntersectionObserver not supported. Loading polyfill...');
  // In production, you would load a polyfill here
}

// ===== START APPLICATION =====
new App();

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    FAQ,
    ContactForm,
    LazyLoader,
    ScrollAnimations,
    PerformanceMonitor,
    Analytics
  };
}

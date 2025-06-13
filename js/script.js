// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
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

// ===== NAVEGACIÓN MEJORADA =====
class Navigation {
  constructor() {
    this.header = $('#header');
    this.navToggle = $('#nav-toggle');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav__link');
    this.isMenuOpen = false;
    this.scrollY = 0;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleScroll();
    this.addScrollIndicator();
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
    
    // Handle scroll with throttling
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));
    
    // Smooth scroll for anchor links
    this.navLinks.forEach(link => {
      if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => this.smoothScroll(e));
      }
    });

    // Keyboard navigation
    this.navToggle?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleMenu();
      }
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    
    // Actualizar aria-expanded
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
  }
  
  closeMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
    this.navToggle.setAttribute('aria-expanded', 'false');
  }
  
  handleScroll() {
    this.scrollY = window.scrollY;
    
    // Add scrolled class to header
    if (this.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    this.updateActiveLink();
    
    // Update scroll indicator
    this.updateScrollIndicator();
  }
  
  updateActiveLink() {
    const sections = $$('section[id]');
    const scrollPos = this.scrollY + 100;
    
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

  addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #00d4ff 0%, #8b5cf6 50%, #06ffa5 100%);
      transform-origin: left;
      transform: scaleX(0);
      z-index: 9999;
      transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(indicator);
    this.scrollIndicator = indicator;
  }

  updateScrollIndicator() {
    const scrollPercent = this.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    this.scrollIndicator.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
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

// ===== OPTIMIZACIÓN DE VIDEO HERO =====
class VideoOptimizer {
  constructor() {
    this.video = $('.hero__video');
    this.observer = null;
    this.init();
  }

  init() {
    if (!this.video) return;

    this.setupVideo();
    this.createIntersectionObserver();
  }

  setupVideo() {
    // Configurar atributos para mejor rendimiento
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('webkit-playsinline', '');
    this.video.setAttribute('preload', 'metadata');
    
    // Mejorar calidad de renderizado
    this.video.style.imageRendering = 'crisp-edges';
    this.video.style.willChange = 'transform';

    // Eventos de video
    this.video.addEventListener('loadeddata', () => {
      console.log('Hero video loaded with high quality');
    });

    this.video.addEventListener('error', (e) => {
      console.error('Hero video error:', e);
    });
  }

  createIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.video.play().catch(() => {
            console.log('Video autoplay prevented');
          });
        } else {
          this.video.pause();
        }
      });
    }, { threshold: 0.3 });

    this.observer.observe(this.video);
  }
}

// ===== GESTOR DE VIDEO YOUTUBE =====
class YouTubeVideoManager {
  constructor() {
    this.videoContainer = $('#video-container');
    this.videoOverlay = $('#video-overlay');
    this.videoId = 'IeKGEAdEtYA'; // ID del video de YouTube
    this.isLoaded = false;
    this.thumbnailLoaded = false;
    this.init();
  }

  init() {
    console.log('Initializing YouTube Video Manager...');
    
    if (!this.videoContainer || !this.videoOverlay) {
      console.error('Video container or overlay not found');
      return;
    }

    console.log('Video container and overlay found');

    // Agregar event listeners
    this.videoOverlay.addEventListener('click', () => {
      console.log('Video overlay clicked');
      this.loadVideo();
    });
    
    this.videoOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        console.log('Video overlay activated via keyboard');
        this.loadVideo();
      }
    });

    // Hacer el overlay focusable
    this.videoOverlay.setAttribute('tabindex', '0');
    this.videoOverlay.setAttribute('role', 'button');
    this.videoOverlay.setAttribute('aria-label', 'Reproducir video de demostración de Starflex');

    // Lazy loading con Intersection Observer
    this.setupLazyLoading();
    
    // Precargar inmediatamente la miniatura para testing
    setTimeout(() => {
      this.preloadThumbnail();
    }, 1000);
  }

  setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.thumbnailLoaded) {
          console.log('Video section is visible, loading thumbnail...');
          this.preloadThumbnail();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.videoContainer);
  }

  preloadThumbnail() {
    if (this.thumbnailLoaded) return;
    
    console.log('Loading YouTube thumbnail...');
    
    // Crear imagen de miniatura de YouTube
    const thumbnail = document.createElement('div');
    thumbnail.className = 'video-thumbnail';
    thumbnail.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 20px;
      z-index: 1;
      transition: opacity 0.3s ease;
    `;
    
    // Verificar si la imagen se carga correctamente
    const img = new Image();
    img.onload = () => {
      console.log('YouTube thumbnail loaded successfully');
      this.videoContainer.insertBefore(thumbnail, this.videoOverlay);
      this.thumbnailLoaded = true;
    };
    img.onerror = () => {
      console.error('Failed to load YouTube thumbnail');
      // Usar thumbnail de respaldo
      thumbnail.style.backgroundImage = `url('https://img.youtube.com/vi/${this.videoId}/hqdefault.jpg')`;
      this.videoContainer.insertBefore(thumbnail, this.videoOverlay);
      this.thumbnailLoaded = true;
    };
    img.src = `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
  }

  loadVideo() {
    if (this.isLoaded) {
      console.log('Video already loaded');
      return;
    }

    console.log('Loading YouTube video...');

    // Crear iframe de YouTube
    const iframe = document.createElement('iframe');
    iframe.className = 'video-iframe';
    iframe.src = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('title', 'Demostración de Starflex - Amazon Flex Automation');

    // Agregar el iframe al contenedor
    this.videoContainer.appendChild(iframe);

    // Ocultar el overlay
    this.videoOverlay.classList.add('hidden');

    // Ocultar la miniatura si existe
    const thumbnail = this.videoContainer.querySelector('.video-thumbnail');
    if (thumbnail) {
      thumbnail.style.opacity = '0';
    }

    // Marcar como cargado
    this.isLoaded = true;

    // Analytics
    this.trackVideoPlay();

    console.log('YouTube video loaded and playing');
  }

  trackVideoPlay() {
    // Enviar evento a analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'video_play', {
        event_category: 'Video',
        event_label: 'YouTube_Demo_Video',
        video_title: 'Starflex Demo'
      });
    }

    // Analytics personalizado
    console.log('📹 Video Play Event: YouTube Demo Video');
  }
}

// ===== ANIMACIONES DE SCROLL =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = $$('[data-animate], .feature, .features__header, .video-section__header, .video-wrapper');
    this.observer = null;
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.createObserver();
    } else {
      // Fallback para navegadores antiguos
      this.animatedElements.forEach(el => el.classList.add('animate-in'));
    }
  }
  
  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Animación escalonada para elementos hijos
          const children = entry.target.querySelectorAll('.feature__list-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateX(0)';
            }, index * 100);
          });
          
          this.observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '-50px 0px'
    });
    
    this.animatedElements.forEach(element => {
      // Preparar elementos para animación
      if (element.classList.contains('feature')) {
        const listItems = element.querySelectorAll('.feature__list-item');
        listItems.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          item.style.transition = 'all 0.6s ease';
        });
      }
      
      this.observer.observe(element);
    });
  }
}

// ===== EFECTOS DE HOVER =====
class HoverEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupButtonEffects();
    this.setupVideoEffects();
  }

  setupButtonEffects() {
    $$('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', (e) => this.createRipple(e));
    });
  }

  setupVideoEffects() {
    const videoContainer = $('#video-container');
    if (videoContainer) {
      videoContainer.addEventListener('mouseenter', () => this.animateVideoContainer(videoContainer, true));
      videoContainer.addEventListener('mouseleave', () => this.animateVideoContainer(videoContainer, false));
    }
  }

  createRipple(e) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
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
    `;
    
    btn.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  animateVideoContainer(container, isHover) {
    const playButton = container.querySelector('.play-button');
    if (playButton) {
      if (isHover) {
        playButton.style.transform = 'scale(1.1)';
        playButton.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.5), 0 0 50px rgba(255, 107, 53, 0.4)';
      } else {
        playButton.style.transform = 'scale(1)';
        playButton.style.boxShadow = '';
      }
    }
  }
}

// ===== ANALYTICS BÁSICO =====
class Analytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.init();
  }
  
  init() {
    this.trackUserInteractions();
  }
  
  trackUserInteractions() {
    // Track CTA button clicks
    $$('.btn--cta').forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackEvent('cta_click', 'Engagement');
      });
    });
    
    // Track download button clicks
    $$('.download-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isGooglePlay = btn.href.includes('google-play') || 
                            btn.querySelector('img').src.includes('Google-Play');
        const store = isGooglePlay ? 'Google_Play' : 'App_Store';
        this.trackEvent('download_click', 'App_Download', { store });
      });
    });

    // Track video section visibility
    const videoSection = $('#video');
    if (videoSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('video_section_view', 'Video');
          }
        });
      }, { threshold: 0.5 });

      observer.observe(videoSection);
    }
  }
  
  trackEvent(action, category, data = {}) {
    const event = {
      action,
      category,
      timestamp: Date.now(),
      ...data
    };
    
    this.events.push(event);
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        ...data
      });
    }
    
    console.log('📊 Analytics Event:', event);
  }
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
class StarflexApp {
  constructor() {
    this.components = [];
    this.isInitialized = false;
    this.init();
  }
  
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  initializeComponents() {
    try {
      console.log('Initializing Starflex components...');
      
      // Inicializar componentes principales
      this.components.push(new Navigation());
      this.components.push(new VideoOptimizer());
      this.components.push(new YouTubeVideoManager());
      this.components.push(new ScrollAnimations());
      this.components.push(new HoverEffects());
      this.components.push(new Analytics());
      
      this.isInitialized = true;
      
      // Agregar CSS de animaciones dinámicamente
      this.addDynamicStyles();
      
      console.log('🚀 Starflex con Video YouTube initialized successfully');
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent('starflexInitialized', {
        detail: { components: this.components.length }
      }));
      
    } catch (error) {
      console.error('Error initializing Starflex components:', error);
    }
  }
  
  addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .feature__list-item {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .video-overlay.hidden {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .video-thumbnail {
        transition: opacity 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
  
  destroy() {
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components = [];
    this.isInitialized = false;
  }
}

// ===== POLYFILLS PARA COMPATIBILIDAD =====
if (!window.IntersectionObserver) {
  console.warn('IntersectionObserver not supported. Consider loading a polyfill.');
}

if (!window.requestIdleCallback) {
  window.requestIdleCallback = function(cb) {
    return setTimeout(cb, 1);
  };
}

// ===== INICIAR APLICACIÓN =====
console.log('Starting Starflex App...');
const app = new StarflexApp();

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
  window.addEventListener('load', () => {
    requestIdleCallback(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('📈 Performance Metrics:', {
        'Load Time': `${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`,
        'DOM Content Loaded': `${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`,
        'First Byte': `${Math.round(perfData.responseStart - perfData.requestStart)}ms`
      });
    });
  });
}